import type { ToolConfig } from "@/types/tool";

export const passwordUuidConfig: ToolConfig = {
  slug: "password-uuid",
  category: "security",
  name: "Password & UUID Generator",
  shortName: "Secrets",
  description: "Generate cryptographically strong passwords and UUID v4 values with complexity filters.",
  seoTitle: "Secure Password & UUID v4 Generator",
  seoDescription:
    "Create CSPRNG passwords with length and character-class filters, plus RFC 4122 UUID v4 identifiers.",
  keywords: ["password generator", "uuid v4", "csprng", "random password"],
  executionTarget: "CLIENT",
  icon: "KeyRound",
  inputs: [{ id: "options", label: "Options", kind: "json" }],
  outputs: [{ id: "secret", label: "Generated value", kind: "text" }],
  sampleData: "20",
};
