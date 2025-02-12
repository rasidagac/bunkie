import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@lib/prisma";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  if (evt.type === "user.created") {
    const { email_addresses, last_name, username, id, first_name, image_url } =
      evt.data;
    try {
      await prisma.users.upsert({
        where: { id },
        update: {
          username,
          email: email_addresses[0].email_address,
          full_name: first_name + " " + last_name,
          avatar_url: image_url,
        },
        create: {
          id,
          username,
          email: email_addresses[0].email_address,
          full_name: first_name + " " + last_name,
          avatar_url: image_url,
        },
      });
      // eslint-disable-next-line
    } catch (e: any) {
      console.error("Error: Could not upsert user:", e);
      return new Response("Error: Could not upsert user", {
        status: 500,
      });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
