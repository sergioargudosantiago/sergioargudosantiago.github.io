import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2 } from "lucide-react";

const resourcesData = [
  {
    exam: "Examen 1: Cuestionario tipo test",
    topics: [
      "La Constitución Española de 1978",
      "El Tribunal Constitucional",
      "Las Cortes Generales y el Defensor del Pueblo",
      "El Poder Judicial",
    ],
  },
  {
    exam: "Examen 2: Desarrollo de tema",
    topics: [
      "La organización territorial del Estado",
      "Las Comunidades Autónomas",
      "La Administración Local",
      "La Unión Europea",
    ],
  },
  {
    exam: "Examen 3: Supuesto práctico",
    topics: [
      "El personal al servicio de las Administraciones Públicas",
      "El acto administrativo",
      "El procedimiento administrativo común",
    ],
  },
  {
    exam: "Examen 4: Prueba de idioma",
    topics: [
      "Comprensión lectora y auditiva",
      "Expresión escrita y oral",
      "Gramática y vocabulario específico",
    ],
  },
  {
    exam: "Examen 5: Prueba informática",
    topics: [
      "Procesador de textos: Microsoft Word",
      "Hoja de cálculo: Microsoft Excel",
      "Bases de datos: Microsoft Access",
    ],
  },
];

export function ResourcesSection() {
  return (
    <section id="recursos" className="w-full py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center space-y-6 text-center">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
            Recursos Clave
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-primary sm:text-5xl">
            Todo lo que necesitas para cada examen
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Hemos organizado los temas y recursos más importantes para que te centres en lo que de verdad importa en cada prueba.
          </p>
        </div>
        <div className="mx-auto mt-12 w-full max-w-3xl">
          <Accordion type="single" collapsible defaultValue="item-0">
            {resourcesData.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg font-medium hover:no-underline">
                  {item.exam}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pt-2">
                    {item.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                        <span className="text-muted-foreground">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
