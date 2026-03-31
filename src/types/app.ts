export type ThemeMode = "light" | "dark";
export type LanguageCode = "en" | "pt" | "es";

export type ConnectionState = "connected" | "unauthorized" | "missingKey" | "offline";

export type KeyPersistence = "device" | "session" | "none";

export interface AppSettings {
  hasApiKey: boolean;
  apiKeyPreview?: string | null;
  keyPersistence: KeyPersistence;
  rememberApiKey: boolean;
  defaultSender?: string | null;
  theme: ThemeMode;
  language: LanguageCode;
  notificationsEnabled: boolean;
}

export interface ConnectionStatus {
  state: ConnectionState;
  message: string;
}

export interface SentEmail {
  id: string;
  subject: string;
  to: string[];
  from: string;
  createdAt: string;
  status: string;
}

export interface ComposeAttachmentInput {
  filename: string;
  content: string;
  contentType: string;
  size: number;
}

export interface EmailAttachment {
  id: string;
  filename: string;
  contentType: string;
  contentDisposition?: string | null;
  contentId?: string | null;
  size?: number | null;
  downloadUrl?: string | null;
  expiresAt?: string | null;
}

export interface SentEmailDetail extends SentEmail {
  html?: string | null;
  text?: string | null;
  cc: string[];
  bcc: string[];
  replyTo: string[];
  scheduledAt?: string | null;
  attachments: EmailAttachment[];
}

export interface ReceivedEmail {
  id: string;
  subject: string;
  to: string[];
  from: string;
  createdAt: string;
  messageId?: string | null;
  attachmentsCount: number;
}

export interface ReceivedEmailAttachment {
  id: EmailAttachment["id"];
  filename: EmailAttachment["filename"];
  contentType: EmailAttachment["contentType"];
  contentDisposition?: EmailAttachment["contentDisposition"];
  contentId?: EmailAttachment["contentId"];
  size?: EmailAttachment["size"];
  downloadUrl?: EmailAttachment["downloadUrl"];
  expiresAt?: EmailAttachment["expiresAt"];
}

export interface EmailRawDownload {
  downloadUrl: string;
  expiresAt: string;
}

export interface ReceivedEmailDetail extends ReceivedEmail {
  html?: string | null;
  text?: string | null;
  headers: Record<string, string>;
  cc: string[];
  bcc: string[];
  replyTo: string[];
  raw?: EmailRawDownload | null;
  attachments: ReceivedEmailAttachment[];
}

export interface ComposeEmailInput {
  from: string;
  to: string;
  subject: string;
  text: string;
  attachments: ComposeAttachmentInput[];
}

export interface SendEmailResult {
  id: string;
}
