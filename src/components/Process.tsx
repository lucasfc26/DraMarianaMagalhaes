import { motion } from "framer-motion";

const steps = [
  { n: "01", t: "Diagnóstico", d: "Anamnese, fotografia clínica e escaneamento digital 3D." },
  { n: "02", t: "Planejamento", d: "Design digital do sorriso com simulação realista pré-aprovada." },
  { n: "03", t: "Mockup", d: "Provisório experimental para validar estética e função na boca." },
  { n: "04", t: "Execução", d: "Protocolo clínico minimamente invasivo, sessões controladas." },
  { n: "05", t: "Refinamento", d: "Polimento, ajustes oclusais e checagem de croma final." },
  { n: "06", t: "Acompanhamento", d: "Manutenção, fotografia evolutiva e revisão semestral." },
];

export function Process() {
  return (
    <section id="processo" className="relative py-32 md:py-40 bg-card/40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="text-center mb-20">
          <div className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6">
            ⟶ Processo Clínico
          </div>
          <h2 className="font-display text-5xl md:text-7xl leading-[1.05]">
            Do diagnóstico ao <span className="italic text-gold-gradient">sorriso final</span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className={`relative flex md:items-center mb-16 last:mb-0 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className={`md:w-1/2 pl-16 md:pl-0 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                <div className="font-mono text-xs text-accent-foreground/70 mb-2 tracking-[0.2em]">
                  STEP {s.n}
                </div>
                <h3 className="font-display text-3xl md:text-4xl mb-3">{s.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gold ring-8 ring-background" />
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
