import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Linkedin, Mail, Github } from "lucide-react";

export function AboutSection() {
  return (
    <section id="sobre-mi" className="flex h-full w-full items-center justify-center bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl">
              Sergio Argudo Santiago
            </h2>
            <p className="font-serif text-lg text-muted-foreground md:text-xl/relaxed">
              Inspector del SOIVRE (promoción del 2025) e Ingeniero Técnico del SOIVRE (promoción del 2023)
            </p>
            <p className="font-serif text-lg text-muted-foreground md:text-xl/relaxed">
              Ingeniero Químico por la Universidad Complutense de Madrid y Máster en Ingeniería de procesos por la Universidad Autónoma de Madrid y Universidad Rey Juan Carlos
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="mailto:sergio.argudo.santiago@example.com">Contactar</Link>
          </Button>
          <div className="flex justify-center gap-6 pt-4">
            <Link href="https://www.linkedin.com/in/sergio-argudo-santiago-inspector-soivre-placeholder" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
              <Linkedin className="h-7 w-7" />
            </Link>
            <Link href="mailto:sergio.argudo.santiago@example.com" aria-label="Email" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
              <Mail className="h-7 w-7" />
            </Link>
            <Link href="https://github.com/sergio-argudo" aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
              <Github className="h-7 w-7" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
