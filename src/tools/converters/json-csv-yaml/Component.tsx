"use client";

import { useMemo, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { convertData, type CsvDelimiter, type DataFormat } from "@/lib/convert";
import type { ToolComponentProps } from "@/types/tool";

const EXT: Record<DataFormat, string> = { json: "json", csv: "csv", yaml: "yaml" };

export default function JsonCsvYamlTool({ config }: ToolComponentProps) {
  const [input, setInput] = useState(config.sampleData ?? "");
  const [from, setFrom] = useState<DataFormat>("json");
  const [to, setTo] = useState<DataFormat>("csv");
  const [delimiter, setDelimiter] = useState<CsvDelimiter>(",");
  const [headers, setHeaders] = useState(true);
  const [pretty, setPretty] = useState(true);

  const result = useMemo(() => {
    try {
      return { output: convertData(input, from, to, { delimiter, headers, pretty }), error: null as string | null };
    } catch (error) {
      return { output: "", error: error instanceof Error ? error.message : "Conversion failed." };
    }
  }, [delimiter, from, headers, input, pretty, to]);

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={result.output}
          downloadName={`converted.${EXT[to]}`}
          onClear={() => setInput("")}
          onSample={() => setInput(config.sampleData ?? "")}
          onUploadText={(value) => setInput(value)}
          extra={
            <div className="flex flex-wrap items-center gap-3">
              <FormatSelect label="From" value={from} onChange={setFrom} />
              <FormatSelect label="To" value={to} onChange={setTo} />
              <div className="w-32">
                <Select value={delimiter} onValueChange={(value) => setDelimiter(value as CsvDelimiter)}>
                  <SelectTrigger><SelectValue placeholder="Delimiter" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">Comma</SelectItem>
                    <SelectItem value={"\t"}>Tab</SelectItem>
                    <SelectItem value=";">Semicolon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="csv-headers" checked={headers} onCheckedChange={setHeaders} />
                <Label htmlFor="csv-headers">Headers</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="pretty" checked={pretty} onCheckedChange={setPretty} />
                <Label htmlFor="pretty">Pretty-print</Label>
              </div>
            </div>
          }
        />
      }
      input={
        <>
          <PaneHeader title="Source" />
          <Textarea className="min-h-0 flex-1 rounded-none border-0" value={input} onChange={(event) => setInput(event.target.value)} />
        </>
      }
      output={
        <>
          <PaneHeader title="Converted" />
          <div className="flex min-h-0 flex-1 flex-col">
            <ToolErrorBanner error={result.error ? { message: result.error } : null} />
            <Textarea className="min-h-0 flex-1 rounded-none border-0" value={result.output} readOnly />
          </div>
        </>
      }
    />
  );
}

function FormatSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: DataFormat;
  onChange: (value: DataFormat) => void;
}) {
  return (
    <div className="w-28">
      <Select value={value} onValueChange={(next) => onChange(next as DataFormat)}>
        <SelectTrigger aria-label={label}><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="json">JSON</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
          <SelectItem value="yaml">YAML</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
