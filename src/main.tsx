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
