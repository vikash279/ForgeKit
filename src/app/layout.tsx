import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — privacy-first webmaster utilities`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full" suppressHydrationWarning>
        <Script id="strip-extension-attrs" strategy="beforeInteractive">
          {`(function(){function strip(root){root.querySelectorAll("[fdprocessedid],[bis_skin_checked]").forEach(function(el){el.removeAttribute("fdprocessedid");el.removeAttribute("bis_skin_checked")})}strip(document.documentElement);new MutationObserver(function(records){for(var i=0;i<records.length;i++){var rec=records[i];if(rec.type==="attributes"&&rec.target.removeAttribute){rec.target.removeAttribute("fdprocessedid");rec.target.removeAttribute("bis_skin_checked")}if(rec.addedNodes){rec.addedNodes.forEach(function(node){if(node.nodeType===1)strip(node)})}}}).observe(document.documentElement,{attributes:true,attributeFilter:["fdprocessedid","bis_skin_checked"],childList:true,subtree:true})})();`}
        </Script>
        <ThemeProvider>
          <TooltipProvider>
            <AppShell>{children}</AppShell>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
