import { signal } from '@preact/signals';

export interface CreditTransaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  createdAt: string;
}

export const transactions = signal<CreditTransaction[]>([]);
export const transactionsLoading = signal(false);
