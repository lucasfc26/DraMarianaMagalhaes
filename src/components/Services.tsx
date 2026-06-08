import { motion } from "framer-motion";

const services = [
  { t: "Limpeza Dentária", d: "Profilaxia para remover placa, tártaro e manchas superficiais, ajudando a manter gengivas e dentes saudáveis." },
  { t: "Restauração", d: "Tratamento de cáries e fraturas com foco em recuperar função, conforto e aparência natural do dente." },
  { t: "Placa Miorrelaxante", d: "Placas para DTM e bruxismo, indicadas após avaliação para proteger dentes e reduzir sobrecargas musculares." },
  { t: "Urgência Odontológica", d: "Atendimento para dor, trauma, inflamações e situações que precisam de avaliação odontológica rápida." },
  { t: "Atendimento Pediátrico", d: "Cuidado acolhedor para crianças, com orientação preventiva e adaptação respeitosa ao consultório." },
  { t: "Clareamento Dentário", d: "Protocolos em consultório e caseiros supervisionados para clarear o sorriso com controle profissional." },
  { t: "Botox", d: "Aplicação planejada para suavizar marcas de expressão e apoiar uma estética facial leve e equilibrada." },
  { t: "Skinbooster", d: "Hidratação profunda da pele com injetáveis, indicada para melhorar viço, textura e qualidade cutânea." },
  { t: "Preenchimento Labial", d: "Volume, contorno e hidratação dos lábios com planejamento para preservar naturalidade e proporção." },
  { t: "Preenchimento de Mento", d: "Harmonização do queixo para melhorar perfil, sustentação visual e equilíbrio facial." },
  { t: "Preenchimento de Malar", d: "Realce da maçã do rosto para valorizar contornos e pontos de luz da face." },
  { t: "Bioestimuladores e Fios", d: "Bioestimuladores de colágeno e fios lisos para cuidado com firmeza, textura e qualidade da pele." },
];

export function Services() {
  return (
    <section id="especialidades" className="relative py-32 md:py-40 bg-card/40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-20">
          <div>
            <div className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6">
              ⟶ Procedimentos
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-[1.05] max-w-2xl">
              Tratamentos<br />
              <span className="italic">realizados</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
            Da prevenção odontológica à estética facial, cada procedimento começa
            com avaliação individual e orientação clara sobre indicação, cuidados
            e expectativas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 border border-border/60">
          {services.map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              className="group relative bg-background p-10 hover:bg-card transition-all duration-700 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-700" />
              <div className="flex items-start justify-between mb-12">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                </span>
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
