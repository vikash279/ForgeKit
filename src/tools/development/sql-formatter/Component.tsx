"use client";

import { useMemo, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTableSql, formatSql } from "@/lib/sql";
import type { ToolComponentProps } from "@/types/tool";

export default function SqlFormatterTool({ config }: ToolComponentProps) {
  const [input, setInput] = useState(config.sampleData ?? "");
  const [table, setTable] = useState("users");
  const [columns, setColumns] = useState("id uuid, email text, created_at timestamptz");
  const formatted = useMemo(() => formatSql(input), [input]);

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={formatted}
          downloadName="query.sql"
          onClear={() => setInput("")}
          onSample={() => setInput(config.sampleData ?? "")}
          onUploadText={setInput}
          extra={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const schema = columns.split(",").map((part) => {
                  const [name, type] = part.trim().split(/\s+/);
                  return { name: name ?? "col", type: type ?? "text", primary: name === "id" };
                });
                setInput(createTableSql(table, schema));
              }}
            >
              Generate CREATE TABLE
            </Button>
          }
        />
      }
      input={
        <>
          <PaneHeader title="SQL" />
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <div className="grid grid-cols-2 gap-2">
              <Input value={table} onChange={(event) => setTable(event.target.value)} placeholder="table" />
              <Input value={columns} onChange={(event) => setColumns(event.target.value)} placeholder="columns" />
            </div>
            <Textarea className="min-h-0 flex-1" value={input} onChange={(event) => setInput(event.target.value)} />
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Formatted" />
          <Textarea readOnly className="min-h-0 flex-1 rounded-none border-0" value={formatted} />
        </>
      }
    />
  );
}
