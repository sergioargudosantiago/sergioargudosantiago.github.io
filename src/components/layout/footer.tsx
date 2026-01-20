import Link from "next/link";
import { Linkedin, Mail, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto flex h-16 items-center justify-center gap-6 px-4 sm:px-6 lg:px-8">
          <Link href="https://www.linkedin.com/in/sergio-argudo-santiago-inspector-soivre-placeholder" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-6 w-6 transition-colors hover:text-accent" />
          </Link>
          <Link href="mailto:sergio.argudo.santiago@example.com" aria-label="Email" target="_blank" rel="noopener noreferrer">
            <Mail className="h-6 w-6 transition-colors hover:text-accent" />
          </Link>
          <Link href="https://github.com/sergio-argudo" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <Github className="h-6 w-6 transition-colors hover:text-accent" />
          </Link>
      </div>
    </footer>
  );
}
