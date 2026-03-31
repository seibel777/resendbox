declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
    __TAURI__?: unknown;
  }
}

export function isTauriRuntime() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(window.__TAURI_INTERNALS__ || window.__TAURI__) || navigator.userAgent.includes("Tauri");
}
