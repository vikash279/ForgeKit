"use client";

import { useRef, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ToolComponentProps } from "@/types/tool";

interface LogLine {
  id: string;
  at: string;
  direction: "in" | "out" | "sys";
  text: string;
}

export default function WebsocketTesterTool({ config }: ToolComponentProps) {
  const socketRef = useRef<WebSocket | null>(null);
  const lastSent = useRef<number>(0);
  const [url, setUrl] = useState(config.sampleData ?? "");
  const [frame, setFrame] = useState("ping");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [error, setError] = useState<string | null>(null);

  const push = (direction: LogLine["direction"], text: string) => {
    setLogs((current) => [
      ...current,
      { id: crypto.randomUUID(), at: new Date().toISOString(), direction, text },
    ]);
  };

  const connect = () => {
    setError(null);
    socketRef.current?.close();
    try {
      const socket = new WebSocket(url);
      socketRef.current = socket;
      socket.addEventListener("open", () => push("sys", "Connected"));
      socket.addEventListener("close", () => push("sys", "Disconnected"));
      socket.addEventListener("error", () => setError("WebSocket error. Check the URL and mixed-content policy."));
      socket.addEventListener("message", (event) => {
        const latency = lastSent.current ? `${Date.now() - lastSent.current} ms RTT` : "n/a";
        push("in", `${String(event.data)} (${latency})`);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open socket.");
    }
  };

  const output = logs.map((line) => `[${line.at}] ${line.direction.toUpperCase()} ${line.text}`).join("\n");

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={output}
          downloadName="websocket.log"
          onClear={() => setLogs([])}
          onSample={() => setUrl(config.sampleData ?? "")}
          extra={
            <>
              <Button size="sm" onClick={connect}>Connect</Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  lastSent.current = Date.now();
                  socketRef.current?.send(frame);
                  push("out", frame);
                }}
              >
                Send
              </Button>
              <Button variant="outline" size="sm" onClick={() => socketRef.current?.close()}>
                Close
              </Button>
            </>
          }
        />
      }
      input={
        <>
          <PaneHeader title="Connection" />
          <div className="flex flex-col gap-3 p-3">
            <Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="wss://" />
            <Textarea value={frame} onChange={(event) => setFrame(event.target.value)} />
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Event log" />
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <ToolErrorBanner error={error ? { message: error } : null} />
            <Textarea readOnly className="min-h-0 flex-1" value={output} />
          </div>
        </>
      }
    />
  );
}
