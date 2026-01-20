import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section id="inicio" className="w-full py-20 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 text-center md:px-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl">
              Tu Guía para Aprobar la Oposición
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Recursos, temario y consejos prácticos para futuros funcionarios. Preparado por y para opositores.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button size="lg">Empezar a Estudiar</Button>
            <Button variant="outline" size="lg">
              Ver Recursos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
