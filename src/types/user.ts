export type PlanId = 'free' | 'pro' | 'studio';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  credits: number;
  plan: PlanId;
  createdAt: string;
}
