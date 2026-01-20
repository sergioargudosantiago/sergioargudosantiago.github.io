export function HeroSection() {
  return (
    <section id="introduccion" className="w-full py-20 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 text-center md:px-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl">
              INTRODUCCIÓN
            </h1>
            <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl">
              Resúmenes extendidos de temario, recursos y algunos enlaces de utilidad para la preparación de las oposiciones del Cuerpo de Inspectores e Ingenieros Técnicos del SOIVRE.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
