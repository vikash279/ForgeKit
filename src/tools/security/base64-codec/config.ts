import type { ToolConfig } from "@/types/tool";

export const base64CodecConfig: ToolConfig = {
  slug: "base64-codec",
  category: "security",
  name: "Base64 Encoder / Decoder",
  shortName: "Base64",
  description: "Encode or decode text and raw files (images, PDFs) with optional data-URI wrapping.",
  seoTitle: "Base64 Encode Decode for Text, Images & PDFs",
  seoDescription:
    "Encode and decode Base64 for text, images, and PDFs in your browser. RFC 4648 and data URIs — private client-side conversion, zero upload. No account needed.",
  keywords: ["base64 encoder", "data uri", "decode base64 file"],
  targetKeywords: [
    "base64 encoder online",
    "base64 decoder",
    "rfc 4648 base64",
    "base64 to file",
    "data uri encoder",
  ],
  executionTarget: "CLIENT",
  icon: "FileCode",
  inputs: [{ id: "input", label: "Source", kind: "binary" }],
  outputs: [{ id: "encoded", label: "Base64", kind: "text" }],
  sampleData: "Hello, LocalForge",
  howToSteps: [
    "Paste text or upload a file (image, PDF, or other binary) into the encoder.",
    "Encode to standard Base64, or wrap the result as a data URI for CSS and HTML embeds.",
    "To reverse, paste a Base64 string or data URI and decode back to text or a downloadable file.",
    "Copy or save the output. Encoding is RFC 4648-style and runs entirely in your browser.",
  ],
  featureNotes: [
    "RFC 4648 Base64 (standard alphabet with +/ and = padding).",
    "Optional data-URI wrapping (data:<mime>;base64,...) for images and fonts.",
    "Encode text or raw files; decode back to a downloadable blob.",
    "Whitespace in encoded input is ignored on decode, matching common copy/paste from email.",
    "Browser memory bounds very large binaries; there is no server-side size quota because nothing is uploaded.",
    "Not encryption — Base64 is an encoding. Do not treat it as a confidentiality control.",
  ],
  faq: [
    {
      question: "Is this Base64 encoder RFC 4648 compliant?",
      answer:
        "Yes. LocalForge uses the standard Base64 alphabet with padding as described in RFC 4648. Decode accepts typical whitespace from wrapped MIME lines.",
    },
    {
      question: "Can I encode images and PDFs to Base64 without uploading?",
      answer:
        "Yes. Files are read locally and converted in the browser. There is zero data upload, so invoices, screenshots, and attachments never leave the device.",
    },
    {
      question: "What is the difference between Base64 and a data URI?",
      answer:
        "Base64 is the encoded payload. A data URI prefixes that payload with a MIME type so browsers can embed it in HTML, CSS, or markdown. This tool can emit either form.",
    },
    {
      question: "Does decoding Base64 happen in the browser?",
      answer:
        "Yes. Decode is private and client-side. You can turn a Base64 string back into text or a file download without a server.",
    },
  ],
};
