import type { ToolConfig } from "@/types/tool";
import { resolveToolSeo } from "@/lib/seo";

export function ToolSeoSection({ config }: { config: ToolConfig }) {
  const seo = resolveToolSeo(config);

  return (
    <article className="mt-10 max-w-3xl space-y-8 border-t pt-8 text-sm leading-relaxed text-foreground">
      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">How to Use {config.name}</h2>
        <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
          {seo.howToSteps.map((step, index) => (
            <li key={index} className="pl-1">
              <span className="text-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Key Features & Edge Cases</h2>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          {seo.featureNotes.map((note) => (
            <li key={note} className="pl-1">
              <span className="text-foreground">{note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Privacy & Security Notice</h2>
        <p className="text-muted-foreground">
          <span className="text-foreground">{seo.privacyNotice}</span>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Frequently Asked Questions (FAQ)</h2>
        <div className="divide-y rounded-xl border">
          {seo.faq.map((item) => (
            <details key={item.question} className="group px-4 py-3">
              <summary className="cursor-pointer text-sm font-medium">
                {item.question}
              </summary>
              <p className="mt-2 text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}
