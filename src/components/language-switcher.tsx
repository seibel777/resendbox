import type { LanguageCode } from "@/types/app";

import { useApp } from "@/app/providers/app-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function LanguageSwitcher({
  value,
  onChange,
  className,
}: {
  value: LanguageCode;
  onChange: (language: LanguageCode) => void;
  className?: string;
}) {
  const { copy } = useApp();
  const options: LanguageCode[] = ["en", "pt", "es"];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {options.map((option) => (
        <Button
          key={option}
          variant={value === option ? "default" : "outline"}
          size="sm"
          type="button"
          onClick={() => onChange(option)}
        >
          {copy.languages[option]}
        </Button>
      ))}
    </div>
  );
}
