import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/termos-de-uso")({
  component: TermsOfUse,
});

function TermsOfUse() {
  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground md:px-10">
      <article className="mx-auto max-w-3xl">
        <a href="/" className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground">
          Voltar ao site
        </a>
        <h1 className="mt-8 font-display text-5xl leading-none md:text-6xl">Termos de Uso</h1>
        <p className="mt-4 text-sm text-muted-foreground">Última atualização: 08/06/2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-3xl text-foreground">1. Finalidade do site</h2>
            <p className="mt-3">
              Este site apresenta informações institucionais e permite solicitar agendamentos odontológicos e de
              estética facial com a Dra. Mariana Magalhães, em Fortaleza/CE.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground">2. Agendamento</h2>
            <p className="mt-3">
              O envio do formulário não confirma automaticamente a consulta. A confirmação depende de contato da
              clínica, disponibilidade da agenda e validação das informações fornecidas.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground">3. Informações de saúde</h2>
            <p className="mt-3">
              O conteúdo do site tem caráter informativo e não substitui avaliação individual por profissional
              habilitado. Condutas, indicações e resultados dependem de consulta clínica.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground">4. Responsabilidades do usuário</h2>
            <p className="mt-3">
              Ao usar o formulário, você se compromete a fornecer dados verdadeiros, atuais e suficientes para contato.
              Não é permitido usar o site para mensagens ofensivas, falsas, automatizadas ou que violem direitos de
              terceiros.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground">5. Privacidade</h2>
            <p className="mt-3">
              O tratamento de dados pessoais segue a Política de Privacidade deste site e a Lei Geral de Proteção de
              Dados Pessoais, Lei nº 13.709/2018.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground">6. Alterações</h2>
            <p className="mt-3">
              Estes termos podem ser atualizados para refletir mudanças no site, nos serviços ou em exigências legais.
              A versão vigente será sempre publicada nesta página.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
