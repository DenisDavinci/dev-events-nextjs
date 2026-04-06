import posthog from "posthog-js";

const isDev = process.env.NODE_ENV === "development";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
  // Disabled in dev: causes ECONNRESET when Next.js proxies the exception-autocapture.js
  // bundle from PostHog's CDN through the /ingest/static rewrite rule
  capture_exceptions: !isDev,
  // Turn on debug in development mode
  debug: isDev,
});
