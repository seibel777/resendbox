import { MailCheck } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { formatRelativeDate } from "@/lib/format";
import type { ReceivedEmail, SentEmail } from "@/types/app";

export function EmailList({
  emails,
  emptyTitle,
  emptyDescription,
  variant,
  onSelectEmail,
  selectedEmailId,
}: {
  emails: Array<SentEmail | ReceivedEmail>;
  emptyTitle: string;
  emptyDescription: string;
  variant: "sent" | "received";
  onSelectEmail?: (email: ReceivedEmail | SentEmail) => void;
  selectedEmailId?: string | null;
}) {
  const { copy } = useApp();

  if (!emails.length) {
    return (
      <EmptyState
        icon={MailCheck}
        title={emptyTitle}
        description={emptyDescription}
        ctaHref="/app/compose"
        ctaLabel={copy.list.writeNew}
      />
    );
  }

  return (
    <div className="space-y-3">
      {emails.map((email) => {
        const content = (
          <>
            <div className="min-w-0 space-y-1">
              <p className="break-words text-base font-medium leading-6">{email.subject}</p>
              <p className="break-words text-sm text-muted-foreground">
                {variant === "sent"
                  ? `${copy.list.toLabel}: ${email.to.join(", ")}`
                  : `${copy.list.fromLabel}: ${email.from}`}
              </p>
              <p className="break-words text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {variant === "sent" ? email.from : email.to.join(", ")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              {"status" in email ? (
                <Badge variant={email.status === "delivered" ? "success" : "secondary"}>{email.status}</Badge>
              ) : email.attachmentsCount > 0 ? (
                <Badge variant="secondary">
                  {email.attachmentsCount} {copy.list.attachments}
                </Badge>
              ) : null}
              <span className="text-sm text-muted-foreground">{formatRelativeDate(email.createdAt)}</span>
            </div>
          </>
        );

        return (
          <Card
            key={email.id}
            className={cn(
              "p-0 transition-colors",
              selectedEmailId === email.id && "border-primary/40 bg-primary/5",
            )}
          >
            {onSelectEmail ? (
              <button
                type="button"
                className="flex w-full flex-col gap-4 px-5 py-5 text-left md:flex-row md:items-center md:justify-between"
                onClick={() => onSelectEmail(email)}
                aria-label={variant === "received" ? copy.list.openEmail : undefined}
              >
                {content}
              </button>
            ) : (
              <div className="flex w-full flex-col gap-4 px-5 py-5 text-left md:flex-row md:items-center md:justify-between">
                {content}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
