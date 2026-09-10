import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExecutionBadge } from "@/components/tools/execution-badge";
import { ToolIcon } from "@/components/tools/tool-icon";
import { getToolsByCategory, isToolCategory, toolHref } from "@/registry";
import { CATEGORY_META, TOOL_CATEGORIES } from "@/types/tool";
import type { Metadata } from "next";

export function generateStaticParams() {
  return TOOL_CATEGORIES.map((category) => ({ category }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isToolCategory(category)) return { title: "Not found" };
  const meta = CATEGORY_META[category];
  return {
    title: meta.label,
    description: meta.description,
    alternates: { canonical: meta.href },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isToolCategory(category)) notFound();
  const meta = CATEGORY_META[category];
  const tools = getToolsByCategory(category);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{meta.label}</h1>
        <p className="mt-2 text-muted-foreground">{meta.description}</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.slug} href={toolHref(tool)}>
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <ToolIcon name={tool.icon} className="size-4 text-primary" />
                  <ExecutionBadge target={tool.executionTarget} />
                </div>
                <CardTitle>{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
