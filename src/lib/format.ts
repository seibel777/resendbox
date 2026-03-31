function resolveLocale() {
  if (typeof navigator === "undefined") {
    return "en";
  }

  return navigator.language || "en";
}

export function formatRelativeDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat(resolveLocale(), {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatAbsoluteDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat(resolveLocale(), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function maskApiKey(value?: string | null) {
  if (!value) {
    return "••••••••";
  }

  if (value.length <= 8) {
    return "••••••••";
  }

  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}

export function htmlToPlainText(value?: string | null) {
  if (!value || typeof document === "undefined") {
    return "";
  }

  const container = document.createElement("div");
  container.innerHTML = value;
  return (container.innerText || container.textContent || "").trim();
}

export function formatBytes(value?: number | null) {
  if (!value || value < 1) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const amount = value / 1024 ** exponent;

  return `${amount >= 10 || exponent === 0 ? amount.toFixed(0) : amount.toFixed(1)} ${units[exponent]}`;
}
