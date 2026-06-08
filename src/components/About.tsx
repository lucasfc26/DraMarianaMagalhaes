import { motion } from "framer-motion";

const stats = [
  { n: "10+", l: "Anos de prática" },
  { n: "1.2k", l: "Sorrisos transformados" },
  { n: "98%", l: "Satisfação clínica" },
  { n: "24", l: "Especializações" },
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
              Trabalho na intersecção entre ciência odontológica e estética
              editorial. Cada plano é pensado como um portfólio: composição,
              proporção e identidade — para devolver não só função, mas presença.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Especialista em reabilitação oral minimamente invasiva e design
              digital do sorriso, com formação internacional e foco em pacientes
              que valorizam discrição, durabilidade e refinamento visual.
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
