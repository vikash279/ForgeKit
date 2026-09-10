import type { ToolConfig } from "@/types/tool";

export const imageCompressorConfig: ToolConfig = {
  slug: "image-compressor",
  category: "media",
  name: "Client-Side Image Compressor",
  shortName: "Compress",
  description: "Lossy and lossless image compression with Canvas / OffscreenCanvas inside a Web Worker.",
  seoTitle: "Browser Image Compressor for PNG, JPG & WebP",
  seoDescription:
    "Compress images locally to JPEG, PNG, or WebP with quality and max-width controls. Nothing is uploaded.",
  keywords: ["image compressor", "webp converter", "compress jpeg", "offscreen canvas"],
  executionTarget: "CLIENT",
  icon: "Image",
  inputs: [{ id: "image", label: "Source image", kind: "image" }],
  outputs: [{ id: "compressed", label: "Compressed image", kind: "image" }],
  relatedSlugs: ["image-watermark", "qr-studio"],
};
