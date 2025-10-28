import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { createClient } from "@/utils/supabase/server";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Get the headers
  const svix_id = request.headers.get("svix-id");
  const svix_timestamp = request.headers.get("svix-timestamp");
  const svix_signature = request.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: unknown;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the webhook
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventType = (evt as any).type;
  const supabase = await createClient();

  if (eventType === "user.created" || eventType === "user.updated") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id, email_addresses, first_name, last_name, phone_numbers } = (evt as any).data;

    const email = email_addresses[0]?.email_address;
    const fullName = `${first_name || ""} ${last_name || ""}`.trim() || null;
    const phone = phone_numbers[0]?.phone_number || null;

    if (eventType === "user.created") {
      // Create new user in Supabase
      const { error } = await supabase.from("users").insert({
        clerk_id: id,
        email,
        full_name: fullName,
        phone,
        role: "cliente", // Default role
      });

      if (error) {
        console.error("Error creating user in Supabase:", error);
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }

      console.log(`User created in Supabase: ${email}`);
    } else if (eventType === "user.updated") {
      // Update existing user in Supabase
      const { error } = await supabase
        .from("users")
        .update({
          email,
          full_name: fullName,
          phone,
        })
        .eq("clerk_id", id);

      if (error) {
        console.error("Error updating user in Supabase:", error);
        // Don't return error - update is not critical
      }

      console.log(`User updated in Supabase: ${email}`);
    }
  }

  return NextResponse.json({ success: true });
}

