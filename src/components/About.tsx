import { motion } from "framer-motion";

const stats = [
  { n: "CRO", l: "Registro ativo" },
  { n: "1:1", l: "Plano individual" },
  { n: "24h", l: "Retorno de agenda" },
  { n: "360", l: "Cuidado bucal e facial" },
];

export function About() {
  return (
    <section id="sobre" className="relative py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="lg:col-span-5"
          >
            <div className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6">
              ⟶ Filosofia
            </div>
            <h2 className="font-display text-5xl md:text-6xl leading-[1.05]">
              Cada sorriso é<br />
              <span className="italic text-gold-gradient">uma assinatura.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-6 lg:col-start-7 space-y-6"
          >
            <p className="text-lg leading-relaxed text-foreground/85">
              A proposta da clínica é unir escuta, avaliação detalhada e execução
              cuidadosa para que cada paciente entenda suas opções antes de iniciar
              o tratamento. O foco está em saúde, conforto e resultados que respeitam
              a individualidade de cada rosto e sorriso.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              No consultório, a Dra. Mariana realiza desde procedimentos essenciais,
              como limpeza, restaurações, placas para DTM/bruxismo e urgências, até
              clareamento dental, atendimento pediátrico e protocolos de estética
              facial como botox, skinbooster, preenchimentos, bioestimuladores de
              colágeno e fios lisos.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-border/60 border border-border/60">
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="bg-background p-8 md:p-10 group hover:bg-card transition-colors duration-700"
            >
              <div className="font-display text-5xl md:text-6xl text-foreground group-hover:text-gold-gradient transition-all">
                {s.n}
              </div>
              <div className="mt-3 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                {s.l}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
