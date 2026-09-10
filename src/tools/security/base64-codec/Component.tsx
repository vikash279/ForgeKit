"use client";

import { useMemo, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { downloadBlob } from "@/lib/files";
import type { ToolComponentProps } from "@/types/tool";

function encodeUtf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeUtf8(value: string): string {
  const binary = atob(value.replace(/^data:[^;]+;base64,/, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function Base64CodecTool({ config }: ToolComponentProps) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState(config.sampleData ?? "");
  const [dataUri, setDataUri] = useState(false);
  const [mime, setMime] = useState("text/plain");

  const result = useMemo(() => {
    try {
      if (mode === "encode") {
        const encoded = encodeUtf8(input);
        return {
          output: dataUri ? `data:${mime};base64,${encoded}` : encoded,
          error: null as string | null,
        };
      }
      return { output: decodeUtf8(input.trim()), error: null };
    } catch (err) {
      return {
        output: "",
        error: err instanceof Error ? err.message : "Codec failed.",
      };
    }
  }, [dataUri, input, mime, mode]);

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={result.output}
          downloadName="base64.txt"
          onClear={() => setInput("")}
          onSample={() => setInput(config.sampleData ?? "")}
          onUploadText={async (_value, file) => {
            const buffer = await file.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            let binary = "";
            bytes.forEach((byte) => {
              binary += String.fromCharCode(byte);
            });
            const encoded = btoa(binary);
            setMime(file.type || "application/octet-stream");
            setMode("encode");
            setInput(dataUri ? `data:${file.type};base64,${encoded}` : encoded);
          }}
          extra={
            <button
              type="button"
              className="text-xs underline"
              onClick={() => {
                if (!result.output.startsWith("data:")) return;
                const blob = fetch(result.output).then((response) => response.blob());
                void blob.then((file) => downloadBlob("decoded.bin", file));
              }}
            >
              Download decoded
            </button>
          }
        />
      }
      input={
        <>
          <PaneHeader title="Source" />
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            <Tabs value={mode} onValueChange={(value) => setMode(value as "encode" | "decode")}>
              <TabsList>
                <TabsTrigger value="encode">Encode</TabsTrigger>
                <TabsTrigger value="decode">Decode</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <Switch checked={dataUri} onCheckedChange={setDataUri} id="data-uri" />
              <Label htmlFor="data-uri">Data URI</Label>
            </div>
            <Textarea className="min-h-0 flex-1" value={input} onChange={(event) => setInput(event.target.value)} />
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Result" />
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <ToolErrorBanner error={result.error ? { message: result.error } : null} />
            <Textarea readOnly className="min-h-0 flex-1" value={result.output} />
          </div>
        </>
      }
    />
  );
}
