import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";

const externalLinks = [
    { title: "Relaciones Comerciales de la UE", href: "https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions_en" },
    { title: "Datacomex", href: "https://datacomex.comercio.es/" },
    { title: "Secretaría de Estado de Comercio", href: "https://comercio.gob.es/" },
    { title: "Revistas ICE", href: "https://comercio.gob.es//es-es/publicaciones-estadisticas/paginas/revistasice.aspx" },
    { title: "Informe mensual de Comercio Exterior", href: "https://comercio.gob.es/ImportacionExportacion/Informes_Estadisticas/Paginas/Historico-boletines-me.aspx" },
    { title: "Blog de la OMC", href: "https://www.wto.org/spanish/blogs_s/blogs_s.htm" },
    { title: "Blog del FMI", href: "https://www.imf.org/es/blogs" },
    { title: "El Orden Mundial", href: "https://elordenmundial.com/" },
    { title: "Bloomberg", href: "https://www.bloomberg.com/europe" },
    { title: "Estadísticas inversiones Exteriores", href: "https://comercio.gob.es/es-es/inversiones_exteriores/estadisticas/Paginas/default.aspx" },
    { title: "Balanza Comercial Agroalimentaria", href: "https://comercio.gob.es/importacionexportacion/informes_estadisticas/paginas/historico-balanza.aspx" },
    { title: "Boletín Estadístico del BdE", href: "https://www.bde.es/webbe/es/estadisticas/otras-clasificaciones/publicaciones/boletin-estadistico/capitulo-17.html" },
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
            Una colección de enlaces a recursos externos que pueden ser de utilidad durante tu preparación.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {externalLinks.map((link) => (
              <Link href={link.href} key={link.title} target="_blank" rel="noopener noreferrer" className="block h-full">
                <Card className="h-full transition-all hover:border-primary hover:shadow-lg">
                    <CardContent className="flex h-full items-center justify-center p-4 text-center">
                        <div className="flex items-center gap-3">
                            <LinkIcon className="h-5 w-5 flex-shrink-0 text-primary" />
                            <h3 className="font-semibold text-card-foreground">{link.title}</h3>
                        </div>
                    </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
