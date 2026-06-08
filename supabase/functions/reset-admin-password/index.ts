import nodemailer from "npm:nodemailer@6.9.16";
import { corsHeaders, jsonResponse } from "./cors.ts";

type AdminProfile = {
  id: string;
  email: string;
  display_name: string;
  is_admin: boolean;
};

function env(name: string, fallback = "") {
  return Deno.env.get(name) || fallback;
}

function makeTemporaryPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
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
    const appUrl = env("APP_URL", "http://localhost:5173/admin/login");
    const smtpHost = env("SMTP_HOST");
    const smtpPort = Number(env("SMTP_PORT", "587"));
    const smtpUser = env("SMTP_USER");
    const smtpPass = env("SMTP_PASS");
    const smtpFrom = env("SMTP_FROM", "staff@professionalodontosys.com.br");

    if (!supabaseUrl || !serviceRoleKey || !smtpHost || !smtpUser || !smtpPass) {
      return jsonResponse({ error: "Variáveis de ambiente incompletas." }, 500);
    }

    const { email } = await request.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      return jsonResponse({ error: "Informe o e-mail administrativo." }, 400);
    }

    const profileResponse = await fetch(
      `${supabaseUrl}/rest/v1/admin_profiles?select=id,email,display_name,is_admin&email=eq.${encodeURIComponent(normalizedEmail)}&is_admin=eq.true&limit=1`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
    );

    const profiles = (await profileResponse.json()) as AdminProfile[];
    const profile = profiles[0];

    // Retorno genérico para não revelar se o e-mail existe.
    if (!profile) {
      return jsonResponse({ ok: true });
    }

    const temporaryPassword = makeTemporaryPassword();

    const updateUserResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${profile.id}`, {
      method: "PUT",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: temporaryPassword }),
    });

    if (!updateUserResponse.ok) {
      const error = await updateUserResponse.json().catch(() => null);
      return jsonResponse({ error: error?.message || "Não foi possível gerar a senha." }, 500);
    }

    await fetch(`${supabaseUrl}/rest/v1/admin_profiles?id=eq.${profile.id}`, {
      method: "PATCH",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ must_change_password: true }),
    });

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: profile.email,
      subject: "Senha temporária - Professional OdontoSys",
      text: [
        `Olá, ${profile.display_name}.`,
        "",
        "Uma senha temporária foi gerada para o acesso administrativo.",
        "",
        `Senha temporária: ${temporaryPassword}`,
        "",
        `Acesse: ${appUrl}`,
        "",
        "Depois do login, altere a senha em Configurações.",
      ].join("\n"),
    });

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : "Erro inesperado." }, 500);
  }
});
