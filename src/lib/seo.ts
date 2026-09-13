import type { Metadata } from "next";
import type { ToolConfig, ToolFaqItem } from "@/types/tool";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

const META_DESCRIPTION_MIN = 150;
const META_DESCRIPTION_MAX = 160;

export interface ResolvedToolSeo {
  title: string;
  description: string;
  canonical: string;
  keywords: string[];
  howToSteps: string[];
  faq: ToolFaqItem[];
  featureNotes: string[];
  privacyNotice: string;
}

export function generateToolMetadata(tool: ToolConfig): Metadata {
  const seo = resolveToolSeo(tool);
  return {
    title: { absolute: seo.title },
    description: seo.description,
    keywords: seo.keywords,
    robots: { index: true, follow: true },
    alternates: { canonical: seo.canonical },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title: seo.title,
      description: seo.description,
    },
  };
}

/** @deprecated Use generateToolMetadata */
export function toolMetadata(config: ToolConfig): Metadata {
  return generateToolMetadata(config);
}

export function resolveToolSeo(tool: ToolConfig): ResolvedToolSeo {
  const canonical = absoluteUrl(`/${tool.category}/${tool.slug}`);
  const keywords = uniqueKeywords([
    ...(tool.targetKeywords ?? []),
    ...tool.keywords,
    `${tool.name} online`,
    `free ${tool.shortName} tool`,
    SITE_NAME,
  ]);

  return {
    title: `${tool.name} Online - Free & Private | ${SITE_NAME}`,
    description: fitMetaDescription(tool.seoDescription),
    canonical,
    keywords,
    howToSteps: tool.howToSteps?.length ? tool.howToSteps : defaultHowToSteps(tool),
    faq: tool.faq?.length ? tool.faq : defaultFaq(tool),
    featureNotes: tool.featureNotes?.length ? tool.featureNotes : defaultFeatureNotes(tool),
    privacyNotice: privacyNoticeFor(tool),
  };
}

export function buildWebApplicationJsonLd(tool: ToolConfig) {
  const seo = resolveToolSeo(tool);
  return {
    "@type": "WebApplication",
    "@id": `${seo.canonical}#app`,
    name: tool.name,
    applicationCategory: "DeveloperTool",
    operatingSystem: "All",
    url: seo.canonical,
    description: seo.description,
    isAccessibleForFree: true,
    browserRequirements: "Requires a modern browser. Processing runs in JavaScript.",
    featureList: seo.keywords.slice(0, 8),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  };
}

