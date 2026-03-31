import { useDeferredValue, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { useApp } from "@/app/providers/app-provider";
import { EmailList } from "@/components/emails/email-list";
import { ReceivedEmailDetailCard } from "@/components/emails/received-email-detail";
import { PageTransition } from "@/components/page-transition";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { appBridge } from "@/services/app-bridge";
import type { ReceivedEmail, ReceivedEmailDetail } from "@/types/app";

export function InboxPage() {
  const { copy, receivedEmails, receivedNotice, refreshing } = useApp();
  const [query, setQuery] = useState("");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<ReceivedEmailDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const filtered = receivedEmails.filter((email) => {
    const search = deferredQuery.trim().toLowerCase();

    if (!search) {
      return true;
    }

    return email.subject.toLowerCase().includes(search) || email.from.toLowerCase().includes(search);
  });

  useEffect(() => {
    if (!filtered.length) {
      setSelectedEmailId(null);
      setSelectedEmail(null);
      return;
    }

    if (!selectedEmailId || !filtered.some((email) => email.id === selectedEmailId)) {
      setSelectedEmailId(filtered[0].id);
    }
  }, [filtered, selectedEmailId]);

  useEffect(() => {
    if (!selectedEmailId) {
      setSelectedEmail(null);
      return;
    }

    let cancelled = false;
    setLoadingDetail(true);

    void appBridge
      .getReceivedEmail(selectedEmailId)
      .then((email) => {
        if (!cancelled) {
          setSelectedEmail(email);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setSelectedEmail(null);
          toast.error(error instanceof Error ? error.message : copy.notificationsCopy.loadFailed);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingDetail(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [copy.notificationsCopy.loadFailed, selectedEmailId]);

  return (
    <PageTransition>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]">
        <Card>
          <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.inboxPage.section}</p>
              <CardTitle className="mt-2 text-balance">{copy.inboxPage.title}</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">{receivedNotice || copy.inboxPage.inboundHint}</p>
            </div>
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder={copy.inboxPage.searchPlaceholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {refreshing ? <LoadingIndicator label={copy.inboxPage.refreshing} /> : null}
            <EmailList
              variant="received"
              emails={filtered}
              emptyTitle={query ? copy.inboxPage.noMatchTitle : copy.inboxPage.emptyTitle}
              emptyDescription={query ? copy.inboxPage.noMatchDescription : copy.inboxPage.emptyDescription}
              selectedEmailId={selectedEmailId}
              onSelectEmail={(email) => setSelectedEmailId((email as ReceivedEmail).id)}
            />
          </CardContent>
        </Card>

        <ReceivedEmailDetailCard email={selectedEmail} loading={loadingDetail} />
      </div>
    </PageTransition>
  );
}
