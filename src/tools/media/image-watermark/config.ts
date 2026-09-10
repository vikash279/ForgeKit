import type { ToolConfig } from "@/types/tool";

export const imageWatermarkConfig: ToolConfig = {
  slug: "image-watermark",
  category: "media",
  name: "Image Watermark & Beautifier",
  shortName: "Watermark",
  description: "Stamp text or logo watermarks, apply aspect-ratio crops, and export from canvas.",
  seoTitle: "Image Watermark, Aspect Presets & Canvas Export",
  seoDescription:
    "Add custom text or logo watermarks, pick aspect-ratio presets, and export PNG or JPEG — all in the browser.",
  keywords: ["image watermark", "logo stamp", "aspect ratio crop"],
  executionTarget: "CLIENT",
  icon: "Stamp",
  inputs: [{ id: "image", label: "Source image", kind: "image" }],
  outputs: [{ id: "result", label: "Watermarked image", kind: "image" }],
};
