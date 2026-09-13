"use client";

import { useEffect, useRef, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { formatBytes, formatDuration } from "@/lib/utils";
import type { ToolComponentProps } from "@/types/tool";

type Wave = OscillatorType;

interface AudioMeta {
  name: string;
  size: number;
  duration: number;
  sampleRate: number;
  channels: number;
  frames: number;
  bitDepth: string;
}

export default function AudioInspectorTool({ config }: ToolComponentProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const [meta, setMeta] = useState<AudioMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wave, setWave] = useState<Wave>("sine");
  const [frequency, setFrequency] = useState(440);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => stopTone(), []);

  const inspect = async (file: File) => {
    setError(null);
    try {
      const bytes = await file.arrayBuffer();
      const context = ensureContext();
      const buffer = await context.decodeAudioData(bytes.slice(0));
      const wavBits = readWavBitDepth(bytes);
      setMeta({
        name: file.name,
        size: file.size,
        duration: buffer.duration,
        sampleRate: buffer.sampleRate,
        channels: buffer.numberOfChannels,
        frames: buffer.length,
        bitDepth: wavBits ? `${wavBits}-bit (WAV header)` : "32-bit float (decoded)",
      });
      drawWaveform(canvasRef.current, buffer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not decode this audio file.");
      setMeta(null);
    }
  };

  const startTone = () => {
    stopTone();
    const context = ensureContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = wave;
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.12;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillatorRef.current = oscillator;
    setPlaying(true);
  };

  const stopTone = () => {
    oscillatorRef.current?.stop();
    oscillatorRef.current?.disconnect();
    oscillatorRef.current = null;
    setPlaying(false);
  };

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={meta ? JSON.stringify(meta, null, 2) : ""}
          downloadName="audio-meta.json"
          onClear={() => {
            setMeta(null);
            setError(null);
            const canvas = canvasRef.current;
            canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
          }}
          extra={
            <>
              <input
                ref={fileRef}
                type="file"
                accept="audio/mpeg,audio/wav,audio/ogg,audio/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void inspect(file);
                }}
              />
              <Button size="sm" onClick={() => fileRef.current?.click()}>
                Upload audio
              </Button>
            </>
          }
        />
      }
      input={
        <>
          <PaneHeader title="Waveform" />
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <ToolErrorBanner error={error ? { message: error } : null} />
            <canvas ref={canvasRef} width={720} height={220} className="h-48 w-full rounded-lg border bg-zinc-950" />
            {meta ? (
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <Meta label="File" value={`${meta.name} · ${formatBytes(meta.size)}`} />
                <Meta label="Duration" value={formatDuration(meta.duration * 1000)} />
                <Meta label="Sample rate" value={`${meta.sampleRate} Hz`} />
                <Meta label="Channels" value={String(meta.channels)} />
                <Meta label="Frames" value={meta.frames.toLocaleString()} />
                <Meta label="Bit depth" value={meta.bitDepth} />
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">Upload an MP3, WAV, or OGG file. Decoding stays in this tab.</p>
            )}
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Test-tone synthesizer" />
          <div className="flex min-h-0 flex-1 flex-col gap-4 p-3">
            <div>
              <Label>Waveform</Label>
              <Select value={wave} onValueChange={(value) => setWave(value as Wave)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sine">Sine</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="sawtooth">Sawtooth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Frequency {frequency} Hz</Label>
              <Slider
                className="mt-3"
                min={40}
                max={4000}
                step={1}
                value={[frequency]}
                onValueChange={(value) => {
                  const next = value[0] ?? 440;
                  setFrequency(next);
                  if (oscillatorRef.current) oscillatorRef.current.frequency.value = next;
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={startTone} disabled={playing}>Play tone</Button>
              <Button size="sm" variant="outline" onClick={stopTone} disabled={!playing}>Stop</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Uses OscillatorNode for speaker, cable, and routing checks. Keep volume low.
            </p>
          </div>
        </>
      }
    />
  );

  function ensureContext(): AudioContext {
    if (!contextRef.current) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      contextRef.current = new Ctor();
    }
    void contextRef.current.resume();
    return contextRef.current;
  }
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border px-3 py-2">
      <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}

function drawWaveform(canvas: HTMLCanvasElement | null, buffer: AudioBuffer) {
  if (!canvas) return;
  const context = canvas.getContext("2d");
  if (!context) return;
  const data = buffer.getChannelData(0);
  const width = canvas.width;
  const height = canvas.height;
  context.fillStyle = "#09090b";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "#2dd4bf";
  context.lineWidth = 1;
  context.beginPath();
  const step = Math.max(1, Math.floor(data.length / width));
  for (let x = 0; x < width; x += 1) {
    const offset = x * step;
    let min = 1;
    let max = -1;
    for (let i = 0; i < step; i += 1) {
      const sample = data[offset + i] ?? 0;
      if (sample < min) min = sample;
      if (sample > max) max = sample;
    }
    const y1 = ((1 + min) / 2) * height;
    const y2 = ((1 + max) / 2) * height;
    context.moveTo(x, y1);
    context.lineTo(x, y2);
  }
  context.stroke();
}

function readWavBitDepth(bytes: ArrayBuffer): number | null {
  if (bytes.byteLength < 36) return null;
  const view = new DataView(bytes);
  const tag = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
  if (tag !== "RIFF") return null;
  return view.getUint16(34, true) || null;
}
