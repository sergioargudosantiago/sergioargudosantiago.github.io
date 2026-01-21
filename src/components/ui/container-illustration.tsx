import { cn } from "@/lib/utils";

export function ContainerIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10",
        className
      )}
    >
      <div
        className="h-full w-full bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: "url('/contenedor-fondo.png')",
        }}
      />
    </div>
  );
}
