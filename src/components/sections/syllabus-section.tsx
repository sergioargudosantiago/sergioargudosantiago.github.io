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
    exam: "Examen 1: Primer Ejercicio: Comercio, CITES y Control.",
    parts: [
      {
        part: "Parte A: Política comercial, CITES y control",
        themes: Array.from({ length: 13 }, (_, i) => `Tema ${i + 1}: ...`),
      },
      {
        part: "Parte B: Productos industriales I",
        themes: Array.from({ length: 12 }, (_, i) => `Tema ${i + 14}: ...`),
      },
      {
        part: "Parte C: Productos industriales II",
        themes: Array.from({ length: 13 }, (_, i) => `Tema ${i + 26}: ...`),
      },
      {
        part: "Parte D: Productos agrarios y alimentarios I",
        themes: Array.from({ length: 10 }, (_, i) => `Tema ${i + 39}: ...`),
      },
      {
        part: "Parte E: Productos agrarios y alimentarios II",
        themes: Array.from({ length: 7 }, (_, i) => `Tema ${i + 49}: ...`),
      },
    ],
  },
  {
    exam: "Examen 2: Examen de idiomas",
    blocks: [
       {
        title: "Pruebas",
        topics: ["Prueba 1: Traducción directa", "Prueba 2: Traducción inversa", "Prueba 3: Reading", "Prueba 4: Listening", "Prueba 5: Redacción"],
      }
    ]
  },
  {
      exam: "Examen 3: Tercer Ejercicio: Comercio Exterior y Organismos.",
      parts: [
        {
          part: "Parte A: Política comercial y comercio exterior",
          themes: Array.from({ length: 36 }, (_, i) => `Tema ${i + 1}: ...`),
        },
        {
          part: "Parte B: Organismos Económicos Internacionales y Unión Europea",
          themes: Array.from({ length: 22 }, (_, i) => `Tema ${i + 37}: ...`),
        },
      ]
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
    exam: "Examen 5: Quinto Ejercicio: Economía, Interior y Derecho.",
    parts: [
      {
        part: "Parte A: Macroeconomía y Microeconomía",
        themes: Array.from({ length: 21 }, (_, i) => `Tema ${i + 1}: ...`),
      },
      {
        part: "Parte B: Economía del sector público, Sistema Financiero Español",
        themes: Array.from({ length: 13 }, (_, i) => `Tema ${i + 22}: ...`),
      },
      {
        part: "Parte C: Derecho",
        themes: Array.from({ length: 12 }, (_, i) => `Tema ${i + 35}: ...`),
      },
    ]
  },
];

export function SyllabusSection() {
  return (
    <section id="temario" className="h-full w-full bg-secondary/30 overflow-y-auto py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl">
            Temario Resumen
          </h2>
          <p className="max-w-[900px] font-serif text-justify text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            El objetivo de esta web es recopilar una serie de resúmenes de cada tema para que, una vez estudiado el temario completo, puedan utilizarse como temas resumidos con los que repasar cuando ya se tiene un conocimiento más amplio del mismo. Asimismo, pretende servir como material complementario o como una forma de consultar el temario con mayor nivel de detalle para aquellas personas que se estén planteando opositar al Cuerpo de Inspectores e Ingenieros Técnicos del SOIVRE. El material está basado en los temas de Roberto Martín López, mi preparador, así como en diversas fuentes relevantes, seleccionadas y enfocadas según mi criterio. Los contenidos se encuentran actualizados hasta finales de 2024.
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
                  {item.parts ? (
                    <Accordion type="single" collapsible className="w-full pl-4">
                      {item.parts.map((part, partIndex) => (
                        <AccordionItem value={`part-${index}-${partIndex}`} key={partIndex}>
                          <AccordionTrigger className="text-lg font-medium text-primary/90 hover:no-underline">
                            {part.part}
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-3 pt-4 pl-4">
                              {part.themes.map((theme, themeIndex) => (
                                <li key={themeIndex}>
                                  <Link href="#" className="group flex items-start gap-3 text-left">
                                    <FileText className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                                    <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                                      {theme}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : item.blocks ? (
                     item.blocks.map((block, blockIndex) => (
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
                      ))
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
