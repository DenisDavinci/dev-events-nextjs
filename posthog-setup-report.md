<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your **DevEvent** Next.js App Router application. Here's a summary of what was set up:

- **`posthog-js`** was installed as a dependency.
- **`instrumentation-client.ts`** was created at the project root to initialize PostHog using the recommended Next.js 15.3+ pattern, with automatic exception/error capture enabled and a reverse proxy via `/ingest`.
- **`next.config.ts`** was updated with reverse proxy rewrites for `/ingest` so PostHog requests route through your own domain, making them less likely to be blocked by ad blockers.
- **`.env.local`** was updated with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- Three client components were updated to capture user actions (see table below).

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `explore_events_clicked` | Fired when the user clicks the "Explore Events" hero CTA button — top of the engagement funnel | `components/ExploreBtn.tsx` |
| `event_card_clicked` | Fired when the user clicks an event card to navigate to its detail page — includes `event_title`, `event_slug`, `event_location`, and `event_date` properties | `components/EventCard.tsx` |
| `nav_link_clicked` | Fired when any navigation link is clicked — includes a `label` property (e.g. "Home", "Events", "Create Event") | `components/NavBar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **Dashboard — Analytics basics**: https://us.posthog.com/project/325411/dashboard/1313670
- 🔀 **Explore → Event Card Conversion Funnel**: https://us.posthog.com/project/325411/insights/vPPOZbzG
- 📈 **Event Card Clicks Over Time**: https://us.posthog.com/project/325411/insights/bIKy6m6Y
- 🏆 **Most Popular Events**: https://us.posthog.com/project/325411/insights/39lmixIL
- 🧭 **Navigation Link Clicks by Label**: https://us.posthog.com/project/325411/insights/2hvR8ySf
- 📉 **Explore CTA vs Event Card Engagement**: https://us.posthog.com/project/325411/insights/hShJwyi8

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
