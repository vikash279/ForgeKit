"use client";

import { useRef, useState } from "react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { downloadBlob } from "@/lib/files";
import type { ToolComponentProps } from "@/types/tool";

type Ecc = "L" | "M" | "Q" | "H";

export default function QrStudioTool({ config }: ToolComponentProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [payload, setPayload] = useState(config.sampleData ?? "");
  const [foreground, setForeground] = useState("#0f172a");
  const [background, setBackground] = useState("#ffffff");
  const [ecc, setEcc] = useState<Ecc>("M");
  const [dataUrl, setDataUrl] = useState("");
  const [scanned, setScanned] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);

  const generate = async () => {
    setError(null);
    try {
      const url = await QRCode.toDataURL(payload || " ", {
        errorCorrectionLevel: ecc,
        margin: 1,
        width: 512,
        color: { dark: foreground, light: background },
      });
      setDataUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "QR generation failed.");
    }
  };

  const decodeFile = async (file: File) => {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(bitmap, 0, 0);
    const image = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(image.data, image.width, image.height);
    setScanned(code?.data ?? "No QR code found.");
  };

  const toggleCamera = async () => {
    if (cameraOn) {
      const stream = videoRef.current?.srcObject;
      if (stream instanceof MediaStream) stream.getTracks().forEach((track) => track.stop());
      setCameraOn(false);
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
    setCameraOn(true);
    const tick = () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        if (video) requestAnimationFrame(tick);
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(video, 0, 0);
      const image = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(image.data, image.width, image.height);
      if (code?.data) {
        setScanned(code.data);
        toggleCamera();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={dataUrl || scanned}
          downloadName="qr.txt"
          onClear={() => {
            setPayload("");
            setDataUrl("");
            setScanned("");
          }}
          onSample={() => setPayload(config.sampleData ?? "")}
          extra={
            <>
              <Button size="sm" onClick={() => void generate()}>
                Generate
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!dataUrl}
                onClick={async () => {
                  const blob = await fetch(dataUrl).then((response) => response.blob());
                  downloadBlob("qr.png", blob);
                }}
              >
                Download PNG
              </Button>
            </>
          }
        />
      }
      input={
        <>
          <PaneHeader title="Generator" />
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            <Label>Payload</Label>
            <Textarea value={payload} onChange={(event) => setPayload(event.target.value)} />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Foreground</Label>
                <Input type="color" value={foreground} onChange={(event) => setForeground(event.target.value)} />
              </div>
              <div>
                <Label>Background</Label>
                <Input type="color" value={background} onChange={(event) => setBackground(event.target.value)} />
              </div>
              <div>
                <Label>ECC</Label>
                <Select value={ecc} onValueChange={(value) => setEcc(value as Ecc)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["L", "M", "Q", "H"] as const).map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center rounded-lg border bg-muted/20 p-3">
              {dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={dataUrl} alt="Generated QR" className="size-56" />
              ) : (
                <p className="text-sm text-muted-foreground">Generate a QR code to preview it.</p>
              )}
            </div>
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Scanner" />
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            <ToolErrorBanner error={error ? { message: error } : null} />
            <div className="flex gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void decodeFile(file);
                }}
              />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                Scan file
              </Button>
              <Button variant="outline" size="sm" onClick={() => void toggleCamera()}>
                {cameraOn ? "Stop camera" : "Open camera"}
              </Button>
            </div>
            <video ref={videoRef} className={cameraOn ? "w-full rounded-lg" : "hidden"} />
            <Textarea readOnly value={scanned} placeholder="Decoded payload appears here." />
          </div>
        </>
      }
    />
  );
}
