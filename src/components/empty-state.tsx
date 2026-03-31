import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <Card className="border-dashed">
      <CardHeader className="items-center text-center">
        <div className="mb-3 rounded-2xl border border-border/70 bg-background/70 p-4 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="max-w-md text-balance">{description}</CardDescription>
      </CardHeader>
      {ctaHref && ctaLabel ? (
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link to={ctaHref}>
              {ctaLabel}
              <ArrowRight />
            </Link>
          </Button>
        </CardContent>
      ) : null}
    </Card>
  );
}
