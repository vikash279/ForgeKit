import type { ToolConfig } from "@/types/tool";

export const textEncryptorConfig: ToolConfig = {
  slug: "text-encryptor",
  category: "security",
  name: "Text Encryptor / Decryptor",
  shortName: "Cipher",
  description: "Encrypt and decrypt text with AES-GCM (recommended) or legacy DES using a passphrase.",
  seoTitle: "AES-GCM & DES Text Encryptor / Decryptor",
  seoDescription:
    "Client-side AES-GCM encryption with PBKDF2 key derivation, plus a legacy DES mode. Passphrases never leave the device.",
  keywords: ["aes gcm", "text encryption", "des encrypt", "passphrase"],
  executionTarget: "CLIENT",
  icon: "Lock",
  inputs: [{ id: "plaintext", label: "Text", kind: "text" }],
  outputs: [{ id: "ciphertext", label: "Envelope", kind: "text" }],
  sampleData: "Confidential note that should stay in this browser.",
  relatedSlugs: ["hash-generator", "password-uuid"],
};
