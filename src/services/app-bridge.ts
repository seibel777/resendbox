import { invoke } from "@tauri-apps/api/core";
import { openUrl } from "@tauri-apps/plugin-opener";

import { getInitialLanguage } from "@/lib/copy";
import { maskApiKey } from "@/lib/format";
import { isTauriRuntime } from "@/lib/runtime";
import type {
  AppSettings,
  ComposeAttachmentInput,
  ComposeEmailInput,
  ConnectionStatus,
  EmailAttachment,
  LanguageCode,
  ReceivedEmail,
  ReceivedEmailDetail,
  SendEmailResult,
  SentEmail,
  SentEmailDetail,
  ThemeMode,
} from "@/types/app";

export type AppEnvironment = "tauri" | "browser";

interface UpdatePreferencesInput {
  defaultSender?: string | null;
  theme?: ThemeMode;
  language?: LanguageCode;
  notificationsEnabled?: boolean;
}

interface BrowserStore {
  persistedApiKey?: string | null;
  settings: AppSettings;
}

interface ApiListResponse<T> {
  data: T[];
}

interface SentApiRecord {
  id: string;
  subject: string;
  to: string[];
  from: string;
  created_at: string;
  last_event?: string | null;
}

interface AttachmentApiRecord {
  id: string;
  filename?: string | null;
  size?: number | null;
  content_type?: string | null;
  content_disposition?: string | null;
  content_id?: string | null;
  download_url?: string | null;
  expires_at?: string | null;
}

interface SentEmailDetailApiRecord extends SentApiRecord {
  html?: string | null;
  text?: string | null;
  cc?: string[];
  bcc?: string[];
  reply_to?: string[];
  scheduled_at?: string | null;
}

interface ReceivedApiRecord {
  id: string;
  subject: string;
  to: string[];
  from: string;
  created_at: string;
  message_id?: string | null;
  attachments?: Array<{ id: string }>;
}

interface ReceivedEmailDetailApiRecord extends ReceivedApiRecord {
  html?: string | null;
  text?: string | null;
  headers?: Record<string, string>;
  cc?: string[];
  bcc?: string[];
  reply_to?: string[];
  raw?: {
    download_url: string;
    expires_at: string;
  } | null;
  attachments?: Array<{
    id: string;
    filename?: string | null;
    content_type?: string | null;
    content_disposition?: string | null;
    content_id?: string | null;
    size?: number | null;
  }>;
}

interface ApiErrorBody {
  message?: string;
  error?: string;
  name?: string;
  statusCode?: number;
}

const appEnvironment: AppEnvironment = isTauriRuntime() ? "tauri" : "browser";
const BROWSER_STORAGE_KEY = "resendbox:web-store";
const BROWSER_SESSION_API_KEY = "resendbox:web-session-api-key";
const RESEND_API_BASE_URL = "https://api.resend.com";
const HOSTED_PROXY_BASE_URL =
  typeof window !== "undefined" && window.location.hostname.endsWith(".vercel.app") ? "/api/resend" : "";
const PROXY_BASE_URL = (import.meta.env.VITE_RESENDBOX_PROXY_BASE_URL || HOSTED_PROXY_BASE_URL).replace(/\/$/, "");
const DEV_PROXY_BASE_URL = "/api/resend";
const UNAUTHORIZED_PREFIX = "RESENDBOX_UNAUTHORIZED:";

function ensureArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function ensureStringArray(value: string[] | string | null | undefined): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return [value.trim()];
  }

  return [];
}

function ensureRecord(value: Record<string, string> | null | undefined): Record<string, string> {
  if (!value || Array.isArray(value) || typeof value !== "object") {
    return {};
  }

  return value;
}

function ensureApiListData<T>(response: ApiListResponse<T> | null | undefined): T[] {
  return Array.isArray(response?.data) ? response.data : [];
}

function buildDefaultSettings(): AppSettings {
  return {
    hasApiKey: false,
    apiKeyPreview: null,
    keyPersistence: "none",
    rememberApiKey: false,
    defaultSender: "",
    theme: "dark",
    language: getInitialLanguage(),
    notificationsEnabled: false,
  };
}

