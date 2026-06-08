import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock, Mail, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";

const whatsappNumber = "5585998420239";
const clinicEmail = "marianamagalhaes67@hotmail.com";
const procedures = ["Consulta", "Limpeza", "Clareamento", "Botox", "HOF"];
const times = Array.from({ length: 11 }, (_, index) => `${String(index + 8).padStart(2, "0")}:00`);
const weekdays = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const months = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

type Channel = "whatsapp" | "email";

type Appointment = {
  procedure: string;
  date: string;
  time: string;
  name: string;
  contact: string;
  comment: string;
  channel: Channel;
};

const initialAppointment: Appointment = {
  procedure: "Consulta",
  date: "",
  time: "",
  name: "",
  contact: "",
  comment: "",
  channel: "whatsapp",
};

function getMonthDays() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const total = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: total }, (_, index) => {
    const day = index + 1;
    const date = new Date(year, month, day);
    return {
      value: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      day,
      weekday: weekdays[date.getDay()],
      month: months[month],
      disabled: date < new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    };
  });
}

function formatDate(value: string) {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return `${String(day).padStart(2, "0")} de ${months[month - 1]} (${weekdays[date.getDay()]})`;
}

function buildMessage(data: Appointment) {
  return [
    "Olá Dra. Mariana, gostaria de agendar um horário.",
    "",
    `Procedimento: ${data.procedure}`,
    `Data: ${formatDate(data.date)}`,
    `Horário: ${data.time}`,
    `Nome: ${data.name}`,
    `Contato: ${data.contact}`,
    data.comment ? `Comentário: ${data.comment}` : "Comentário: sem observações",
  ].join("\n");
}

