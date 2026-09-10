"use client";

import { useMemo, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { htaccessToNginx, nginxToHtaccess } from "@/lib/rewrites";
import type { ToolComponentProps } from "@/types/tool";

export default function NginxHtaccessTool({ config }: ToolComponentProps) {
  const [mode, setMode] = useState<"apache-nginx" | "nginx-apache">("apache-nginx");
  const [input, setInput] = useState(config.sampleData ?? "");
  const output = useMemo(
    () => (mode === "apache-nginx" ? htaccessToNginx(input) : nginxToHtaccess(input)),
    [input, mode],
  );

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={output}
          downloadName={mode === "apache-nginx" ? "nginx.conf" : ".htaccess"}
          onClear={() => setInput("")}
          onSample={() => setInput(config.sampleData ?? "")}
          onUploadText={setInput}
        />
      }
      input={
        <>
          <PaneHeader
            title="Source"
            extra={
              <Tabs value={mode} onValueChange={(value) => setMode(value as typeof mode)}>
                <TabsList>
                  <TabsTrigger value="apache-nginx">Apache → Nginx</TabsTrigger>
                  <TabsTrigger value="nginx-apache">Nginx → Apache</TabsTrigger>
                </TabsList>
              </Tabs>
            }
          />
          <Textarea className="min-h-0 flex-1 rounded-none border-0" value={input} onChange={(event) => setInput(event.target.value)} />
        </>
      }
      output={
        <>
          <PaneHeader title="Converted config" />
          <Textarea readOnly className="min-h-0 flex-1 rounded-none border-0" value={output} />
        </>
      }
    />
  );
}
