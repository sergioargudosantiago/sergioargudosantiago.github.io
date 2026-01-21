import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Linkedin, Mail, Github } from "lucide-react";

export function AboutSection() {
  return (
    <section id="sobre-mi" className="flex h-full min-h-screen w-full items-center justify-center">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-4 text-left">
            <h2 className="text-5xl font-bold tracking-tighter text-primary sm:text-6xl">
              Sergio Argudo Santiago
            </h2>
            <div className="font-serif text-2xl text-foreground md:text-3xl space-y-2">
                <p className="font-bold">Inspector del SOIVRE (Promoción 2025)</p>
                <p className="font-bold">Ingeniero Técnico del SOIVRE (Promoción del 2023)</p>
            </div>
            <div className="font-serif text-xl text-muted-foreground md:text-2xl space-y-2">
                <p>Ingeniero Químico por la Universidad Complutense de Madrid</p>
                <p>Máster en Ingeniería Química por la Universidad Autónoma de Madrid y Universidad Rey Juan Carlos</p>
            </div>
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
