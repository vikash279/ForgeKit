import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & {
  variant?: "default" | "outline" | "secondary" | "client" | "proxy" | "ai";
}) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
        variant === "default" && "border-transparent bg-primary text-primary-foreground",
        variant === "outline" && "text-foreground",
        variant === "secondary" && "border-transparent bg-secondary text-secondary-foreground",
        variant === "client" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        variant === "proxy" && "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
        variant === "ai" && "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
