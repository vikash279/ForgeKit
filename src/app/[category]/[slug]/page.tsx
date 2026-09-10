import type { Metadata } from "next";
import { JsonLd } from "@/components/tools/json-ld";
import { toolJsonLd, toolMetadata } from "@/lib/seo";
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
  return toolMetadata(tool.config);
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const tool = requireRegisteredTool(category, slug);
  const Component = (await tool.loadComponent()).default;

  return (
    <>
      <JsonLd data={toolJsonLd(tool.config)} />
      <Component config={tool.config} />
    </>
  );
}
