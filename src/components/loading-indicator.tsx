import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/cn";

export function LoadingIndicator({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 text-sm text-muted-foreground", className)}>
      <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
      <span>{label}</span>
    </div>
  );
}
