import Stripe from 'stripe';

export function createStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
    httpClient: Stripe.createFetchHttpClient(),
  });
}

interface LineItem {
  price_data: {
    currency: string;
    product_data: { name: string };
    unit_amount: number;
    recurring?: { interval: string };
  };
  quantity: number;
}

export interface CheckoutParams {
  lineItems: LineItem[];
  metadata: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
  mode?: string;
  customerId?: string;
}

export async function createCheckoutSession(
  stripe: Stripe,
  params: CheckoutParams,
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    line_items: params.lineItems as Stripe.Checkout.SessionCreateParams.LineItem[],
    mode: (params.mode ?? 'payment') as Stripe.Checkout.SessionCreateParams.Mode,
    metadata: params.metadata,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer: params.customerId,
  });

  return session.url ?? '';
}
