const swUrl = `${import.meta.env.BASE_URL}sw.js`;

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || import.meta.env.DEV) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(swUrl, {
      scope: import.meta.env.BASE_URL,
    });

    return registration;
  } catch {
    return null;
  }
}

export async function showLocalNotification(
  title: string,
  body: string,
  options?: {
    href?: string;
  },
) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  const registration =
    "serviceWorker" in navigator
      ? await navigator.serviceWorker.getRegistration(import.meta.env.BASE_URL)
      : null;

  if (registration) {
    await registration.showNotification(title, {
      body,
      icon: `${import.meta.env.BASE_URL}icons/icon-192.svg`,
      badge: `${import.meta.env.BASE_URL}icons/icon-192.svg`,
      tag: "resendbox-notification",
      data: {
        href: options?.href || `${import.meta.env.BASE_URL}app/inbox`,
      },
    });
    return;
  }

  new Notification(title, {
    body,
    data: {
      href: options?.href || `${import.meta.env.BASE_URL}app/inbox`,
    },
  });
}

export async function requestLocalNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied" as const;
  }

  if (Notification.permission === "granted") {
    return "granted" as const;
  }

  return Notification.requestPermission();
}
