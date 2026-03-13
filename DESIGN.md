# Design Document: Fortune Telling App

**Version:** 1.0
**Date:** 2026-03-13
**Status:** Draft
**Ref:** PRD v1.0

---

## 1. Summary

A web app that tells fortunes using Chinese metaphysics. The home page has two entry points:

1. **"Feeling Lucky"** — one-click daily luck reading powered by today's 万年历 data. No user input required.
2. **"Ask the Oracle"** — a conversational chat experience where the user provides their birth data and asks personal fortune questions. Answers are grounded in their 生辰八字 and 紫微斗数 chart.

All fortune interpretation is handled by an LLM (Claude API). Chart computation (四柱, 紫微命盘) is done with a deterministic open-source Chinese calendar library; the computed chart is passed to the LLM as structured context so it reasons from real data rather than hallucinating.

The app is fully anonymous — no accounts, no server-side storage. User profiles are persisted in `localStorage`.

---

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Next.js (App Router) | SSR + API routes in one repo; easy deployment on Vercel |
| Styling | Tailwind CSS | Fast to style; pairs well with Next.js |
| LLM | Claude API via `@anthropic-ai/sdk` | Conversational quality; streaming support |
| Chinese calendar | `lunar-javascript` (JS library) | Actively maintained, runs client- or server-side, covers 1900–2100, no external API dependency |
| State / storage | React state + `localStorage` | No backend DB needed; user profile persisted locally |
| Deployment | Vercel | Zero-config Next.js hosting |

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser (Next.js)                 │
│                                                      │
│  ┌─────────────┐        ┌────────────────────────┐  │
│  │  Home Page  │        │  Chat Page             │  │
│  │             │        │  - Message thread      │  │
│  │  [Feeling   │        │  - Birth data form     │  │
│  │   Lucky]    │        │  - Follow-up input     │  │
│  │             │        │                        │  │
│  │  [Ask the   │        │  localStorage:         │  │
│  │   Oracle]   │        │  { name, dob, sex }    │  │
│  └──────┬──────┘        └────────────┬───────────┘  │
│         │                            │               │
└─────────┼────────────────────────────┼───────────────┘
          │                            │
          ▼                            ▼
┌─────────────────────┐   ┌────────────────────────────┐
│  Next.js API Route  │   │  Next.js API Route         │
│  /api/daily-luck    │   │  /api/chat                 │
│                     │   │                            │
│  1. Compute today's │   │  1. Receive birth data +   │
│     Chinese date    │   │     user message           │
│  2. Extract 干支,   │   │  2. Compute 四柱 (BaZi)   │
│     宜/忌 from      │   │  3. Compute 紫微 命盘      │
│     lunar-javascript│   │  4. Build system prompt    │
│  3. Call Claude API │   │     with chart context     │
│  4. Stream response │   │  5. Stream Claude response │
└─────────────────────┘   └────────────────────────────┘
          │                            │
          └──────────┬─────────────────┘
                     ▼
             ┌───────────────┐
             │  Claude API   │
             │  (Anthropic)  │
             └───────────────┘
