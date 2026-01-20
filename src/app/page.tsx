import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { SyllabusSection } from "@/components/sections/syllabus-section";
import { ResourcesSection } from "@/components/sections/resources-section";
import { AboutSection } from "@/components/sections/about-section";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <SyllabusSection />
        <ResourcesSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
