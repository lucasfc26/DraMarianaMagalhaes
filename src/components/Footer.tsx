export function Footer() {
  return (
    <footer className="relative bg-noir text-cream pt-24 pb-10 overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 font-display text-[20vw] leading-none text-cream/[0.04] pointer-events-none whitespace-nowrap">
        Mariana
      </div>
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <div className="text-[10px] tracking-[0.4em] uppercase text-cream/50 mb-4">Dra.</div>
            <div className="font-display text-4xl">Mariana Magalhães</div>
            <div className="text-[10px] tracking-[0.4em] uppercase text-cream/50 mt-2">Cirurgiã-Dentista</div>
            <p className="mt-8 text-sm text-cream/60 max-w-sm leading-relaxed italic font-display text-lg">
              "Cada sorriso é uma assinatura — e a sua merece ser editorial."
            </p>
          </div>
          <div className="md:col-span-3">
            <div className="text-[10px] tracking-[0.4em] uppercase text-cream/50 mb-5">Navegar</div>
            <ul className="space-y-3 text-sm">
              {["Sobre", "Especialidades", "Casos", "Processo", "Contato"].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="text-cream/80 hover:text-gold transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <div className="text-[10px] tracking-[0.4em] uppercase text-cream/50 mb-5">Social</div>
            <ul className="space-y-3 text-sm">
              {["Instagram", "WhatsApp", "LinkTree"].map((s) => (
                <li key={s}>
                  <a href={s.toLowerCase() === "instagram" ? "https://www.instagram.com/dra.marianacmagalhaes" : s.toLowerCase() === "whatsapp" ? "https://wa.me/5585998420239" : "https://linktr.ee/MarianaCMagalhaes"} className="group inline-flex items-center gap-3 text-cream/80 hover:text-gold transition-colors">
                    <span className="w-6 h-px bg-cream/30 group-hover:w-10 group-hover:bg-gold transition-all" />
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-cream/10 flex flex-wrap items-center justify-between gap-4 text-[10px] tracking-[0.3em] uppercase text-cream/40">
          <span>© 2026 Dra. Mariana Magalhães · CROCE-17697</span>
          <span>MaselCorp Design & Professional Odontological System</span>
        </div>
      </div>
    </footer>
  );
}
