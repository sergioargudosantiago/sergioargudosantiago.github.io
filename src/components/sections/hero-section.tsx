export function HeroSection() {
  return (
    <section id="introduccion" className="flex h-full w-full items-center justify-center">
      <div className="container mx-auto px-4 text-center md:px-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl">
              INTRODUCCIÓN
            </h1>
            <p className="mx-auto max-w-[900px] font-serif text-justify text-muted-foreground md:text-xl">
              En esta web encontrarás resúmenes extendidos de temario, recursos y algunos enlaces de utilidad para la preparación de las oposiciones del Cuerpo de Inspectores del SOIVRE e Ingenieros Técnicos del SOIVRE.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
