"use client";

import { useRef, useState } from "react";
import { AiRemoteBoundary } from "@/components/tools/ai-remote-boundary";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ToolComponentProps } from "@/types/tool";

async function remoteOcr(file: File): Promise<string | null> {
  const endpoint = process.env.NEXT_PUBLIC_OCR_ENDPOINT;
  if (!endpoint) return null;
  const body = new FormData();
  body.append("image", file);
  const response = await fetch(endpoint, { method: "POST", body });
  if (!response.ok) throw new Error(`Remote OCR returned ${response.status}`);
  const payload: unknown = await response.json();
  if (typeof payload === "object" && payload && "text" in payload) {
    return String((payload as { text: unknown }).text);
  }
  throw new Error("Remote OCR payload was malformed.");
}

async function tesseractOcr(file: File): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  const result = await worker.recognize(file);
  await worker.terminate();
  return result.data.text;
}

export default function OcrExtractorTool({ config }: ToolComponentProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string | "remote" | "tesseract" | null>(null);
  const [pending, setPending] = useState(false);

  const run = async (file: File) => {
    setPending(true);
    setError(null);
    try {
      try {
        const remote = await remoteOcr(file);
        if (remote !== null) {
          setOutput(remote);
          setSource("remote");
          return;
        }
      } catch (remoteError) {
        setError(
          remoteError instanceof Error
            ? `${remoteError.message} Falling back to Tesseract.js.`
            : "Remote OCR failed. Falling back locally.",
        );
      }
      setOutput(await tesseractOcr(file));
      setSource("tesseract");
    } catch (err) {
      setError(err instanceof Error ? err.message : "OCR failed.");
    } finally {
      setPending(false);
    }
  };

  return (
    <AiRemoteBoundary fallbackLabel="OCR">
      <ToolLayout
        config={config}
        toolbar={
          <ToolToolbar
            output={output}
            downloadName="ocr.txt"
            onClear={() => setOutput("")}
            extra={
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void run(file);
                  }}
                />
                <Button size="sm" onClick={() => fileRef.current?.click()} disabled={pending}>
                  {pending ? "Reading…" : "Upload image"}
                </Button>
              </>
            }
          />
        }
        input={
          <>
            <PaneHeader title="Source" />
            <div className="p-3 text-sm text-muted-foreground">
              Set <code>NEXT_PUBLIC_OCR_ENDPOINT</code> to wrap a remote model. Without it, Tesseract.js
              runs entirely in the browser.
              {source ? <p className="mt-2">Engine: {source}</p> : null}
            </div>
          </>
        }
        output={
          <>
            <PaneHeader title="Extracted text" />
            <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
              <ToolErrorBanner error={error ? { message: error } : null} />
              <Textarea className="min-h-0 flex-1" value={output} onChange={(event) => setOutput(event.target.value)} />
            </div>
          </>
        }
      />
    </AiRemoteBoundary>
  );
}
