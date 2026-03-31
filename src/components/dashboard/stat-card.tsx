import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export function StatCard({
  icon: Icon,
  eyebrow,
  value,
  title,
  description,
  badge,
  className,
}: {
  icon: LucideIcon;
  eyebrow: string;
  value: string;
  title: string;
  description: string;
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "success" | "warning" | "danger";
  };
  className?: string;
}) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="min-w-0 space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{eyebrow}</p>
          <div>
            <p className="font-display text-3xl font-bold tracking-tight break-words">{value}</p>
            <p className="mt-1 text-sm font-medium text-balance">{title}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/80 bg-background/70 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground text-balance">{description}</p>
        {badge ? <Badge variant={badge.variant}>{badge.label}</Badge> : null}
      </CardContent>
    </Card>
  );
}
