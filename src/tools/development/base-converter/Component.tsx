"use client";

import { useMemo, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { convertBase } from "@/lib/radix";
import type { ToolComponentProps } from "@/types/tool";

export default function BaseConverterTool({ config }: ToolComponentProps) {
  const [value, setValue] = useState(config.sampleData ?? "255");
  const [from, setFrom] = useState(10);
  const [to, setTo] = useState(16);
  const result = useMemo(() => {
    try {
      return { output: convertBase(value, from, to), error: null as string | null };
    } catch (error) {
      return { output: "", error: error instanceof Error ? error.message : "Conversion failed." };
    }
  }, [from, to, value]);

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={result.output}
          downloadName="converted.txt"
          onClear={() => setValue("")}
          onSample={() => setValue(config.sampleData ?? "")}
        />
      }
      input={
        <>
          <PaneHeader title="Source" />
          <div className="flex flex-col gap-3 p-3">
            <Input value={value} onChange={(event) => setValue(event.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>From base</Label>
                <Input className="mt-1" type="number" min={2} max={64} value={from} onChange={(event) => setFrom(Number(event.target.value))} />
              </div>
              <div>
                <Label>To base</Label>
                <Input className="mt-1" type="number" min={2} max={64} value={to} onChange={(event) => setTo(Number(event.target.value))} />
              </div>
            </div>
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Converted" />
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <ToolErrorBanner error={result.error ? { message: result.error } : null} />
            <Textarea readOnly className="min-h-0 flex-1" value={result.output} />
          </div>
        </>
      }
    />
  );
}
