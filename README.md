# ResendBox

ResendBox is a multilingual Tauri 2 and PWA client for professional business email workflows powered by Resend.

The project is designed for teams and operators who want a cleaner way to:

- connect a Resend account
- send professional outbound email
- inspect recent sent messages
- inspect received messages when Resend inbound is configured
- manage a local-first email operations workflow across desktop, mobile and web

Repository: `github.com/seibel777/resendbox`

## What ships now

- Tauri 2 structure for desktop and mobile expansion
- React + TypeScript + Tailwind CSS frontend
- polished SaaS-style UI with bento dashboard
- onboarding flow with API key storage options
- dashboard with connection, sent volume, inbox volume and quick actions
- compose screen for plain-text email with attachments
- sent screen with live list, search and message detail
- inbox screen with live received-email list, search and message detail
- settings for:
  - API key
  - default sender
  - theme
  - language
  - notifications
  - local reset
  - GitHub follow link
- English, Portuguese and Spanish UI
- PWA base:
  - web manifest
  - service worker
  - installable app shell
  - local notifications support
- SEO/GEO-oriented web foundation:
  - metadata
  - Open Graph / Twitter tags
  - canonical link
  - JSON-LD schema
  - robots.txt
  - sitemap.xml
  - GitHub Pages SPA fallback
- optional ad slot support on the landing screen via environment variables

## Important behavior changes

The app no longer uses fake email activity as the normal experience.

Browser/PWA mode now tries to use the real Resend API. If your hosting environment blocks direct API access, the app shows a clear technical error instead of inventing data.

## Stack

- Tauri 2
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-style component primitives
- lucide-react
- Framer Motion
- native Rust bridge for Tauri mode
- browser/PWA live bridge for web mode

## Architecture

```text
src/
  app/
    layout/
    providers/
    router.tsx
  components/
    dashboard/
    emails/
    layout/
    ui/
  features/
    onboarding/
    dashboard/
    inbox/
    compose/
    sent/
    settings/
  lib/
    copy.ts
    seo.ts
    pwa.ts
    site.ts
    validators.ts
  services/
    app-bridge.ts
  types/
    app.ts

src-tauri/
  src/
    commands.rs
    resend.rs
    storage.rs
    models.rs
    lib.rs
```

## How the integrations work

### Tauri mode

When running as a native Tauri app, the frontend talks to Rust commands that:

- resolve the active API key from session memory or local persisted settings
- call the Resend API from native code
- return typed results to the UI

This keeps the Resend integration inside the native runtime and gives the app the most complete desktop experience.

### Browser / PWA mode

When running in the browser, ResendBox uses the web bridge for the same send, inbox and settings flows.

In local development, the Vite setup keeps requests on the same app flow. For production web hosting, the repository already includes a proxy path that can be deployed with the frontend.

### Vercel proxy mode

The repository includes a Vercel rewrite-based proxy through `vercel.json`.

That means you can host the frontend on Vercel and forward `/api/resend/:path*` to the Resend API on the same deployment origin.

`vercel.json` also rewrites SPA routes to `index.html` without intercepting `/api/*` requests.

If you deploy on the default `*.vercel.app` domain, the frontend now automatically prefers `/api/resend`.

If you deploy on a custom domain, set:

```bash
VITE_RESENDBOX_PROXY_BASE_URL=/api/resend
```

In this Vercel flow, the browser sends requests to the same deployment origin and Vercel forwards them to Resend.

### Inbox / received email

The inbox screen relies on Resend email receiving.

That means you only see received messages if inbound/receiving is already configured for your domain in Resend. If inbound is not configured, the inbox stays empty even when the rest of the app works.

## Running the project

### Prerequisites

- Node.js 20+
- npm 10+
- Rust stable for Tauri desktop/mobile
- Tauri system prerequisites for your OS
- Android Studio / Xcode if you want Android or iOS targets

### Install

```bash
npm install
```

### Web development

```bash
npm run dev
```

### Frontend production build

```bash
npm run build
```

### Native Tauri development

```bash
npm run tauri:dev
```

### Native Tauri build

```bash
npm run tauri:build
```

## Fixing the Cargo error

If you see:

```text
failed to run 'cargo metadata' ... No such file or directory (os error 2)
```

your machine does not have Rust correctly installed in PATH.

Install and load Rust:

```bash
curl https://sh.rustup.rs -sSf | sh
source "$HOME/.cargo/env"
cargo --version
rustc --version
```

Then run:

```bash
npm run tauri:dev
```

The project now includes a small preflight script that explains this before calling Tauri.

## GitHub Pages / web hosting

For GitHub Pages builds:

```bash
GITHUB_PAGES=true npm run build
```

This sets the Vite base path to `/resendbox/` and includes a SPA fallback page for browser routing.

## Optional environment variables

### Backend proxy for web/PWA mode

Use this when you want browser/PWA mode to talk to your own backend instead of calling Resend directly:

```bash
VITE_RESENDBOX_PROXY_BASE_URL=https://your-proxy.example.com
```

For same-origin Vercel hosting you can also use:

```bash
VITE_RESENDBOX_PROXY_BASE_URL=/api/resend
```

### Optional AdSense support

AdSense is intentionally optional and does not render unless both values exist:

```bash
VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
VITE_ADSENSE_SLOT_ID=1234567890
```

## Notifications

ResendBox currently supports local notifications for:

- successful outbound send
- new inbound emails detected after refresh while the app is open

This is not the same as full push delivery. Background push notifications for email events would require an additional webhook + push backend or a native notification plugin workflow.

## Security notes

- no API key is hardcoded
- the UI does not log the API key
- access to the key is centralized through a bridge layer
- Tauri mode keeps API access in native code
- the API key is stored locally on the active device through the app storage layer

## Current limitations

- compose currently sends plain-text bodies with optional attachments
- inbox only works when Resend inbound is configured
- native Tauri runtime still depends on Rust being installed locally
- full background push notifications are not implemented yet
- secure OS keychain / vault storage is not implemented yet
- threads are still future work

## Future roadmap

- threads
- multiple accounts
- advanced filters
- advanced search
- full inbox workflows
- richer sync strategy
- platform-specific credential storage
- webhook-driven push notifications
- automation management

## Product positioning

ResendBox is focused on making professional business email easier to operate, especially for founders, sales teams, agencies, operators and product businesses that already use Resend and want a cleaner operational surface than raw API scripts.
