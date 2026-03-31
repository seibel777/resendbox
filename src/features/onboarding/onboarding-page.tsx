import { startTransition, useState, type FormEvent } from "react";
import { ArrowRight, KeyRound, ShieldCheck, Sparkles } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

import { useApp } from "@/app/providers/app-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoMark } from "@/components/logo-mark";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OnboardingPage() {
  const navigate = useNavigate();
  const { booting, copy, saveApiKey, setLanguage, settings } = useApp();
  const [apiKey, setApiKey] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!booting && settings.hasApiKey) {
    return <Navigate to="/app/dashboard" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!apiKey.trim()) {
      setError(copy.onboarding.emptyError);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await saveApiKey(apiKey, remember);
      startTransition(() => navigate("/app/dashboard"));
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message.replace("RESENDBOX_UNAUTHORIZED:", "")
          : "Could not save the key.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container min-h-screen px-4 py-8">
      <div className="mb-6 flex justify-end">
        <LanguageSwitcher value={settings.language} onChange={(language) => void setLanguage(language)} />
      </div>
      <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden p-0">
          <div className="bg-hero-mesh p-8 dark:bg-hero-mesh-dark sm:p-10">
            <LogoMark subtitle={copy.common.tagline} />
            <div className="mt-16 max-w-xl space-y-5">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/45 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-slate-700 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-300">
                <Sparkles className="h-3.5 w-3.5" />
                {copy.onboarding.badge}
              </p>
              <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">{copy.onboarding.heroTitle}</h1>
              <p className="max-w-lg text-base text-muted-foreground sm:text-lg">{copy.onboarding.heroDescription}</p>
            </div>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-3">
            <div className="rounded-[28px] border border-border/70 bg-background/70 p-5">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="mt-4 text-sm font-medium">{copy.onboarding.featureLocalTitle}</p>
              <p className="mt-2 text-sm text-muted-foreground">{copy.onboarding.featureLocalDescription}</p>
            </div>
            <div className="rounded-[28px] border border-border/70 bg-background/70 p-5">
              <ArrowRight className="h-5 w-5 text-primary" />
              <p className="mt-4 text-sm font-medium">{copy.onboarding.featureFlowTitle}</p>
              <p className="mt-2 text-sm text-muted-foreground">{copy.onboarding.featureFlowDescription}</p>
            </div>
            <div className="rounded-[28px] border border-border/70 bg-background/70 p-5">
              <KeyRound className="h-5 w-5 text-primary" />
              <p className="mt-4 text-sm font-medium">{copy.onboarding.featureGrowthTitle}</p>
              <p className="mt-2 text-sm text-muted-foreground">{copy.onboarding.featureGrowthDescription}</p>
            </div>
          </div>
          <div className="px-6 pb-6">
          </div>
        </Card>

        <Card className="mx-auto flex w-full max-w-xl flex-col justify-center">
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.onboarding.section}</p>
            <CardTitle className="mt-2 text-3xl">{copy.onboarding.title}</CardTitle>
            <CardDescription>{copy.onboarding.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
              <div className="space-y-2">
                <Label htmlFor="apiKey">{copy.onboarding.apiKeyLabel}</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="re_xxxxxxxxx"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                />
                <p className="text-sm text-muted-foreground">{copy.onboarding.apiKeyHint}</p>
              </div>
              <label className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/60 p-4">
                <Checkbox checked={remember} onCheckedChange={(checked) => setRemember(Boolean(checked))} />
                <span className="space-y-1 text-sm">
                  <span className="block font-medium">{copy.onboarding.rememberTitle}</span>
                  <span className="block text-muted-foreground">{copy.onboarding.rememberDescription}</span>
                </span>
              </label>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" size="lg" disabled={saving} className="w-full">
                {saving ? copy.settingsPage.savingKey : copy.onboarding.submit}
                <ArrowRight />
              </Button>
              <p className="rounded-2xl border border-border/70 bg-background/50 px-4 py-3 text-sm text-muted-foreground">
                {copy.onboarding.securityNote}
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
      <SiteFooter />
    </div>
  );
}
