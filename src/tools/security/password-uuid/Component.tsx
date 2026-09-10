"use client";

import { useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ToolComponentProps } from "@/types/tool";

function randomFrom(alphabet: string, length: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return [...bytes].map((byte) => alphabet[byte % alphabet.length]).join("");
}

export default function PasswordUuidTool({ config }: ToolComponentProps) {
  const [length, setLength] = useState(20);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [output, setOutput] = useState("");

  const generatePassword = () => {
    const alphabet = [
      lower ? "abcdefghijkmnopqrstuvwxyz" : "",
      upper ? "ABCDEFGHJKLMNPQRSTUVWXYZ" : "",
      digits ? "23456789" : "",
      symbols ? "!@#$%^&*_-+=?" : "",
    ].join("");
    if (!alphabet) return;
    setOutput(randomFrom(alphabet, length));
  };

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={output}
          downloadName="secrets.txt"
          onClear={() => setOutput("")}
          extra={
            <>
              <Button size="sm" onClick={generatePassword}>
                Password
              </Button>
              <Button variant="outline" size="sm" onClick={() => setOutput(crypto.randomUUID())}>
                UUID v4
              </Button>
            </>
          }
        />
      }
      input={
        <>
          <PaneHeader title="Complexity" />
          <div className="flex flex-col gap-3 p-3">
            <div>
              <Label>Length</Label>
              <Input
                className="mt-1"
                type="number"
                min={8}
                max={128}
                value={length}
                onChange={(event) => setLength(Number(event.target.value))}
              />
            </div>
            {[
              ["lower", lower, setLower, "Lowercase"],
              ["upper", upper, setUpper, "Uppercase"],
              ["digits", digits, setDigits, "Digits"],
              ["symbols", symbols, setSymbols, "Symbols"],
            ].map(([id, checked, setter, label]) => (
              <div key={String(id)} className="flex items-center gap-2">
                <Switch
                  checked={Boolean(checked)}
                  onCheckedChange={setter as (value: boolean) => void}
                  id={String(id)}
                />
                <Label htmlFor={String(id)}>{String(label)}</Label>
              </div>
            ))}
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Generated" />
          <Textarea readOnly className="min-h-0 flex-1 rounded-none border-0" value={output} />
        </>
      }
    />
  );
}
