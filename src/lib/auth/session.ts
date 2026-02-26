import { user, jwt } from '@/signals/auth';
import { api } from '@/lib/api';
import type { User } from '@/types/user';

const JWT_KEY = 'pm_jwt';

export function loadSession(): void {
  const stored = localStorage.getItem(JWT_KEY);
  if (stored) {
    jwt.value = stored;
    refreshUser();
  }
}

export function setSession(token: string): void {
  jwt.value = token;
  localStorage.setItem(JWT_KEY, token);
  refreshUser();
}

export function clearSession(): void {
  jwt.value = null;
  user.value = null;
  localStorage.removeItem(JWT_KEY);
}

async function refreshUser(): Promise<void> {
  try {
    const data = await api.get<User>('/api/auth/me');
    user.value = data;
  } catch {
    clearSession();
  }
}
