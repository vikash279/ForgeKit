import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolSeoSection } from "@/components/ToolSeoSection";
import { ToolClientBoundary } from "@/components/tools/tool-client-boundary";
import { buildToolJsonLdGraph, generateToolMetadata } from "@/lib/seo";
import { getStaticToolParams, requireRegisteredTool } from "@/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return getStaticToolParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const tool = requireRegisteredTool(category, slug);
  return generateToolMetadata(tool.config);
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const tool = requireRegisteredTool(category, slug);

  return (
    <>
      <JsonLd data={buildToolJsonLdGraph(tool.config)} />
      <ToolClientBoundary category={category} slug={slug} config={tool.config} />
      <ToolSeoSection config={tool.config} />
    </>
  );
}
