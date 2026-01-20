import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AboutSection() {
  return (
    <section id="sobre-mi" className="w-full py-16 md:py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-primary sm:text-4xl">
                Sobre Mí
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Soy un profesional dedicado con una pasión por el servicio público. Mi objetivo es ayudar a otros aspirantes a opositores a alcanzar sus metas proporcionando recursos claros, estructurados y de alta calidad. Este sitio es el resultado de años de estudio y experiencia en el campo.
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="mailto:sergio.argudo.santiago@example.com">Contactar por email</Link>
            </Button>
          </div>
          <div className="flex justify-center">
            {/* You can replace this with an actual image */}
            <div className="h-64 w-64 rounded-full bg-gradient-to-br from-primary to-accent sm:h-80 sm:w-80" data-ai-hint="profile picture"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
