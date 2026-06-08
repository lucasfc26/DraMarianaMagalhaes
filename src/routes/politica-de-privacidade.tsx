import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/politica-de-privacidade")({
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground md:px-10">
      <article className="mx-auto max-w-3xl">
        <a href="/" className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground">
          Voltar ao site
        </a>
        <h1 className="mt-8 font-display text-5xl leading-none md:text-6xl">Política de Privacidade</h1>
        <p className="mt-4 text-sm text-muted-foreground">Última atualização: 08/06/2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-3xl text-foreground">1. Controlador</h2>
            <p className="mt-3">
              A responsável pelo tratamento dos dados deste site é Dra. Mariana Magalhães, cirurgiã-dentista, com
              atendimento em Fortaleza/CE. Para assuntos de privacidade, entre em contato pelo e-mail
              marianamagalhaes67@hotmail.com.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground">2. Dados tratados</h2>
            <p className="mt-3">
              Após o aceite de cookies, o site pode tratar nome, telefone ou e-mail, procedimento desejado, data,
              horário, canal de contato e observações enviadas voluntariamente no formulário de agendamento.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground">3. Finalidades</h2>
            <p className="mt-3">
              Os dados são usados para responder solicitações, organizar a agenda, confirmar horários, prestar
              atendimento e cumprir obrigações legais, regulatórias ou profissionais aplicáveis.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground">4. Base legal</h2>
            <p className="mt-3">
              O tratamento ocorre com base no consentimento do titular, execução de procedimentos preliminares
              relacionados ao atendimento solicitado, legítimo interesse para gestão da agenda e cumprimento de
              obrigações legais quando aplicável.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground">5. Cookies e integrações</h2>
            <p className="mt-3">
              Antes do aceite, a página pública não carrega o formulário de agendamento nem consulta o sistema externo
              de agenda. Após o aceite, o site usa armazenamento local para registrar sua escolha e pode se comunicar
              com o Supabase para listar procedimentos, horários e registrar solicitações.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground">6. Compartilhamento</h2>
            <p className="mt-3">
              Os dados podem ser processados por provedores necessários ao funcionamento do site e da agenda, como
              Supabase, e pelos canais escolhidos pelo usuário, como WhatsApp ou e-mail. Não há venda de dados pessoais.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground">7. Retenção e segurança</h2>
            <p className="mt-3">
              As informações são mantidas pelo tempo necessário para atendimento, organização administrativa e
              cumprimento de obrigações legais. São adotadas medidas técnicas e organizacionais para reduzir riscos de
              acesso não autorizado, perda ou uso indevido.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground">8. Direitos do titular</h2>
            <p className="mt-3">
              Você pode solicitar confirmação de tratamento, acesso, correção, anonimização, bloqueio, eliminação,
              portabilidade, informação sobre compartilhamento e revogação do consentimento, conforme a LGPD.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-foreground">9. Autoridade nacional</h2>
            <p className="mt-3">
              Caso entenda necessário, você também pode apresentar petição à Autoridade Nacional de Proteção de Dados
              (ANPD), sem prejuízo de entrar em contato conosco antes para buscar uma solução.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
