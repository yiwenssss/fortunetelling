# Task List: Fortune Telling App v1.0

Each task is tagged with the user story and acceptance criteria it satisfies.

**Status legend:** `[ ]` todo · `[~]` in progress · `[x]` done

---

## Epic 0 — Project Setup

These tasks are prerequisites with no direct US/AC mapping but block everything else.

| ID | Task | Covers |
|---|---|---|
| T-0.1 | Initialise Next.js project with TypeScript and App Router (`npx create-next-app`) | — |
| T-0.2 | Install and configure Tailwind CSS | — |
| T-0.3 | Install `@anthropic-ai/sdk`, add `ANTHROPIC_API_KEY` to `.env.local` | — |
| T-0.4 | Install `lunar-javascript`; write a smoke-test script that converts today's date to lunar | — |
| T-0.5 | Investigate `iztro` library for 紫微斗数 palace computation; document findings in a short spike note | OQ-1 |
| T-0.6 | Install `next-intl`; scaffold locale files for `en`, `zh-CN`, `zh-TW` with placeholder strings | — |
| T-0.7 | Add IP-based rate limiting to all API routes using `@upstash/ratelimit` | OQ-2 |
| T-0.8 | Set up Vercel project, connect repo, configure environment variables | — |

---

## Epic 1 — Today's Luck (Feature 1)

### E1-S1: Calendar data layer
> Satisfies: **AC-1.1**, **AC-1.2**, **AC-1.3**

| ID | Task | AC |
|---|---|---|
| T-1.1 | Write `lib/almanac.ts`: function `getAlmanacData(date: Date)` that returns `{ lunarDate, ganzhiYear, ganzhiMonth, ganzhiDay, yi, ji }` using `lunar-javascript` | AC-1.1, AC-1.3 |
| T-1.2 | Verify `lunar-javascript` exposes 宜/忌 lists; if not, bundle a static 黄历 dataset and integrate it into `getAlmanacData` | AC-1.3 |
| T-1.3 | Write unit tests for `getAlmanacData`: verify output for at least 5 known dates (cross-check against a public almanac site) | AC-1.1, AC-1.3 |
| T-1.4 | Add date parsing utility `parseDateInput(input: string): Date` that accepts `"today"`, `"tomorrow"`, `"March 20"`, and ISO strings | AC-1.2 |
| T-1.5 | Write unit tests for `parseDateInput` covering each accepted format | AC-1.2 |

### E1-S2: `/api/daily-luck` endpoint
> Satisfies: **AC-1.1**, **AC-1.3**, **AC-1.4**, **AC-1.5**

| ID | Task | AC |
|---|---|---|
| T-1.6 | Scaffold `app/api/daily-luck/route.ts`; accept optional `?date=` query param, default to today | AC-1.1, AC-1.2 |
| T-1.7 | Call `getAlmanacData` and build the daily-luck prompt template (see DESIGN §7) | AC-1.3 |
| T-1.8 | Call Claude API with the prompt; stream the response as SSE (`text/event-stream`) | AC-1.4 |
| T-1.9 | Add `Accept-Language` header detection to the API route; pass detected language into the system prompt | AC-1.5 |
| T-1.10 | Add error handling: return `500` with a user-facing error message if Claude call fails | — |

### E1-S3: `/lucky` page UI
> Satisfies: **US-1.1**, **US-1.2**, **US-1.3**, **AC-1.4**, **AC-1.5**, **AC-1.6**

| ID | Task | AC |
|---|---|---|
| T-1.11 | Build `/lucky` page that fires `GET /api/daily-luck` on mount and renders the streamed response | US-1.1, AC-1.6 |
| T-1.12 | Display the Chinese date header (农历 date + 干支 day) above the streamed reading | AC-1.3 |
| T-1.13 | Render luck rating as a star display (★★★★☆) parsed from the LLM response | AC-1.4 |
| T-1.14 | Render 宜 and 忌 as labelled chips/badges below the narrative | AC-1.4 |
| T-1.15 | Add a date picker (or text input) above the result; on change, re-fetch with `?date=` | US-1.2, AC-1.2 |
| T-1.16 | Show a loading skeleton while streaming; animate text appearance as chunks arrive | — |
| T-1.17 | Add "Share" button that copies a plain-text summary to clipboard | — |
| T-1.18 | Confirm no auth, no login, no personal data field is present on this page | AC-1.6 |

---

## Epic 2 — Personalized Fortune Reading (Feature 2)

### E2-S1: Chart computation — BaZi
> Satisfies: **AC-2.2**, **AC-2.3**, **AC-2.4**

