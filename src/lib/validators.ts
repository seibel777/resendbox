const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mailboxPattern = /^(?:"?[^<>"]+"?\s*)?<([^<>@\s]+@[^<>@\s]+\.[^<>@\s]+)>$|^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string) {
  return emailPattern.test(value.trim());
}

export function extractEmailAddress(value: string) {
  const trimmed = value.trim();
  const bracketMatch = trimmed.match(/<([^<>@\s]+@[^<>@\s]+\.[^<>@\s]+)>$/);

  if (bracketMatch) {
    return bracketMatch[1];
  }

  return trimmed;
}

export function isValidMailbox(value: string) {
  const trimmed = value.trim();
  return mailboxPattern.test(trimmed) && isValidEmail(extractEmailAddress(trimmed));
}

export function splitRecipients(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
