import { FileText, ShieldEllipsis } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { EmailComposeForm } from "@/components/emails/email-compose-form";
import { PageTransition } from "@/components/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ComposePage() {
  const { copy, sendEmail, sending, settings } = useApp();

  return (
    <PageTransition>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.55fr]">
        <EmailComposeForm
          defaultFrom={settings.defaultSender}
          pending={sending}
          onSubmit={async (payload) => {
            await sendEmail(payload);
          }}
        />
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.composePage.noteSection}</p>
              <CardTitle className="mt-2">{copy.composePage.noteTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                <ShieldEllipsis className="h-5 w-5 text-primary" />
                <p className="mt-4 text-sm font-medium">{copy.composePage.noteSecurityTitle}</p>
                <p className="mt-2 text-sm text-muted-foreground">{copy.composePage.noteSecurityDescription}</p>
              </div>
              <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                <FileText className="h-5 w-5 text-primary" />
                <p className="mt-4 text-sm font-medium">{copy.composePage.notePlainTextTitle}</p>
                <p className="mt-2 text-sm text-muted-foreground">{copy.composePage.notePlainTextDescription}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
