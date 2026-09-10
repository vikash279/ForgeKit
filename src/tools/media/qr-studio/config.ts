import type { ToolConfig } from "@/types/tool";

export const qrStudioConfig: ToolConfig = {
  slug: "qr-studio",
  category: "media",
  name: "QR Code Generator & Scanner",
  shortName: "QR Studio",
  description: "Create customizable QR codes and scan codes from a file or camera.",
  seoTitle: "QR Code Generator & Camera / File Scanner",
  seoDescription:
    "Generate QR codes with color and error-correction controls, then decode QR payloads from images or your camera.",
  keywords: ["qr generator", "qr scanner", "error correction qr"],
  executionTarget: "CLIENT",
  icon: "QrCode",
  inputs: [{ id: "payload", label: "QR payload", kind: "text" }],
  outputs: [{ id: "png", label: "QR image", kind: "image" }],
  sampleData: "https://example.com",
};
