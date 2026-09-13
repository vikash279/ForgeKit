import type { ToolConfig } from "@/types/tool";

export const imageFormatConfig: ToolConfig = {
  slug: "image-format",
  category: "converters",
  name: "Image Format Converter",
  shortName: "Image Convert",
  description: "Convert images between PNG, JPEG, WEBP, and AVIF in the browser with a quality slider.",
  seoTitle: "PNG JPEG WEBP AVIF Converter in Browser",
  seoDescription:
    "Convert PNG, JPEG, WEBP, and AVIF in your browser with a quality slider. Canvas-based, instant download, zero upload, private.",
  keywords: ["png to webp", "jpeg to png", "avif converter", "image format converter"],
  executionTarget: "CLIENT",
  icon: "Images",
  inputs: [{ id: "image", label: "Source image", kind: "image" }],
  outputs: [{ id: "converted", label: "Converted image", kind: "image" }],
  relatedSlugs: ["image-compressor", "svg-raster"],
  howToSteps: [
    "Upload a PNG, JPEG, WEBP, or another bitmap the browser can decode.",
    "Pick the output format and quality (0.1–1.0).",
    "Convert with Canvas / createImageBitmap, then download the result.",
    "Files never leave the device.",
  ],
  featureNotes: [
    "Targets: PNG, JPEG, WEBP, AVIF (AVIF depends on browser encoder support).",
    "Quality slider from 0.1 to 1.0 for lossy formats.",
    "Client canvas conversion — no image CDN.",
  ],
  faq: [
    {
      question: "Is this image converter client-side?",
      answer: "Yes. LocalForge draws the bitmap to a canvas and calls toBlob. Nothing is uploaded.",
    },
    {
      question: "Why might AVIF fail?",
      answer:
        "Not every browser encodes image/avif. If encoding fails, switch to WEBP or PNG — decode support is broader than encode support.",
    },
  ],
};
