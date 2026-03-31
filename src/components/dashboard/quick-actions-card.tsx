import { Link } from "react-router-dom";
import { ArrowUpRight, Inbox, MailPlus, RefreshCcw, Settings2 } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickActionsCard({
  onRefresh,
  refreshing,
}: {
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const { copy } = useApp();

  return (
    <Card className="h-full">
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.quickActions.title}</p>
        <CardTitle className="mt-2 text-balance">{copy.quickActions.description}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Button asChild size="lg" className="h-auto min-h-12 justify-between whitespace-normal px-4 py-3 text-left">
          <Link to="/app/compose">
            {copy.quickActions.newEmail}
            <MailPlus />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onRefresh}
          disabled={refreshing}
          className="h-auto min-h-12 justify-between whitespace-normal px-4 py-3 text-left"
        >
          {copy.quickActions.refresh}
          <RefreshCcw className={refreshing ? "animate-spin" : ""} />
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-auto min-h-12 justify-between whitespace-normal px-4 py-3 text-left"
        >
          <Link to="/app/inbox">
            {copy.quickActions.openInbox}
            <Inbox />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-auto min-h-12 justify-between whitespace-normal px-4 py-3 text-left"
        >
          <Link to="/app/settings">
            {copy.quickActions.settings}
            <Settings2 />
          </Link>
        </Button>
        <div className="rounded-3xl border border-border/80 bg-background/60 p-4 sm:col-span-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{copy.quickActions.futureTitle}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {copy.quickActions.futureDescription}
              </p>
            </div>
            <ArrowUpRight className="mt-1 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
