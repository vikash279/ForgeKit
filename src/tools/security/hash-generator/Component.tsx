"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { HashAlgorithm } from "@/lib/crypto/protocol";
import { createCryptoWorker } from "@/lib/workers";
import type { ToolComponentProps } from "@/types/tool";

const ALGORITHMS: HashAlgorithm[] = ["MD5", "SHA-1", "SHA-256", "SHA-512"];

export default function HashGeneratorTool({ config }: ToolComponentProps) {
  const worker = useMemo(() => createCryptoWorker(), []);
  const [input, setInput] = useState(config.sampleData ?? "");
  const [fileName, setFileName] = useState<string | null>(null);
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => () => worker.terminate(), [worker]);

  const run = async (payload?: ArrayBuffer) => {
    setPending(true);
    setError(null);
    try {
      const encoded = new TextEncoder().encode(input);
      const data = payload ?? bytes ?? encoded.buffer.slice(encoded.byteOffset, encoded.byteOffset + encoded.byteLength);
      const result = await worker.call({
        action: "hash",
        algorithm,
        bytes: data,
      });
      setOutput(result.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hashing failed.");
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
          downloadName={`${algorithm.toLowerCase()}.txt`}
          onClear={() => {
            setInput("");
            setOutput("");
            setBytes(null);
            setFileName(null);
          }}
          onSample={() => {
            setInput(config.sampleData ?? "");
            setBytes(null);
            setFileName(null);
          }}
          onUploadText={async (_value, file) => {
            const buffer = await file.arrayBuffer();
            setFileName(file.name);
            setBytes(buffer);
            setInput(`(file) ${file.name} · ${file.size} bytes`);
            await run(buffer);
          }}
          extra={
            <Button size="sm" onClick={() => void run()} disabled={pending}>
              {pending ? "Hashing…" : "Generate"}
            </Button>
          }
        />
      }
      input={
        <>
          <PaneHeader title="Payload" extra={fileName ? <span className="text-xs">{fileName}</span> : null} />
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            <Tabs value={algorithm} onValueChange={(value) => setAlgorithm(value as HashAlgorithm)}>
              <TabsList>
                {ALGORITHMS.map((item) => (
                  <TabsTrigger key={item} value={item}>
                    {item}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Label>Text (ignored when a file is loaded)</Label>
            <Textarea className="min-h-0 flex-1" value={input} onChange={(event) => {
              setInput(event.target.value);
              setBytes(null);
              setFileName(null);
            }} />
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Hex digest" />
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <ToolErrorBanner error={error ? { message: error } : null} />
            <Textarea readOnly className="min-h-0 flex-1 break-all" value={output} />
          </div>
        </>
      }
    />
  );
}
