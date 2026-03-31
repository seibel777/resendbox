import { Box, Sparkles } from "lucide-react";

import { cn } from "@/lib/cn";

export function LogoMark({
  className,
  compact = false,
  subtitle,
}: {
  className?: string;
  compact?: boolean;
  subtitle?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-br from-sky-400 via-cyan-400 to-teal-400 text-slate-950 shadow-glow">
        <div className="absolute inset-[1px] rounded-[15px] bg-white/25 backdrop-blur-md dark:bg-slate-950/15" />
        <Box className="relative h-5 w-5" strokeWidth={2.25} />
        <Sparkles className="absolute right-1.5 top-1.5 h-3.5 w-3.5" strokeWidth={2.25} />
      </div>
      {!compact ? (
        <div className="space-y-0.5">
          <p className="font-display text-xl font-bold tracking-tight">ResendBox</p>
          <p className="text-sm text-muted-foreground">{subtitle || "A local client for Resend"}</p>
        </div>
      ) : null}
    </div>
  );
}
