import type { LanguageCode } from "@/types/app";

import { copyByLanguage } from "@/lib/copy";
import { SITE_AUTHOR, SITE_KEYWORDS, SITE_NAME, SITE_REPO_URL, SITE_URL } from "@/lib/site";

function ensureMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function ensureLink(rel: string, href: string, hreflang?: string) {
  let selector = `link[rel="${rel}"]`;

  if (hreflang) {
    selector += `[hreflang="${hreflang}"]`;
  }

  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    if (hreflang) {
      element.hreflang = hreflang;
    }
    document.head.appendChild(element);
  }

  element.href = href;
}

function ensureJsonLd(id: string, value: Record<string, unknown>) {
  let script = document.head.querySelector<HTMLScriptElement>(`script#${id}`);

  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(value);
}

export function applySeo(language: LanguageCode) {
  const copy = copyByLanguage[language];
  const title = copy.meta.title;
  const description = copy.meta.description;
  const keywords = `${copy.meta.keywords}, ${SITE_KEYWORDS.join(", ")}`;
  const currentUrl = SITE_URL;

  document.title = title;
  document.documentElement.lang = language;

  ensureMeta('meta[name="description"]', { name: "description", content: description });
  ensureMeta('meta[name="keywords"]', { name: "keywords", content: keywords });
  ensureMeta('meta[name="author"]', { name: "author", content: SITE_AUTHOR });
  ensureMeta('meta[name="theme-color"]', { name: "theme-color", content: "#0ea5e9" });
  ensureMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
  ensureMeta('meta[property="og:title"]', { property: "og:title", content: title });
  ensureMeta('meta[property="og:description"]', { property: "og:description", content: description });
  ensureMeta('meta[property="og:url"]', { property: "og:url", content: currentUrl });
  ensureMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
  ensureMeta('meta[property="og:locale"]', { property: "og:locale", content: language });
  ensureMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  ensureMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
  ensureMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });

  ensureLink("canonical", currentUrl);
  ensureLink("alternate", `${SITE_URL}?lang=en`, "en");
  ensureLink("alternate", `${SITE_URL}?lang=pt`, "pt");
  ensureLink("alternate", `${SITE_URL}?lang=es`, "es");

  ensureJsonLd("resendbox-product-schema", {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Windows, macOS, Linux, Android, iOS, Web",
    description,
    url: currentUrl,
    inLanguage: [language, "en", "pt", "es"],
    author: {
      "@type": "Person",
      name: SITE_AUTHOR,
      url: SITE_REPO_URL,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    keywords,
  });
}
