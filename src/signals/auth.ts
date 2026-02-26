import { signal, computed } from '@preact/signals';
import type { User } from '@/types/user';

export const user = signal<User | null>(null);
export const jwt = signal<string | null>(null);
export const isAuthenticated = computed(() => user.value !== null);
export const creditBalance = computed(() => user.value?.credits ?? 0);
