import type { ParseIssue } from "@/types/tool";
import { AlertCircle } from "lucide-react";

export function ToolErrorBanner({ error }: { error: ParseIssue | null }) {
  if (!error) return null;
  const location =
    error.line !== undefined
      ? `Line ${error.line}${error.column !== undefined ? `, column ${error.column}` : ""}`
      : null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <div>
        {location ? <p className="font-medium">{location}</p> : null}
        <p>{error.message}</p>
      </div>
    </div>
  );
}
