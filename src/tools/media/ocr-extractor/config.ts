import type { ToolConfig } from "@/types/tool";

export const ocrExtractorConfig: ToolConfig = {
  slug: "ocr-extractor",
  category: "media",
  name: "OCR Text Extractor",
  shortName: "OCR",
  description: "Extract text from images with an optional remote OCR API and a Tesseract.js fallback.",
  seoTitle: "OCR Text Extractor with Tesseract Fallback",
  seoDescription:
    "Read text from screenshots and photos. Uses a remote OCR API when configured, otherwise Tesseract.js in the browser.",
  keywords: ["ocr", "tesseract", "image to text", "screenshot text"],
  executionTarget: "AI_REMOTE",
  icon: "ScanText",
  inputs: [{ id: "image", label: "Source image", kind: "image" }],
  outputs: [{ id: "text", label: "Extracted text", kind: "text" }],
};