| ID | Task | AC |
|---|---|---|
| T-2.1 | Write `lib/bazi.ts`: function `computeBazi(birthDate: Date, birthHour?: number)` that returns the four-pillar object `{ yearPillar, monthPillar, dayPillar, hourPillar?, dayMaster, element, wuxingBalance }` | AC-2.2, AC-2.3 |
| T-2.2 | Implement Gregorian → lunar date conversion using `lunar-javascript` inside `computeBazi` | AC-2.2 |
| T-2.3 | Implement 年柱 (year pillar): derive 天干地支 from lunar year | AC-2.3 |
| T-2.4 | Implement 月柱 (month pillar): derive 天干地支 from solar term (节气) of birth month | AC-2.3 |
| T-2.5 | Implement 日柱 (day pillar): derive 天干地支 from lunar day | AC-2.3 |
| T-2.6 | Implement 时柱 (hour pillar): map birth hour to one of 12 时辰; derive 天干地支 | AC-2.3 |
| T-2.7 | If `birthHour` is undefined, omit 时柱 and set a `birthTimeUnknown: true` flag on the output | AC-2.7 |
| T-2.8 | Compute 日主 (day master element) and 五行 balance counts from all present pillars | AC-2.4 |
| T-2.9 | Write unit tests for `computeBazi`: verify 四柱 output for at least 5 known birth dates (cross-check against a trusted 八字 calculator) | AC-2.3 |

### E2-S2: Chart computation — 紫微斗数
> Satisfies: **AC-2.5**

| ID | Task | AC |
|---|---|---|
| T-2.10 | Evaluate `iztro` library: if it covers 北派 palace computation, write `lib/ziwei.ts` as a thin wrapper; otherwise implement from scratch | AC-2.5 |
| T-2.11 | Implement 命宫 position lookup from birth month and 时辰 | AC-2.5 |
| T-2.12 | Implement 身宫 position lookup from birth year and 时辰 | AC-2.5 |
| T-2.13 | Implement 紫微星 placement using lunar birth day + 北派 lookup table | AC-2.5 |
| T-2.14 | Derive positions of all 14 main stars (十四主星) from 紫微星 using fixed offsets | AC-2.5 |
| T-2.15 | Place auxiliary and malevolent stars (辅星/煞星) using year/month/day/hour stems and branches | AC-2.5 |
| T-2.16 | Produce the 12-palace output array with `{ palace, position, mainStars, auxStars, stemBranch }` per palace | AC-2.5 |
| T-2.17 | Write unit tests: verify 命宫 and three key palaces (命宫, 财帛宫, 感情宫) for at least 3 known birth charts | AC-2.5 |

### E2-S3: `/api/chat` endpoint
> Satisfies: **AC-2.1**, **AC-2.6**, **AC-2.7**, **AC-2.9**

| ID | Task | AC |
|---|---|---|
| T-2.18 | Scaffold `app/api/chat/route.ts`; define and validate the request body schema (`profile`, optional `chart`, `messages`) | AC-2.1 |
| T-2.19 | On first call (no `chart` in body): call `computeBazi` and `computeZiwei` and attach result to the system context | AC-2.2, AC-2.3, AC-2.5 |
| T-2.20 | Return the computed chart to the client in the first SSE event as `data: {"type":"chart", ...}` so it can be cached | — |
| T-2.21 | Build the personal reading system prompt (see DESIGN §7): embed name, birth data, 四柱, 五行 balance, and 紫微 palace grid | AC-2.4, AC-2.5, AC-2.6 |
| T-2.22 | If `birthTimeUnknown` is true in the chart, append the missing-time caveat to the system prompt | AC-2.7 |
| T-2.23 | Pass `messages` history to Claude API; stream response as SSE | AC-2.6 |
| T-2.24 | Detect language from `Accept-Language` header; inject into system prompt | AC-2.9 |
| T-2.25 | Add input validation: reject requests where required fields (name, birthDate, sex) are missing | AC-2.1 |

### E2-S4: Birth data form
> Satisfies: **US-2.1**, **AC-2.1**, **AC-2.7**, **AC-2.8**

| ID | Task | AC |
|---|---|---|
| T-2.26 | Build `<BirthDataForm>` component with fields: name (text), birth date (date picker), birth time (time picker, labelled optional), sex (男/女 toggle) | AC-2.1 |
| T-2.27 | Add client-side validation: name and birth date are required; show inline errors | AC-2.1 |
| T-2.28 | On submit, write profile to `localStorage` as `fortune_profile` key | AC-2.8 |
| T-2.29 | On page load at `/oracle`, read `fortune_profile` from `localStorage`; skip form if present | AC-2.8 |
| T-2.30 | Show "Edit profile" link that clears `localStorage` and re-shows the form | AC-2.8 |
| T-2.31 | Display a one-line disclaimer when birth time is left blank: "Readings without birth time may be less precise" | AC-2.7 |

