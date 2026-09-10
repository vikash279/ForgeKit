"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DiffLine } from "@/lib/crypto/protocol";
import { createDiffWorker } from "@/lib/workers";
import { cn } from "@/lib/utils";
import type { ToolComponentProps } from "@/types/tool";

export default function TextDiffTool({ config }: ToolComponentProps) {
  const worker = useMemo(() => createDiffWorker(), []);
  const [left, setLeft] = useState(config.sampleData ?? "");
  const [right, setRight] = useState("ForgeKit ships local-first utilities with a proxy when needed.");
  const [lines, setLines] = useState<DiffLine[]>([]);
  const [mode, setMode] = useState<"split" | "inline">("split");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => worker.terminate(), [worker]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void worker
        .call({ action: "diff", left, right })
        .then((response) => {
          setLines(response.result);
          setError(null);
        })
        .catch((err: unknown) => {
          setError(err instanceof Error ? err.message : "Diff failed.");
        });
    }, 120);
    return () => window.clearTimeout(handle);
  }, [left, right, worker]);

  const serialized = lines
    .map((line) => `${line.kind === "add" ? "+" : line.kind === "remove" ? "-" : " "} ${line.text}`)
    .join("\n");

  return (
    <ToolLayout
      config={config}
      stacked
      toolbar={
        <ToolToolbar
          output={serialized}
          downloadName="diff.txt"
          onClear={() => {
            setLeft("");
            setRight("");
          }}
          onSample={() => {
            setLeft(config.sampleData ?? "");
            setRight("ForgeKit ships local-first utilities with a proxy when needed.");
          }}
          extra={
            <Tabs value={mode} onValueChange={(value) => setMode(value as "split" | "inline")}>
              <TabsList>
                <TabsTrigger value="split">Side-by-side</TabsTrigger>
                <TabsTrigger value="inline">Inline</TabsTrigger>
              </TabsList>
            </Tabs>
          }
        />
      }
      input={
        <>
          <PaneHeader title="Original" />
          <Textarea className="min-h-0 flex-1 rounded-none border-0" value={left} onChange={(event) => setLeft(event.target.value)} />
        </>
      }
      output={
        <>
          <PaneHeader title="Revised" />
          <Textarea className="min-h-0 flex-1 rounded-none border-0" value={right} onChange={(event) => setRight(event.target.value)} />
        </>
      }
      below={
        <div className="rounded-xl border">
          <PaneHeader title="Diff" />
          <div className="p-3">
            <ToolErrorBanner error={error ? { message: error } : null} />
            <ScrollArea className="h-72 font-mono text-sm">
              {mode === "inline" ? (
                <pre className="space-y-0.5">
                  {lines.map((line, index) => (
                    <div
                      key={`${line.kind}-${index}`}
                      className={cn(
                        "px-2 py-0.5",
                        line.kind === "add" && "bg-emerald-500/15",
                        line.kind === "remove" && "bg-destructive/15",
                      )}
                    >
                      {line.kind === "add" ? "+" : line.kind === "remove" ? "-" : " "} {line.text}
                    </div>
                  ))}
                </pre>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    {lines
                      .filter((line) => line.kind !== "add")
                      .map((line, index) => (
                        <div
                          key={`l-${index}`}
                          className={cn("px-2 py-0.5", line.kind === "remove" && "bg-destructive/15")}
                        >
                          {line.leftNumber} {line.text}
                        </div>
                      ))}
                  </div>
                  <div>
                    {lines
                      .filter((line) => line.kind !== "remove")
                      .map((line, index) => (
                        <div
                          key={`r-${index}`}
                          className={cn("px-2 py-0.5", line.kind === "add" && "bg-emerald-500/15")}
                        >
                          {line.rightNumber} {line.text}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      }
    />
  );
}
