import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";

const resourceCategories = [
    {
        category: "ESTADÍSTICAS DE COMERCIO EXTERIOR",
        links: [
            { title: "Datacomex", href: "https://datacomex.comercio.es/" },
            { title: "Informe mensual de Comercio Exterior", href: "https://comercio.gob.es/ImportacionExportacion/Informes_Estadisticas/Paginas/Historico-boletines-me.aspx" },
            { title: "Estadísticas Inversiones Exteriores", href: "https://comercio.gob.es/es-es/inversiones_exteriores/estadisticas/Paginas/default.aspx" },
            { title: "Balanza Comercial Agroalimentaria", href: "https://comercio.gob.es/importacionexportacion/informes_estadisticas/paginas/historico-balanza.aspx" },
            { title: "Estadísticas relacionadas con el sector exterior del BdE", href: "https://www.bde.es/webbe/es/estadisticas/otras-clasificaciones/publicaciones/boletin-estadistico/capitulo-17.html" },
            { title: "EUROSTAT", href: "https://ec.europa.eu/eurostat/web/international-trade-in-goods/database" },
        ]
    },
    {
        category: "ENLACES GENERALES",
        links: [
            { title: "Secretaría de Estado de Comercio", href: "https://comercio.gob.es/" },
            { title: "Revistas ICE", href: "https://comercio.gob.es//es-es/publicaciones-estadisticas/paginas/revistasice.aspx" },
            { title: "El Orden Mundial", href: "https://elordenmundial.com/" },
            { title: "Bloomberg", href: "https://www.bloomberg.com/europe" },
            { title: "Portwatch", href: "https://portwatch.imf.org/" },
            { title: "Drewry - Precios de rutas comerciales", href: "https://www.drewry.co.uk/supply-chain-advisors/supply-chain-expertise/world-container-index-assessed-by-drewry?gad_source=1&gad_campaignid=21493608168&gclid=CjwKCAiAssfLBhBDEiwAcLpwfkWGPLr_uwX4wGO2cldRa8pw3XWhqUBj8LAplnqbs8hpJYc_r2D01hoCdQQQAvD_BwE" },
        ]
    },
    {
        category: "RELACIONES COMERCIALES",
        links: [
            { title: "Relaciones Comerciales de la UE", href: "https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions_en" },
        ]
    },
    {
        category: "ORGANISMOS INTERGUBERNAMENTALES",
        links: [
            { title: "Blog de la OMC", href: "https://www.wto.org/spanish/blogs_s/blogs_s.htm" },
            { title: "Blog del FMI", href: "https://www.imf.org/es/blogs" },
            { title: "UNCTAD", href: "https://unctad.org/es" },
            { title: "OCDE", href: "https://www.oecd.org/en/about/directorates/statistics-and-data-directorate.html" },
            { title: "TRADE MAP (ITC)", href: "https://www.trademap.org/Index.aspx" },
            { title: "OMA", href: "https://www.wcoomd.org/" },
        ]
    }
];

export function ResourcesSection() {
  return (
    <section id="enlaces-de-interes" className="flex min-h-screen w-full items-center py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-white/95 rounded-2xl shadow-xl p-8">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-center space-y-6 text-center">
              <h2 className="text-4xl font-extrabold tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl">
                ENLACES DE INTERÉS
              </h2>
              <p className="max-w-[900px] font-serif text-justify text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Una colección de enlaces a recursos externos que pueden ser de utilidad durante tu preparación.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {resourceCategories.map((category) => (
                  <Card key={category.category} className="flex h-full flex-col bg-background/50">
                    <CardHeader>
                        <CardTitle className="text-primary text-xl">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-3">
                            {category.links.map(link => (
                                <li key={link.title}>
                                    <Link href={link.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-left">
                                        <LinkIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                                        <span className="font-serif text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                                            {link.title}
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
      </div>
    </section>
  );
}