### E2-S5: Chat UI
> Satisfies: **US-2.2**, **US-2.3**, **US-2.4**, **AC-2.4**, **AC-2.5**, **AC-2.6**, **AC-2.9**

| ID | Task | AC |
|---|---|---|
| T-2.32 | Build `<ChatThread>` component: renders alternating user/assistant message bubbles | — |
| T-2.33 | On first render (after birth data is submitted/loaded), POST to `/api/chat` with profile + no chart; parse the `chart` SSE event and cache in React state | AC-2.3, AC-2.5 |
| T-2.34 | Render the automatic opening message (四柱 summary + 日主 + brief 紫微 intro) as the first assistant bubble | US-2.2, US-2.3, AC-2.4 |
| T-2.35 | Build `<ChatInput>` component: text input + send button; submits on Enter or click | US-2.4 |
| T-2.36 | On user message submit, append user bubble immediately, POST to `/api/chat` with cached chart + full message history, stream assistant reply into a new bubble | US-2.4, AC-2.6 |
| T-2.37 | Show typing indicator (animated dots) while streaming | — |
| T-2.38 | Confirm responses reference specific stars or pillars — verified via prompt design in T-2.21 (manual QA required) | AC-2.6 |
| T-2.39 | Display a 四柱 summary card above the chat thread (year/month/day/hour pillars as a visual grid) | US-2.2, AC-2.3 |
| T-2.40 | Display 五行 balance as a small bar chart or icon set below the pillars card | AC-2.4 |

---

## Epic 3 — Home Page & Navigation

| ID | Task | Covers |
|---|---|---|
| T-3.1 | Build home page (`/`) with two CTA cards: "Feeling Lucky" → `/lucky` and "Ask the Oracle" → `/oracle` | — |
| T-3.2 | Apply atmospheric dark theme (ink/stars aesthetic) in Tailwind | — |
| T-3.3 | Detect `navigator.language` on the client; render CTA labels in both Chinese and English regardless of locale | AC-1.5, AC-2.9 |
| T-3.4 | Add a locale toggle (EN / 中文) in the header that persists to `localStorage` | — |

---

## Epic 4 — i18n

| ID | Task | Covers |
|---|---|---|
| T-4.1 | Populate `messages/en.json` with all static UI strings | AC-1.5, AC-2.9 |
| T-4.2 | Populate `messages/zh-CN.json` with all static UI strings | AC-1.5, AC-2.9 |
| T-4.3 | Wire `next-intl` middleware to detect locale from `Accept-Language` and route accordingly | AC-1.5, AC-2.9 |
| T-4.4 | QA: verify every static string on all three pages renders correctly in both locales | AC-1.5, AC-2.9 |

---

## Epic 5 — QA & Polish

| ID | Task | Covers |
|---|---|---|
| T-5.1 | End-to-end smoke test: open `/lucky`, verify a reading loads within 5 seconds | AC-1.4 |
| T-5.2 | End-to-end smoke test: enter a known birth date on `/oracle`, verify 四柱 summary card is correct | AC-2.3 |
| T-5.3 | End-to-end smoke test: ask "今年财运如何？" in chat, verify response references 紫微 stars or 八字 pillars | AC-2.6 |
| T-5.4 | Test missing birth time path: form with no birth time → verify caveat appears in first assistant message | AC-2.7 |
| T-5.5 | Test profile persistence: save profile, close tab, reopen `/oracle` → verify form is skipped | AC-2.8 |
| T-5.6 | Test rate limiting: send >N requests per minute from same IP; verify 429 response | — |
| T-5.7 | Accessibility audit: keyboard navigation, ARIA labels on form fields, colour contrast | — |
| T-5.8 | Mobile responsiveness check on 375px viewport | — |

---

## Dependency Order (suggested sprint sequence)

```
Sprint 1 (foundation)
  T-0.1 → T-0.6   Project setup
  T-0.5           Spike: iztro evaluation

Sprint 2 (Feature 1 complete)
  T-1.1 → T-1.5   Calendar data layer
  T-1.6 → T-1.10  /api/daily-luck
  T-1.11 → T-1.18 /lucky page

Sprint 3 (Feature 2 — computation)
  T-2.1 → T-2.9   BaZi computation
  T-2.10 → T-2.17 Ziwei computation

Sprint 4 (Feature 2 — API + UI)
  T-2.18 → T-2.25 /api/chat
  T-2.26 → T-2.31 Birth data form
  T-2.32 → T-2.40 Chat UI

Sprint 5 (home, i18n, QA)
  T-3.x            Home page
  T-4.x            i18n wiring
  T-0.7, T-0.8     Rate limiting + deploy
  T-5.x            QA & polish
```
