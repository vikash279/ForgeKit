"use client";

import { useMemo, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { ToolComponentProps } from "@/types/tool";

const CHEATSHEET = [
  [".", "Any character except newline"],
  ["\\d \\w \\s", "Digit, word, whitespace"],
  ["^ $", "Start / end of string"],
  ["*", "0 or more"],
  ["+", "1 or more"],
  ["?", "Optional"],
  ["{n,m}", "Count range"],
  ["( )", "Capturing group"],
  ["(?: )", "Non-capturing group"],
  ["[abc]", "Character class"],
  ["(?<name>)", "Named group"],
];

export default function RegexTesterTool({ config }: ToolComponentProps) {
  const [pattern, setPattern] = useState("\\b(\\w+)\\b");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [input, setInput] = useState(config.sampleData ?? "");

  const result = useMemo(() => {
    try {
      const flagStr = Object.entries(flags)
        .filter(([, on]) => on)
        .map(([flag]) => flag)
        .join("");
      const regex = new RegExp(pattern, flagStr);
      const matches: { index: number; text: string; groups: string[] }[] = [];
      if (flags.g) {
        for (const match of input.matchAll(regex)) {
          matches.push({
            index: match.index ?? 0,
            text: match[0],
            groups: match.slice(1),
          });
        }
      } else {
        const match = regex.exec(input);
        if (match) {
          matches.push({ index: match.index, text: match[0], groups: match.slice(1) });
        }
      }
      return {
        error: null as string | null,
        output: JSON.stringify(matches, null, 2),
        count: matches.length,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Invalid regular expression",
        output: "",
        count: 0,
      };
    }
  }, [flags, input, pattern]);

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={result.output}
          downloadName="regex-matches.json"
          onClear={() => setInput("")}
          onSample={() => setInput(config.sampleData ?? "")}
          onUploadText={setInput}
        />
      }
      input={
        <>
          <PaneHeader title="Pattern & haystack" />
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            <Input value={pattern} onChange={(event) => setPattern(event.target.value)} />
            <div className="flex gap-3">
              {(["g", "i", "m", "s"] as const).map((flag) => (
                <label key={flag} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={flags[flag]}
                    onCheckedChange={(checked) =>
                      setFlags((current) => ({ ...current, [flag]: Boolean(checked) }))
                    }
                  />
                  {flag}
                </label>
              ))}
            </div>
            <Textarea className="min-h-0 flex-1" value={input} onChange={(event) => setInput(event.target.value)} />
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title={`Matches (${result.count})`} />
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <ToolErrorBanner error={result.error ? { message: result.error } : null} />
            <Textarea readOnly className="min-h-40" value={result.output} />
            <div>
              <Label>Cheatsheet</Label>
              <ul className="mt-2 grid gap-1 text-xs">
                {CHEATSHEET.map(([token, meaning]) => (
                  <li key={token} className="flex gap-3 font-mono">
                    <span className="w-28 text-primary">{token}</span>
                    <span className="font-sans text-muted-foreground">{meaning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      }
    />
  );
}
