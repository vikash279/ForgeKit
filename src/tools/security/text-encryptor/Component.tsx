"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { CipherAlgorithm } from "@/lib/crypto/protocol";
import { createCryptoWorker } from "@/lib/workers";
import type { ToolComponentProps } from "@/types/tool";

export default function TextEncryptorTool({ config }: ToolComponentProps) {
  const worker = useMemo(() => createCryptoWorker(), []);
  const [algorithm, setAlgorithm] = useState<CipherAlgorithm>("AES-GCM");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [passphrase, setPassphrase] = useState("");
  const [input, setInput] = useState(config.sampleData ?? "");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => () => worker.terminate(), [worker]);

  const run = async () => {
    setPending(true);
    setError(null);
    try {
      if (!passphrase) throw new Error("Passphrase is required.");
      const result =
        mode === "encrypt"
          ? await worker.call({
              action: "encrypt",
              algorithm,
              plaintext: input,
              passphrase,
            })
          : await worker.call({
              action: "decrypt",
              algorithm,
              payload: input,
              passphrase,
            });
      setOutput(result.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cipher failed.");
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
          downloadName={mode === "encrypt" ? "ciphertext.txt" : "plaintext.txt"}
          onClear={() => {
            setInput("");
            setOutput("");
            setError(null);
          }}
          onSample={() => setInput(config.sampleData ?? "")}
          onUploadText={(value) => setInput(value)}
          extra={
            <Button size="sm" onClick={() => void run()} disabled={pending}>
              {pending ? "Working…" : mode === "encrypt" ? "Encrypt" : "Decrypt"}
            </Button>
          }
        />
      }
      input={
        <>
          <PaneHeader title="Plaintext / ciphertext" />
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            <div className="flex flex-wrap gap-2">
              <Tabs value={algorithm} onValueChange={(value) => setAlgorithm(value as CipherAlgorithm)}>
                <TabsList>
                  <TabsTrigger value="AES-GCM">AES-GCM</TabsTrigger>
                  <TabsTrigger value="DES">DES (legacy)</TabsTrigger>
                </TabsList>
              </Tabs>
              <Tabs value={mode} onValueChange={(value) => setMode(value as "encrypt" | "decrypt")}>
                <TabsList>
                  <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
                  <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div>
              <Label htmlFor="pass">Passphrase</Label>
              <Input
                id="pass"
                type="password"
                className="mt-1"
                value={passphrase}
                onChange={(event) => setPassphrase(event.target.value)}
              />
            </div>
            {algorithm === "DES" ? (
              <p className="text-xs text-amber-700 dark:text-amber-300">
                DES is provided for interoperability only. Prefer AES-GCM for anything sensitive.
              </p>
            ) : null}
            <Textarea className="min-h-0 flex-1" value={input} onChange={(event) => setInput(event.target.value)} />
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Result envelope" />
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <ToolErrorBanner error={error ? { message: error } : null} />
            <Textarea readOnly className="min-h-0 flex-1" value={output} />
          </div>
        </>
      }
    />
  );
}
