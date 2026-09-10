import type { ToolConfig } from "@/types/tool";

export const nginxHtaccessConfig: ToolConfig = {
  slug: "nginx-htaccess",
  category: "development",
  name: "Nginx & .htaccess Converter",
  shortName: "Rewrites",
  description: "Translate Apache RewriteRule blocks into Nginx rewrite/return directives and back.",
  seoTitle: "Apache .htaccess to Nginx Rewrite Converter",
  seoDescription:
    "Convert Apache RewriteRule / RewriteCond snippets into Nginx rewrite configuration, and translate common Nginx rules back.",
  keywords: ["htaccess to nginx", "rewrite rule", "apache nginx converter"],
  executionTarget: "CLIENT",
  icon: "Server",
  inputs: [{ id: "rules", label: "Rewrite rules", kind: "code" }],
  outputs: [{ id: "converted", label: "Converted config", kind: "code" }],
  sampleData: `RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
RewriteRule ^blog/([0-9]+)/?$ /index.php?id=$1 [QSA,L]`,
};
