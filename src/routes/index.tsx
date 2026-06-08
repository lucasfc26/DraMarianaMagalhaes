import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Cases } from "@/components/Cases";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CookieConsentGate } from "@/components/CookieConsentGate";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <CookieConsentGate>
      <main className="relative bg-background text-foreground overflow-x-hidden">
        <SmoothScroll />
        <Navbar />
        <Hero />
        <About />
        <Services />
        <Cases />
        <Process />
        <Testimonials />
        <Contact />
        <Footer />
      </main>
    </CookieConsentGate>
  );
}
