import { motion } from "framer-motion";
import { useState } from "react";
import antes1 from "@/assets/Antes1.jpeg";
import antes2 from "@/assets/Antes2.jpeg";
import antes3 from "@/assets/Antes3.jpeg";
import antes4 from "@/assets/Antes4.jpeg";
import antes5 from "@/assets/Antes5.jpeg";
import antes6 from "@/assets/Antes6.jpeg";
import depois1 from "@/assets/Depois1.jpeg";
import depois2 from "@/assets/Depois2.jpeg";
import depois3 from "@/assets/Depois3.jpeg";
import depois4 from "@/assets/Depois4.jpeg";
import depois5 from "@/assets/Depois5.jpeg";
import depois6 from "@/assets/Depois6.jpeg";

const cases = [
  {
    tag: "Harmonização",
    t: "Caso 01 · Evolução labial",
    d: "Comparativo clínico com registro fotográfico de antes e depois.",
    before: antes1,
    after: depois1,
  },
  {
    tag: "Harmonização",
    t: "Caso 02 · Contorno e volume",
    d: "Resultado acompanhado em consultório com foco em naturalidade.",
    before: antes2,
    after: depois2,
  },
  {
    tag: "Estética Facial",
    t: "Caso 03 · Proporção facial",
    d: "Planejamento individualizado para equilíbrio e expressão.",
    before: antes3,
    after: depois3,
  },
  {
    tag: "Estética Facial",
    t: "Caso 04 · Refinamento estético",
    d: "Intervenção delicada com leitura anatômica personalizada.",
    before: antes4,
    after: depois4,
  },
  {
    tag: "Rejuvenescimento",
    t: "Caso 05 · Renovação clínica",
    d: "Acompanhamento visual do resultado em diferentes ângulos.",
    before: antes5,
    after: depois5,
  },
  {
    tag: "Rejuvenescimento",
    t: "Caso 06 · Resultado natural",
    d: "Comparativo fotográfico para demonstrar a evolução do caso.",
    before: antes6,
    after: depois6,
  },
];

const filters = ["Todos", "Harmonização", "Estética Facial", "Rejuvenescimento"];

type CaseItem = (typeof cases)[number];

function BeforeAfterSlider({ item }: { item: CaseItem }) {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-card shadow-soft">
      <img
        src={item.before}
        alt={`${item.t} antes`}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <img
          src={item.after}
          alt={`${item.t} depois`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-noir/45 via-transparent to-noir/15 pointer-events-none" />
      <div className="absolute left-4 top-4 rounded-full glass-dark px-3 py-2 text-[9px] uppercase tracking-[0.25em] text-cream">
        Antes
      </div>
      <div className="absolute right-4 top-4 rounded-full glass px-3 py-2 text-[9px] uppercase tracking-[0.25em] text-noir">
        Depois
      </div>

      <div
        className="absolute bottom-0 top-0 w-px bg-cream/90 shadow-[0_0_24px_oklch(0.18_0.01_60_/_0.35)] pointer-events-none"
        style={{ left: `${position}%` }}
      />
      <div
        className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cream/80 bg-noir/55 text-cream backdrop-blur-md pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <span className="text-xl leading-none">↔</span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={position}
        aria-label={`Comparar antes e depois de ${item.t}`}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

export function Cases() {
  const [active, setActive] = useState("Todos");
  const list = active === "Todos" ? cases : cases.filter((c) => c.tag === active);

  return (
    <section id="casos" className="relative py-32 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex items-end justify-between flex-wrap gap-8 mb-16">
          <div>
            <div className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6">
              ⟶ Portfólio Clínico
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-[1.05]">
              Casos <span className="italic text-gold-gradient">selecionados</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-4 py-2 text-[10px] tracking-[0.25em] uppercase rounded-full border transition-all duration-500 ${
                  active === f
                    ? "bg-foreground text-background border-foreground"
                    : "border-foreground/20 text-muted-foreground hover:border-foreground/60"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {list.map((c, i) => (
            <motion.article
              key={c.t}
              layout
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.9, delay: (i % 2) * 0.1 }}
              className={`group relative ${i % 2 === 1 ? "md:mt-20" : ""}`}
            >
              <BeforeAfterSlider item={c} />
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-accent-foreground/70 mb-2">
                    {c.tag}
                  </div>
                  <h3 className="font-display text-2xl">{c.t}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{c.d}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
