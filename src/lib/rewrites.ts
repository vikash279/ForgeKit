export function htaccessToNginx(source: string): string {
  const lines = source.split(/\r?\n/);
  const out: string[] = ["server {", "    # Generated from Apache rewrite rules", "    listen 80;"];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || /^RewriteEngine/i.test(line)) continue;
    const cond = line.match(/^RewriteCond\s+%\{HTTPS\}\s+!=on/i);
    if (cond) {
      out.push("    if ($scheme = http) { return 301 https://$host$request_uri; }");
      continue;
    }
    const rule = line.match(/^RewriteRule\s+(\S+)\s+(\S+)\s*\[([^\]]*)\]?/i);
    if (!rule) {
      out.push(`    # Untranslated: ${line}`);
      continue;
    }
    const pattern = rule[1]!.replace(/^\^/, "^").replace(/\$$/, "$");
    const target = rule[2]!.replace("%{HTTP_HOST}", "$host").replace("%{REQUEST_URI}", "$request_uri");
    const flags = (rule[3] ?? "").toUpperCase();
    if (flags.includes("R=301") || flags.includes("R=Permanent")) {
      out.push(`    rewrite ${pattern} ${target} permanent;`);
    } else if (flags.includes("R=")) {
      out.push(`    rewrite ${pattern} ${target} redirect;`);
    } else {
      out.push(`    rewrite ${pattern} ${target} last;`);
    }
  }
  out.push("}");
  return out.join("\n");
}

export function nginxToHtaccess(source: string): string {
  const out = ["RewriteEngine On"];
  for (const raw of source.split(/\r?\n/)) {
    const line = raw.trim();
    const rewrite = line.match(/^rewrite\s+(\S+)\s+(\S+)\s*(permanent|redirect|last|break)?;/i);
    if (!rewrite) continue;
    const flags =
      rewrite[3] === "permanent" ? "[L,R=301]" : rewrite[3] === "redirect" ? "[L,R=302]" : "[L]";
    out.push(`RewriteRule ${rewrite[1]} ${rewrite[2]} ${flags}`);
  }
  return out.join("\n");
}
