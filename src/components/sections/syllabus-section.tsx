"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Info, Download, Search, XCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Topic = {
  name: string;
  path: string;
  status: "available" | "coming-soon" | "discarded";
  message?: string;
};

type SyllabusBlock = {
  title: string;
  description: string | string[];
  isModal: boolean;
  href?: string;
  modalType?: "coming-soon" | "topic-list";
  exerciseDetails?: {
    number: number;
    count: number;
  };
};

const syllabusBlocksData: SyllabusBlock[] = [
  {
    title: "PRIMER EJERCICIO",
    description: [
      "Parte A. Comercio de mercancías. Análisis sectorial",
      "Parte B. Comercio de servicios",
      "Parte C. CITES",
      "Parte D. Control analítico",
      "Parte E. Normalización. Inspección.",
    ],
    isModal: true,
    modalType: "coming-soon",
  },
  {
    title: "SEGUNDO EJERCICIO",
    description: "Consiste en una prueba de inglés con parte escrita y oral, que puede realizarse de forma optativa en otros idiomas.",
    isModal: false,
    href: "/temario/ejercicio-2",
  },
  {
    title: "TERCER EJERCICIO",
    description: [
      "Parte A. Comercio exterior",
      "Parte B. Organismos Internacionales y Unión Europea.",
    ],
    isModal: true,
    modalType: "topic-list",
    exerciseDetails: { number: 3, count: 58 },
  },
  {
    title: "CUARTO EJERCICIO",
    description: "Consiste en la resolución de 4 casos prácticos relacionados con el contenido de la oposición.",
    isModal: true,
    modalType: "coming-soon",
  },
  {
    title: "QUINTO EJERCICIO",
    description: [
      "Parte A. Economía General y Estructura económica de España",
      "Parte B. Comercio Interior",
      "Parte C. Derecho Administrativo y organización del Estado.",
    ],
    isModal: true,
    modalType: "topic-list",
    exerciseDetails: { number: 5, count: 46 },
  },
];

export function SyllabusSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<SyllabusBlock | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleBlockClick = (block: SyllabusBlock) => {
    if (block.isModal) {
      setCurrentExercise(block);
      setIsModalOpen(true);
      setSearchQuery(""); // Reset search on open
    }
  };

  const topicList = useMemo((): Topic[] => {
    if (currentExercise?.modalType !== "topic-list" || !currentExercise.exerciseDetails) {
      return [];
    }

    const { number, count } = currentExercise.exerciseDetails;
    const topics: Topic[] = [];

    for (let i = 1; i <= count; i++) {
      const topic: Topic = {
        name: `ESQUEMA TEMA ${i}.docx`,
        path: `/temas/ejercicio-${number}/ESQUEMA TEMA ${i}.docx`,
        status: "coming-soon", // Default status
      };

      if (number === 3) {
        if ([12, 33, 43].includes(i)) {
          topic.status = "discarded";
          topic.message = "No disponible, era mi tema de descarte";
        } else if (i >= 1 && i <= 30) {
          topic.status = "available";
        }
      } else if (number === 5) {
        if (i >= 1 && i <= 2) {
          topic.status = "available";
        }
      }
      topics.push(topic);
    }
    return topics;
  }, [currentExercise]);

  const filteredTopics = useMemo(() => {
    if (!topicList) return [];
    return topicList.filter(topic =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [topicList, searchQuery]);

  const getModalTitle = (title: string | undefined) => {
    if (!title) return "Esquemas";
    const titleCase = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
    const exerciseName = titleCase.replace("ejercicio", "Ejercicio");
    return `Esquemas del ${exerciseName}`;
  };

  const renderTopicItem = (topic: Topic) => {
    switch (topic.status) {
      case "available":
        return (
          <a
            key={topic.path}
            href={topic.path}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex cursor-pointer items-center justify-between rounded-md p-3 transition-colors hover:bg-accent group"
          >
            <span className="font-serif font-medium text-foreground/80 group-hover:text-foreground">{topic.name}</span>
            <Download className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
          </a>
        );
      case "discarded":
        return (
          <div key={topic.path} className="flex items-center justify-between rounded-md p-3 opacity-60">
            <span className="font-serif font-medium text-foreground/80">{topic.name}</span>
            <span className="text-sm text-muted-foreground italic">{topic.message}</span>
          </div>
        );
      case "coming-soon":
        return (
          <div key={topic.path} className="flex items-center justify-between rounded-md p-3 opacity-60">
            <span className="font-serif font-medium text-foreground/80">{topic.name}</span>
            <span className="text-sm text-muted-foreground">Próximamente disponible</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="temario" className="flex min-h-screen w-full items-center py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-white/95 rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-4xl font-extrabold tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl">
                TEMARIO
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
              {syllabusBlocksData.map((block) => (
                block.isModal ? (
                    <div
                        key={block.title}
                        className="group block h-full cursor-pointer"
                        onClick={() => handleBlockClick(block)}
                    >
                        <Card className="flex h-full flex-col bg-background/50 transition-all duration-300 group-hover:border-primary group-hover:shadow-lg group-hover:scale-[1.02]">
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
                    </div>
                ) : (
                    <Link href={block.href!} key={block.title} className="group block h-full">
                        <Card className="flex h-full flex-col bg-background/50 transition-all duration-300 group-hover:border-primary group-hover:shadow-lg group-hover:scale-[1.02]">
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
                )
              ))}
            </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={cn(
            "max-w-2xl flex flex-col",
            currentExercise?.modalType === 'topic-list' ? "h-[90vh] sm:h-[80vh]" : "h-auto"
        )}>
            {currentExercise?.modalType === 'coming-soon' && (
                <>
                    <DialogHeader>
                        <DialogTitle className="sr-only">{currentExercise.title}</DialogTitle>
                        <DialogDescription className="sr-only">Contenido no disponible todavía.</DialogDescription>
                    </DialogHeader>
                    <div className="flex h-48 flex-col items-center justify-center text-center">
                        <h3 className="text-2xl font-bold text-primary">PRÓXIMAMENTE DISPONIBLE...</h3>
                    </div>
                </>
            )}

            {currentExercise?.modalType === 'topic-list' && (
                <>
                    <DialogHeader className="pr-6">
                        <DialogTitle className="text-primary text-2xl">{getModalTitle(currentExercise?.title)}</DialogTitle>
                        <DialogDescription className="sr-only">
                            Lista de esquemas descargables para {currentExercise?.title}. Utilice la barra de búsqueda para filtrar los resultados.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar por 'Tema X' o palabra clave..."
                            className="h-10 w-full rounded-md bg-secondary pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto -mx-6 px-6 mt-4">
                        <div className="space-y-2">
                            {filteredTopics.length > 0 ? (
                                filteredTopics.map(renderTopicItem)
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                                    <p className="font-semibold">No se encontraron resultados.</p>
                                    <p className="text-sm">Pruebe con otra búsqueda.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
