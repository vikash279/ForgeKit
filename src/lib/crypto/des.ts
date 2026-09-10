/// <reference lib="es2020" />

const PC1 = [
  57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35,
  27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38,
  30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4,
];
const PC2 = [
  14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27,
  20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34,
  53, 46, 42, 50, 36, 29, 32,
];
const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
const IP = [
  58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38,
  30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9, 1,
  59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39,
  31, 23, 15, 7,
];
const FP = [
  40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14,
  54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60, 28,
  35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9,
  49, 17, 57, 25,
];
const E = [
  32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16,
  17, 16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28, 29,
  28, 29, 30, 31, 32, 1,
];
const P = [
  16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32,
  27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25,
];
const SBOX = [
  [
    14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7, 0, 15, 7, 4, 14, 2,
    13, 1, 10, 6, 12, 11, 9, 5, 3, 8, 4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7,
    3, 10, 5, 0, 15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13,
  ],
  [
    15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10, 3, 13, 4, 7, 15, 2, 8,
    14, 12, 0, 1, 10, 6, 9, 11, 5, 0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3,
    2, 15, 13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9,
  ],
  [
    10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8, 13, 7, 0, 9, 3, 4, 6,
    10, 2, 8, 5, 14, 12, 11, 15, 1, 13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5,
    10, 14, 7, 1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12,
  ],
  [
    7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15, 13, 8, 11, 5, 6, 15, 0,
    3, 4, 7, 2, 12, 1, 10, 14, 9, 10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2,
    8, 4, 3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14,
  ],
  [
    2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9, 14, 11, 2, 12, 4, 7,
    13, 1, 5, 0, 15, 10, 3, 9, 8, 6, 4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6,
    3, 0, 14, 11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3,
  ],
  [
    12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11, 10, 15, 4, 2, 7, 12, 9,
    5, 6, 1, 13, 14, 0, 11, 3, 8, 9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13,
    11, 6, 4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13,
  ],
  [
    4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1, 13, 0, 11, 7, 4, 9, 1,
    10, 14, 3, 5, 12, 2, 15, 8, 6, 1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0,
    5, 9, 2, 6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12,
  ],
  [
    13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7, 1, 15, 13, 8, 10, 3, 7,
    4, 12, 5, 6, 11, 0, 14, 9, 2, 7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3,
    5, 8, 2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11,
  ],
] as const;

function permute(src: bigint, table: number[], inBits: number): bigint {
  let out = 0n;
  for (const bit of table) {
    out = (out << 1n) | ((src >> BigInt(inBits - bit)) & 1n);
  }
  return out;
}

function rotateLeft28(value: bigint, shift: number): bigint {
  const mask = 0x0fffffffn;
  return ((value << BigInt(shift)) | (value >> BigInt(28 - shift))) & mask;
}

function f(right: bigint, subkey: bigint): bigint {
  const expanded = permute(right, E, 32) ^ subkey;
  let sOut = 0n;
  for (let i = 0; i < 8; i += 1) {
    const chunk = Number((expanded >> BigInt((7 - i) * 6)) & 0x3fn);
    const row = ((chunk & 0b100000) >> 4) | (chunk & 1);
    const col = (chunk >> 1) & 0b1111;
    sOut = (sOut << 4n) | BigInt(SBOX[i][row * 16 + col]!);
  }
  return permute(sOut, P, 32);
}

function scheduleKeys(key: bigint): bigint[] {
  const cd = permute(key, PC1, 64);
  let c = cd >> 28n;
  let d = cd & 0x0fffffffn;
  return SHIFTS.map((shift) => {
    c = rotateLeft28(c, shift);
    d = rotateLeft28(d, shift);
    return permute((c << 28n) | d, PC2, 56);
  });
}

function desBlock(block: bigint, keys: bigint[]): bigint {
  const permuted = permute(block, IP, 64);
  let left = permuted >> 32n;
  let right = permuted & 0xffffffffn;
  for (const key of keys) {
    const next = left ^ f(right, key);
    left = right;
    right = next;
  }
  return permute((right << 32n) | left, FP, 64);
}

function bytesToBlocks(bytes: Uint8Array): bigint[] {
  const padded = new Uint8Array(Math.ceil((bytes.length + 1) / 8) * 8);
  padded.set(bytes);
  const pad = padded.length - bytes.length;
  padded.fill(pad, bytes.length);
  const blocks: bigint[] = [];
  for (let i = 0; i < padded.length; i += 8) {
    let block = 0n;
    for (let j = 0; j < 8; j += 1) block = (block << 8n) | BigInt(padded[i + j]!);
    blocks.push(block);
  }
  return blocks;
}

function blockToBytes(block: bigint): Uint8Array {
  const out = new Uint8Array(8);
  for (let i = 7; i >= 0; i -= 1) {
    out[i] = Number(block & 0xffn);
    block >>= 8n;
  }
  return out;
}

function passphraseToKey(passphrase: string): bigint {
  const bytes = new TextEncoder().encode(passphrase);
  const key = new Uint8Array(8);
  for (let i = 0; i < 8; i += 1) {
    key[i] = (bytes[i % bytes.length] ?? 0) ^ i;
  }
  let value = 0n;
  for (const byte of key) value = (value << 8n) | BigInt(byte);
  return value;
}

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

export function desEncrypt(plaintext: string, passphrase: string): string {
  const keys = scheduleKeys(passphraseToKey(passphrase));
  const blocks = bytesToBlocks(new TextEncoder().encode(plaintext));
  const out = new Uint8Array(blocks.length * 8);
  blocks.forEach((block, index) => {
    out.set(blockToBytes(desBlock(block, keys)), index * 8);
  });
  return `DES:${bytesToBase64(out)}`;
}

export function desDecrypt(payload: string, passphrase: string): string {
  const body = payload.startsWith("DES:") ? payload.slice(4) : payload;
  const keys = scheduleKeys(passphraseToKey(passphrase)).reverse();
  const bytes = base64ToBytes(body);
  if (bytes.length === 0 || bytes.length % 8 !== 0) {
    throw new Error("Invalid DES ciphertext.");
  }
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i += 8) {
    let block = 0n;
    for (let j = 0; j < 8; j += 1) block = (block << 8n) | BigInt(bytes[i + j]!);
    out.set(blockToBytes(desBlock(block, keys)), i);
  }
  const pad = out[out.length - 1] ?? 0;
  if (pad < 1 || pad > 8) throw new Error("Invalid DES padding.");
  return new TextDecoder().decode(out.subarray(0, out.length - pad));
}
