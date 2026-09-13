import type { ToolConfig } from "@/types/tool";

export const sampleFilesConfig: ToolConfig = {
  slug: "sample-files",
  category: "samples",
  name: "Developer Sample Files Hub",
  shortName: "Samples",
  description: "Generate dummy JSON, CSV, SQL, templates, and binary files of any size entirely in the browser.",
  seoTitle: "Dummy JSON, CSV, SQL & Binary Sample Files",
  seoDescription:
    "Generate dummy JSON, CSV, SQL, YAML, and binary files in your browser. Custom row counts and 1–50MB blobs — zero upload, private fixtures.",
  keywords: ["dummy json", "sample csv", "fake sql dump", "binary file generator"],
  targetKeywords: [
    "dummy json generator",
    "sample csv download",
    "dummy file generator",
    "test upload file size",
  ],
  executionTarget: "CLIENT",
  icon: "Files",
  inputs: [{ id: "options", label: "Generator options", kind: "text" }],
  outputs: [{ id: "file", label: "Dummy file", kind: "file" }],
  howToSteps: [
    "Pick a text fixture (JSON, CSV, SQL, YAML, XML, HTML, or Markdown) and a row count if needed.",
    "Copy contents to the clipboard or download the generated file.",
    "For upload-limit tests, choose a binary size (1–50MB) and format (.bin, .txt, .pdf, .mp4).",
    "Everything is built with Blobs in this tab — nothing is fetched from a CDN.",
  ],
  featureNotes: [
    "JSON datasets: users, ecommerce products, and GeoJSON points.",
    "CSV and SQL dumps at 10, 100, or 1000 rows.",
    "Binary blobs for 1MB, 5MB, 10MB, and 50MB with minimal PDF/MP4 headers.",
    "Client-side only. No static fixtures are stored on the server.",
  ],
  faq: [
    {
      question: "Are these dummy files uploaded anywhere?",
      answer: "No. LocalForge generates JSON, CSV, SQL, and binary samples in the browser with zero data upload.",
    },
    {
      question: "Can I create a 50MB file to test upload limits?",
      answer:
        "Yes. The binary generator builds a Blob of 1, 5, 10, or 50MB as .bin, .txt, a minimal PDF, or an MP4-flavored container.",
    },
    {
      question: "Is the sample SQL a real database backup?",
      answer: "It is a synthetic CREATE TABLE plus INSERT dump for parser and importer tests, not production data.",
    },
  ],
};
