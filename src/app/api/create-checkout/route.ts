import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { generateTrackingNumber } from "@/lib/tracking-number";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const {
      // Package details
      length,
      width,
      height,
      weight,
      // Destination
      destinationAddress,
      destinationCity,
      destinationState,
      destinationZipcode,
      customerDestination,
      // Insurance
      includeInsurance,
      declaredValue,
      // Pricing
      serviceCost,
      insuranceCost,
      totalCost,
    } = body;

    // Validate required fields
    if (!weight || !destinationAddress || !destinationCity || !destinationState || !totalCost) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get or create user in Supabase
    const { data: supabaseUser } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", user.id)
      .single();

    let userId = supabaseUser?.id;

    // If user doesn't exist in Supabase, create them
    if (!userId) {
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          clerk_id: user.id,
          email: user.emailAddresses[0].emailAddress,
          full_name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
          role: "cliente",
        })
        .select("id")
        .single();

      if (createError) {
        console.error("Error creating user:", createError);
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }

      userId = newUser.id;
    }

    // Generate tracking number
    const trackingNumber = generateTrackingNumber();

    // Create pending shipment in database
    const { data: shipment, error: shipmentError } = await supabase
      .from("shipments")
      .insert({
        tracking_number: trackingNumber,
        user_id: userId,
        customer_destination: customerDestination || `${destinationCity}, ${destinationState}`,
        dimensions: { length, width, height },
        weight,
        declared_value: declaredValue || null,
        insurance_purchased: includeInsurance || false,
        insurance_cost: insuranceCost || 0,
        service_cost: serviceCost,
        total_cost: totalCost,
        destination_address: destinationAddress,
        destination_city: destinationCity,
        destination_state: destinationState,
        destination_zipcode: destinationZipcode || null,
        payment_status: "pending",
        assignment_status: "pending_assignment",
        current_status: "Pendiente de Pago",
      })
      .select("id")
      .single();

    if (shipmentError) {
      console.error("Error creating shipment:", shipmentError);
      return NextResponse.json(
        { error: "Failed to create shipment" },
        { status: 500 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: "Servicio de Paquetería MY PACK MX",
              description: `Envío a ${destinationCity}, ${destinationState} - ${weight}kg`,
            },
            unit_amount: Math.round(totalCost * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pago/success?session_id={CHECKOUT_SESSION_ID}&tracking=${trackingNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cotizador`,
      customer_email: user.emailAddresses[0].emailAddress,
      metadata: {
        shipment_id: shipment.id,
        tracking_number: trackingNumber,
        user_id: userId,
      },
    });

    // Update shipment with payment intent ID
    await supabase
      .from("shipments")
      .update({ payment_intent_id: session.id })
      .eq("id", shipment.id);

    return NextResponse.json({ sessionId: session.id, sessionUrl: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

