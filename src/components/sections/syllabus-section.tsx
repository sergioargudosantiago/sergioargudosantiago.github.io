import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import Link from "next/link";

const syllabusBlocks = [
  {
    title: "PRIMER EJERCICIO",
    description: [
      "Parte A. Comercio de mercancías. Análisis sectorial",
      "Parte B. Comercio de servicios",
      "Parte C. CITES",
      "Parte D. Control analítico",
      "Parte E. Normalización. Inspección.",
    ],
    href: "/temario/ejercicio-1"
  },
  {
    title: "SEGUNDO EJERCICIO",
    description: "Consiste en una prueba de inglés con parte escrita y oral, que puede realizarse de forma optativa en otros idiomas.",
    href: "/temario/ejercicio-2"
  },
  {
    title: "TERCER EJERCICIO",
    description: [
      "Parte A. Comercio exterior",
      "Parte B. Organismos Internacionales y Unión Europea.",
    ],
    href: "/temario/ejercicio-3"
  },
  {
    title: "CUARTO EJERCICIO",
    description: "Consiste en la resolución de 4 casos prácticos relacionados con el contenido de la oposición.",
    href: "/temario/ejercicio-4"
  },
  {
    title: "QUINTO EJERCICIO",
    description: [
      "Parte A. Economía General y Estructura económica de España",
      "Parte B. Comercio Interior",
      "Parte C. Derecho Administrativo y organización del Estado.",
    ],
    href: "/temario/ejercicio-5"
  }
];

export function SyllabusSection() {
  return (
    <section id="temario" className="flex h-full min-h-screen w-full items-center py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-white/95 rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-4xl font-extrabold tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl">
                temario
              </h2>
              <p className="max-w-[900px] font-serif text-justify text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                El objetivo de esta web es recopilar una serie de resúmenes de cada tema para que, una vez estudiado el temario completo, puedan utilizarse como temas resumidos con los que repasar cuando ya se tiene un conocimiento más amplio del mismo. Asimismo, pretende servir como material complementario o como una forma de consultar el temario con mayor nivel de detalle para aquellas personas que se estén planteando opositar al Cuerpo de Inspectores e Ingenieros Técnicos del SOIVRE.
                <br/><br/>
                El material está basado en los temas de Roberto Martín López, mi preparador, así como en diversas fuentes relevantes, seleccionadas y enfocadas según mi criterio. Los contenidos se encuentran actualizados hasta finales de 2024.
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-4xl">
                <Alert className="bg-background/50 border-primary/50">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertTitle className="font-bold text-primary">Nota aclaratoria</AlertTitle>
                    <AlertDescription className="font-serif text-justify text-foreground/80">
                    El contenido de este repositorio no incluye toda la información necesaria para aprobar y, además, puede contener errores. Si detectas cualquier error, por favor contacta con <a href="mailto:ponercorreo@gmail.com" className="font-semibold text-primary underline">ponercorreo@gmail.com</a>.
                    </AlertDescription>
                </Alert>
            </div>

            <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {syllabusBlocks.map((block) => (
                 <Link href={block.href} key={block.title} className="group block h-full">
                  <Card className="flex h-full flex-col bg-background/50 transition-all duration-300 group-hover:border-primary group-hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-primary">{block.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="font-serif text-justify text-sm text-muted-foreground space-y-2">
                        {Array.isArray(block.description) ? (
                            block.description.map((part, index) => (
                                <p key={index}>{part}</p>
                            ))
                        ) : (
                            <p>{block.description}</p>
                        )}
                        </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}
