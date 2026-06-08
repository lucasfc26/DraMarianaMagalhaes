import { corsHeaders, jsonResponse } from "./cors.ts";

function env(name: string) {
  return Deno.env.get(name) || "";
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Método não permitido." }, 405);
  }

  try {
    const supabaseUrl = env("SUPABASE_URL");
    const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = env("SUPABASE_ANON_KEY");
    const authorization = request.headers.get("Authorization") || "";
    const token = authorization.replace("Bearer ", "");

    if (!supabaseUrl || !serviceRoleKey || !anonKey || !token) {
      return jsonResponse({ error: "Sessão inválida." }, 401);
    }

    const { password } = await request.json();
    if (String(password || "").length < 8) {
      return jsonResponse({ error: "A nova senha precisa ter pelo menos 8 caracteres." }, 400);
    }

    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`,
      },
    });

    const user = await userResponse.json();
    if (!userResponse.ok || !user?.id) {
      return jsonResponse({ error: "Sessão expirada. Entre novamente." }, 401);
    }

    const updatePasswordResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: "PUT",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!updatePasswordResponse.ok) {
      const error = await updatePasswordResponse.json().catch(() => null);
      return jsonResponse({ error: error?.message || "Não foi possível alterar a senha." }, 400);
    }

    await fetch(`${supabaseUrl}/rest/v1/admin_profiles?id=eq.${user.id}`, {
      method: "PATCH",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ must_change_password: false }),
    });

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : "Erro inesperado." }, 500);
  }
});