function readBrowserStore(): BrowserStore {
  const serialized = localStorage.getItem(BROWSER_STORAGE_KEY);

  if (!serialized) {
    const store = {
      settings: buildDefaultSettings(),
      persistedApiKey: null,
    };
    localStorage.setItem(BROWSER_STORAGE_KEY, JSON.stringify(store));
    return store;
  }

  try {
    const parsed = JSON.parse(serialized) as BrowserStore;
    return {
      persistedApiKey: parsed.persistedApiKey ?? null,
      settings: {
        ...buildDefaultSettings(),
        ...parsed.settings,
      },
    };
  } catch {
    const store = {
      settings: buildDefaultSettings(),
      persistedApiKey: null,
    };
    localStorage.setItem(BROWSER_STORAGE_KEY, JSON.stringify(store));
    return store;
  }
}

function writeBrowserStore(store: BrowserStore) {
  localStorage.setItem(BROWSER_STORAGE_KEY, JSON.stringify(store));
}

function getBrowserApiKey() {
  const sessionKey = sessionStorage.getItem(BROWSER_SESSION_API_KEY);

  if (sessionKey?.trim()) {
    return sessionKey.trim();
  }

  return readBrowserStore().persistedApiKey?.trim() || null;
}

function saveBrowserApiKey(apiKey: string, remember: boolean) {
  const trimmed = apiKey.trim();
  const store = readBrowserStore();

  if (remember) {
    store.persistedApiKey = trimmed;
    sessionStorage.removeItem(BROWSER_SESSION_API_KEY);
  } else {
    store.persistedApiKey = null;
    sessionStorage.setItem(BROWSER_SESSION_API_KEY, trimmed);
  }

  store.settings = {
    ...store.settings,
    hasApiKey: Boolean(trimmed),
    apiKeyPreview: trimmed ? maskApiKey(trimmed) : null,
    keyPersistence: remember ? "device" : "session",
    rememberApiKey: remember,
  };

  writeBrowserStore(store);
  return store.settings;
}

function resolveBrowserSettings() {
  const store = readBrowserStore();
  const apiKey = getBrowserApiKey();

  return {
    store,
    settings: {
      ...store.settings,
      hasApiKey: Boolean(apiKey),
      apiKeyPreview: apiKey ? maskApiKey(apiKey) : null,
      keyPersistence: apiKey ? (store.persistedApiKey ? "device" : "session") : "none",
      rememberApiKey: Boolean(store.persistedApiKey),
    } satisfies AppSettings,
  };
}

function normalizeSent(email: SentApiRecord): SentEmail {
  return {
    id: email.id,
    subject: email.subject || "(No subject)",
    to: ensureStringArray(email.to),
    from: email.from || "",
    createdAt: email.created_at,
    status: email.last_event || "queued",
  };
}

function normalizeAttachment(attachment: AttachmentApiRecord): EmailAttachment {
  return {
    id: attachment.id,
    filename: attachment.filename || "attachment",
    contentType: attachment.content_type || "application/octet-stream",
    contentDisposition: attachment.content_disposition ?? null,
    contentId: attachment.content_id ?? null,
    size: attachment.size ?? null,
    downloadUrl: attachment.download_url ?? null,
    expiresAt: attachment.expires_at ?? null,
  };
}

function normalizeSentDetail(email: SentEmailDetailApiRecord, attachments: AttachmentApiRecord[]): SentEmailDetail {
  return {
    ...normalizeSent(email),
    html: email.html ?? null,
    text: email.text ?? null,
    cc: ensureStringArray(email.cc),
    bcc: ensureStringArray(email.bcc),
    replyTo: ensureStringArray(email.reply_to),
    scheduledAt: email.scheduled_at ?? null,
    attachments: ensureArray(attachments).map(normalizeAttachment),
  };
}

function normalizeReceived(email: ReceivedApiRecord): ReceivedEmail {
  return {
    id: email.id,
    subject: email.subject || "(No subject)",
    to: ensureStringArray(email.to),
    from: email.from || "",
    createdAt: email.created_at,
    messageId: email.message_id ?? null,
    attachmentsCount: ensureArray(email.attachments).length,
  };
}

