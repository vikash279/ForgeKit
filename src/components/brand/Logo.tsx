import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  title?: string;
}

/**
 * LocalForge mark: code brackets around a geometric anvil.
 * Uses currentColor so it follows light/dark (and parent badge) themes.
 */
export function Logo({ className, title = "LocalForge" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={cn("size-8 shrink-0", className)}
    >
      <title>{title}</title>
      <path
        d="M9 8.5 3.8 16 9 23.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 8.5 28.2 16 23 23.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fill="currentColor"
        d="M11.2 11.2h9.6l-1.15 2.35h-7.3L11.2 11.2Zm2.55 2.35h4.5V18h-4.5v-4.45ZM10.1 18h11.8l1.2 3.1H8.9L10.1 18Z"
      />
    </svg>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground",
        className,
      )}
    >
      <Logo className="size-5" />
    </span>
  );
}