```

---

## 4. Page & Component Design

### 4.1 Home Page (`/`)

Two CTAs, centered layout, atmospheric design (dark background, ink/stars aesthetic).

```
┌──────────────────────────────────┐
│          命运天书                 │
│      Fortune of the Stars        │
│                                  │
│   ┌──────────────────────────┐   │
│   │   ✦  Feeling Lucky?      │   │
│   │   今日运势 · Today's Luck │   │
│   └──────────────────────────┘   │
│                                  │
│   ┌──────────────────────────┐   │
│   │   ☽  Ask the Oracle      │   │
│   │   命盘解读 · My Reading  │   │
│   └──────────────────────────┘   │
└──────────────────────────────────┘
```

Language auto-detected from `navigator.language`. Labels shown in both Chinese and English regardless.

---

### 4.2 "Feeling Lucky" Flow (`/lucky`)

- On page load, immediately calls `GET /api/daily-luck`.
- Streams the response in place.
- No user input at all.
- Response card shows:
  - Today's Chinese date (农历) and 干支 day
  - Overall luck rating (e.g. ★★★★☆)
  - 宜 (auspicious) and 忌 (inauspicious) activities from the almanac
  - A short narrative interpretation (1–2 paragraphs from Claude)
- A "Share" button copies a text summary to clipboard.

---

### 4.3 "Ask the Oracle" Flow (`/oracle`)

**Step 1 — Birth data collection (first visit only)**

A minimal modal/form collects:

| Field | Type | Required |
|---|---|---|
| Name (姓名) | Text | Yes |
| Birth date (出生日期) | Date picker | Yes |
| Birth time (出生时辰) | Time picker (hour precision) | No — shown as optional |
| Biological sex (性别) | Toggle: 男 / 女 | Yes (needed for 紫微) |

On submit, data is saved to `localStorage`. Subsequent visits skip this step and load the saved profile directly (with an "Edit profile" link).

**Step 2 — Chat interface**

A chat thread UI. The system automatically sends a first message after birth data is collected:

> "根据您的生辰八字和紫微命盘，您的日主是 [X]，五行偏 [Y]...
> Based on your BaZi, your day master is [X]..."

Then the user can ask free-form follow-up questions:
- "今年财运怎么样？"
- "What does my love life look like this year?"
- "Should I change jobs?"

Each user message is sent to `/api/chat` along with the pre-computed chart (kept in React state for the session, not re-computed on each message).

---

## 5. API Design

### `GET /api/daily-luck`

**Request:** No body. Server reads today's date.

**Logic:**
1. Get today's Gregorian date.
2. Use `lunar-javascript` to compute:
   - Lunar date (农历年月日)
   - 干支 of the year, month, and day
   - 黄历 宜 and 忌 lists
3. Build a prompt with this structured data.
4. Call Claude API with streaming.

**Response:** `text/event-stream` (SSE), streaming Claude's response.

---

### `POST /api/chat`

**Request body:**
```json
{
  "profile": {
    "name": "王小明",
    "birthDate": "1993-07-15",
    "birthHour": 14,
    "sex": "male"
  },
  "chart": {
    "bazi": { ... },
    "ziwei": { ... }
  },
  "messages": [
    { "role": "user", "content": "今年财运怎么样？" }
  ]
}
```

The `chart` field is optional on the first call; the server computes it from `profile` and returns it in the response so the client can cache it for subsequent calls.

**Logic:**
1. If `chart` is absent, compute it (see Section 6).
2. Build a system prompt that embeds the full chart as structured context.
3. Call Claude API with `messages` history + streaming.

**Response:** `text/event-stream`, streaming Claude's response, with an optional `X-Chart` header on the first call carrying the computed chart JSON for client-side caching.

---

## 6. Chart Computation

Chart computation happens server-side in the API route using `lunar-javascript`.

### 6.1 四柱 BaZi

| Pillar | Source |
|---|---|
| 年柱 (Year) | Lunar year → 天干地支 |
| 月柱 (Month) | Solar term (节气) of birth month → 天干地支 |
| 日柱 (Day) | Lunar day → 天干地支 |
| 时柱 (Hour) | Birth hour mapped to 时辰 (12 two-hour blocks) → 天干地支 |

If birth time is unknown, 时柱 is omitted and the LLM is instructed to note this caveat.

Output structure:
```json
{
  "yearPillar":  { "stem": "癸", "branch": "酉" },
  "monthPillar": { "stem": "丁", "branch": "未" },
  "dayPillar":   { "stem": "甲", "branch": "午" },
  "hourPillar":  { "stem": "甲", "branch": "申" },
  "dayMaster":   "甲",
  "element":     "wood",
  "wuxingBalance": { "metal": 2, "wood": 1, "water": 0, "fire": 2, "earth": 1 }
}
```

### 6.2 紫微斗数 命盘 (北派)

The 紫微 chart is a 12-palace grid. Computation steps:

1. Determine the **命宫** (Life Palace) position from birth month and hour.
2. Determine the **身宫** (Body Palace) from birth year and hour.
3. Place the **紫微星** (Purple Star) using birth day (lunar) and a standard 北派 lookup table.
4. Derive all 14 main stars (十四主星) using their fixed offsets from 紫微.
5. Place the remaining auxiliary stars (辅星/煞星) using year, month, day, hour stems/branches.

Output: a 12-element array, one object per palace:

```json
[
  {
    "palace": "命宫",
    "position": 1,
    "mainStars": ["紫微", "天府"],
    "auxStars": ["左辅", "文昌"],
    "stemBranch": "甲子"
  },
  ...
]
```

---

## 7. LLM Prompt Design

### System Prompt Template (shared base)

```
You are 命理先生 (Master of Destiny), a wise and warm Chinese fortune teller
fluent in classical 生辰八字 and 紫微斗数. You give insightful,
grounded readings — never vague platitudes.

