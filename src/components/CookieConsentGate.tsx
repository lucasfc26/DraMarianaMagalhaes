import { PropsWithChildren, useEffect, useState } from "react";

const consentKey = "dra-mariana-lgpd-cookie-consent";

export function CookieConsentGate({ children }: PropsWithChildren) {
  const [consent, setConsent] = useState<"checking" | "pending" | "accepted" | "declined">("checking");

  useEffect(() => {
    const stored = window.localStorage.getItem(consentKey);
    setConsent(stored === "accepted" ? "accepted" : "pending");
  }, []);

  const accept = () => {
    window.localStorage.setItem(consentKey, "accepted");
    setConsent("accepted");
  };

  const decline = () => {
    window.localStorage.removeItem(consentKey);
    setConsent("declined");
  };

  if (consent === "accepted") {
    return <>{children}</>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10 text-foreground">
      <section className="w-full max-w-2xl border border-foreground/15 bg-card p-6 shadow-soft md:p-9">
        <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">Privacidade e cookies</div>
        <h1 className="mt-4 font-display text-5xl leading-none md:text-6xl">
          Antes de continuar
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Este site usa recursos essenciais para funcionamento, segurança e envio de solicitações de agendamento.
          As informações do formulário e as consultas ao sistema de agenda só são ativadas após o seu aceite.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Ao aceitar, você concorda com os Termos de Uso e com a Política de Privacidade, conforme a LGPD.
        </p>

        {consent === "declined" && (
          <div className="mt-6 border border-foreground/15 bg-background p-4 text-sm text-muted-foreground">
            Sem o aceite, a página pública e o agendamento online permanecem bloqueados. Você ainda pode consultar os
            documentos legais abaixo.
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-foreground px-7 py-4 text-xs uppercase tracking-[0.22em] text-background transition-transform hover:scale-[1.02]"
          >
            Aceitar e entrar
          </button>
          <button
            type="button"
            onClick={decline}
            className="rounded-full border border-foreground/25 px-7 py-4 text-xs uppercase tracking-[0.22em] text-foreground"
          >
            Não aceitar
          </button>
        </div>

        <div className="mt-7 flex flex-wrap gap-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <a href="/termos-de-uso" className="hover:text-foreground">
            Termos de uso
          </a>
          <a href="/politica-de-privacidade" className="hover:text-foreground">
            Política de privacidade
          </a>
        </div>
      </section>
    </main>
  );
}
