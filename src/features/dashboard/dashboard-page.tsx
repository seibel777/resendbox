import {
  CircleCheckBig,
  Inbox,
  KeyRound,
  Mailbox,
  MailPlus,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useApp } from "@/app/providers/app-provider";
import { ActivityCard } from "@/components/dashboard/activity-card";
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageTransition } from "@/components/page-transition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function connectionCopy(state: ReturnType<typeof useApp>["connection"]["state"], copy: ReturnType<typeof useApp>["copy"]) {
  switch (state) {
    case "connected":
      return {
        value: copy.dashboard.live,
        title: copy.dashboard.connectedTitle,
        badge: { label: copy.dashboard.healthy, variant: "success" as const },
      };
    case "unauthorized":
      return {
        value: copy.dashboard.checkKey,
        title: copy.dashboard.unauthorizedTitle,
        badge: { label: copy.dashboard.attention, variant: "warning" as const },
      };
    case "offline":
      return {
        value: copy.dashboard.offline,
        title: copy.dashboard.offlineTitle,
        badge: { label: copy.dashboard.retryNeeded, variant: "danger" as const },
      };
    default:
      return {
        value: copy.dashboard.missing,
        title: copy.dashboard.missingTitle,
        badge: { label: copy.dashboard.setup, variant: "warning" as const },
      };
  }
}

export function DashboardPage() {
  const { connection, copy, receivedEmails, refreshing, refreshData, sentEmails, settings } = useApp();
  const connectionMeta = connectionCopy(connection.state, copy);

  return (
    <PageTransition>
      <section className="space-y-4">
        <div className="grid gap-4 xl:grid-cols-4">
          <div className="xl:col-span-2">
            <StatCard
              icon={ShieldCheck}
              eyebrow={copy.dashboard.apiStatus}
              value={connectionMeta.value}
              title={connectionMeta.title}
              description={connection.message}
              badge={connectionMeta.badge}
            />
          </div>
          <StatCard
            icon={Mailbox}
            eyebrow={copy.dashboard.recentSends}
            value={String(sentEmails.length).padStart(2, "0")}
            title={copy.dashboard.emailsInLatestSync}
            description={copy.dashboard.activityDescription}
          />
          <StatCard
            icon={Inbox}
            eyebrow={copy.dashboard.recentInbound}
            value={String(receivedEmails.length).padStart(2, "0")}
            title={copy.dashboard.inboxInLatestSync}
            description={copy.inboxPage.inboundHint}
          />
          <StatCard
            icon={KeyRound}
            eyebrow={copy.dashboard.storedKey}
            value={
              settings.keyPersistence === "device"
                ? copy.dashboard.saved
                : settings.keyPersistence === "session"
                  ? copy.dashboard.session
                  : copy.common.noData
            }
            title={copy.dashboard.keyPersistence}
            description={settings.apiKeyPreview || copy.dashboard.noActiveKey}
          />
          <StatCard
            icon={UserCircle2}
            eyebrow={copy.dashboard.defaultSender}
            value={settings.defaultSender ? copy.dashboard.ready : copy.dashboard.unset}
            title={settings.defaultSender || copy.dashboard.configureSender}
            description={copy.dashboard.senderPrefill}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          <div className="xl:col-span-2">
            <QuickActionsCard onRefresh={() => void refreshData()} refreshing={refreshing} />
          </div>
          <ActivityCard emails={sentEmails} />
          <Card className="h-full overflow-hidden p-0">
            <div className="flex h-full flex-col justify-between bg-gradient-to-br from-sky-500/15 via-transparent to-teal-500/15 p-6">
              <div className="space-y-3">
                <Badge variant="secondary" className="w-fit">
                  {copy.dashboard.primaryFlow}
                </Badge>
                <div>
                  <p className="font-display text-3xl font-bold tracking-tight text-balance">
                    {copy.dashboard.writeAndSend}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{copy.dashboard.composeDescription}</p>
                </div>
              </div>
              <Button
                asChild
                size="lg"
                className="mt-8 h-auto min-h-12 justify-between whitespace-normal px-5 py-3 text-left"
              >
                <Link to="/app/compose">
                  {copy.quickActions.newEmail}
                  <MailPlus />
                </Link>
              </Button>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.dashboard.atGlance}</p>
              <CardTitle className="mt-2 text-balance">{copy.dashboard.mvpCoverage}</CardTitle>
            </div>
            <Badge variant="success">{copy.dashboard.portfolioReady}</Badge>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <CircleCheckBig className="h-5 w-5 text-primary" />
              <p className="mt-4 text-sm font-medium">{copy.dashboard.nativeBridgeTitle}</p>
              <p className="mt-2 text-sm text-muted-foreground">{copy.dashboard.nativeBridgeDescription}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <CircleCheckBig className="h-5 w-5 text-primary" />
              <p className="mt-4 text-sm font-medium">{copy.dashboard.localPersistenceTitle}</p>
              <p className="mt-2 text-sm text-muted-foreground">{copy.dashboard.localPersistenceDescription}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <CircleCheckBig className="h-5 w-5 text-primary" />
              <p className="mt-4 text-sm font-medium">{copy.dashboard.growthTitle}</p>
              <p className="mt-2 text-sm text-muted-foreground">{copy.dashboard.growthDescription}</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageTransition>
  );
}
