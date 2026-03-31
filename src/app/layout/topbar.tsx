import { MoonStar, RefreshCcw, SunMedium } from "lucide-react";
import { useLocation } from "react-router-dom";

import { useApp } from "@/app/providers/app-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function getConnectionVariant(state: ReturnType<typeof useApp>["connection"]["state"]) {
  if (state === "connected") {
    return "success";
  }

  if (state === "missingKey") {
    return "warning";
  }

  return "danger";
}

export function Topbar() {
  const location = useLocation();
  const { connection, copy, refreshing, refreshData, settings, updatePreferences } = useApp();
  const pageLabels: Record<string, string> = {
    "/app/dashboard": copy.topbar.overview,
    "/app/compose": copy.topbar.compose,
    "/app/sent": copy.topbar.sent,
    "/app/inbox": copy.topbar.inbox,
    "/app/settings": copy.topbar.settings,
  };

  return (
    <header className="glass-panel sticky top-4 z-20 mb-6 flex items-center justify-between gap-4 rounded-[28px] px-5 py-4">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{copy.common.appName}</p>
        <h1 className="font-display text-2xl font-bold tracking-tight text-balance">
          {pageLabels[location.pathname] ?? copy.topbar.workspace}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={getConnectionVariant(connection.state)} className="hidden max-w-[18rem] truncate sm:inline-flex">
          {connection.state === "connected" ? copy.common.apiConnected : connection.message}
        </Badge>
        <Button
          variant="outline"
          size="icon"
          onClick={() => void refreshData()}
          disabled={refreshing}
          aria-label={copy.common.refresh}
        >
          <RefreshCcw className={refreshing ? "animate-spin" : ""} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            void updatePreferences({
              theme: settings.theme === "dark" ? "light" : "dark",
            })
          }
          aria-label={copy.common.theme}
        >
          {settings.theme === "dark" ? <SunMedium /> : <MoonStar />}
        </Button>
      </div>
    </header>
  );
}
