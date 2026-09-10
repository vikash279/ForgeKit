"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { jsonParseIssue, sortKeys } from "@/lib/json";
import { cn } from "@/lib/utils";
import type { ParseIssue, ToolComponentProps } from "@/types/tool";

type ViewMode = "pretty" | "tree";

export default function JsonFormatterTool({ config }: ToolComponentProps) {
  const [input, setInput] = useState(config.sampleData ?? "");
  const [indent, setIndent] = useState(2);
  const [sort, setSort] = useState(false);
  const [view, setView] = useState<ViewMode>("pretty");

  const parsed = useMemo(() => {
    try {
      const value: unknown = JSON.parse(input);
      const normalized = sort ? sortKeys(value) : value;
      return {
        value: normalized,
        output: JSON.stringify(normalized, null, indent),
        minified: JSON.stringify(normalized),
        error: null as ParseIssue | null,
      };
    } catch (error) {
      return {
        value: null,
        output: "",
        minified: "",
        error: jsonParseIssue(error, input),
      };
    }
  }, [indent, input, sort]);

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={parsed.output}
          downloadName="formatted.json"
          accept=".json,application/json,text/plain"
          onClear={() => setInput("")}
          onSample={() => setInput(config.sampleData ?? "")}
          onUploadText={(value) => setInput(value)}
          extra={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput(parsed.minified || input)}
                disabled={Boolean(parsed.error)}
              >
                Minify
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput(parsed.output || input)}
                disabled={Boolean(parsed.error)}
              >
                Beautify
              </Button>
              <div className="ml-2 flex items-center gap-2">
                <Switch checked={sort} onCheckedChange={setSort} id="sort-keys" />
                <Label htmlFor="sort-keys">Sort keys</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={indent === 4}
                  onCheckedChange={(checked) => setIndent(checked ? 4 : 2)}
                  id="indent-4"
                />
                <Label htmlFor="indent-4">4-space indent</Label>
              </div>
            </>
          }
        />
      }
      input={
        <>
          <PaneHeader title="Input JSON" />
          <Textarea
            className="min-h-0 flex-1 rounded-none border-0"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
          />
        </>
      }
      output={
        <>
          <PaneHeader
            title="Result"
            extra={
              <Tabs value={view} onValueChange={(value) => setView(value as ViewMode)}>
                <TabsList>
                  <TabsTrigger value="pretty">Pretty</TabsTrigger>
                  <TabsTrigger value="tree">Tree</TabsTrigger>
                </TabsList>
              </Tabs>
            }
          />
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <ToolErrorBanner error={parsed.error} />
            {view === "pretty" || parsed.error ? (
              <Textarea
                readOnly
                className="min-h-0 flex-1"
                value={parsed.error ? "" : parsed.output}
              />
            ) : (
              <ScrollArea className="min-h-0 flex-1 rounded-lg border bg-background p-3">
                <JsonTree value={parsed.value} path="$" />
              </ScrollArea>
            )}
          </div>
        </>
      }
    />
  );
}

function JsonTree({ value, path }: { value: unknown; path: string }) {
  if (value === null) return <span className="text-muted-foreground">null</span>;
  if (typeof value === "string") return <span className="text-emerald-600 dark:text-emerald-300">&quot;{value}&quot;</span>;
  if (typeof value === "number") return <span className="text-sky-600 dark:text-sky-300">{value}</span>;
  if (typeof value === "boolean") return <span className="text-violet-600 dark:text-violet-300">{String(value)}</span>;
  if (Array.isArray(value)) {
    return (
      <details open className="ml-2">
        <summary className="cursor-pointer text-xs text-muted-foreground">
          <ChevronRight className="inline size-3" /> Array[{value.length}] <code>{path}</code>
        </summary>
        <ul className="ml-4 border-l pl-3">
          {value.map((item, index) => (
            <li key={`${path}.${index}`} className="py-0.5 font-mono text-sm">
              <span className="mr-2 text-muted-foreground">{index}:</span>
              <JsonTree value={item} path={`${path}[${index}]`} />
            </li>
          ))}
        </ul>
      </details>
    );
  }
  const record = value as Record<string, unknown>;
  return (
    <details open className="ml-1">
      <summary className={cn("cursor-pointer text-xs text-muted-foreground")}>
        <ChevronRight className="inline size-3" /> Object{" "}
        <code className="text-[11px]">{path}</code>
      </summary>
      <ul className="ml-4 border-l pl-3">
        {Object.entries(record).map(([key, child]) => (
          <li key={`${path}.${key}`} className="py-0.5 font-mono text-sm">
            <span className="mr-2 text-amber-700 dark:text-amber-300">{key}:</span>
            <JsonTree value={child} path={`${path}.${key}`} />
          </li>
        ))}
      </ul>
    </details>
  );
}
