import { useEffect, useRef, useState, type FormEvent } from "react";
import { LoaderCircle, Paperclip, SendHorizonal, X } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatBytes } from "@/lib/format";
import { isValidMailbox, splitRecipients } from "@/lib/validators";
import type { ComposeEmailInput } from "@/types/app";

const MAX_TOTAL_ATTACHMENT_SIZE = 28 * 1024 * 1024;

function validate(payload: ComposeEmailInput, copy: ReturnType<typeof useApp>["copy"]) {
  if (!payload.from.trim() || !payload.to.trim() || !payload.subject.trim() || !payload.text.trim()) {
    return copy.composePage.validationFill;
  }

  if (!isValidMailbox(payload.from)) {
    return copy.composePage.validationFrom;
  }

  const recipients = splitRecipients(payload.to);

  if (!recipients.length || recipients.some((item) => !isValidMailbox(item))) {
    return copy.composePage.validationTo;
  }

  const totalSize = payload.attachments.reduce((sum, attachment) => sum + attachment.size, 0);

  if (totalSize > MAX_TOTAL_ATTACHMENT_SIZE) {
    return copy.composePage.attachmentsTooLarge;
  }

  return null;
}

async function fileToBase64(file: File) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return btoa(binary);
}

export function EmailComposeForm({
  defaultFrom,
  pending,
  onSubmit,
}: {
  defaultFrom?: string | null;
  pending: boolean;
  onSubmit: (payload: ComposeEmailInput) => Promise<void>;
}) {
  const { copy } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<ComposeEmailInput>({
    from: defaultFrom?.trim() || "",
    to: "",
    subject: "",
    text: "",
    attachments: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [readingAttachments, setReadingAttachments] = useState(false);

  useEffect(() => {
    if (defaultFrom?.trim()) {
      setForm((current) => ({
        ...current,
        from: current.from || defaultFrom,
      }));
    }
  }, [defaultFrom]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextError = validate(form, copy);
    setError(nextError);

    if (nextError) {
      return;
    }

    await onSubmit(form);

    setForm((current) => ({
      ...current,
      to: "",
      subject: "",
      text: "",
      attachments: [],
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError(null);
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    setReadingAttachments(true);

    try {
      const nextAttachments = await Promise.all(
        Array.from(files).map(async (file) => ({
          filename: file.name,
          content: await fileToBase64(file),
          contentType: file.type || "application/octet-stream",
          size: file.size,
        })),
      );

      setForm((current) => ({
        ...current,
        attachments: [
          ...current.attachments,
          ...nextAttachments.filter(
            (attachment) =>
              !current.attachments.some(
                (existing) =>
                  existing.filename === attachment.filename &&
                  existing.size === attachment.size &&
                  existing.content === attachment.content,
              ),
          ),
        ],
      }));
    } finally {
      setReadingAttachments(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function removeAttachment(targetFilename: string, targetSize: number) {
    setForm((current) => ({
      ...current,
      attachments: current.attachments.filter(
        (attachment) => !(attachment.filename === targetFilename && attachment.size === targetSize),
      ),
    }));
  }

  return (
    <Card>
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.composePage.section}</p>
        <CardTitle className="mt-2">{copy.composePage.title}</CardTitle>
        <CardDescription>{copy.composePage.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="from">{copy.composePage.from}</Label>
              <Input
                id="from"
                placeholder={copy.composePage.fromPlaceholder}
                value={form.from}
                onChange={(event) => setForm((current) => ({ ...current, from: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">{copy.composePage.to}</Label>
              <Input
                id="to"
                placeholder={copy.composePage.toPlaceholder}
                value={form.to}
                onChange={(event) => setForm((current) => ({ ...current, to: event.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">{copy.composePage.subject}</Label>
            <Input
              id="subject"
              placeholder={copy.composePage.subjectPlaceholder}
              value={form.subject}
              onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">{copy.composePage.content}</Label>
            <Textarea
              id="message"
              placeholder={copy.composePage.contentPlaceholder}
              value={form.text}
              onChange={(event) => setForm((current) => ({ ...current, text: event.target.value }))}
            />
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Label htmlFor="attachments">{copy.composePage.attachments}</Label>
                <p className="mt-1 text-sm text-muted-foreground">{copy.composePage.attachmentsHint}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={pending || readingAttachments}
              >
                <Paperclip />
                {copy.composePage.attachments}
              </Button>
            </div>
            <Input
              ref={fileInputRef}
              id="attachments"
              type="file"
              multiple
              className="hidden"
              onChange={(event) => void handleFiles(event.target.files)}
            />
            {form.attachments.length ? (
              <div className="grid gap-3">
                {form.attachments.map((attachment) => (
                  <div
                    key={`${attachment.filename}-${attachment.size}`}
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
                      <Badge variant="secondary">{formatBytes(attachment.size)}</Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => removeAttachment(attachment.filename, attachment.size)}
                        aria-label={copy.composePage.removeAttachment}
                      >
                        <X />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border/70 bg-background/40 px-4 py-5 text-sm text-muted-foreground">
                {copy.composePage.attachmentsEmpty}
              </div>
            )}
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" size="lg" disabled={pending || readingAttachments} className="w-full sm:w-auto">
            {pending ? <LoaderCircle className="animate-spin" /> : <SendHorizonal />}
            {pending ? copy.composePage.sending : copy.composePage.send}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
