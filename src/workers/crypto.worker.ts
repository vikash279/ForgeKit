/// <reference lib="es2020" />
/// <reference lib="webworker" />

import { md5Bytes } from "@/lib/crypto/md5";
import { desDecrypt, desEncrypt } from "@/lib/crypto/des";
import type {
  CryptoWorkerRequest,
  CryptoWorkerResponse,
  HashAlgorithm,
} from "@/lib/crypto/protocol";

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deriveAesKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt.buffer as ArrayBuffer, iterations: 120_000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptAes(plaintext: string, passphrase: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(passphrase, salt);
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
    key,
    new TextEncoder().encode(plaintext),
  );
  return JSON.stringify({
    v: 1,
    alg: "AES-GCM",
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ct: bytesToBase64(new Uint8Array(cipher)),
  });
}

async function decryptAes(payload: string, passphrase: string): Promise<string> {
  const parsed: unknown = JSON.parse(payload);
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("salt" in parsed) ||
    !("iv" in parsed) ||
    !("ct" in parsed)
  ) {
    throw new Error("Invalid AES envelope.");
  }
  const envelope = parsed as { salt: string; iv: string; ct: string };
  const salt = base64ToBytes(envelope.salt);
  const iv = base64ToBytes(envelope.iv);
  const key = await deriveAesKey(passphrase, salt);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
    key,
    base64ToBytes(envelope.ct).buffer as ArrayBuffer,
  );
  return new TextDecoder().decode(plain);
}

async function hashBytes(algorithm: HashAlgorithm, bytes: ArrayBuffer): Promise<string> {
  if (algorithm === "MD5") return md5Bytes(new Uint8Array(bytes));
  const digest = await crypto.subtle.digest(algorithm, bytes);
  return [...new Uint8Array(digest)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

self.onmessage = async (event: MessageEvent<CryptoWorkerRequest>) => {
  const request = event.data;
  try {
    let result: string;
    if (request.action === "hash") {
      result = await hashBytes(request.algorithm, request.bytes);
    } else if (request.action === "encrypt") {
      result =
        request.algorithm === "AES-GCM"
          ? await encryptAes(request.plaintext, request.passphrase)
          : desEncrypt(request.plaintext, request.passphrase);
    } else {
      result =
        request.algorithm === "AES-GCM"
          ? await decryptAes(request.payload, request.passphrase)
          : desDecrypt(request.payload, request.passphrase);
    }
    const response: CryptoWorkerResponse = { id: request.id, ok: true, result };
    self.postMessage(response);
  } catch (error) {
    const response: CryptoWorkerResponse = {
      id: request.id,
      ok: false,
      error: error instanceof Error ? error.message : "Crypto worker failed.",
    };
    self.postMessage(response);
  }
};
