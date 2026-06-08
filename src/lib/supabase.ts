export type AdminSession = {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user: {
    id: string;
    email?: string;
  };
};

export type Procedure = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  active: boolean;
  sort_order: number;
};

export type AvailabilitySlot = {
  id: string;
  procedure_id: string | null;
  slot_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  is_booked: boolean;
  notes: string | null;
  procedures?: Pick<Procedure, "name">;
};

export type Appointment = {
  id: string;
  procedure_id: string | null;
  slot_id: string | null;
  procedure_name: string;
  patient_name: string;
  patient_contact: string;
  patient_comment: string | null;
  channel: "whatsapp" | "email";
  requested_date: string | null;
  requested_time: string | null;
  status: "pending" | "confirmed" | "cancelled" | "done";
  created_at: string;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const sessionKey = "dra-mariana-admin-session";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function assertSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
  }
}

function jsonHeaders(token?: string) {
  assertSupabase();

  return {
    apikey: supabaseAnonKey!,
    Authorization: `Bearer ${token || supabaseAnonKey}`,
    "Content-Type": "application/json",
  };
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(sessionKey);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as AdminSession;
    if (session.expires_at && session.expires_at < Math.floor(Date.now() / 1000)) {
      clearAdminSession();
      return null;
    }

    return session;
  } catch {
    clearAdminSession();
    return null;
  }
}

export function setAdminSession(session: AdminSession) {
  window.localStorage.setItem(sessionKey, JSON.stringify(session));
}

export function clearAdminSession() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(sessionKey);
  }
}

export async function signInAdmin(email: string, password: string) {
  assertSupabase();

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || data.msg || "Não foi possível entrar.");
  }

  const session: AdminSession = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_in ? Math.floor(Date.now() / 1000) + data.expires_in : undefined,
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  };

  setAdminSession(session);
  return session;
}

export async function restFetch<T>(
  path: string,
  options: RequestInit = {},
  token = getAdminSession()?.access_token,
) {
  assertSupabase();

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      ...jsonHeaders(token),
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });

  if (response.status === 204) return null as T;

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(data?.message || data?.msg || `Erro ${response.status} ao consultar o Supabase.`);
  }

  return data as T;
}

export async function callFunction<T>(
  name: string,
  body: unknown,
  token = getAdminSession()?.access_token,
) {
  assertSupabase();

  const response = await fetch(`${supabaseUrl}/functions/v1/${name}`, {
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || "A função do Supabase retornou erro.");
  }

  return data as T;
}

export function toTimeLabel(value: string) {
  return value.slice(0, 5);
}
