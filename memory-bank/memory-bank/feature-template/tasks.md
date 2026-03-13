`TASKS.md` is committed and pushed. Here's the breakdown:

---

### 49 tasks across 5 epics

| Epic | Tasks | What it covers |
|---|---|---|
| **E0 — Setup** | T-0.1–0.8 | Next.js, Tailwind, Claude SDK, lunar-javascript, iztro spike, i18n scaffold, rate limiting, Vercel |
| **E1 — Today's Luck** | T-1.1–1.18 | Calendar data layer, `/api/daily-luck`, `/lucky` page UI |
| **E2 — Personal Reading** | T-2.1–2.40 | BaZi computation, Ziwei computation, `/api/chat`, birth form, chat UI |
| **E3 — Home & Nav** | T-3.1–3.4 | Home page, dark theme, locale toggle |
| **E4 — i18n** | T-4.1–4.4 | Locale files, middleware, QA |
| **E5 — QA & Polish** | T-5.1–5.8 | E2E smoke tests, edge cases, a11y, mobile |

### Notable design decisions baked into the tasks

- **T-0.5** is a spike before any 紫微 work — block Sprint 3 on this result since the whole computation approach depends on whether `iztro` works
- **T-2.20** handles the chart caching via SSE event (not a header) per the design doc's OQ-3 resolution
- **T-2.7** + **T-2.22** + **T-2.31** together form the full missing-birth-time path (AC-2.7) across computation, API, and UI layers
- The sprint sequence puts all of Feature 1 in Sprint 2 so you have a shippable demo early before the harder chart math in Sprint 3