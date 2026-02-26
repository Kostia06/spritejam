import { nanoid } from 'nanoid';

interface UserRow {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  credits: number;
  plan: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function getUser(
  db: D1Database,
  id: string,
): Promise<UserRow | null> {
  const row = await db
    .prepare('SELECT * FROM users WHERE id = ?')
    .bind(id)
    .first<UserRow>();

  return row ?? null;
}

export async function updateUserCredits(
  db: D1Database,
  userId: string,
  amount: number,
): Promise<void> {
  await db
    .prepare(
      "UPDATE users SET credits = credits + ?, updated_at = datetime('now') WHERE id = ?",
    )
    .bind(amount, userId)
    .run();
}

export async function logCreditTransaction(
  db: D1Database,
  userId: string,
  amount: number,
  type: string,
  feature?: string,
  paymentId?: string,
): Promise<void> {
  const id = nanoid();

  await db
    .prepare(
      'INSERT INTO credit_transactions (id, user_id, amount, type, ai_feature, stripe_payment_id) VALUES (?, ?, ?, ?, ?, ?)',
    )
    .bind(id, userId, amount, type, feature ?? null, paymentId ?? null)
    .run();
}