Respond in {language}. If the user writes in Chinese, reply in Chinese.
If in English, reply in English. Mirror their language.

Always ground your interpretation in the chart data provided.
Cite specific stars, pillars, or almanac entries when relevant.
Be encouraging but honest. Keep responses under 300 words unless the
user asks for more detail.
```

### Daily Luck Prompt Addition

```
Today is {gregorianDate} ({lunarDate}, 干支日: {ganzhiDay}).
黄历 宜: {yiList}
黄历 忌: {jiList}

Provide a luck reading for today. Include:
1. An overall luck rating (1–5 stars)
2. The energetic theme of the day based on the 干支
3. One concrete thing to do (from 宜)
4. One thing to avoid (from 忌)
5. A short narrative (2–3 sentences)
```

### Personal Reading Prompt Addition

```
User profile:
- Name: {name}
- Birth: {gregorianDate} ({lunarDate}) at hour {shichen}
- Sex: {sex}

四柱 BaZi:
  Year:  {yearStem}{yearBranch}
  Month: {monthStem}{monthBranch}
  Day:   {dayStem}{dayBranch} ← Day Master: {dayMaster} ({element})
  Hour:  {hourStem}{hourBranch} {or "Unknown — omit time-based analysis"}

五行 balance: {wuxingBalance}

紫微 命盘 (北派):
{palaceGrid as structured text}

{if birthHour unknown}
Note: Birth time was not provided. Omit 时柱 and time-sensitive
palace readings. Mention this caveat once to the user.
{endif}
```

---

## 8. Internationalisation (i18n)

- Language detection: `navigator.language` on the client; `Accept-Language` header on the server.
- Supported locales: `zh-CN`, `zh-TW`, `en`.
- Static UI strings: `next-intl` with locale files under `/messages/`.
- LLM responses: the prompt instructs Claude to mirror the user's input language dynamically — no separate LLM calls per language.

---

## 9. Data Flow Diagram

```
User opens /lucky
      │
      ▼
GET /api/daily-luck
      │
      ├── lunar-javascript: today → 农历, 干支, 宜忌
      │
      ├── Build prompt with almanac data
      │
      └── Claude API (stream) ──► SSE ──► UI renders streamed text


User opens /oracle
      │
      ├── localStorage has profile? ──No──► Show birth data form
      │         │                                    │
      │        Yes                             Save to localStorage
      │         │                                    │
      │         └────────────────────────────────────┘
      │                          │
      ▼                          ▼
POST /api/chat (first call, no chart)
      │
      ├── lunar-javascript: birth data → 四柱 BaZi
      ├── Lookup tables: 四柱 → 紫微 命盘 (北派)
      ├── Build system prompt with chart
      └── Claude API (stream) ──► SSE ──► Chat UI
                                            │
                               Client caches chart in React state
                                            │
                               User sends follow-up message
                                            │
                               POST /api/chat (with cached chart)
                                            │
                               Claude API (stream) ──► Chat UI
```

---

## 10. Open Technical Questions

| # | Question | Recommendation |
|---|---|---|
| OQ-1 | Does `lunar-javascript` cover 紫微 palace computation or just calendar conversion? | Likely calendar only — palace placement logic may need a custom implementation or a second library (e.g. `iztro`). Investigate before sprint 1. |
| OQ-2 | Rate limiting on the Claude API for streaming endpoints | Add simple IP-based rate limiting (e.g. `upstash/ratelimit`) on API routes |
| OQ-3 | How to handle the `X-Chart` header approach for caching — headers may be stripped by some proxies | Alternative: include chart in the first SSE event as a `data: {"type":"chart", ...}` frame |
| OQ-4 | 万年历 宜/忌 data — does `lunar-javascript` expose this? | Check library docs; if not, may need a secondary dataset |

---

## 11. Out of Scope (v1.0)

- User accounts / cloud sync
- Push notifications
- Compatibility readings (合八字)
- Paid tiers
- Native mobile apps
