"use client";

import { useMemo, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { ToolComponentProps } from "@/types/tool";

function toBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function fromBase64(value: string): string {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function CodeObfuscatorTool({ config }: ToolComponentProps) {
  const [lang, setLang] = useState<"js" | "php">("js");
  const [mode, setMode] = useState<"pack" | "unpack">("pack");
  const [input, setInput] = useState(config.sampleData ?? "");

  const result = useMemo(() => {
    try {
      if (mode === "pack") {
        const encoded = toBase64(input);
        const output =
          lang === "js"
            ? `eval(decodeURIComponent(escape(atob("${encoded}"))));`
            : `<?php eval(base64_decode('${encoded}'));`;
        return { output, error: null as string | null };
      }
      const packed = input.match(/atob\("([^"]+)"\)/) ?? input.match(/base64_decode\('([^']+)'\)/);
      if (!packed?.[1]) throw new Error("Could not find a Base64 payload to unpack.");
      return { output: fromBase64(packed[1]), error: null };
    } catch (error) {
      return { output: "", error: error instanceof Error ? error.message : "Pack failed." };
    }
  }, [input, lang, mode]);

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={result.output}
          downloadName={lang === "js" ? "packed.js" : "packed.php"}
          onClear={() => setInput("")}
          onSample={() => setInput(config.sampleData ?? "")}
          onUploadText={setInput}
        />
      }
      input={
        <>
          <PaneHeader title="Source" />
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <div className="flex gap-2">
              <Tabs value={lang} onValueChange={(value) => setLang(value as "js" | "php")}>
                <TabsList>
                  <TabsTrigger value="js">JavaScript</TabsTrigger>
                  <TabsTrigger value="php">PHP</TabsTrigger>
                </TabsList>
              </Tabs>
              <Tabs value={mode} onValueChange={(value) => setMode(value as "pack" | "unpack")}>
                <TabsList>
                  <TabsTrigger value="pack">Pack</TabsTrigger>
                  <TabsTrigger value="unpack">Unpack</TabsTrigger>
                </TabsList>
              </Tabs>
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
