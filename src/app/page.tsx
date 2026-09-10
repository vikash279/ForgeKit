import Link from "next/link";
import { Command, Lock, Zap } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExecutionBadge } from "@/components/tools/execution-badge";
import { ToolIcon } from "@/components/tools/tool-icon";
import { getAllToolConfigs, getToolsByCategory, toolHref } from "@/registry";
import { CATEGORY_META, TOOL_CATEGORIES } from "@/types/tool";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export default function HomePage() {
  const tools = getAllToolConfigs();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <section className="rounded-2xl border bg-gradient-to-br from-accent/70 to-background p-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Local-first · {tools.length} tools
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight">
          {SITE_NAME}: {SITE_TAGLINE}
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          JSON, regex, crypto, HTTP, DNS, images, and OCR — modular runners with client execution,
          a locked-down server proxy, and AI fallbacks. Press{" "}
          <kbd className="rounded border bg-muted px-1.5 font-mono text-xs">Ctrl K</kbd> to jump.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          <li className="flex items-start gap-2 text-sm">
            <Lock className="mt-0.5 size-4 text-primary" />
            Client tools never upload your payload.
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Zap className="mt-0.5 size-4 text-primary" />
            Heavy work runs in Web Workers.
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Command className="mt-0.5 size-4 text-primary" />
            Registry-driven routes and sitemap.
          </li>
        </ul>
      </section>

      {TOOL_CATEGORIES.map((category) => (
        <section key={category} className="flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold">{CATEGORY_META[category].label}</h2>
              <p className="text-sm text-muted-foreground">{CATEGORY_META[category].description}</p>
            </div>
            <Link href={CATEGORY_META[category].href} className="text-sm text-primary hover:underline">
              View category
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {getToolsByCategory(category).map((tool) => (
              <Link key={tool.slug} href={toolHref(tool)}>
                <Card className="h-full transition-colors hover:border-primary/40 hover:bg-accent/30">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
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
        </section>
      ))}
    </div>
  );
}
