import type { ToolConfig } from "@/types/tool";

export const codeObfuscatorConfig: ToolConfig = {
  slug: "code-obfuscator",
  category: "development",
  name: "Code Obfuscator / De-obfuscator",
  shortName: "Packer",
  description: "Pack or unpack JavaScript and PHP payloads with reversible Base64 wrappers.",
  seoTitle: "JavaScript & PHP Base64 Packer / Unpacker",
  seoDescription:
    "Obfuscate or restore JS and PHP snippets using reversible Base64 pack wrappers. Entirely local.",
  keywords: ["javascript obfuscator", "php base64 pack", "deobfuscator"],
  executionTarget: "CLIENT",
  icon: "ShieldOff",
  inputs: [{ id: "source", label: "Source", kind: "code" }],
  outputs: [{ id: "packed", label: "Packed code", kind: "code" }],
  sampleData: `console.log("hello from LocalForge");`,
};
