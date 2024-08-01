import Stripe from "stripe";

import { Hono } from "hono";
import { stripe } from "@/lib/stripe";
import { verifyAuth } from "@hono/auth-js";

import { db } from "@/db/drizzle";
import { subscription } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkIsActive } from "@/features/subscriptions/lib";

const app = new Hono()
  .get(
    "/current",
    verifyAuth(),
    async (c) => {
      const auth = c.get("authUser");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [subscriptions] = await db
        .select()
        .from(subscription)
        .where(eq(subscription.userId, auth.token.id));

      const active = checkIsActive(subscriptions);

      return c.json({
        data: {
          ...subscriptions,
          active,
        }
      });
    }
  )
  .post(
    "/billing",
    verifyAuth(),
    async (c) => {
      const auth = c.get("authUser");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [subscriptions] = await db
        .select()
        .from(subscription)
        .where(eq(subscription.userId, auth.token.id));

      if (!subscriptions) {
        return c.json({ error: "No subscription found" }, 404);
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: subscriptions.customerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      });

      if (!session.url) {
        return c.json({ error: "Failed to create session" }, 400);
      }

      return c.json({ data: session.url });
    }
  )
  .post(
    "/webhook",
    async (c) => {
      const body = await c.req.text();
      const signature = c.req.header("Stripe-Signature") as string;

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET!,
        );
      } catch (error) {
        return c.json({ error: "Invalid signature" }, 400);
      }

      const session = event.data.object as Stripe.Checkout.Session;

      if (event.type === "checkout.session.completed") {
        const subscriptions = await stripe.subscriptions.retrieve(session.subscription as string);

        if (!session?.metadata?.userId) {
          return c.json({ error: "Invalid session" }, 400);
        }

        await db
          .insert(subscription)
          .values({
            status: subscriptions.status,
            userId: session.metadata.userId,
            subscriptionId: subscriptions.id,
            customerId: subscriptions.customer as string,
            priceId: subscriptions.items.data[0].price.product as string,
            currentPeriodEnd: new Date(subscriptions.current_period_end * 1000),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
      }

      if (event.type === "invoice.payment_succeeded") {
        const subscriptions = await stripe.subscriptions.retrieve(session.subscription as string);

        if (!session?.metadata?.userId) {
          return c.json({ error: "Invalid session" }, 400);
        }

        await db
          .update(subscription)
          .set({
            status: subscriptions.status,
            currentPeriodEnd: new Date(subscriptions.current_period_end * 1000),
            updatedAt: new Date(),
          })
          .where(eq(subscription.id, subscriptions.id));
      }

      return c.json(null, 200);
    }
  )
  .post(
    "/checkout",
    verifyAuth(),
    async (c) => {
      const auth = c.get("authUser");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const session = await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}?success=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}?canceled=1`,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: auth.token.email || "",
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        metadata: {
          userId: auth.token.id,
        },
      });

      const url = session.url;

      if (!url) {
        return c.json({ error: "Failed to create session" }, 400);
      }

      return c.json({ data: url });
    }
  )

export default app;