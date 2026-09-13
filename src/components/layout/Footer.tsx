import { SITE_NAME } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t px-4 py-3 text-center text-[11px] text-muted-foreground">
      © {new Date().getFullYear()} {SITE_NAME}. All rights reserved. Privacy-first utilities that
      run in your browser.
    </footer>
  );
}
