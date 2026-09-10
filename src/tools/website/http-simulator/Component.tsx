"use client";

import { useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDuration } from "@/lib/utils";
import type { ToolComponentProps } from "@/types/tool";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"] as const;
type Method = (typeof METHODS)[number];

interface HeaderRow {
  id: string;
  key: string;
  value: string;
}

interface ProxySuccess {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  truncated: boolean;
  durationMs: number;
  redirected: boolean;
}

export default function HttpSimulatorTool({ config }: ToolComponentProps) {
  const [method, setMethod] = useState<Method>("GET");
  const [url, setUrl] = useState(config.sampleData ?? "");
  const [headers, setHeaders] = useState<HeaderRow[]>([
    { id: "1", key: "Accept", value: "application/json" },
  ]);
  const [body, setBody] = useState('{\n  "ok": true\n}');
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const send = async () => {
    setPending(true);
    setError(null);
    try {
      const headerMap: Record<string, string> = {};
      for (const header of headers) {
        if (header.key.trim()) headerMap[header.key.trim()] = header.value;
      }
      const response = await fetch("/api/proxy/http-simulator", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          method,
          url,
          headers: headerMap,
          body: method === "GET" || method === "HEAD" ? undefined : body,
        }),
      });
      const payload: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof payload === "object" && payload && "error" in payload
            ? String((payload as { error: unknown }).error)
            : "Request failed.";
        throw new Error(message);
      }
      const data = payload as ProxySuccess;
      const prettyBody = (() => {
        try {
          return JSON.stringify(JSON.parse(data.body), null, 2);
        } catch {
          return data.body;
        }
      })();
      setResult(
        [
          `${data.status} ${data.statusText}`,
          `Time: ${formatDuration(data.durationMs)}`,
          data.redirected ? "Redirect: yes" : "Redirect: no",
          "",
          "Headers:",
          ...Object.entries(data.headers).map(([key, value]) => `${key}: ${value}`),
          "",
          "Body:",
          prettyBody,
        ].join("\n"),
      );
    } catch (err) {
      setResult("");
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setPending(false);
    }
  };

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={result}
          downloadName="http-response.txt"
          onClear={() => {
            setResult("");
            setError(null);
            setBody("");
          }}
          onSample={() => {
            setUrl(config.sampleData ?? "");
            setMethod("GET");
          }}
          extra={
            <Button size="sm" onClick={send} disabled={pending}>
              {pending ? "Sending…" : "Send request"}
            </Button>
          }
        />
      }
      input={
        <>
          <PaneHeader title="Request builder" />
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-3">
            <div className="flex gap-2">
              <Select value={method} onValueChange={(value) => setMethod(value as Method)}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METHODS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://" />
            </div>
            <div>
              <Label>Headers</Label>
              <div className="mt-2 space-y-2">
                {headers.map((header) => (
                  <div key={header.id} className="flex gap-2">
                    <Input
                      placeholder="Header"
                      value={header.key}
                      onChange={(event) =>
                        setHeaders((rows) =>
                          rows.map((row) =>
                            row.id === header.id ? { ...row, key: event.target.value } : row,
                          ),
                        )
                      }
                    />
                    <Input
                      placeholder="Value"
                      value={header.value}
                      onChange={(event) =>
                        setHeaders((rows) =>
                          rows.map((row) =>
                            row.id === header.id ? { ...row, value: event.target.value } : row,
                          ),
                        )
                      }
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setHeaders((rows) => [...rows, { id: crypto.randomUUID(), key: "", value: "" }])
                  }
                >
                  Add header
                </Button>
              </div>
            </div>
            {method !== "GET" && method !== "HEAD" ? (
              <div className="flex min-h-40 flex-1 flex-col">
                <Label>Body</Label>
                <Textarea className="mt-2 min-h-40 flex-1" value={body} onChange={(event) => setBody(event.target.value)} />
              </div>
            ) : null}
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Response inspector" />
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <ToolErrorBanner error={error ? { message: error } : null} />
            <Textarea readOnly className="min-h-0 flex-1" value={result} placeholder="Send a request to inspect the response." />
          </div>
        </>
      }
    />
  );
}
