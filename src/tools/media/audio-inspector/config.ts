import type { ToolConfig } from "@/types/tool";

export const audioInspectorConfig: ToolConfig = {
  slug: "audio-inspector",
  category: "media",
  name: "Audio Waveform & Metadata Inspector",
  shortName: "Audio",
  description: "Inspect MP3, WAV, and OGG files with a waveform, metadata, and a test-tone synthesizer.",
  seoTitle: "Audio Waveform Inspector & Test Tone Generator",
  seoDescription:
    "Inspect MP3, WAV, and OGG in your browser. Waveform, sample rate, duration, channels, plus a sine/square/saw test tone — zero upload.",
  keywords: ["audio waveform", "mp3 metadata", "wav inspector", "test tone generator"],
  executionTarget: "CLIENT",
  icon: "AudioLines",
  inputs: [{ id: "audio", label: "Audio file", kind: "file" }],
  outputs: [{ id: "analysis", label: "Waveform and metadata", kind: "json" }],
  relatedSlugs: ["image-compressor", "text-diff"],
  howToSteps: [
    "Upload an MP3, WAV, or OGG file.",
    "Read sample rate, duration, channel count, and the decoded bit format.",
    "Inspect the waveform drawn from AudioBuffer channel data.",
    "Use the synthesizer to play sine, square, or sawtooth test tones.",
  ],
  featureNotes: [
    "Web Audio API decodeAudioData — no server transcode.",
    "Waveform preview downsampled for the canvas.",
    "WAV header peek for container bit depth when present.",
    "OscillatorNode test tones for speaker and routing checks.",
  ],
  faq: [
    {
      question: "Does the audio inspector upload my recording?",
      answer: "No. Files are decoded with AudioContext in this tab. LocalForge never posts the audio.",
    },
    {
      question: "Why is bit depth shown as 32-bit float?",
      answer:
        "The Web Audio API decodes to Float32. For WAV files we also read the header’s original bit depth when the RIFF fmt chunk is present.",
    },
    {
      question: "What test tones can I generate?",
      answer: "Sine, square, and sawtooth via OscillatorNode, with a frequency control for audio debugging.",
    },
  ],
};
