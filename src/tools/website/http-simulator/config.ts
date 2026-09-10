import type { ToolConfig } from "@/types/tool";

export const httpSimulatorConfig: ToolConfig = {
  slug: "http-simulator",
  category: "website",
  name: "HTTP Simulator & API Client",
  shortName: "HTTP",
  description: "Build GET/POST/PUT/DELETE requests with headers and inspect proxied responses.",
  seoTitle: "HTTP Simulator & In-Browser API Client",
  seoDescription:
    "Compose HTTP requests with custom headers and bodies, then inspect status, timing, and response payloads via a CORS-safe proxy.",
  keywords: ["http client", "api tester", "rest client", "request builder"],
  executionTarget: "SERVER_PROXY",
  icon: "Globe",
  inputs: [{ id: "request", label: "HTTP request", kind: "json" }],
  outputs: [{ id: "response", label: "HTTP response", kind: "json" }],
  sampleData: "https://httpbin.org/get",
  relatedSlugs: ["websocket-tester", "dns-port-checker"],
};
