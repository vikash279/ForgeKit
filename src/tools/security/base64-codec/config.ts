import type { ToolConfig } from "@/types/tool";

export const base64CodecConfig: ToolConfig = {
  slug: "base64-codec",
  category: "security",
  name: "Base64 Encoder / Decoder",
  shortName: "Base64",
  description: "Encode or decode text and raw files (images, PDFs) with optional data-URI wrapping.",
  seoTitle: "Base64 Encode Decode for Text, Images & PDFs",
  seoDescription:
    "Convert text or binary files to Base64 and data URIs, or decode payloads back to files. Fully client-side.",
  keywords: ["base64 encoder", "data uri", "decode base64 file"],
  executionTarget: "CLIENT",
  icon: "FileCode",
  inputs: [{ id: "input", label: "Source", kind: "binary" }],
  outputs: [{ id: "encoded", label: "Base64", kind: "text" }],
  sampleData: "Hello, ForgeKit",
};