function normalizeReceivedDetail(email: ReceivedEmailDetailApiRecord): ReceivedEmailDetail {
  const attachments = ensureArray(email.attachments).map((attachment) => ({
    id: attachment.id,
    filename: attachment.filename || "attachment",
    contentType: attachment.content_type || "application/octet-stream",
    contentDisposition: attachment.content_disposition ?? null,
    contentId: attachment.content_id ?? null,
    size: attachment.size ?? null,
  }));

  return {
    ...normalizeReceived(email),
    html: email.html ?? null,
    text: email.text ?? null,
    headers: ensureRecord(email.headers),
    cc: ensureStringArray(email.cc),
    bcc: ensureStringArray(email.bcc),
    replyTo: ensureStringArray(email.reply_to),
    raw: email.raw
      ? {
          downloadUrl: email.raw.download_url,
          expiresAt: email.raw.expires_at,
        }
      : null,
    attachments,
    attachmentsCount: attachments.length,
  };
}

function resolveBrowserApiBaseUrl() {
  if (PROXY_BASE_URL) {
    return PROXY_BASE_URL;
  }

  if (import.meta.env.DEV) {
    return DEV_PROXY_BASE_URL;
  }

  return RESEND_API_BASE_URL;
}

async function parseApiError(response: Response) {
  const fallback = `Resend request failed with status ${response.status}.`;

  try {
    const body = (await response.json()) as ApiErrorBody;
    return body.message || body.error || body.name || fallback;
  } catch {
    try {
      const body = await response.text();
      return body || fallback;
    } catch {
      return fallback;
    }
  }
}

