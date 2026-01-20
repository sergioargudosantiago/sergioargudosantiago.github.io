"use client";

import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { SyllabusSection } from "@/components/sections/syllabus-section";
import { ResourcesSection } from "@/components/sections/resources-section";
import { AboutSection } from "@/components/sections/about-section";

export type SectionId = "introduccion" | "temario" | "enlaces-de-interes" | "sobre-mi";

export default function Home() {
  const [activeSection, setActiveSection] = React.useState<SectionId>("introduccion");

  const sections: Record<SectionId, React.ReactNode> = {
    introduccion: <HeroSection />,
    temario: <SyllabusSection />,
    "enlaces-de-interes": <ResourcesSection />,
    "sobre-mi": <AboutSection />,
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-hidden">
        {sections[activeSection]}
      </main>
      <Footer />
    </div>
  );
}
