import { Badge } from "@/components/ui/badge";
import type { ExecutionTarget } from "@/types/tool";

const LABELS: Record<ExecutionTarget, { label: string; variant: "client" | "proxy" | "ai" }> = {
  CLIENT: { label: "Client", variant: "client" },
  SERVER_PROXY: { label: "Server proxy", variant: "proxy" },
  AI_REMOTE: { label: "AI remote", variant: "ai" },
};

export function ExecutionBadge({ target }: { target: ExecutionTarget }) {
  const meta = LABELS[target];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
