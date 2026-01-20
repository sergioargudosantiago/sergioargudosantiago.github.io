import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Linkedin, Mail, Github } from "lucide-react";

export function AboutSection() {
  return (
    <section id="sobre-mi" className="flex h-full w-full items-center justify-center bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-4 text-left">
            <h2 className="text-5xl font-bold tracking-tighter text-primary sm:text-6xl">
              Sergio Argudo Santiago
            </h2>
            <p className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              Inspector del SOIVRE (promoción del 2025) e Ingeniero Técnico del SOIVRE (promoción del 2023)
            </p>
            <p className="font-serif text-xl text-muted-foreground md:text-2xl">
              Ingeniero Químico por la Universidad Complutense de Madrid y Máster en Ingeniería Química por la Universidad Autónoma de Madrid y Universidad Rey Juan Carlos.
            </p>
          </div>
          <div className="flex flex-col items-start space-y-6">
              <Button size="lg" asChild>
                <Link href="mailto:sergio.argudo.santiago@example.com">Contactar</Link>
              </Button>
              <div className="flex justify-start gap-6 pt-4">
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
      </div>
    </section>
  );
}
