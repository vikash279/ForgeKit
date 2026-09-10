import type { ToolConfig } from "@/types/tool";

export const websocketTesterConfig: ToolConfig = {
  slug: "websocket-tester",
  category: "website",
  name: "WebSocket Tester",
  shortName: "WebSocket",
  description: "Connect to a WebSocket, send frames, inspect events, and measure round-trip latency.",
  seoTitle: "WebSocket Client, Frame Inspector & Latency Log",
  seoDescription:
    "Test WebSocket endpoints from the browser: connect, send frames, log incoming events, and track latency.",
  keywords: ["websocket tester", "ws client", "socket frames"],
  executionTarget: "CLIENT",
  icon: "Radio",
  inputs: [{ id: "url", label: "WebSocket URL", kind: "text" }],
  outputs: [{ id: "log", label: "Event log", kind: "text" }],
  sampleData: "wss://echo.websocket.events",
};
