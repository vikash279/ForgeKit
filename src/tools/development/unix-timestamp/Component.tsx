"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ToolComponentProps } from "@/types/tool";

export default function UnixTimestampTool({ config }: ToolComponentProps) {
  const [now, setNow] = useState(() => Date.now());
  const [input, setInput] = useState(config.sampleData ?? "");
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const converted = useMemo(() => {
    const trimmed = input.trim();
    const numeric = Number(trimmed);
    let date: Date | null = null;
    if (trimmed && Number.isFinite(numeric)) {
      date = new Date(numeric > 1e12 ? numeric : numeric * 1000);
    } else if (trimmed) {
      const parsed = Date.parse(trimmed);
      if (!Number.isNaN(parsed)) date = new Date(parsed);
    }
    if (!date || Number.isNaN(date.getTime())) {
      return { output: "", epoch: "" };
    }
    const shifted = new Date(date.getTime() + offset * 60 * 60 * 1000);
    return {
      epoch: String(Math.floor(date.getTime() / 1000)),
      output: JSON.stringify(
        {
          iso: date.toISOString(),
          utc: date.toUTCString(),
          local: date.toString(),
          withOffset: shifted.toISOString(),
          epochSeconds: Math.floor(date.getTime() / 1000),
          epochMillis: date.getTime(),
        },
        null,
        2,
      ),
    };
  }, [input, offset]);

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={converted.output}
          downloadName="timestamp.json"
          onClear={() => setInput("")}
          onSample={() => setInput(String(Math.floor(Date.now() / 1000)))}
        />
      }
      input={
        <>
          <PaneHeader title="Timestamp or date" extra={<span className="font-mono text-xs">{Math.floor(now / 1000)}</span>} />
          <div className="flex flex-col gap-3 p-3">
            <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="1710000000 or 2024-03-09T12:00:00Z" />
            <div>
              <Label>Timezone offset (hours)</Label>
              <Input
                className="mt-1"
                type="number"
                value={offset}
                onChange={(event) => setOffset(Number(event.target.value))}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Live clock: {new Date(now).toISOString()}
            </p>
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Converted" />
          <Textarea readOnly className="min-h-0 flex-1 rounded-none border-0" value={converted.output} />
        </>
      }
    />
  );
}
