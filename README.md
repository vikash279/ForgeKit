# LocalForge

Privacy-first developer and webmaster utilities that run in your browser. No accounts. No telemetry. No upload-by-default.

**Repo owner:** [Vikash Rai](https://github.com/vikash279)

LocalForge is a Next.js app with 22 modular tools for JSON, regex, crypto, HTTP, DNS, images, and OCR. Most work stays on the client. Network tools go through a locked-down server proxy. Heavy jobs (hashes, image processing, diffs) run in Web Workers.

## Features

- **Local-first** — client tools never upload your payload
- **Registry-driven** — routes, sitemap, and metadata come from a single tool registry
- **Fast search** — press `Ctrl K` (or `Cmd K`) to jump to any tool
- **Dark / light theme** — persisted locally
- **SEO-ready** — static generation, JSON-LD, sitemap, and robots

## Tools

### Development

| Tool | Path |
| --- | --- |
| JSON Formatter & Validator | `/development/json-formatter` |
| Regex Tester & Debugger | `/development/regex-tester` |
| Crontab Evaluator | `/development/crontab-evaluator` |
| Unix Timestamp Converter | `/development/unix-timestamp` |
| Base Converter | `/development/base-converter` |
| Nginx & .htaccess Converter | `/development/nginx-htaccess` |
| SQL Designer & Formatter | `/development/sql-formatter` |
| Code Obfuscator / De-obfuscator | `/development/code-obfuscator` |

### Network & Webmaster

| Tool | Path |
| --- | --- |
| HTTP Simulator & API Client | `/website/http-simulator` |
| WebSocket Tester | `/website/websocket-tester` |
| DNS & Port Checker | `/website/dns-port-checker` |
| Website Asset Extractor | `/website/website-asset-extractor` |

HTTP, DNS/port, and asset extraction run through `/api/proxy/[slug]` with SSRF guards (private IPs, localhost, and metadata hosts are blocked). WebSocket testing stays in the browser.

### Security & Encoders

| Tool | Path |
| --- | --- |
| Hash & Checksum Generator | `/security/hash-generator` |
| Base64 Encoder / Decoder | `/security/base64-codec` |
| Text Encryptor / Decryptor | `/security/text-encryptor` |
| Password & UUID Generator | `/security/password-uuid` |
| URL & HTML Entity Encoder | `/security/url-html-encoder` |

### Media & AI

| Tool | Path |
| --- | --- |
| Client-Side Image Compressor | `/media/image-compressor` |
| Image Watermark & Beautifier | `/media/image-watermark` |
| QR Code Generator & Scanner | `/media/qr-studio` |
| OCR Text Extractor | `/media/ocr-extractor` |
| Text Diff Tool | `/media/text-diff` |

OCR uses Tesseract.js in the browser by default. Optionally point `NEXT_PUBLIC_OCR_ENDPOINT` at a remote model.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router) and React 19
- TypeScript
- Tailwind CSS 4 and [shadcn/ui](https://ui.shadcn.com)
- Web Workers for crypto, image, and diff work
- Tesseract.js for on-device OCR

## Getting started

**Requirements:** Node.js 20+ and npm.

```bash
git clone https://github.com/vikash279/ForgeKit.git localforge
cd localforge
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

### Environment

Copy the values you need into `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Optional remote OCR endpoint; Tesseract.js is used when unset
NEXT_PUBLIC_OCR_ENDPOINT=
```

`NEXT_PUBLIC_SITE_URL` is used for canonical URLs, sitemap, and Open Graph metadata.

## Project layout

```
src/
  app/                 App Router pages, sitemap, robots, proxy API
  components/          Layout, tool chrome, and UI primitives
  lib/                 SEO, SSRF, crypto, workers, storage helpers
  registry/            Tool registry (routes and discovery)
  tools/               One folder per tool: config.ts + Component.tsx
  workers/             Crypto, image, and diff Web Workers
  types/               Shared tool types and categories
```

Each tool is registered in `src/registry/index.ts` with a `config.ts` (name, SEO, execution target) and a lazily loaded `Component.tsx`. Adding a tool means creating that pair, then calling `register(...)` in the registry.

Execution targets:

- `CLIENT` — runs entirely in the browser
- `SERVER_PROXY` — public-network requests via the SSRF-safe proxy
- `AI_REMOTE` — optional remote API with a local fallback

## License

Private project. All rights reserved.

**Owner:** Vikash Rai ([@vikash279](https://github.com/vikash279))