async function fetchResendJson<T>(path: string, apiKey: string, init?: RequestInit) {
  const target = `${resolveBrowserApiBaseUrl()}${path}`;

  try {
    const response = await fetch(target, {
      ...init,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    if (response.status === 401 || response.status === 403) {
      throw new Error(`${UNAUTHORIZED_PREFIX}${await parseApiError(response)}`);
    }

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error) {
      const normalized = error.message.replace(UNAUTHORIZED_PREFIX, "").trim();

      if (!/failed to fetch|networkerror|load failed/i.test(normalized) && normalized) {
        throw error;
      }
    }

    throw new Error("Unable to reach Resend right now. Check your connection and try again.");
  }
}

const browserBridge = {
  environment: "browser" as const,

  async loadSettings() {
    return resolveBrowserSettings().settings;
  },

  async saveApiKey(apiKey: string, remember: boolean) {
    const trimmed = apiKey.trim();

    if (!trimmed) {
      throw new Error("The API key cannot be empty.");
    }

    return saveBrowserApiKey(trimmed, remember);
  },

  async updatePreferences(input: UpdatePreferencesInput) {
    const { store } = resolveBrowserSettings();
    store.settings = {
      ...store.settings,
      ...(input.defaultSender !== undefined ? { defaultSender: input.defaultSender } : {}),
      ...(input.theme !== undefined ? { theme: input.theme } : {}),
      ...(input.language !== undefined ? { language: input.language } : {}),
      ...(input.notificationsEnabled !== undefined ? { notificationsEnabled: input.notificationsEnabled } : {}),
    };
    writeBrowserStore(store);
    return resolveBrowserSettings().settings;
  },

  async removeApiKey() {
    const { store } = resolveBrowserSettings();
    store.persistedApiKey = null;
    store.settings = {
      ...store.settings,
      hasApiKey: false,
      apiKeyPreview: null,
      keyPersistence: "none",
      rememberApiKey: false,
    };
    sessionStorage.removeItem(BROWSER_SESSION_API_KEY);
    writeBrowserStore(store);
    return store.settings;
  },

  async clearLocalData() {
    localStorage.removeItem(BROWSER_STORAGE_KEY);
    sessionStorage.removeItem(BROWSER_SESSION_API_KEY);
    return buildDefaultSettings();
  },

  async verifyConnection() {
    const apiKey = getBrowserApiKey();

    if (!apiKey) {
      return {
        state: "missingKey",
        message: "Add your Resend API key to connect.",
      } satisfies ConnectionStatus;
    }

    try {
      await fetchResendJson<ApiListResponse<SentApiRecord>>("/emails?limit=1", apiKey);
      return {
        state: "connected",
        message: "Connected to the Resend API.",
      } satisfies ConnectionStatus;
    } catch (error) {
      const message =
        error instanceof Error ? error.message.replace(UNAUTHORIZED_PREFIX, "") : "Could not reach Resend.";
      return {
        state: error instanceof Error && error.message.startsWith(UNAUTHORIZED_PREFIX) ? "unauthorized" : "offline",
        message,
      } satisfies ConnectionStatus;
    }
  },

  async listSentEmails(limit = 20) {
    const apiKey = getBrowserApiKey();

    if (!apiKey) {
      throw new Error("Add a Resend API key before continuing.");
    }

    const response = await fetchResendJson<ApiListResponse<SentApiRecord>>(`/emails?limit=${limit}`, apiKey);
    return ensureApiListData(response).map(normalizeSent);
  },

  async listReceivedEmails(limit = 20) {
    const apiKey = getBrowserApiKey();

    if (!apiKey) {
      throw new Error("Add a Resend API key before continuing.");
    }

    const response = await fetchResendJson<ApiListResponse<ReceivedApiRecord>>(`/emails/receiving?limit=${limit}`, apiKey);
    return ensureApiListData(response).map(normalizeReceived);
  },

  async getSentEmail(emailId: string) {
    const apiKey = getBrowserApiKey();

    if (!apiKey) {
      throw new Error("Add a Resend API key before continuing.");
    }

    const [email, attachments] = await Promise.all([
      fetchResendJson<SentEmailDetailApiRecord>(`/emails/${emailId}`, apiKey),
      fetchResendJson<ApiListResponse<AttachmentApiRecord>>(`/emails/${emailId}/attachments`, apiKey).catch(() => ({
        data: [] as AttachmentApiRecord[],
      })),
    ]);

    return normalizeSentDetail(email, ensureApiListData(attachments));
  },

  async getReceivedEmail(emailId: string) {
    const apiKey = getBrowserApiKey();

    if (!apiKey) {
      throw new Error("Add a Resend API key before continuing.");
    }

    const response = await fetchResendJson<ReceivedEmailDetailApiRecord>(`/emails/receiving/${emailId}`, apiKey);
    return normalizeReceivedDetail(response);
  },

  async sendEmail(payload: ComposeEmailInput) {
    const apiKey = getBrowserApiKey();

    if (!apiKey) {
      throw new Error("Add a Resend API key before continuing.");
    }

    return fetchResendJson<SendEmailResult>("/emails", apiKey, {
      method: "POST",
      body: JSON.stringify({
        from: payload.from.trim(),
        to: payload.to
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        subject: payload.subject.trim(),
        text: payload.text.trim(),
        attachments: (payload.attachments ?? []).map((attachment: ComposeAttachmentInput) => ({
          filename: attachment.filename,
          content: attachment.content,
        })),
      }),
    });
  },

  async openExternal(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  },
};

const tauriBridge = {
  environment: "tauri" as const,
  loadSettings: () => invoke<AppSettings>("load_settings"),
  saveApiKey: (apiKey: string, remember: boolean) =>
    invoke<AppSettings>("save_api_key", { payload: { apiKey, remember } }),
  updatePreferences: (input: UpdatePreferencesInput) =>
    invoke<AppSettings>("update_preferences", { payload: input }),
  removeApiKey: () => invoke<AppSettings>("remove_api_key"),
  clearLocalData: () => invoke<AppSettings>("clear_local_data"),
  verifyConnection: () => invoke<ConnectionStatus>("verify_connection"),
  listSentEmails: (limit = 20) => invoke<SentEmail[]>("list_sent_emails", { limit }),
  getSentEmail: (emailId: string) => invoke<SentEmailDetail>("get_sent_email", { emailId }),
  listReceivedEmails: (limit = 20) => invoke<ReceivedEmail[]>("list_received_emails", { limit }),
  getReceivedEmail: (emailId: string) => invoke<ReceivedEmailDetail>("get_received_email", { emailId }),
  sendEmail: (payload: ComposeEmailInput) =>
    invoke<SendEmailResult>("send_email", { payload }),
  openExternal: async (url: string) => {
    await openUrl(url);
  },
};

export const appBridge = appEnvironment === "tauri" ? tauriBridge : browserBridge;
export { appEnvironment };
