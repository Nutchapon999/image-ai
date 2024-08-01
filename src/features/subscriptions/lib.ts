import { subscription } from "@/db/schema";

const DAY_IN_MS = 86_400_000;

export function checkIsActive(subscriptions: typeof subscription.$inferSelect) {
  let active = false;

  if (
    subscriptions &&
    subscriptions.priceId &&
    subscriptions.currentPeriodEnd
  ) {
    active = subscriptions.currentPeriodEnd.getTime() + DAY_IN_MS > Date.now();
  }

  return active;
}