export function buildFaqPageJsonLd(tool: ToolConfig) {
  const seo = resolveToolSeo(tool);
  return {
    "@type": "FAQPage",
    "@id": `${seo.canonical}#faq`,
    url: seo.canonical,
    mainEntity: seo.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildToolJsonLdGraph(tool: ToolConfig) {
  return {
    "@context": "https://schema.org",
    "@graph": [buildWebApplicationJsonLd(tool), buildFaqPageJsonLd(tool)],
  };
}

/** @deprecated Use buildToolJsonLdGraph */
export function toolJsonLd(config: ToolConfig) {
  return buildWebApplicationJsonLd(config);
}

export function fitMetaDescription(source: string): string {
  let text = source.replace(/\s+/g, " ").trim();
  if (text.length >= META_DESCRIPTION_MIN && text.length <= META_DESCRIPTION_MAX) {
    return text;
  }

  if (text.length < META_DESCRIPTION_MIN) {
    const closers = [
      " Free, private, and local.",
      " No upload. Client-side only.",
      " Fast local-first execution.",
      " Private client-side tool with zero data upload.",
    ];
    for (const closer of closers) {
      const candidate = `${text.replace(/[. ]+$/, ".")}${closer}`.replace(/\s+/g, " ").trim();
      if (candidate.length >= META_DESCRIPTION_MIN && candidate.length <= META_DESCRIPTION_MAX) {
        return candidate;
      }
    }
    text = `${text.replace(/[. ]+$/, ".")} Private, free, and processed in your browser.`.replace(/\s+/g, " ");
  }

  if (text.length <= META_DESCRIPTION_MAX) return text;

  let sliced = text.slice(0, META_DESCRIPTION_MAX);
  const boundary = sliced.lastIndexOf(" ");
  sliced = (boundary >= 120 ? sliced.slice(0, boundary) : sliced).replace(/[,:;]+$/, "").trimEnd();
  if (!/[.!?]$/.test(sliced)) sliced = `${sliced}.`;
  return sliced.slice(0, META_DESCRIPTION_MAX);
}

function defaultHowToSteps(tool: ToolConfig): string[] {
  const input = tool.inputs[0]?.label ?? "input";
  const output = tool.outputs[0]?.label ?? "result";
  return [
    `Open the ${tool.name} and paste or upload your ${input.toLowerCase()} in the left pane.`,
    "Adjust options if needed, then run the action from the toolbar.",
    `Review the ${output.toLowerCase()} on the right, including any validation messages.`,
    "Copy or download the output. Client tools keep the payload in this browser tab.",
  ];
}

function defaultFaq(tool: ToolConfig): ToolFaqItem[] {
  const local =
    tool.executionTarget === "CLIENT"
      ? "Yes. LocalForge runs this utility in your browser. Your payload is not uploaded by default."
      : tool.executionTarget === "SERVER_PROXY"
        ? "Network lookups use a locked-down public proxy. Your editor payload is not stored, and private/internal hosts are blocked."
        : "A remote model is optional. Without a configured endpoint, processing falls back to a local engine in the browser.";
  return [
    {
      question: `Is the ${tool.name} free to use online?`,
      answer: `Yes. ${tool.name} on ${SITE_NAME} is free, requires no account, and is built for private, high-speed developer workflows.`,
    },
    {
      question: `Does ${SITE_NAME} upload my data when I use ${tool.shortName}?`,
      answer: local,
    },
    {
      question: `What is ${tool.name} best used for?`,
      answer: tool.description,
    },
    {
      question: `Can I use ${tool.shortName} without installing software?`,
      answer: `Yes. This is a browser-based ${tool.shortName.toLowerCase()} tool. Open the page and run it instantly — no install, no signup.`,
    },
  ];
}

function defaultFeatureNotes(tool: ToolConfig): string[] {
  const locality =
    tool.executionTarget === "CLIENT"
      ? "Client-side only: the payload stays in page memory and is never posted to LocalForge."
      : tool.executionTarget === "SERVER_PROXY"
        ? "Public-network requests go through an SSRF-safe proxy (no private IPs, localhost, or cloud metadata hosts)."
        : "Optional remote AI with an on-device fallback so you can keep sensitive files local.";
  return [
    tool.description,
    locality,
    `Inputs: ${tool.inputs.map((field) => field.label).join(", ") || "none"}.`,
    `Outputs: ${tool.outputs.map((field) => field.label).join(", ") || "none"}.`,
    "No account, no telemetry, and no quota wall on the local runner.",
  ];
}

function privacyNoticeFor(tool: ToolConfig): string {
  if (tool.executionTarget === "SERVER_PROXY") {
    return `${tool.name} sends only the public URL or host you ask us to fetch through LocalForge’s locked-down proxy. We do not keep request bodies, we block private networks and cloud metadata, and we never require an account. Editor contents that are not part of that request stay in your browser.`;
  }
  if (tool.executionTarget === "AI_REMOTE") {
    return `${tool.name} prefers on-device processing. If a remote OCR endpoint is configured, only the file you choose to analyze is sent there; otherwise Tesseract.js runs entirely in this tab. LocalForge does not create accounts or store uploads.`;
  }
  return `${tool.name} processes your data locally in the browser. Nothing is uploaded to LocalForge servers, there is no account system, and we do not collect telemetry on your payload. Close the tab and the working copy is gone.`;
}

function uniqueKeywords(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const key = value.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(value.trim());
  }
  return result;
}
