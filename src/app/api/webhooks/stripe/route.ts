import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { generateTrackingQRCode } from "@/lib/qr-generator";
import { generateShippingGuidePDF } from "@/lib/pdf-guide";
import { sendGuideEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await handleSuccessfulPayment(session);
    } catch (error) {
      console.error("Error handling successful payment:", error);
      return NextResponse.json(
        { error: "Failed to process payment" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const shipmentId = session.metadata?.shipment_id;
  const trackingNumber = session.metadata?.tracking_number;
  const userId = session.metadata?.user_id;

  if (!shipmentId || !trackingNumber || !userId) {
    throw new Error("Missing metadata in session");
  }

  const supabase = await createClient();

  // Get shipment details
  const { data: shipment, error: fetchError } = await supabase
    .from("shipments")
    .select(`
      *,
      user:users(email, full_name, phone)
    `)
    .eq("id", shipmentId)
    .single();

  if (fetchError || !shipment) {
    throw new Error("Shipment not found");
  }

  // Generate QR code
  const qrCodeDataUrl = await generateTrackingQRCode(
    trackingNumber,
    process.env.NEXT_PUBLIC_APP_URL
  );

  // Generate PDF guide
  const pdfBuffer = await generateShippingGuidePDF({
    trackingNumber,
    customerName: shipment.user.full_name || "Cliente",
    customerPhone: shipment.user.phone,
    destinationAddress: shipment.destination_address,
    destinationCity: shipment.destination_city,
    destinationState: shipment.destination_state,
    destinationZipcode: shipment.destination_zipcode,
    weight: Number(shipment.weight),
    dimensions: shipment.dimensions as { length: number; width: number; height: number },
    declaredValue: shipment.declared_value ? Number(shipment.declared_value) : undefined,
    insurancePurchased: shipment.insurance_purchased,
    qrCodeDataUrl,
    createdAt: new Date(shipment.created_at),
  });

  // Upload PDF to Supabase Storage
  const pdfFileName = `${trackingNumber}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("shipment-guides")
    .upload(pdfFileName, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    console.error("Error uploading PDF:", uploadError);
    throw uploadError;
  }

  // Get public URL for the PDF
  const { data: { publicUrl } } = supabase.storage
    .from("shipment-guides")
    .getPublicUrl(pdfFileName);

  // Update shipment with payment confirmation and guide URL
  const { error: updateError } = await supabase
    .from("shipments")
    .update({
      payment_status: "paid",
      current_status: "Pago Confirmado",
      guide_pdf_url: publicUrl,
      qr_code_url: qrCodeDataUrl,
    })
    .eq("id", shipmentId);

  if (updateError) {
    throw updateError;
  }

  // Create initial status update
  const { error: statusError } = await supabase
    .from("status_updates")
    .insert({
      shipment_id: shipmentId,
      status: "Pago Confirmado",
      location: "Sistema",
      notes: "Pago procesado exitosamente. Guía generada.",
      update_type: "automatic",
    });

  if (statusError) {
    console.error("Error creating status update:", statusError);
  }

  // Send email with guide
  try {
    await sendGuideEmail({
      to: shipment.user.email,
      customerName: shipment.user.full_name || "Cliente",
      trackingNumber,
      pdfBuffer,
      destinationCity: shipment.destination_city,
      destinationState: shipment.destination_state,
    });
  } catch (emailError) {
    console.error("Error sending guide email:", emailError);
    // Don't throw - payment was successful even if email fails
  }

  console.log(`Payment processed successfully for ${trackingNumber}`);
}

