import { jwt } from '@/signals/auth';

const BASE = import.meta.env.VITE_API_URL ?? '';

async function request(path: string, options: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = {
    ...options.headers as Record<string, string>,
  };

  if (jwt.value) {
    headers['Authorization'] = `Bearer ${jwt.value}`;
  }

  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response;
}

export const api = {
  async get<T = unknown>(path: string): Promise<T> {
    const res = await request(path);
    return res.json() as Promise<T>;
  },

  async post<T = unknown>(path: string, body?: unknown): Promise<T> {
    const res = await request(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json() as Promise<T>;
  },

  async put<T = unknown>(path: string, body?: unknown): Promise<T> {
    const res = await request(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json() as Promise<T>;
  },

  async del<T = unknown>(path: string): Promise<T> {
    const res = await request(path, { method: 'DELETE' });
    return res.json() as Promise<T>;
  },
};
