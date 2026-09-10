import type { Metadata } from "next";
import type { ToolConfig } from "@/types/tool";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export function toolMetadata(config: ToolConfig): Metadata {
  const url = absoluteUrl(`/${config.category}/${config.slug}`);
  const title = config.seoTitle;
  return {
    title,
    description: config.seoDescription,
    keywords: config.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description: config.seoDescription,
      url,
    },
    twitter: {
      card: "summary",
      title,
      description: config.seoDescription,
    },
  };
}

export function toolJsonLd(config: ToolConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: config.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: absoluteUrl(`/${config.category}/${config.slug}`),
    description: config.seoDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: config.keywords.slice(0, 8),
    isAccessibleForFree: true,
    privacyPolicy: "Client-side execution unless a documented server proxy is required.",
  };
}
