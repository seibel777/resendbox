import { Inbox, LoaderCircle } from "lucide-react";
import { Navigate, createBrowserRouter, createHashRouter } from "react-router-dom";

import { AppShell } from "@/app/layout/app-shell";
import { useApp } from "@/app/providers/app-provider";
import { EmptyState } from "@/components/empty-state";
import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { ComposePage } from "@/features/compose/compose-page";
import { InboxPage } from "@/features/inbox/inbox-page";
import { OnboardingPage } from "@/features/onboarding/onboarding-page";
import { SentPage } from "@/features/sent/sent-page";
import { SettingsPage } from "@/features/settings/settings-page";
import { isTauriRuntime } from "@/lib/runtime";

function FullScreenLoader() {
  const { copy } = useApp();

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-panel flex items-center gap-3 rounded-[28px] px-5 py-4">
        <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">{copy.common.preparing}</span>
      </div>
    </div>
  );
}

function RootRedirect() {
  const { booting, settings } = useApp();

  if (booting) {
    return <FullScreenLoader />;
  }

  return <Navigate to={settings.hasApiKey ? "/app/dashboard" : "/welcome"} replace />;
}

function ProtectedLayout() {
  const { booting, settings } = useApp();

  if (booting) {
    return <FullScreenLoader />;
  }

  if (!settings.hasApiKey) {
    return <Navigate to="/welcome" replace />;
  }

  return <AppShell />;
}

function NotFoundPage() {
  const { copy } = useApp();

  return (
    <div className="container min-h-screen px-4 py-10">
      <EmptyState
        icon={Inbox}
        title={copy.common.pageNotFound}
        description={`${copy.common.appName} could not find this route.`}
        ctaHref="/"
        ctaLabel={copy.common.backHome}
      />
    </div>
  );
}

const routes = [
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/welcome",
    element: <OnboardingPage />,
  },
  {
    path: "/app",
    element: <ProtectedLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "inbox",
        element: <InboxPage />,
      },
      {
        path: "compose",
        element: <ComposePage />,
      },
      {
        path: "sent",
        element: <SentPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export const router = isTauriRuntime()
  ? createHashRouter(routes)
  : createBrowserRouter(routes, {
      basename: import.meta.env.BASE_URL,
    });
