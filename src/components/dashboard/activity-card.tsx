import { Link } from "react-router-dom";
import { ArrowUpRight, Clock3 } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeDate } from "@/lib/format";
import type { SentEmail } from "@/types/app";

export function ActivityCard({ emails }: { emails: SentEmail[] }) {
  const { copy } = useApp();

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.dashboard.recentSends}</p>
          <CardTitle className="mt-2 text-balance">{copy.dashboard.activityTitle}</CardTitle>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to="/app/sent">
            {copy.common.sent}
            <ArrowUpRight />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {emails.length ? (
          emails.slice(0, 4).map((email) => (
            <div
              key={email.id}
              className="flex items-start justify-between gap-3 rounded-3xl border border-border/70 bg-background/60 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="break-words text-sm font-medium">{email.subject}</p>
                <p className="break-words text-sm text-muted-foreground">{email.to.join(", ")}</p>
              </div>
              <div className="space-y-2 text-right">
                <Badge variant={email.status === "delivered" ? "success" : "secondary"}>{email.status}</Badge>
                <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />
                  {formatRelativeDate(email.createdAt)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-border/80 bg-background/40 px-4 py-8 text-center text-sm text-muted-foreground">
            {copy.dashboard.noRecentActivity}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
