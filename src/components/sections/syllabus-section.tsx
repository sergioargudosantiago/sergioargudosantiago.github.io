"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Info, Download, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Helper to generate a dummy file list for demonstration
const generateDummyFiles = (exerciseNumber: number, count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        name: `ESQUEMA TEMA ${i + 1}.docx`,
        path: `/temas/ejercicio-${exerciseNumber}/ESQUEMA TEMA ${i + 1}.docx`,
    }));
};

const syllabusBlocksData = [
  {
    title: "PRIMER EJERCICIO",
    description: [
      "Parte A. Comercio de mercancías. Análisis sectorial",
      "Parte B. Comercio de servicios",
      "Parte C. CITES",
      "Parte D. Control analítico",
      "Parte E. Normalización. Inspección.",
    ],
    href: "/temario/ejercicio-1",
    isModal: true,
    files: generateDummyFiles(1, 20), // Example files
  },
  {
    title: "SEGUNDO EJERCICIO",
    description: "Consiste en una prueba de inglés con parte escrita y oral, que puede realizarse de forma optativa en otros idiomas.",
    href: "/temario/ejercicio-2",
    isModal: false,
    files: [],
  },
  {
    title: "TERCER EJERCICIO",
    description: [
      "Parte A. Comercio exterior",
      "Parte B. Organismos Internacionales y Unión Europea.",
    ],
    href: "/temas/ejercicio-3/",
    isModal: true,
    files: [
        { name: "ESQUEMA TEMA 1.docx", path: "/temas/ejercicio-3/ESQUEMA TEMA 1.docx" },
        { name: "ESQUEMA TEMA 7.docx", path: "/temas/ejercicio-3/ESQUEMA TEMA 7.docx" },
        // Generate remaining files to meet the count of 60, avoiding duplicates
        ...Array.from({ length: 58 }, (_, i) => {
            const themeNum = i + 2;
            if (themeNum === 7) return null; // Avoid duplicating Tema 7
            return { name: `ESQUEMA TEMA ${themeNum > 7 ? themeNum + 1 : themeNum}.docx`, path: `/temas/ejercicio-3/ESQUEMA TEMA ${themeNum > 7 ? themeNum + 1 : themeNum}.docx` };
        }).filter(Boolean)
    ].sort((a,b) => {
        const numA = parseInt(a!.name.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b!.name.match(/\d+/)?.[0] || '0');
        return numA - numB;
    }),
  },
  {
    title: "CUARTO EJERCICIO",
    description: "Consiste en la resolución de 4 casos prácticos relacionados con el contenido de la oposición.",
    href: "/temario/ejercicio-4",
    isModal: false,
    files: [],
  },
  {
    title: "QUINTO EJERCICIO",
    description: [
      "Parte A. Economía General y Estructura económica de España",
      "Parte B. Comercio Interior",
      "Parte C. Derecho Administrativo y organización del Estado.",
    ],
    href: "/temas/ejercicio-5/",
    isModal: true,
    files: [
        { name: "ESQUEMA TEMA 1.docx", path: "/temas/ejercicio-5/ESQUEMA TEMA 1.docx" },
        ...generateDummyFiles(5, 15).slice(1),
    ],
  }
];

type SyllabusBlock = typeof syllabusBlocksData[0];

export function SyllabusSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<SyllabusBlock | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleBlockClick = (block: SyllabusBlock) => {
    if (block.isModal && block.files.length > 0) {
      setCurrentExercise(block);
      setIsModalOpen(true);
      setSearchQuery(""); // Reset search on open
    }
  };

  const filteredFiles = useMemo(() => {
    if (!currentExercise?.files) return [];
    return currentExercise.files.filter(file =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentExercise, searchQuery]);

  const getModalTitle = (title: string | undefined) => {
    if (!title) return "Esquemas";
    const titleCase = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
    return `Esquemas del ${titleCase}`;
  }

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
                    <Link href={block.href} key={block.title} className="group block h-full">
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
        <DialogContent className="max-w-2xl h-[90vh] sm:h-[80vh] flex flex-col">
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
                    {filteredFiles.length > 0 ? (
                        filteredFiles.map((file) => (
                            <a
                                key={file.path}
                                href={file.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="flex items-center justify-between rounded-md p-3 transition-colors hover:bg-accent group"
                            >
                                <span className="font-serif font-medium text-foreground/80 group-hover:text-foreground">{file.name}</span>
                                <Download className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                            </a>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                            <p className="font-semibold">No se encontraron resultados.</p>
                            <p className="text-sm">Pruebe con otra búsqueda.</p>
                        </div>
                    )}
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}