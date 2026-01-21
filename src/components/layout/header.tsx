"use client";

import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import React from "react";
import { cn } from "@/lib/utils";
import type { SectionId } from "@/app/page";

const navLinks: { id: SectionId; label: string }[] = [
  { id: "introduccion", label: "INTRODUCCIÓN" },
  { id: "temario", label: "TEMARIO" },
  { id: "enlaces-de-interes", label: "ENLACES DE INTERÉS" },
  { id: "sobre-mi", label: "SOBRE MÍ" },
];

interface HeaderProps {
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
}

export function Header({ activeSection, setActiveSection }: HeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        
        <div className="hidden items-center gap-1 md:flex">
          <nav className="flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => (
              <Button
                key={link.id}
                variant="ghost"
                onClick={() => setActiveSection(link.id)}
                className={cn(
                  "group relative text-foreground/80 transition-colors hover:text-primary",
                  activeSection === link.id && "text-primary"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute bottom-2 left-0 block h-[2px] w-full origin-center transform bg-primary transition-transform duration-300",
                  activeSection === link.id ? 'scale-x-100' : 'scale-x-0',
                  'group-hover:scale-x-100'
                )} />
              </Button>
            ))}
          </nav>
          <div className="relative ml-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar en temario..."
              className="h-9 w-48 rounded-md bg-secondary pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="absolute right-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs p-0">
                <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
                <SheetDescription className="sr-only">
                  Contiene los enlaces principales del sitio: Introducción, Temario, Enlaces de Interés y Sobre Mí.
                </SheetDescription>
                <div className="flex h-full flex-col">
                  <div className="border-b p-4">
                     <SheetClose asChild>
                      <button onClick={() => setActiveSection('introduccion')} className="text-left text-lg font-bold text-primary">
                        Menú
                      </button>
                     </SheetClose>
                  </div>
                  <nav className="flex flex-col gap-1 p-4">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.id}>
                        <Button
                          variant="ghost"
                          onClick={() => setActiveSection(link.id)}
                          className={cn(
                            "w-full justify-start rounded-md p-2 text-left text-foreground/80",
                            activeSection === link.id && "bg-accent text-accent-foreground"
                          )}
                        >
                          {link.label}
                        </Button>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="mt-auto p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Buscar en temario..."
                        className="h-9 w-full rounded-md bg-secondary pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
