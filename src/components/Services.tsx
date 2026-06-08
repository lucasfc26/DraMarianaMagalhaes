import { motion } from "framer-motion";

const services = [
  { n: "01", t: "Reabilitação Oral", d: "Restauração completa da função e estética com materiais premium e técnicas minimamente invasivas." },
  { n: "02", t: "Design do Sorriso", d: "Planejamento digital personalizado para harmonização orofacial e estética dental de alto padrão." },
  { n: "03", t: "Facetas em Cerâmica", d: "Lentes ultrafinas com escultura artesanal — naturalidade e durabilidade editorial." },
  { n: "04", t: "Implantodontia", d: "Cirurgia guiada digital com prótese imediata e protocolo estético invisível." },
  { n: "05", t: "Clareamento Avançado", d: "Protocolos in-office e supervisionados com controle de sensibilidade e croma." },
  { n: "06", t: "Ortodontia Invisível", d: "Alinhadores transparentes com planejamento 3D e acompanhamento próximo." },
];

export function Services() {
  return (
    <section id="especialidades" className="relative py-32 md:py-40 bg-card/40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-20">
          <div>
            <div className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6">
              ⟶ Especialidades
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-[1.05] max-w-2xl">
              Áreas de<br />
              <span className="italic">Especialidade</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
            Procedimentos selecionados, protocolados e executados com precisão
            milimétrica e cuidado editorial em cada detalhe.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 border border-border/60">
          {services.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              className="group relative bg-background p-10 hover:bg-card transition-all duration-700 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-700" />
              <div className="flex items-start justify-between mb-12">
                <span className="font-mono text-xs text-muted-foreground">{s.n} / 06</span>
                <span className="w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/50 group-hover:border-accent group-hover:text-accent group-hover:rotate-45 transition-all duration-500">
                  ↗
                </span>
              </div>
              <h3 className="font-display text-3xl mb-4 group-hover:translate-x-1 transition-transform duration-500">
                {s.t}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
