"use client";

import { useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ToolComponentProps } from "@/types/tool";

export default function WebsiteAssetExtractorTool({ config }: ToolComponentProps) {
  const [url, setUrl] = useState(config.sampleData ?? "");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const extract = async () => {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/proxy/website-asset-extractor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const payload: unknown = await response.json();
      if (!response.ok) {
        throw new Error(
          typeof payload === "object" && payload && "error" in payload
            ? String((payload as { error: unknown }).error)
            : "Extract failed.",
        );
      }
      setOutput(JSON.stringify(payload, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Extract failed.");
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
          downloadName="assets.json"
          onClear={() => setOutput("")}
          onSample={() => setUrl(config.sampleData ?? "")}
          extra={
            <Button size="sm" onClick={() => void extract()} disabled={pending}>
              {pending ? "Fetching…" : "Extract"}
            </Button>
          }
        />
      }
      input={
        <>
          <PaneHeader title="Public URL" />
          <div className="p-3">
            <Input value={url} onChange={(event) => setUrl(event.target.value)} />
            <p className="mt-2 text-xs text-muted-foreground">
              Only public http(s) pages. Private networks, localhost, and credentialed URLs are blocked.
            </p>
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Asset tree" />
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <ToolErrorBanner error={error ? { message: error } : null} />
            <Textarea readOnly className="min-h-0 flex-1" value={output} />
          </div>
        </>
      }
    />
  );
}
