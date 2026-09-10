import type { ToolConfig } from "@/types/tool";

export const dnsPortCheckerConfig: ToolConfig = {
  slug: "dns-port-checker",
  category: "website",
  name: "DNS & Port Checker",
  shortName: "DNS/Port",
  description: "Resolve public DNS records and probe whether a remote TCP port accepts connections.",
  seoTitle: "DNS Lookup & Public Port Checker",
  seoDescription:
    "Query A, CNAME, MX, and TXT records and test public host ports through a locked-down server proxy with SSRF guards.",
  keywords: ["dns lookup", "mx records", "port checker", "open port"],
  executionTarget: "SERVER_PROXY",
  icon: "Network",
  inputs: [{ id: "host", label: "Hostname", kind: "text" }],
  outputs: [{ id: "records", label: "DNS records", kind: "json" }],
  sampleData: "example.com",
};
