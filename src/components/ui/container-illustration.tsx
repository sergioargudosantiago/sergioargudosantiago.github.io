import { cn } from "@/lib/utils";

export function ContainerIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10",
        className
      )}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1600 1200"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="side-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.5)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.2)" />
          </linearGradient>
          <linearGradient id="top-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.4)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.1)" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="hsl(var(--background))" />
        <g transform="translate(900, 700) scale(3.5) rotate(-25) skewX(-15)" opacity="0.3">
            {/* Front */}
            <rect width="700" height="400" fill="hsl(var(--primary) / 0.3)" />
            {/* Side */}
            <path d="M 700 0 L 800 100 L 800 500 L 700 400 Z" fill="url(#side-grad)" />
            {/* Top */}
            <path d="M 0 0 L 700 0 L 800 100 L 100 100 Z" fill="url(#top-grad)" />

             {/* Front Ribs */}
            <line x1="100" y1="0" x2="100" y2="400" stroke="hsl(var(--accent) / 0.2)" strokeWidth="15" />
            <line x1="300" y1="0" x2="300" y2="400" stroke="hsl(var(--accent) / 0.2)" strokeWidth="15" />
            <line x1="500" y1="0" x2="500" y2="400" stroke="hsl(var(--accent) / 0.2)" strokeWidth="15" />
        </g>
      </svg>
    </div>
  );
}
