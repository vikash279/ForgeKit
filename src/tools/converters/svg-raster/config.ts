import type { ToolConfig } from "@/types/tool";

export const svgRasterConfig: ToolConfig = {
  slug: "svg-raster",
  category: "converters",
  name: "SVG to PNG / ICO Converter",
  shortName: "SVG Raster",
  description: "Rasterize SVG markup or files to PNG or a multi-resolution ICO pack in the browser.",
  seoTitle: "SVG to PNG and ICO Converter Online",
  seoDescription:
    "Convert SVG to PNG or multi-size ICO in your browser. Paste markup or upload a file — private canvas rasterization, zero upload.",
  keywords: ["svg to png", "svg to ico", "favicon generator", "rasterize svg"],
  executionTarget: "CLIENT",
  icon: "FileImage",
  inputs: [{ id: "svg", label: "SVG markup", kind: "code" }],
  outputs: [{ id: "raster", label: "PNG or ICO", kind: "image" }],
  sampleData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#0f766e"/>
  <text x="32" y="40" text-anchor="middle" fill="#f0fdfa" font-size="22" font-family="sans-serif">LF</text>
</svg>`,
  relatedSlugs: ["image-format", "qr-studio"],
  howToSteps: [
    "Paste SVG markup or upload an .svg file.",
    "Set the raster width, then export PNG or a 16/32/48 ICO.",
    "Download the blob. Rasterization uses an Image + Canvas locally.",
  ],
  featureNotes: [
    "PNG export at a chosen pixel width.",
    "ICO pack with 16, 32, and 48px PNG frames (Vista-style ICO).",
    "External raster images inside the SVG follow browser CORS rules.",
  ],
  faq: [
    {
      question: "Can I make a favicon ICO from SVG?",
      answer: "Yes. LocalForge rasterizes the SVG at 16, 32, and 48px and packs a PNG-based ICO in the browser.",
    },
    {
      question: "Does SVG to PNG upload my logo?",
      answer: "No. Markup is drawn locally. Keep brand assets on-device.",
    },
  ],
};
