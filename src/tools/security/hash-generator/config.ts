import type { ToolConfig } from "@/types/tool";

export const hashGeneratorConfig: ToolConfig = {
  slug: "hash-generator",
  category: "security",
  name: "Hash & Checksum Generator",
  shortName: "Hash",
  description: "Generate MD5, SHA-1, SHA-256, and SHA-512 checksums for text or files in a Web Worker.",
  seoTitle: "MD5, SHA-1, SHA-256 & SHA-512 Hash Generator",
  seoDescription:
    "Compute cryptographic checksums locally with the Web Crypto API plus a typed MD5 implementation. Files never leave the browser.",
  keywords: ["sha256", "md5 checksum", "file hash", "sha512"],
  executionTarget: "CLIENT",
  icon: "Fingerprint",
  inputs: [{ id: "payload", label: "Text or file", kind: "binary" }],
  outputs: [{ id: "digest", label: "Hex digest", kind: "text" }],
  sampleData: "ForgeKit checksum sample",
  relatedSlugs: ["text-encryptor", "base64-codec"],
};
