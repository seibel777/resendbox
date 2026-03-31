import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import { copyByLanguage, getInitialLanguage, type LocaleCopy } from "@/lib/copy";
import { showLocalNotification, requestLocalNotificationPermission } from "@/lib/pwa";
import { applySeo } from "@/lib/seo";
import { appBridge, appEnvironment, type AppEnvironment } from "@/services/app-bridge";
import type {
  AppSettings,
  ComposeEmailInput,
  ConnectionStatus,
  LanguageCode,
  ReceivedEmail,
  SendEmailResult,
  SentEmail,
  ThemeMode,
} from "@/types/app";

interface AppContextValue {
  booting: boolean;
  refreshing: boolean;
  sending: boolean;
  environment: AppEnvironment;
  settings: AppSettings;
  copy: LocaleCopy;
  connection: ConnectionStatus;
  sentEmails: SentEmail[];
  receivedEmails: ReceivedEmail[];
  receivedNotice: string | null;
  saveApiKey: (apiKey: string, remember: boolean) => Promise<AppSettings>;
  updatePreferences: (input: {
    defaultSender?: string | null;
    theme?: ThemeMode;
    language?: LanguageCode;
    notificationsEnabled?: boolean;
  }) => Promise<void>;
  setLanguage: (language: LanguageCode) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  removeApiKey: () => Promise<void>;
  clearLocalData: () => Promise<void>;
  refreshData: (options?: { silent?: boolean; notify?: boolean }) => Promise<void>;
  sendEmail: (payload: ComposeEmailInput) => Promise<SendEmailResult>;
  openExternal: (url: string) => Promise<void>;
}

const defaultSettings: AppSettings = {
  hasApiKey: false,
  apiKeyPreview: null,
  keyPersistence: "none",
  rememberApiKey: false,
  defaultSender: "",
  theme: "dark",
  language: getInitialLanguage(),
  notificationsEnabled: false,
};

const defaultConnection: ConnectionStatus = {
  state: "missingKey",
  message: "Add your Resend API key to start.",
};

const AppContext = createContext<AppContextValue | null>(null);

function userFacingErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message.replace("RESENDBOX_UNAUTHORIZED:", "") || fallback;
  }

  return fallback;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [connection, setConnection] = useState<ConnectionStatus>(defaultConnection);
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);
  const [receivedEmails, setReceivedEmails] = useState<ReceivedEmail[]>([]);
  const [receivedNotice, setReceivedNotice] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const hasLoaded = useRef(false);
  const hasHydratedData = useRef(false);
  const refreshTask = useRef<Promise<void> | null>(null);
  const lastKnownIds = useRef<{ sent: string[]; received: string[] }>({
    sent: [],
    received: [],
  });

  const copy = copyByLanguage[settings.language] ?? copyByLanguage.en;
  const buildAppHref = (path: string) =>
    `${window.location.origin}${import.meta.env.BASE_URL}${appEnvironment === "tauri" ? `#${path}` : path.slice(1)}`;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
    document.documentElement.style.colorScheme = settings.theme;
  }, [settings.theme]);

  useEffect(() => {
    applySeo(settings.language);
  }, [settings.language]);

  useEffect(() => {
    if (hasLoaded.current) {
      return;
    }

    hasLoaded.current = true;

    void (async () => {
      try {
        const nextSettings = await appBridge.loadSettings();
        setSettings(nextSettings);

        if (nextSettings.hasApiKey) {
          await refreshDataInternal({ silent: true, notify: false });
        }
      } catch (error) {
        const message = userFacingErrorMessage(error, copy.notificationsCopy.loadFailed);
        toast.error(message);
      } finally {
        setBooting(false);
      }
    })();
  }, [copy.notificationsCopy.loadFailed]);

  async function refreshDataInternal(options?: { silent?: boolean; notify?: boolean }) {
    if (refreshTask.current) {
      return refreshTask.current;
    }

    const task = (async () => {
      setRefreshing(true);

      try {
        const nextConnection = await appBridge.verifyConnection();
        setConnection(nextConnection);

        if (nextConnection.state === "connected") {
          const [nextSentEmails, nextReceivedResult] = await Promise.all([
            appBridge.listSentEmails(20),
            appBridge
              .listReceivedEmails(20)
              .then((items) => ({ items, notice: null as string | null }))
              .catch((error) => ({
                items: [] as ReceivedEmail[],
                notice: userFacingErrorMessage(error, copy.notificationsCopy.browserApiFailure),
              })),
          ]);

          const nextReceivedEmails = nextReceivedResult.items;
          setReceivedNotice(nextReceivedResult.notice);

          if (settings.notificationsEnabled && options?.notify !== false && hasHydratedData.current) {
            const newInbound = nextReceivedEmails.filter((item) => !lastKnownIds.current.received.includes(item.id));

            if (newInbound.length > 0) {
              await showLocalNotification(
                copy.notificationsCopy.newIncomingTitle,
                `${copy.notificationsCopy.newIncomingBody} (${newInbound[0].from})`,
                { href: buildAppHref("/app/inbox") },
              );
            }
          }

          lastKnownIds.current = {
            sent: nextSentEmails.map((item) => item.id),
            received: nextReceivedEmails.map((item) => item.id),
          };
          hasHydratedData.current = true;

          startTransition(() => {
            setSentEmails(nextSentEmails);
            setReceivedEmails(nextReceivedEmails);
          });
        } else {
          setSentEmails([]);
          setReceivedEmails([]);
          setReceivedNotice(
            appEnvironment === "browser" && nextConnection.state === "offline"
              ? copy.notificationsCopy.browserApiFailure
              : null,
          );

          if (!options?.silent && nextConnection.state !== "missingKey") {
            toast.message(nextConnection.message);
          }
        }
      } catch (error) {
        const message = userFacingErrorMessage(error, "Could not refresh your data.");
        setConnection({
          state: "offline",
          message,
        });
        setSentEmails([]);
        setReceivedEmails([]);
        setReceivedNotice(appEnvironment === "browser" ? copy.notificationsCopy.browserApiFailure : message);

        if (!options?.silent) {
          toast.error(message);
        }
      } finally {
        setRefreshing(false);
        refreshTask.current = null;
      }
    })();

    refreshTask.current = task;
    return task;
  }

  const pollForUpdates = useEffectEvent(async () => {
    if (!settings.hasApiKey) {
      return;
    }

    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      return;
    }

    await refreshDataInternal({ silent: true, notify: true });
  });

  async function saveApiKey(apiKey: string, remember: boolean) {
    const nextSettings = await appBridge.saveApiKey(apiKey, remember);
    setSettings(nextSettings);
    toast.success(copy.notificationsCopy.savedKey);
    await refreshDataInternal({ silent: true, notify: false });
    return nextSettings;
  }

  async function updatePreferences(input: {
    defaultSender?: string | null;
    theme?: ThemeMode;
    language?: LanguageCode;
    notificationsEnabled?: boolean;
  }) {
    const nextSettings = await appBridge.updatePreferences(input);
    setSettings(nextSettings);
    toast.success(copy.notificationsCopy.prefsUpdated);
  }

  async function setLanguage(language: LanguageCode) {
    const nextSettings = await appBridge.updatePreferences({ language });
    setSettings(nextSettings);
  }

  async function setNotificationsEnabled(enabled: boolean) {
    if (enabled) {
      const permission = await requestLocalNotificationPermission();

      if (permission !== "granted") {
        toast.error(copy.notificationsCopy.permissionDenied);
        return;
      }
    }

    const nextSettings = await appBridge.updatePreferences({ notificationsEnabled: enabled });
    setSettings(nextSettings);
    toast.success(copy.notificationsCopy.prefsUpdated);
  }

  async function removeApiKey() {
    const nextSettings = await appBridge.removeApiKey();
    setSettings(nextSettings);
    setConnection(defaultConnection);
    setSentEmails([]);
    setReceivedEmails([]);
    setReceivedNotice(null);
    toast.success(copy.notificationsCopy.keyRemoved);
  }

  async function clearLocalData() {
    const nextSettings = await appBridge.clearLocalData();
    setSettings(nextSettings);
    setConnection(defaultConnection);
    setSentEmails([]);
    setReceivedEmails([]);
    setReceivedNotice(null);
    lastKnownIds.current = { sent: [], received: [] };
    hasHydratedData.current = false;
    toast.success(copy.notificationsCopy.localDataCleared);
  }

  async function sendEmail(payload: ComposeEmailInput) {
    setSending(true);

    try {
      const result = await appBridge.sendEmail(payload);
      toast.success(copy.notificationsCopy.emailSent);
      await showLocalNotification(copy.notificationsCopy.sentTitle, copy.notificationsCopy.sentBody, {
        href: buildAppHref("/app/sent"),
      });
      await refreshDataInternal({ silent: true, notify: false });
      return result;
    } catch (error) {
      const message = userFacingErrorMessage(error, copy.notificationsCopy.sendFailed);
      toast.error(message);
      throw error;
    } finally {
      setSending(false);
    }
  }

  async function openExternal(url: string) {
    try {
      await appBridge.openExternal(url);
    } catch (error) {
      const message = userFacingErrorMessage(error, "Could not open the link.");
      toast.error(message);
    }
  }

  useEffect(() => {
    if (booting || !settings.hasApiKey) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void pollForUpdates();
    }, 45000);

    const handleFocus = () => {
      void pollForUpdates();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void pollForUpdates();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [booting, settings.hasApiKey]);

  const value: AppContextValue = {
    booting,
    refreshing,
    sending,
    environment: appEnvironment,
    settings,
    copy,
    connection,
    sentEmails,
    receivedEmails,
    receivedNotice,
    saveApiKey,
    updatePreferences,
    setLanguage,
    setNotificationsEnabled,
    removeApiKey,
    clearLocalData,
    refreshData: refreshDataInternal,
    sendEmail,
    openExternal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider.");
  }

  return context;
}
