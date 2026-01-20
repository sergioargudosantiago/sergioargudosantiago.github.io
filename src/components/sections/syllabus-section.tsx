import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import Link from "next/link";

const syllabusData = [
  {
    exam: "Bloque I: Derecho Constitucional",
    topics: [
      "Tema 1: La Constitución Española de 1978: estructura y contenido.",
      "Tema 2: Derechos y deberes fundamentales.",
      "Tema 3: La Corona. Funciones constitucionales del Rey.",
      "Tema 4: Las Cortes Generales: composición, atribuciones y funcionamiento.",
    ],
  },
  {
    exam: "Bloque II: Derecho Administrativo",
    topics: [
      "Tema 5: El Gobierno y la Administración. La Administración General del Estado.",
      "Tema 6: El procedimiento administrativo común.",
      "Tema 7: Los contratos del sector público.",
      "Tema 8: La responsabilidad patrimonial de las Administraciones Públicas.",
    ],
  },
  {
    exam: "Bloque III: Gestión Financiera",
    topics: [
      "Tema 9: El presupuesto: elaboración, aprobación y ejecución.",
      "Tema 10: El control del gasto público.",
      "Tema 11: Los tributos: clases. La Agencia Tributaria.",
      "Tema 12: La Seguridad Social: campo de aplicación, estructura y regímenes.",
    ],
  },
];

export function SyllabusSection() {
  return (
    <section id="temario" className="w-full bg-secondary/30 py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-primary sm:text-5xl">
            Temario Completo y Estructurado
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Accede a un temario desglosado por bloques para facilitar tu estudio y planificación. Cada tema incluye un enlace a su material en PDF.
          </p>
        </div>
        <div className="mx-auto mt-12 grid gap-8 md:grid-cols-1 lg:max-w-5xl lg:grid-cols-3">
          {syllabusData.map((item, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl text-primary">{item.exam}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="flex-1 space-y-4">
                  {item.topics.map((topic, topicIndex) => (
                    <li key={topicIndex}>
                      <Link href="#" className="group flex items-start gap-3 text-left">
                         <FileText className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                        <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                          {topic}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
