import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";

const linksEspanol = [
    { title: "Ministerio de Industria, Comercio y Turismo", href: "#" },
    { title: "ICEX España Exportación e Inversiones", href: "#" },
    { title: "Boletín Oficial del Estado (BOE)", href: "#" },
    { title: "Web del opositor", href: "#" },
];

const linksIngles = [
    { title: "World Trade Organization (WTO)", href: "#" },
    { title: "International Trade Centre (ITC)", href: "#" },
    { title: "The Economist", href: "#" },
    { title: "Financial Times", href: "#" },
];

export function ResourcesSection() {
  return (
    <section id="enlaces-de-interes" className="h-full w-full overflow-y-auto py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center space-y-6 text-center">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
            Recursos Externos
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-primary sm:text-5xl">
            Enlaces de Interés
          </h2>
          <p className="max-w-[900px] font-serif text-justify text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Una colección de enlaces a recursos externos en español e inglés que pueden ser de utilidad durante tu preparación.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Enlaces en Español</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {linksEspanol.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="group flex items-center gap-2 text-muted-foreground hover:text-primary" target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="h-4 w-4" />
                      <span>{link.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Enlaces en Inglés</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {linksIngles.map((link, index) => (
                  <li key={index}>
                     <Link href={link.href} className="group flex items-center gap-2 text-muted-foreground hover:text-primary" target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="h-4 w-4" />
                      <span>{link.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
