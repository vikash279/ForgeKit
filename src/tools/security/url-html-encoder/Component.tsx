"use client";

import { useMemo, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { ToolComponentProps } from "@/types/tool";

type Mode = "url-encode" | "url-decode" | "html-encode" | "html-decode";

function htmlEncode(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function htmlDecode(value: string): string {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");
}

export default function UrlHtmlEncoderTool({ config }: ToolComponentProps) {
  const [mode, setMode] = useState<Mode>("url-encode");
  const [input, setInput] = useState(config.sampleData ?? "");
  const output = useMemo(() => {
    if (mode === "url-encode") return encodeURIComponent(input);
    if (mode === "url-decode") {
      try {
        return decodeURIComponent(input);
      } catch {
        return input;
      }
    }
    if (mode === "html-encode") return htmlEncode(input);
    return htmlDecode(input);
  }, [input, mode]);

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={output}
          downloadName="encoded.txt"
          onClear={() => setInput("")}
          onSample={() => setInput(config.sampleData ?? "")}
          onUploadText={setInput}
        />
      }
      input={
        <>
          <PaneHeader
            title="Input"
            extra={
              <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
                <TabsList>
                  <TabsTrigger value="url-encode">URI enc</TabsTrigger>
                  <TabsTrigger value="url-decode">URI dec</TabsTrigger>
                  <TabsTrigger value="html-encode">HTML enc</TabsTrigger>
                  <TabsTrigger value="html-decode">HTML dec</TabsTrigger>
                </TabsList>
              </Tabs>
            }
          />
          <Textarea className="min-h-0 flex-1 rounded-none border-0" value={input} onChange={(event) => setInput(event.target.value)} />
        </>
      }
      output={
        <>
          <PaneHeader title="Output" />
          <Textarea readOnly className="min-h-0 flex-1 rounded-none border-0" value={output} />
        </>
      }
    />
  );
}
