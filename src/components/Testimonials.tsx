import { motion } from "framer-motion";

const items = [
  { q: "Meu clareamento ficou leve e natural. A Dra. Mariana explicou tudo com cuidado e acompanhou cada etapa.", a: "Mariana C.", r: "Clareamento" },
  { q: "Eu queria valorizar os lábios sem exagero, e o preenchimento ficou delicado, proporcional e do jeito que imaginei.", a: "Rhomara C.", r: "Preenchimento labial" },
  { q: "A aplicação de botox suavizou minhas expressões sem tirar minha naturalidade. Me senti muito segura no atendimento.", a: "Gabryellen R.", r: "Botox" },
];

export function Testimonials() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6">
          ⟶ Pacientes
        </div>
        <h2 className="font-display text-5xl md:text-6xl mb-16 max-w-3xl">
          Histórias que <span className="italic text-gold-gradient">ficam.</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <motion.figure
              key={it.a}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.9, delay: i * 0.1 }}
              className="glass rounded-sm p-8 flex flex-col justify-between min-h-[280px] hover:-translate-y-1 transition-transform duration-700"
            >
              <div className="font-display text-2xl text-gold-gradient leading-none mb-6">"</div>
              <blockquote className="font-display italic text-xl leading-snug text-foreground/85">
                {it.q}
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-between text-[10px] tracking-[0.3em] uppercase">
                <span className="text-foreground">{it.a}</span>
                <span className="text-muted-foreground">{it.r}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