export function Contact() {
  const days = useMemo(() => getMonthDays(), []);
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState<Appointment>(initialAppointment);

  const steps = [
    { label: "Proced", valid: Boolean(form.procedure) },
    { label: "Dia", valid: Boolean(form.date) },
    { label: "Horário", valid: Boolean(form.time) },
    { label: "Dados", valid: Boolean(form.name.trim() && form.contact.trim()) },
  ];
  const canGoNext = steps[step].valid;
  const confirmationMessage = buildMessage(form);

  const resetForm = () => {
    setForm(initialAppointment);
    setStep(0);
    setSent(false);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!steps.every((item) => item.valid)) return;

    const encodedMessage = encodeURIComponent(confirmationMessage);

    if (form.channel === "whatsapp") {
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
    } else {
      const subject = encodeURIComponent(`Agendamento - ${form.procedure}`);
      window.open(`mailto:${clinicEmail}?subject=${subject}&body=${encodedMessage}`, "_blank");
    }

    setSent(true);
  };

  return (
    <section id="contato" className="relative py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:col-span-5"
          >
            <div className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6">
              ⟶ Agende sua consulta
            </div>
            <h2 className="font-display text-5xl md:text-6xl leading-[1.05] mb-8">
              Vamos<br />
              <span className="italic text-gold-gradient">conversar.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-md">
              Atendimento personalizado em Fortaleza/CE. Resposta em até 24 horas.
            </p>
            <div className="space-y-4 text-sm">
              <a href={`mailto:${clinicEmail}`} className="block group">
                <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
                  Email
                </div>
                <div className="font-display text-xl group-hover:text-gold-gradient transition-all">
                  {clinicEmail}
                </div>
              </a>
              <a href={`https://wa.me/${whatsappNumber}`} className="block group">
                <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
                  WhatsApp
                </div>
                <div className="font-display text-xl group-hover:text-gold-gradient transition-all">
                  +55 85 99842-0239
                </div>
              </a>
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
                  Consultório
                </div>
                <div className="font-display text-xl">Scopa Platinum Corporate - Sala 811 (8º andar)</div>
                <div className="font-display text-xl">Rua Monsenhor Bruno, 1153 - Aldeota · Fortaleza/CE</div>
              </div>
            </div>
          </motion.div>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-6 lg:col-start-7"
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-foreground/15 bg-card/95 p-6 shadow-soft backdrop-blur-md md:p-8"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
                  <Check className="h-6 w-6" />
                </div>
                <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                  Agendamento enviado
                </div>
                <h3 className="mt-3 font-display text-4xl leading-tight">
                  Solicitação registrada com sucesso.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  A mensagem foi aberta em {form.channel === "whatsapp" ? "WhatsApp" : "email"} com
                  os dados escolhidos. Confira o resumo antes de finalizar por lá.
                </p>

                <div className="mt-8 border border-foreground/15 bg-background/80 p-5">
                  <div className="mb-5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Resultado escolhido
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ["Procedimento", form.procedure],
                      ["Dia", formatDate(form.date)],
                      ["Horário", form.time],
                      ["Envio", form.channel === "whatsapp" ? "WhatsApp" : "Email"],
                      ["Nome", form.name],
                      ["Contato", form.contact],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                          {label}
                        </div>
                        <div className="mt-1 font-display text-xl">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border border-gold/40 bg-gold/10 p-5">
                  <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Mensagem
                  </div>
                  <div className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                    {confirmationMessage}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-8 inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] text-background transition-transform duration-500 hover:scale-[1.02]"
                >
                  Ok
                  <Check className="h-4 w-4" />
                </button>
              </motion.div>
            ) : (
              <>
            <div className="mb-10 grid grid-cols-4 gap-2">
              {steps.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => (index <= step || item.valid) && setStep(index)}
                  className={`min-h-16 border px-3 py-3 text-left transition-all ${
                    index === step
                      ? "border-foreground bg-foreground text-background"
                      : item.valid
                        ? "border-gold/60 bg-gold/10 text-foreground"
                        : "border-foreground/15 text-muted-foreground"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-[0.25em]">{String(index + 1).padStart(2, "0")}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.12em]">{item.label}</div>
                </button>
              ))}
            </div>

            <div className="min-h-[450px]">
              {step === 0 && (
                <div>
                  <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    <Check className="h-4 w-4" />
                    Procedimento
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {procedures.map((procedure) => (
                      <button
                        key={procedure}
                        type="button"
                        onClick={() => setForm({ ...form, procedure })}
                        className={`min-h-24 border px-5 py-4 text-left transition-all ${
                          form.procedure === procedure
                            ? "border-foreground bg-foreground text-background shadow-soft"
                            : "border-foreground/15 hover:border-foreground/50"
                        }`}
                      >
                        <span className="font-display text-2xl">{procedure}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    Dias de {days[0]?.month}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {days.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        disabled={item.disabled}
                        onClick={() => setForm({ ...form, date: item.value })}
                        className={`min-h-20 border px-4 py-3 text-left transition-all disabled:pointer-events-none disabled:opacity-35 ${
                          form.date === item.value
                            ? "border-foreground bg-foreground text-background shadow-soft"
                            : "border-foreground/15 hover:border-foreground/50"
                        }`}
                      >
                        <div className="font-display text-3xl leading-none">{item.day}</div>
                        <div className="mt-2 text-[10px] uppercase tracking-[0.2em]">{item.weekday}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Horários
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {times.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setForm({ ...form, time })}
                        className={`min-h-16 border px-4 py-3 font-display text-2xl transition-all ${
                          form.time === time
                            ? "border-foreground bg-foreground text-background shadow-soft"
                            : "border-foreground/15 hover:border-foreground/50"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-7">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
                        Nome
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={(event) => setForm({ ...form, name: event.target.value })}
                        className="w-full bg-transparent border-b border-foreground/20 pb-3 text-lg font-display focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
                        Telefone ou email
                      </label>
                      <input
                        required
                        value={form.contact}
                        onChange={(event) => setForm({ ...form, contact: event.target.value })}
                        className="w-full bg-transparent border-b border-foreground/20 pb-3 text-lg font-display focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
                      Comentário
                    </label>
                    <textarea
                      rows={4}
                      value={form.comment}
                      onChange={(event) => setForm({ ...form, comment: event.target.value })}
                      className="w-full bg-transparent border-b border-foreground/20 pb-3 text-lg font-display focus:outline-none focus:border-foreground transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <div className="mb-3 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Enviar por</div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { value: "whatsapp" as const, label: "WhatsApp", icon: MessageCircle },
                        { value: "email" as const, label: "Email", icon: Mail },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setForm({ ...form, channel: item.value })}
                            className={`flex min-h-16 items-center justify-center gap-3 border px-5 py-4 text-xs uppercase tracking-[0.25em] transition-all ${
                              form.channel === item.value
                                ? "border-foreground bg-foreground text-background shadow-soft"
                                : "border-foreground/15 hover:border-foreground/50"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep((current) => Math.max(current - 1, 0))}
                className="inline-flex items-center gap-3 rounded-full border border-foreground/30 px-6 py-4 text-xs uppercase tracking-[0.25em] transition-all hover:border-foreground disabled:pointer-events-none disabled:opacity-35"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  disabled={!canGoNext}
                  onClick={() => setStep((current) => Math.min(current + 1, steps.length - 1))}
                  className="group relative inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] text-background transition-transform duration-500 hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-35"
                >
                  <span className="absolute inset-0 rounded-full gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="relative">Continuar</span>
                  <ArrowRight className="relative h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canGoNext}
                  className="group relative inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] text-background transition-transform duration-500 hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-35"
                >
                  <span className="absolute inset-0 rounded-full gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="relative">Enviar agendamento</span>
                  <Check className="relative h-4 w-4" />
                </button>
              )}
            </div>

              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
