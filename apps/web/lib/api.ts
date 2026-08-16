import {staticApiGet} from './staticData';
const API = process.env.API_INTERNAL_URL;

export async function apiGet<T>(path: string): Promise<T> {
  if(!API){const value=staticApiGet(path);if(value==null)throw new Error('Static API resource not found');return value as T}
  const res = await fetch(`${API}/api${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}
