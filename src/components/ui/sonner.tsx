"use client";

import { useSyncExternalStore } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function subscribeTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function Toaster(props: ToasterProps) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    () =>
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    () => "system",
  ) as ToasterProps["theme"];

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      {...props}
    />
  );
}

export { Toaster };
