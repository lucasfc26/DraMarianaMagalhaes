import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { href: "#sobre", label: "Sobre" },
  { href: "#especialidades", label: "Tratamentos" },
  { href: "#casos", label: "Casos" },
  { href: "#processo", label: "Processo" },
  { href: "#contato", label: "Contato" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? "py-3 glass" : "py-6 bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 flex items-center justify-between">
        <a href="/admin/login" className="flex items-center gap-3 group" aria-label="Acesso administrativo">
          <div className="w-9 h-9 rounded-full border border-foreground/30 flex items-center justify-center font-display text-base text-foreground group-hover:bg-accent group-hover:border-accent transition-all duration-500">
            M
          </div>
          <div className="hidden sm:block">
            <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Dra.</div>
            <div className="font-display text-sm tracking-wide -mt-0.5">Mariana Magalhães</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-xs uppercase tracking-[0.2em] text-foreground/70 hover:text-foreground transition-colors duration-500 group"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-500" />
            </a>
          ))}
        </nav>

        <a
          href="#contato"
          className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-foreground/30 text-xs uppercase tracking-[0.2em] hover:border-accent hover:text-accent-foreground hover:bg-accent transition-all duration-500"
        >
          Agendar
          <span className="w-1 h-1 rounded-full bg-current group-hover:scale-150 transition-transform" />
        </a>
      </div>
    </motion.header>
  );
}
