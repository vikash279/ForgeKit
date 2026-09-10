"use client";

import { useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { ToolComponentProps } from "@/types/tool";

const TYPES = ["A", "CNAME", "MX", "TXT"] as const;

export default function DnsPortCheckerTool({ config }: ToolComponentProps) {
  const [host, setHost] = useState(config.sampleData ?? "");
  const [port, setPort] = useState("443");
  const [types, setTypes] = useState<string[]>(["A", "MX", "TXT"]);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const lookup = async () => {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/proxy/dns-port-checker", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          host,
          types,
          port: port ? Number(port) : undefined,
        }),
      });
      const payload: unknown = await response.json();
      if (!response.ok) {
        throw new Error(
          typeof payload === "object" && payload && "error" in payload
            ? String((payload as { error: unknown }).error)
            : "Lookup failed.",
        );
      }
      setOutput(JSON.stringify(payload, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed.");
    } finally {
      setPending(false);
    }
  };

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={output}
          downloadName="dns.json"
          onClear={() => setOutput("")}
          onSample={() => setHost(config.sampleData ?? "")}
          extra={
            <Button size="sm" onClick={() => void lookup()} disabled={pending}>
              {pending ? "Querying…" : "Lookup"}
            </Button>
          }
        />
      }
      input={
        <>
          <PaneHeader title="Host" />
          <div className="flex flex-col gap-3 p-3">
            <Input value={host} onChange={(event) => setHost(event.target.value)} />
            <div>
              <Label>Port (optional)</Label>
              <Input className="mt-1" value={port} onChange={(event) => setPort(event.target.value)} />
            </div>
            <div className="flex flex-wrap gap-3">
              {TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={types.includes(type)}
                    onCheckedChange={(checked) =>
                      setTypes((current) =>
                        checked ? [...current, type] : current.filter((item) => item !== type),
                      )
                    }
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Records" />
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <ToolErrorBanner error={error ? { message: error } : null} />
            <Textarea readOnly className="min-h-0 flex-1" value={output} />
          </div>
        </>
      }
    />
  );
}
