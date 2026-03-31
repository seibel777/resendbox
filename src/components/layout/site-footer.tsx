import { ExternalLink } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { SITE_REPO_URL } from "@/lib/site";

export function SiteFooter() {
  const { copy, openExternal } = useApp();

  return (
    <footer className="mt-8 px-2 pb-2 text-center text-sm text-muted-foreground">
      <button
        type="button"
        onClick={() => void openExternal(SITE_REPO_URL)}
        className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/50 px-4 py-2 transition-colors hover:bg-secondary/70"
      >
        <span>{copy.common.madeBy}</span>
        <ExternalLink className="h-3.5 w-3.5" />
      </button>
    </footer>
  );
}
