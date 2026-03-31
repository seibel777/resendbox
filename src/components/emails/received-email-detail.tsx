import { Clock3, Download, Inbox, Paperclip } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { EmptyState } from "@/components/empty-state";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAbsoluteDate, htmlToPlainText } from "@/lib/format";
import type { ReceivedEmailDetail } from "@/types/app";

export function ReceivedEmailDetailCard({
  email,
  loading,
}: {
  email: ReceivedEmailDetail | null;
  loading: boolean;
}) {
  const { copy, openExternal } = useApp();

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.inboxPage.detailTitle}</p>
          <CardTitle className="mt-2">{copy.inboxPage.detailDescription}</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingIndicator label={copy.inboxPage.detailLoading} />
        </CardContent>
      </Card>
    );
  }

  if (!email) {
    return (
      <Card className="h-full">
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.inboxPage.detailTitle}</p>
          <CardTitle className="mt-2">{copy.inboxPage.detailDescription}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Inbox}
            title={copy.inboxPage.detailEmptyTitle}
            description={copy.inboxPage.detailEmptyDescription}
          />
        </CardContent>
      </Card>
    );
  }

  const body = email.text?.trim() || htmlToPlainText(email.html);
  const headers = Object.entries(email.headers).sort(([left], [right]) => left.localeCompare(right));

  return (
    <Card className="h-full">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.inboxPage.detailTitle}</p>
            <CardTitle className="mt-2 text-balance break-words">{email.subject}</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{copy.inboxPage.detailDescription}</p>
          </div>
          {email.raw ? (
            <Button variant="outline" size="sm" onClick={() => void openExternal(email.raw?.downloadUrl ?? "")}>
              <Download />
              {copy.inboxPage.openRaw}
            </Button>
          ) : null}
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
              <Clock3 className="h-3.5 w-3.5" />
              {copy.inboxPage.receivedAtLabel}
            </div>
            <p className="mt-2 text-sm font-medium">{formatAbsoluteDate(email.createdAt)}</p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{copy.inboxPage.messageIdLabel}</p>
            <p className="mt-2 break-all text-sm font-medium">{email.messageId || copy.common.noData}</p>
          </div>
          {email.replyTo.length ? (
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{copy.inboxPage.replyToLabel}</p>
              <p className="mt-2 break-words text-sm font-medium">{email.replyTo.join(", ")}</p>
            </div>
          ) : null}
          {email.cc.length ? (
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{copy.inboxPage.ccLabel}</p>
              <p className="mt-2 break-words text-sm font-medium">{email.cc.join(", ")}</p>
            </div>
          ) : null}
          {email.bcc.length ? (
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{copy.inboxPage.bccLabel}</p>
              <p className="mt-2 break-words text-sm font-medium">{email.bcc.join(", ")}</p>
            </div>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">{copy.inboxPage.bodyTitle}</p>
            {email.attachmentsCount > 0 ? (
              <Badge variant="secondary">
                {email.attachmentsCount} {copy.list.attachments}
              </Badge>
            ) : null}
          </div>
          <div className="max-h-[360px] overflow-y-auto rounded-3xl border border-border/70 bg-background/60 p-4">
            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-6 text-foreground">
              {body || copy.inboxPage.noBody}
            </pre>
          </div>
        </div>

        {email.attachments.length ? (
          <div className="space-y-3">
            <p className="text-sm font-medium">{copy.inboxPage.attachmentsTitle}</p>
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
                  {attachment.size ? <Badge variant="secondary">{attachment.size} B</Badge> : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {headers.length ? (
          <div className="space-y-3">
            <p className="text-sm font-medium">{copy.inboxPage.headersTitle}</p>
            <div className="max-h-[240px] overflow-y-auto rounded-3xl border border-border/70 bg-background/60 p-4">
              <div className="space-y-3">
                {headers.map(([key, value]) => (
                  <div key={key} className="border-b border-border/60 pb-3 last:border-b-0 last:pb-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{key}</p>
                    <p className="mt-2 break-words text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
