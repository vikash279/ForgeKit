/// <reference lib="es2020" />

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";

export function convertBase(value: string, from: number, to: number): string {
  if (from < 2 || from > 64 || to < 2 || to > 64) {
    throw new Error("Bases must be between 2 and 64.");
  }
  const trimmed = value.trim();
  if (!trimmed) throw new Error("Enter a value to convert.");
  const negative = trimmed.startsWith("-");
  const body = negative ? trimmed.slice(1) : trimmed;
  let decimal = 0n;
  for (const char of body) {
    const digit = BigInt(ALPHABET.indexOf(char));
    if (digit < 0n || digit >= BigInt(from)) {
      throw new Error(`Invalid digit "${char}" for base ${from}.`);
    }
    decimal = decimal * BigInt(from) + digit;
  }
  if (decimal === 0n) return negative ? "-0" : "0";
  const target = ALPHABET.slice(0, to);
  let out = "";
  let remaining = decimal;
  while (remaining > 0n) {
    const rem = Number(remaining % BigInt(to));
    out = target[rem] + out;
    remaining /= BigInt(to);
  }
  return negative ? `-${out}` : out;
}
