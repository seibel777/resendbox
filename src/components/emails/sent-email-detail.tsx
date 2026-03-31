import { CalendarClock, Download, MailCheck, Paperclip } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { EmptyState } from "@/components/empty-state";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAbsoluteDate, formatBytes, htmlToPlainText } from "@/lib/format";
import type { SentEmailDetail } from "@/types/app";

export function SentEmailDetailCard({
  email,
  loading,
}: {
  email: SentEmailDetail | null;
  loading: boolean;
}) {
  const { copy, openExternal } = useApp();

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.sentPage.detailTitle}</p>
          <CardTitle className="mt-2">{copy.sentPage.detailDescription}</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingIndicator label={copy.sentPage.detailLoading} />
        </CardContent>
      </Card>
    );
  }

  if (!email) {
    return (
      <Card className="h-full">
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.sentPage.detailTitle}</p>
          <CardTitle className="mt-2">{copy.sentPage.detailDescription}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={MailCheck}
            title={copy.sentPage.detailEmptyTitle}
            description={copy.sentPage.detailEmptyDescription}
          />
        </CardContent>
      </Card>
    );
  }

  const body = email.text?.trim() || htmlToPlainText(email.html);

  return (
    <Card className="h-full">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.sentPage.detailTitle}</p>
            <CardTitle className="mt-2 text-balance break-words">{email.subject}</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{copy.sentPage.detailDescription}</p>
          </div>
          <Badge variant={email.status === "delivered" ? "success" : "secondary"}>{email.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{copy.list.fromLabel}</p>
            <p className="mt-2 break-words text-sm font-medium">{email.from}</p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{copy.list.toLabel}</p>
            <p className="mt-2 break-words text-sm font-medium">{email.to.join(", ")}</p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              {copy.sentPage.sentAtLabel}
            </div>
            <p className="mt-2 text-sm font-medium">{formatAbsoluteDate(email.createdAt)}</p>
          </div>
          {email.scheduledAt ? (
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{copy.sentPage.scheduledAtLabel}</p>
              <p className="mt-2 text-sm font-medium">{formatAbsoluteDate(email.scheduledAt)}</p>
            </div>
          ) : null}
          {email.replyTo.length ? (
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{copy.sentPage.replyToLabel}</p>
              <p className="mt-2 break-words text-sm font-medium">{email.replyTo.join(", ")}</p>
            </div>
          ) : null}
          {email.cc.length ? (
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{copy.sentPage.ccLabel}</p>
              <p className="mt-2 break-words text-sm font-medium">{email.cc.join(", ")}</p>
            </div>
          ) : null}
          {email.bcc.length ? (
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{copy.sentPage.bccLabel}</p>
              <p className="mt-2 break-words text-sm font-medium">{email.bcc.join(", ")}</p>
            </div>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">{copy.sentPage.bodyTitle}</p>
            {email.attachments.length ? (
              <Badge variant="secondary">
                {email.attachments.length} {copy.list.attachments}
              </Badge>
            ) : null}
          </div>
          <div className="max-h-[360px] overflow-y-auto rounded-3xl border border-border/70 bg-background/60 p-4">
            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-6 text-foreground">
              {body || copy.sentPage.noBody}
            </pre>
          </div>
        </div>

        {email.attachments.length ? (
          <div className="space-y-3">
            <p className="text-sm font-medium">{copy.sentPage.attachmentsTitle}</p>
            <div className="grid gap-3">
              {email.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-start justify-between gap-3 rounded-3xl border border-border/70 bg-background/60 p-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-primary" />
                      <p className="truncate text-sm font-medium">{attachment.filename}</p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{attachment.contentType}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {attachment.size ? <Badge variant="secondary">{formatBytes(attachment.size)}</Badge> : null}
                    {attachment.downloadUrl ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void openExternal(attachment.downloadUrl ?? "")}
                      >
                        <Download />
                        {copy.sentPage.downloadAttachment}
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
