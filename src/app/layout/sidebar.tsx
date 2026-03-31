import type { LucideIcon } from "lucide-react";
import { BarChart3, Inbox, MailPlus, Mails, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useApp } from "@/app/providers/app-provider";
import { LogoMark } from "@/components/logo-mark";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

function getNavigationItems(copy: ReturnType<typeof useApp>["copy"]) {
  return [
    {
      href: "/app/dashboard",
      label: copy.nav.dashboard,
      icon: BarChart3,
    },
    {
      href: "/app/inbox",
      label: copy.nav.inbox,
      icon: Inbox,
    },
    {
      href: "/app/compose",
      label: copy.nav.compose,
      icon: MailPlus,
    },
    {
      href: "/app/sent",
      label: copy.nav.sent,
      icon: Mails,
    },
    {
      href: "/app/settings",
      label: copy.nav.settings,
      icon: Settings,
    },
  ];
}

function NavigationLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary/75 hover:text-foreground",
          isActive && "bg-secondary text-foreground shadow-sm",
        )
      }
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </NavLink>
  );
}

export function Sidebar({ keyReady }: { keyReady: boolean }) {
  const { copy } = useApp();
  const navigationItems = getNavigationItems(copy);

  return (
    <aside className="hidden lg:block lg:w-[290px] lg:flex-none">
      <div className="sticky top-6 space-y-4">
        <Card className="overflow-hidden p-0">
          <div className="bg-hero-mesh p-6 dark:bg-hero-mesh-dark">
            <LogoMark subtitle={copy.common.tagline} />
          </div>
          <div className="space-y-2 p-4">
            {navigationItems.map((item) => (
              <NavigationLink key={item.href} {...item} />
            ))}
          </div>
        </Card>
        <Card className="space-y-3">
          <Badge variant={keyReady ? "success" : "warning"} className="w-fit">
            {keyReady ? copy.nav.readyToSend : copy.nav.needsApiKey}
          </Badge>
          <div>
            <p className="text-sm font-medium">{copy.nav.localWorkflowTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {copy.nav.localWorkflowDescription}
            </p>
          </div>
        </Card>
      </div>
    </aside>
  );
}

export function MobileNavigation() {
  const { copy } = useApp();
  const navigationItems = getNavigationItems(copy);

  return (
    <nav className="glass-panel fixed inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-[26px] px-3 py-2 lg:hidden">
      {navigationItems.map(({ href, icon: Icon, label }) => (
        <NavLink
          key={href}
          to={href}
          className={({ isActive }) =>
            cn(
              "flex min-w-[68px] flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium text-muted-foreground transition-colors",
              isActive && "bg-secondary text-foreground",
            )
          }
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
