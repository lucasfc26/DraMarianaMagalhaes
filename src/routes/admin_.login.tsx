import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, KeyRound, Loader2, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { callFunction, isSupabaseConfigured, signInAdmin } from "@/lib/supabase";

export const Route = createFileRoute("/admin_/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("marianamagalhaes67@hotmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await signInAdmin(email.trim().toLowerCase(), password);
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  };

  const recoverPassword = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await callFunction("reset-admin-password", { email: email.trim().toLowerCase() }, undefined);
      setMessage("Se o e-mail estiver cadastrado, uma senha temporária será enviada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível solicitar a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-12">
        <section className="flex flex-col justify-between px-6 py-8 md:px-10 lg:col-span-5">
          <a
            href="/"
            className="inline-flex w-fit items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </a>

          <div className="py-20">
            <div className="mb-6 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Acesso administrativo
            </div>
            <h1 className="font-display text-6xl leading-[0.95] md:text-7xl">
              Professional<br />
              <span className="italic text-gold-gradient">OdontoSys</span>
            </h1>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
              Área reservada para gerenciar procedimentos, disponibilidade, agendamentos e senha de acesso.
            </p>
          </div>

          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Dra. Mariana Magalhães · CROCE-17697
          </div>
        </section>

        <section className="flex items-center px-6 pb-12 md:px-10 lg:col-span-7 lg:pb-0">
          <form onSubmit={submit} className="w-full border border-foreground/15 bg-card/60 p-6 shadow-soft md:p-10">
            {!isSupabaseConfigured && (
              <div className="mb-6 border border-gold/50 bg-gold/10 p-4 text-sm leading-relaxed text-foreground">
                Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` para ativar o login.
              </div>
            )}

            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
              <KeyRound className="h-6 w-6" />
            </div>

            <label className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Nome de acesso administrativo
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-3 w-full border-b border-foreground/20 bg-transparent pb-3 font-display text-2xl outline-none transition-colors focus:border-foreground"
              placeholder="staff@professionalodontosys.com.br"
              required
            />

            <label className="mt-8 block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-3 w-full border-b border-foreground/20 bg-transparent pb-3 font-display text-2xl outline-none transition-colors focus:border-foreground"
              placeholder="Digite sua senha"
              required
            />

            {error && <p className="mt-5 text-sm text-red-600">{error}</p>}
            {message && <p className="mt-5 text-sm text-foreground">{message}</p>}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={recoverPassword}
                disabled={loading || !email.trim()}
                className="inline-flex items-center gap-3 rounded-full border border-foreground/30 px-6 py-4 text-xs uppercase tracking-[0.2em] transition-all hover:border-foreground disabled:pointer-events-none disabled:opacity-40"
              >
                <Mail className="h-4 w-4" />
                Esqueci a senha
              </button>

              <button
                type="submit"
                disabled={loading || !isSupabaseConfigured}
                className="inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] text-background transition-transform hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-40"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                Entrar
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
