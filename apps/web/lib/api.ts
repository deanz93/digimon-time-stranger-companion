const API = process.env.API_INTERNAL_URL ?? 'http://127.0.0.1:4000';

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API}/api${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}
