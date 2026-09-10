"use client";

import { useRef, type ChangeEvent, type ReactNode } from "react";
import {
  ClipboardCopy,
  Download,
  Eraser,
  FileUp,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { downloadText } from "@/lib/files";

interface ToolToolbarProps {
  output: string;
  onClear: () => void;
  onSample?: () => void;
  onUploadText?: (value: string, file: File) => void;
  downloadName?: string;
  accept?: string;
  extra?: ReactNode;
}

export function ToolToolbar({
  output,
  onClear,
  onSample,
  onUploadText,
  downloadName = "result.txt",
  accept,
  extra,
}: ToolToolbarProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const copy = async () => {
    if (!output) {
      toast.error("Nothing to copy yet.");
      return;
    }
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !onUploadText) return;
    const text = await file.text();
    onUploadText(text, file);
    toast.success(`Loaded ${file.name}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Button variant="outline" size="sm" onClick={copy}>
        <ClipboardCopy />
        Copy
      </Button>
      <Button variant="outline" size="sm" onClick={onClear}>
        <Eraser />
        Clear
      </Button>
      {onSample ? (
        <Button variant="outline" size="sm" onClick={onSample}>
          <Sparkles />
          Sample
        </Button>
      ) : null}
      {onUploadText ? (
        <>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={onFile}
          />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <FileUp />
            Upload
          </Button>
        </>
      ) : null}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (!output) {
            toast.error("Nothing to download yet.");
            return;
          }
          downloadText(downloadName, output);
          toast.success("Download started");
        }}
      >
        <Download />
        Download
      </Button>
      {extra}
    </div>
  );
}
