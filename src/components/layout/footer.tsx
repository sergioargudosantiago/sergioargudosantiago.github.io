import Link from "next/link";
import { Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} Sergio Argudo Santiago. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-4">
          <Link href="https://www.linkedin.com/in/sergio-argudo-santiago-inspector-soivre-placeholder" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-5 w-5 transition-colors hover:text-accent" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
