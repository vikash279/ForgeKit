"use client";

import { useMemo, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { evaluateCron } from "@/lib/cron";
import type { ToolComponentProps } from "@/types/tool";

export default function CrontabEvaluatorTool({ config }: ToolComponentProps) {
  const [expression, setExpression] = useState(config.sampleData ?? "");
  const result = useMemo(() => {
    try {
      const evaluation = evaluateCron(expression);
      return {
        error: null as string | null,
        output: [
          evaluation.explanation,
          "",
          "Next 5 runs (UTC):",
          ...evaluation.next.map((item) => `- ${item}`),
        ].join("\n"),
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Invalid cron.",
        output: "",
      };
    }
  }, [expression]);

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={result.output}
          downloadName="cron.txt"
          onClear={() => setExpression("")}
          onSample={() => setExpression(config.sampleData ?? "")}
        />
      }
      input={
        <>
          <PaneHeader title="Cron expression" />
          <div className="p-3">
            <Input value={expression} onChange={(event) => setExpression(event.target.value)} />
            <p className="mt-2 text-xs text-muted-foreground">minute hour day-of-month month day-of-week</p>
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Schedule" />
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <ToolErrorBanner error={result.error ? { message: result.error } : null} />
            <Textarea readOnly className="min-h-0 flex-1" value={result.output} />
          </div>
        </>
      }
    />
  );
}
