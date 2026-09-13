import type { ToolConfig } from "@/types/tool";

export const hashGeneratorConfig: ToolConfig = {
  slug: "hash-generator",
  category: "security",
  name: "Hash & Checksum Generator",
  shortName: "Hash",
  description: "Generate MD5, SHA-1, SHA-256, and SHA-512 checksums for text or files in a Web Worker.",
  seoTitle: "MD5, SHA-1, SHA-256 & SHA-512 Hash Generator",
  seoDescription:
    "Generate SHA-256, SHA-512, SHA-1, and MD5 checksums in your browser. Private file hash tool with a Web Worker and zero data upload. No account needed.",
  keywords: ["sha256", "md5 checksum", "file hash", "sha512"],
  targetKeywords: [
    "sha256 hash generator",
    "md5 checksum online",
    "file hash generator",
    "sha512 checksum",
    "private hash generator",
  ],
  executionTarget: "CLIENT",
  icon: "Fingerprint",
  inputs: [{ id: "payload", label: "Text or file", kind: "binary" }],
  outputs: [{ id: "digest", label: "Hex digest", kind: "text" }],
  sampleData: "LocalForge checksum sample",
  relatedSlugs: ["text-encryptor", "base64-codec"],
  howToSteps: [
    "Paste text or choose a local file you want to checksum.",
    "Select MD5, SHA-1, SHA-256, or SHA-512, then generate the digest.",
    "Copy the lowercase hex output to compare with a published checksum.",
    "Keep the file on disk — hashing runs in a Web Worker inside this browser, with zero upload.",
  ],
  featureNotes: [
    "Algorithms: MD5, SHA-1, SHA-256, and SHA-512 (hex digest).",
    "SHA family uses the Web Crypto API; MD5 uses a typed local implementation.",
    "Heavy hashing is off the UI thread via a Web Worker so large files stay responsive.",
    "Text and arbitrary files (ISO, disk images, installers) are supported as far as browser memory allows.",
    "MD5 and SHA-1 are collision-prone — use them for integrity checks, not password storage.",
    "Client-side only: binaries never leave the machine.",
  ],
  faq: [
    {
      question: "Can I generate a SHA-256 hash without uploading a file?",
      answer:
        "Yes. LocalForge’s hash generator reads the file in the browser and computes SHA-256 (or SHA-512, SHA-1, MD5) locally. There is zero data upload.",
    },
    {
      question: "Which checksum algorithms are supported?",
      answer:
        "MD5, SHA-1, SHA-256, and SHA-512. Prefer SHA-256 or SHA-512 for integrity. MD5/SHA-1 remain for legacy checksums printed on older mirrors.",
    },
    {
      question: "Is hashing done in a Web Worker?",
      answer:
        "Yes. Digests run in a dedicated worker so the page stays interactive while large files are hashed on-device.",
    },
    {
      question: "Should I use this MD5 generator for passwords?",
      answer:
        "No. MD5 and raw SHA are not password-hashing functions (use Argon2, bcrypt, or scrypt in your app). This tool is for checksums and fingerprinting data you already have.",
    },
  ],
};
