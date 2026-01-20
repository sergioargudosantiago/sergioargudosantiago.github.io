"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import React from "react";

const navLinks = [
  { href: "#introduccion", label: "INTRODUCCIÓN" },
  { href: "#temario", label: "TEMARIO" },
  { href: "#enlaces-de-interes", label: "ENLACES DE INTERÉS" },
  { href: "#sobre-mi", label: "SOBRE MÍ" },
];

export function Header() {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-primary sm:text-xl">
          Sergio Argudo Santiago - Inspector del SOIVRE
        </Link>
        
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="relative">
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

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs pr-0">
                <div className="flex h-full flex-col">
                  <div className="border-b p-4">
                     <Link href="/" className="text-lg font-bold text-primary">
                      Sergio Argudo Santiago - Inspector del SOIVRE
                    </Link>
                  </div>
                  <nav className="flex flex-col gap-4 p-4">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className="rounded-md p-2 text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          {link.label}
                        </Link>
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
