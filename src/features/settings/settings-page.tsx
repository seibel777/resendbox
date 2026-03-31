import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, Info, KeyRound, Trash2, UserRoundCog } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useApp } from "@/app/providers/app-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PageTransition } from "@/components/page-transition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SITE_REPO_URL } from "@/lib/site";

export function SettingsPage() {
  const navigate = useNavigate();
  const {
    clearLocalData,
    copy,
    openExternal,
    removeApiKey,
    saveApiKey,
    setLanguage,
    setNotificationsEnabled,
    settings,
    updatePreferences,
  } = useApp();
  const [defaultSender, setDefaultSender] = useState(settings.defaultSender ?? "");
  const [newApiKey, setNewApiKey] = useState("");
  const [remember, setRemember] = useState(settings.rememberApiKey);
  const [savingKey, setSavingKey] = useState(false);
  const [savingSender, setSavingSender] = useState(false);

  useEffect(() => {
    setDefaultSender(settings.defaultSender ?? "");
    setRemember(settings.rememberApiKey);
  }, [settings.defaultSender, settings.rememberApiKey]);

  async function handleSaveSender() {
    setSavingSender(true);

    try {
      await updatePreferences({
        defaultSender: defaultSender.trim(),
      });
    } finally {
      setSavingSender(false);
    }
  }

  async function handleSaveApiKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newApiKey.trim()) {
      return;
    }

    setSavingKey(true);

    try {
      await saveApiKey(newApiKey, remember);
      setNewApiKey("");
    } finally {
      setSavingKey(false);
    }
  }

  async function handleRemoveApiKey() {
    await removeApiKey();
    navigate("/welcome");
  }

  async function handleClearLocalData() {
    await clearLocalData();
    navigate("/welcome");
  }

  return (
    <PageTransition>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.settingsPage.apiKeySection}</p>
            <CardTitle className="mt-2">{copy.settingsPage.apiKeyTitle}</CardTitle>
            <CardDescription>{copy.settingsPage.apiKeyDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{copy.settingsPage.currentKeyState}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{settings.apiKeyPreview || copy.settingsPage.noKeySaved}</p>
                </div>
                <Badge
                  variant={
                    settings.keyPersistence === "device"
                      ? "success"
                      : settings.keyPersistence === "session"
                        ? "warning"
                        : "secondary"
                  }
                >
                  {settings.keyPersistence === "device"
                    ? copy.dashboard.saved
                    : settings.keyPersistence === "session"
                      ? copy.dashboard.session
                      : copy.common.noData}
                </Badge>
              </div>
            </div>
            <form className="space-y-4" onSubmit={(event) => void handleSaveApiKey(event)}>
              <div className="space-y-2">
                <Label htmlFor="replaceApiKey">{copy.settingsPage.replaceKey}</Label>
                <Input
                  id="replaceApiKey"
                  type="password"
                  placeholder="re_xxxxxxxxx"
                  value={newApiKey}
                  onChange={(event) => setNewApiKey(event.target.value)}
                />
              </div>
              <label className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/60 p-4">
                <Checkbox checked={remember} onCheckedChange={(checked) => setRemember(Boolean(checked))} />
                <span className="space-y-1 text-sm">
                  <span className="block font-medium">{copy.settingsPage.rememberTitle}</span>
                  <span className="block text-muted-foreground">{copy.settingsPage.rememberDescription}</span>
                </span>
              </label>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={savingKey || !newApiKey.trim()}>
                  <KeyRound />
                  {savingKey ? copy.settingsPage.savingKey : copy.settingsPage.saveKey}
                </Button>
                <Button type="button" variant="destructive" onClick={() => void handleRemoveApiKey()}>
                  <Trash2 />
                  {copy.settingsPage.removeKey}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.settingsPage.defaultsSection}</p>
            <CardTitle className="mt-2">{copy.settingsPage.defaultsTitle}</CardTitle>
            <CardDescription>{copy.settingsPage.defaultsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="defaultSender">{copy.settingsPage.defaultSender}</Label>
              <Input
                id="defaultSender"
                placeholder={copy.composePage.fromPlaceholder}
                value={defaultSender}
                onChange={(event) => setDefaultSender(event.target.value)}
              />
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{copy.settingsPage.darkMode}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{copy.settingsPage.darkModeDescription}</p>
                </div>
                <Switch
                  checked={settings.theme === "dark"}
                  onCheckedChange={(checked) =>
                    void updatePreferences({
                      theme: checked ? "dark" : "light",
                    })
                  }
                />
              </div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{copy.common.notifications}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{copy.settingsPage.notificationsDescription}</p>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => void setNotificationsEnabled(checked)}
                />
              </div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <p className="text-sm font-medium">{copy.common.language}</p>
              <p className="mt-1 text-sm text-muted-foreground">{copy.settingsPage.languageDescription}</p>
              <LanguageSwitcher
                value={settings.language}
                onChange={(language) => void setLanguage(language)}
                className="mt-4"
              />
            </div>
            <Button onClick={() => void handleSaveSender()} disabled={savingSender}>
              <UserRoundCog />
              {savingSender ? copy.settingsPage.savingDefaults : copy.settingsPage.saveDefaults}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.settingsPage.localSection}</p>
            <CardTitle className="mt-2">{copy.settingsPage.localTitle}</CardTitle>
            <CardDescription>{copy.settingsPage.localDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{copy.settingsPage.localDataBody}</p>
            <Button variant="destructive" onClick={() => void handleClearLocalData()}>
              <Trash2 />
              {copy.settingsPage.clearLocalData}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.settingsPage.aboutSection}</p>
            <CardTitle className="mt-2">{copy.settingsPage.aboutTitle}</CardTitle>
            <CardDescription>{copy.settingsPage.aboutDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{copy.settingsPage.aboutBodyTitle}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{copy.settingsPage.aboutBodyDescription}</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <p className="text-sm font-medium">{copy.settingsPage.author}</p>
              <p className="mt-2 text-sm text-muted-foreground">{copy.common.tagline}</p>
            </div>
            <Button variant="outline" onClick={() => void openExternal(SITE_REPO_URL)}>
              <ArrowUpRight />
              {copy.settingsPage.github}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
