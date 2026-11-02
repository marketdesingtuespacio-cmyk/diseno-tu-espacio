// Acceso a Supabase desde las Cloudflare Pages Functions con la clave service_role.
// Esta clave solo existe en las variables de entorno del servidor (Cloudflare → Settings → Variables).

export interface ServerEnv {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  BOLD_IDENTITY_KEY: string;
  BOLD_SECRET_KEY: string;
  SIIGO_USERNAME: string;
  SIIGO_ACCESS_KEY: string;
  SIIGO_PARTNER_ID?: string;
  SIIGO_DOCUMENT_ID?: string;
  SIIGO_SELLER_ID?: string;
  SIIGO_PAYMENT_ID_BOLD?: string;
  SIIGO_PAYMENT_ID_ADDI?: string;
}

const DEFAULT_SUPABASE_URL = 'https://ukvoqxsmrpicnpelkhex.supabase.co';

export const supabaseUrl = (env: ServerEnv) => env.SUPABASE_URL || DEFAULT_SUPABASE_URL;

const headers = (env: ServerEnv, extra: Record<string, string> = {}) => ({
  apikey: env.SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  ...extra
});

export async function dbSelect<T = any>(env: ServerEnv, table: string, query: string): Promise<T[]> {
  const res = await fetch(`${supabaseUrl(env)}/rest/v1/${table}?${query}`, { headers: headers(env) });
  if (!res.ok) throw new Error(`Supabase select ${table} (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function dbInsert<T = any>(env: ServerEnv, table: string, rows: object | object[]): Promise<T[]> {
  const res = await fetch(`${supabaseUrl(env)}/rest/v1/${table}`, {
    method: 'POST',
    headers: headers(env, { Prefer: 'return=representation' }),
    body: JSON.stringify(rows)
  });
  if (!res.ok) throw new Error(`Supabase insert ${table} (${res.status}): ${await res.text()}`);
  return res.json();
}

/** Actualiza y devuelve las filas modificadas (vacío si el filtro no encontró nada). */
export async function dbUpdate<T = any>(env: ServerEnv, table: string, query: string, values: object): Promise<T[]> {
  const res = await fetch(`${supabaseUrl(env)}/rest/v1/${table}?${query}`, {
    method: 'PATCH',
    headers: headers(env, { Prefer: 'return=representation' }),
    body: JSON.stringify(values)
  });
  if (!res.ok) throw new Error(`Supabase update ${table} (${res.status}): ${await res.text()}`);
  return res.json();
}

/** Devuelve el perfil del usuario del panel (admin o colaborador activo) dueño del token, o null. */
export async function getStaffProfile(env: ServerEnv, request: Request): Promise<any | null> {
  const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const res = await fetch(`${supabaseUrl(env)}/auth/v1/user`, {
    headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  const user = await res.json();
  const [profile] = await dbSelect(env, 'profiles', `id=eq.${user.id}&select=id,full_name,email,role,status`);
  if (!profile || !['admin', 'collaborator'].includes(profile.role) || (profile.status || 'active') !== 'active') return null;
  return profile;
}

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
