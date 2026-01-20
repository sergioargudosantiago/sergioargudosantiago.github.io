import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} Mi Sitio Personal. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-4">
          <Link href="#" aria-label="Twitter">
            <Twitter className="h-5 w-5 transition-colors hover:text-accent" />
          </Link>
          <Link href="#" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5 transition-colors hover:text-accent" />
          </Link>
          <Link href="#" aria-label="GitHub">
            <Github className="h-5 w-5 transition-colors hover:text-accent" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
