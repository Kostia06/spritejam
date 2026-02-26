import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import type { Env } from '../index';
import { authMiddleware } from '../middleware/auth';
import { getUser, updateUserCredits, logCreditTransaction } from '../lib/d1';
import { createStripeClient, createCheckoutSession } from '../lib/stripe';

export const paymentRoutes = new Hono<{ Bindings: Env }>();

paymentRoutes.post('/checkout', authMiddleware(), async (c) => {
  const userId = c.get('userId') as string;
  const user = await getUser(c.env.DB, userId);

  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }

  const body = await c.req.json<{
    planId?: string;
    creditPackId?: string;
  }>();

  const stripe = createStripeClient(c.env.STRIPE_SECRET_KEY);

  if (body.planId) {
    const planPrices: Record<string, { amount: number; name: string }> = {
      pro: { amount: 800, name: 'Sprynt Pro' },
      studio: { amount: 2000, name: 'Sprynt Studio' },
    };

    const plan = planPrices[body.planId];
    if (!plan) {
      return c.json({ message: 'Invalid plan' }, 400);
    }

    const url = await createCheckoutSession(stripe, {
      lineItems: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: plan.name },
            unit_amount: plan.amount,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: { type: 'subscription', planId: body.planId, userId },
      successUrl: `${c.env.APP_URL}/settings?subscribed=true`,
      cancelUrl: `${c.env.APP_URL}/pricing`,
      customerId: user.stripe_customer_id ?? undefined,
    });

    return c.json({ url });
  }

  if (body.creditPackId) {
    const packs: Record<string, { credits: number; price: number }> = {
      starter: { credits: 50, price: 299 },
      creator: { credits: 200, price: 999 },
      studio: { credits: 500, price: 1999 },
      enterprise: { credits: 2000, price: 5999 },
    };

    const pack = packs[body.creditPackId];
    if (!pack) {
      return c.json({ message: 'Invalid credit pack' }, 400);
    }

    const url = await createCheckoutSession(stripe, {
      lineItems: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${pack.credits} AI Credits`,
            },
            unit_amount: pack.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'credit_pack',
        packId: body.creditPackId,
        credits: String(pack.credits),
        userId,
      },
      successUrl: `${c.env.APP_URL}/settings?credits_purchased=true`,
      cancelUrl: `${c.env.APP_URL}/pricing`,
      customerId: user.stripe_customer_id ?? undefined,
    });

    return c.json({ url });
  }

  return c.json({ message: 'Specify planId or creditPackId' }, 400);
});

paymentRoutes.post('/webhook', async (c) => {
  const body = await c.req.text();
  const signature = c.req.header('stripe-signature');

  if (!signature) {
    return c.json({ message: 'Missing signature' }, 400);
  }

  const stripe = createStripeClient(c.env.STRIPE_SECRET_KEY);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      c.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return c.json({ message: 'Invalid signature' }, 400);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const metadata = session.metadata ?? {};

      if (metadata.type === 'credit_pack') {
        const credits = parseInt(metadata.credits ?? '0', 10);
        const userId = metadata.userId;

        if (userId && credits > 0) {
          await updateUserCredits(c.env.DB, userId, credits);
          await logCreditTransaction(
            c.env.DB,
            userId,
            credits,
            'credit',
            undefined,
            session.id,
          );
        }
      }

      if (metadata.type === 'subscription') {
        const userId = metadata.userId;
        const planId = metadata.planId;

        if (userId && planId) {
          await c.env.DB.prepare(
            "UPDATE users SET plan = ?, stripe_subscription_id = ?, updated_at = datetime('now') WHERE id = ?",
          )
            .bind(planId, session.subscription ?? null, userId)
            .run();
        }
      }

      if (metadata.type === 'marketplace_purchase') {
        const listingId = metadata.listingId;
        const buyerId = metadata.buyerId;

        if (listingId && buyerId) {
          const listing = await c.env.DB.prepare(
            'SELECT * FROM marketplace_listings WHERE id = ?',
          )
            .bind(listingId)
            .first();

          if (listing) {
            const amount = listing.price_cents as number;
            const platformFee = Math.round(amount * 0.15);
            const sellerPayout = amount - platformFee;

            await c.env.DB.prepare(
              'INSERT INTO marketplace_purchases (id, listing_id, buyer_id, stripe_payment_intent_id, amount_cents, platform_fee_cents, seller_payout_cents) VALUES (?, ?, ?, ?, ?, ?, ?)',
            )
              .bind(
                nanoid(),
                listingId,
                buyerId,
                session.payment_intent ?? null,
                amount,
                platformFee,
                sellerPayout,
              )
              .run();

            await c.env.DB.prepare(
              'UPDATE marketplace_listings SET downloads = downloads + 1 WHERE id = ?',
            )
              .bind(listingId)
              .run();
          }
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await c.env.DB.prepare(
        "UPDATE users SET plan = 'free', stripe_subscription_id = NULL, updated_at = datetime('now') WHERE stripe_subscription_id = ?",
      )
        .bind(subscription.id)
        .run();
      break;
    }
  }

  return c.json({ received: true });
});

paymentRoutes.post('/connect', authMiddleware(), async (c) => {
  const userId = c.get('userId') as string;
  const user = await getUser(c.env.DB, userId);

  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }

  const stripe = createStripeClient(c.env.STRIPE_SECRET_KEY);

  const account = await stripe.accounts.create({
    type: 'express',
    email: user.email,
    metadata: { userId },
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${c.env.APP_URL}/settings`,
    return_url: `${c.env.APP_URL}/settings?connected=true`,
    type: 'account_onboarding',
  });

  return c.json({ url: accountLink.url });
});

paymentRoutes.post('/portal', authMiddleware(), async (c) => {
  const userId = c.get('userId') as string;
  const user = await getUser(c.env.DB, userId);

  if (!user || !user.stripe_customer_id) {
    return c.json({ message: 'No billing account found' }, 404);
  }

  const stripe = createStripeClient(c.env.STRIPE_SECRET_KEY);

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: `${c.env.APP_URL}/settings`,
  });

  return c.json({ url: session.url });
});
