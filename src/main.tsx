import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import { AppProvider } from "@/app/providers/app-provider";
import { router } from "@/app/router";
import { registerServiceWorker } from "@/lib/pwa";
import "@/styles.css";

function restoreRedirectedBrowserPath() {
  if (typeof window === "undefined") {
    return;
  }

  const currentUrl = new URL(window.location.href);
  const redirect = currentUrl.searchParams.get("redirect");

  if (!redirect) {
    return;
  }

  const targetUrl = new URL(redirect, window.location.origin);
  const basePath = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");
  let pathname = targetUrl.pathname;

  if (basePath && pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length) || "/";
  }

  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const nextUrl = `${basePath}${normalizedPath}${targetUrl.search}${targetUrl.hash}`;

  window.history.replaceState(null, "", nextUrl);
}

restoreRedirectedBrowserPath();
void registerServiceWorker();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast:
              "!border-border/80 !bg-card/95 !text-card-foreground !shadow-soft backdrop-blur-xl",
            title: "!font-medium",
            description: "!text-muted-foreground",
          },
        }}
      />
    </AppProvider>
  </React.StrictMode>,
);
