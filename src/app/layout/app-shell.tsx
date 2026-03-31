import { Outlet } from "react-router-dom";

import { useApp } from "@/app/providers/app-provider";
import { MobileNavigation, Sidebar } from "@/app/layout/sidebar";
import { Topbar } from "@/app/layout/topbar";
import { SiteFooter } from "@/components/layout/site-footer";

export function AppShell() {
  const { settings } = useApp();

  return (
    <>
      <div className="container min-h-screen px-4 pb-28 pt-6 lg:px-6 lg:pb-8">
        <div className="flex items-start gap-6">
          <Sidebar keyReady={settings.hasApiKey} />
          <main className="min-w-0 flex-1">
            <Topbar />
            <Outlet />
            <SiteFooter />
          </main>
        </div>
      </div>
      <MobileNavigation />
    </>
  );
}
