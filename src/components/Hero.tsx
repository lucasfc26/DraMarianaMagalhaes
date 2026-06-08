import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import heroImg from "@/assets/hero-mariana.png";

const roles = [
  "Cirurgiã-Dentista",
  "Design do Sorriso",
  "Reabilitação Oral",
  "Estética Dental",
];

export function Hero() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % roles.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="top" className="relative min-h-screen pt-32 pb-16 overflow-hidden">
      {/* Background ornament */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-gold/15 blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-sand/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* Top bar caption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex items-center justify-between text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-12"
        >
          <span>Efeito Dominó Reverso</span>
          <span className="hidden md:block">Editorial · Clínico · 2026</span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: text */}
          <div className="lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="font-display text-[14vw] sm:text-[10vw] lg:text-[7.5vw] leading-[0.9] tracking-tight"
            >
              Excelência<br />
              <span className="italic text-gold-gradient">Clínica</span>
              <br />
              <span className="text-foreground/80">&amp; Design</span>
              <br />
              <span className="italic">Editorial</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-8 flex items-center gap-4 h-7"
            >
              <span className="w-10 h-px bg-foreground/40" />
              <div className="relative h-7 overflow-hidden text-sm tracking-[0.25em] uppercase text-muted-foreground">
                <motion.div
                  key={idx}
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -28, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {roles[idx]}
                </motion.div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="mt-8 max-w-md text-base text-muted-foreground leading-relaxed"
            >
              Salvar um dente pode evitar problemas em toda a boca. Uma abordagem
              que une precisão médica à estética refinada de um portfólio criativo.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href="#casos"
                className="group relative inline-flex items-center gap-3 px-7 py-4 rounded-full bg-foreground text-background text-xs uppercase tracking-[0.25em] overflow-hidden transition-transform duration-500 hover:scale-[1.02]"
              >
                <span className="absolute inset-0 gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <span className="relative">Ver Casos</span>
                <span className="relative w-2 h-2 rounded-full bg-current" />
              </a>
              <a
                href="#contato"
                className="inline-flex items-center gap-3 px-7 py-4 rounded-full border border-foreground/40 text-xs uppercase tracking-[0.25em] hover:border-foreground transition-all duration-500"
              >
                Entrar em Contato
              </a>
            </motion.div>
          </div>

          {/* Right: portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-soft">
              <div className="absolute inset-0 gradient-editorial" />
              <img
                src={heroImg}
                alt="Dra. Mariana Magalhães"
                className="relative w-full h-full object-cover object-top"
                loading="eager"
              />
              <div className="absolute top-5 left-5 right-5 flex justify-between text-[9px] tracking-[0.3em] uppercase text-foreground/70">
                <span>Dra. Mariana</span>
                <span>CRO/SP</span>
              </div>
              <div className="absolute bottom-5 left-5 right-5 font-display italic text-foreground/80">
                <div className="text-[10px] tracking-[0.3em] uppercase not-italic">Efeito</div>
                <div className="text-3xl leading-none">Dominó Reverso</div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full border border-gold/50 hidden lg:block animate-float" />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-20 flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase text-muted-foreground"
        >
          <span>Role para descobrir</span>
          <span className="relative w-16 h-px bg-foreground/30 overflow-hidden">
            <span className="absolute top-0 left-0 w-1/3 h-full bg-foreground animate-[marquee_2s_linear_infinite]" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
