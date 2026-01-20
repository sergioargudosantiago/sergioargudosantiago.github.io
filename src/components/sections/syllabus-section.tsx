import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";
import Link from "next/link";

const syllabusData = [
  {
    exam: "Examen 1: Bloques I, II, III y IV",
    blocks: [
      {
        title: "Bloque I: Derecho",
        topics: ["Tema 1: ...", "Tema 2: ...", "Tema 3: ..."],
      },
      {
        title: "Bloque II: Economía",
        topics: ["Tema 4: ...", "Tema 5: ...", "Tema 6: ..."],
      },
      {
        title: "Bloque III: Unión Europea",
        topics: ["Tema 7: ...", "Tema 8: ..."],
      },
       {
        title: "Bloque IV: Política Comercial",
        topics: ["Tema 9: ...", "Tema 10: ..."],
      },
    ],
  },
  {
    exam: "Examen 2: Examen de inglés y optativamente otro idioma voluntario",
    blocks: [
       {
        title: "Pruebas",
        topics: ["Prueba 1: Traducción directa", "Prueba 2: Traducción inversa", "Prueba 3: Reading", "Prueba 4: Listening", "Prueba 5: Redacción"],
      }
    ]
  },
  {
    exam: "Examen 3: Bloques V y VI",
    blocks: [
        {
            title: "Bloque V: Calidad y Seguridad industrial",
            topics: ["Tema 11: ...", "Tema 12: ..."],
        },
        {
            title: "Bloque VI: Sectores específicos",
            topics: ["Tema 13: ...", "Tema 14: ..."],
        }
    ],
  },
  {
    exam: "Examen 4: Casos prácticos",
    blocks: [
      {
        title: "Casos prácticos",
        topics: ["Caso 1: ...", "Caso 2: ..."],
      },
      {
        title: "Casos prácticos resueltos",
        topics: ["Resolución Caso 1: ...", "Resolución Caso 2: ..."],
      },
    ],
  },
  {
    exam: "Examen 5: Desarrollo de tema",
     blocks: [
        {
            title: "Desarrollo de tema",
            topics: ["Tema a elegir de los bloques I, II, III o IV", "Tema a elegir de los bloques V o VI"],
        }
    ],
  },
];

export function SyllabusSection() {
  return (
    <section id="temario" className="w-full bg-secondary/30 py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-primary sm:text-5xl">
            Temario Resumen
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            El objetivo de esta web es recopilar una serie de resúmenes de cada tema con el objetivo de una vez estudiado el temario que sirvan como tema estilo resumido para poder estudiar con ellos una vez se tiene un conocimiento más amplio del temario, así como servir de material complementario o para ver el temario de manera más detallada para gente que se está planteando opositar al cuerpo de Inspectores e Ingenieros Técnicos del SOIVRE. El material está basado en los temas de Roberto Martín López, mi preparador y en diversas fuentes de relevancia y enfoque según mi punto de vista. Los materiales se encuentran actualizados hasta finales de 2024.
          </p>
        </div>
        <div className="mx-auto mt-12 w-full max-w-4xl">
          <Accordion type="single" collapsible className="w-full">
            {syllabusData.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-xl font-semibold text-primary hover:no-underline">
                  {item.exam}
                </AccordionTrigger>
                <AccordionContent>
                  {item.blocks.map((block, blockIndex) => (
                    <div key={blockIndex} className="pt-4">
                      <h4 className="mb-3 text-lg font-medium">{block.title}</h4>
                      <ul className="space-y-3 pl-4">
                        {block.topics.map((topic, topicIndex) => (
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
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
