# Fortunetelling App - Complete Setup Guide

## Project Structure

```
app/
├── lib/                          # Shared logic and utilities
│   ├── types/index.ts           # TypeScript type definitions
│   ├── charts/index.ts          # BaZi & Ziwei computation using iztro
│   ├── utils/calendar.ts        # Daily luck & lunar calendar
│   ├── prompts/index.ts         # Claude system prompts
│   ├── i18n.config.ts           # Internationalization configuration
│   ├── env.ts                   # Environment variables
│   ├── rate-limit.ts            # Rate limiting middleware
│   └── index.ts                 # Main exports
│
├── app/
│   ├── api/
│   │   ├── daily-luck/route.ts  # GET /api/daily-luck?date=YYYY-MM-DD
│   │   ├── charts/route.ts      # POST /api/charts (BaZi & Ziwei)
│   │   └── chat/route.ts        # POST /api/chat (streaming chat)
│   ├── lucky/                   # Pages for Today's Luck feature (E1)
│   ├── reading/                 # Pages for Personal Reading feature (E2)
│   └── layout.tsx               # Main layout with Tailwind
│
├── components/
│   ├── form/                    # Birth profile form
│   ├── charts/                  # Chart display components
│   ├── chat/                    # Chat interface
│   └── ui/                      # Reusable UI components
│
├── public/icons/                # SVG icons
├── middleware.ts                # i18n locale routing
├── .env.example                 # Environment template
├── .env.local                   # Local environment (git-ignored)
└── package.json                 # Dependencies
```

## Environment Setup

### 1. Install Dependencies

Dependencies are already installed:
- `next` & `react` - Framework
- `tailwindcss` - Styling
- `groq-sdk` - Groq API (free LLM with 10k req/month)
- `iztro` - Ziwei computation
- `lunar-javascript` - Lunar calendar & BaZi
- `next-intl` - Internationalization
- `ratelimit` - Rate limiting utilities

### 2. Configure Environment Variables

Create `.env.local` (copy from `.env.example`):

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local with actual values
GROQ_API_KEY=gsk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Get your Groq API key from: https://console.groq.com

Free tier: 10,000 requests/month. No credit card required!

### 3. Verify Configuration

```bash
npm run dev
# Should start on http://localhost:3000
```

## API Documentation

### Daily Luck Endpoint

**GET** `/api/daily-luck?date=YYYY-MM-DD`

Returns today's or specified date's fortune based on lunar calendar.

**Query Parameters:**
- `date` (optional): Date in YYYY-MM-DD format. Defaults to today.

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2024-03-12",
    "lunarDate": "农历二月初三",
    "heavenlyStem": "甲",
    "earthlyBranch": "寅",
    "zodiacSign": "虎",
    "auspiciousActivities": ["祈福", "出行", "学习"],
    "inauspiciousActivities": ["破土", "手术"],
    "fortuneLevel": "excellent"
  }
}
```

**Example:**
```bash
curl http://localhost:3000/api/daily-luck
curl "http://localhost:3000/api/daily-luck?date=2024-03-15"
```

---

### Charts Endpoint

**POST** `/api/charts`

Compute BaZi (Four Pillars) and Ziwei (Purple Wealth) charts.

**Request Body:**
```json
{
  "name": "张三",
  "birthDate": "1990-06-15",
  "birthTime": "02:30",
  "gender": "M"
}
```

**Parameters:**
- `name` (required): User's name
- `birthDate` (required): Birth date in YYYY-MM-DD format
- `birthTime` (required): Birth time in HH:MM format (24-hour)
- `gender` (required): "M", "F", "男", or "女"

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "name": "张三",
      "birthDate": "1990-06-15",
      "birthTime": "02:30",
      "gender": "M"
    },
    "baziChart": {
      "year": "庚午",
      "month": "甲午",
      "day": "丙午",
      "hour": "丙寅",
      "dayMaster": "丙",
      "dayMasterElement": "火",
      "hiddenStems": {...}
    },
    "ziweiChart": {
      "palaces": [
        {
          "name": "spousePalace",
          "heavenlyStem": "甲",
          "earthlyBranch": "寅",
          "majorStars": ["紫微", "天相"],
          "minorStars": ["左辅", "右弼"],
          "adjunctiveStars": [],
          "brightnesses": {}
        }
        // ... 11 more palaces
      ],
      "soulAndBody": {"soul": "主人", "body": "心"},
      "fiveElementsClass": "金四局",
      "zodiac": "马",
      "horoscope": "..."
    }
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/charts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "birthDate": "1990-06-15",
    "birthTime": "02:30",
    "gender": "M"
  }'
```

---

### Chat Endpoint (Streaming)

**POST** `/api/chat`

Stream Claude's interpretation of charts and answer specific questions.

**Request Body:**
```json
{
  "message": "我想了解我的事业运势",
  "context": {
    "profile": {
      "name": "张三",
      "birthDate": "1990-06-15",
      "birthTime": "02:30",
      "gender": "M"
    },
    "baziChart": {...},
    "ziweiChart": {...},
    "language": "zh-CN"
  }
}
```

**Response:** Server-sent events (text/event-stream)

```
data: {"text":"你的命主是丙火..."}

data: {"text":"聪慧敏捷,具有..."}

data: {"done":true,"text":"你的命主是丙火...聪慧敏捷..."}

data: {"usage":{"input_tokens":245,"output_tokens":156}}
```

**Example with JavaScript:**
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: '我的事业前景如何?',
    context: {
      profile: {...},
      ziweiChart: {...},
      language: 'zh-CN'
    }
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  const lines = text.split('\n').filter(l => l.startsWith('data: '));
  lines.forEach(line => {
    const json = JSON.parse(line.slice(6));
    if (json.text) console.log(json.text);
  });
}
```

---

## Rate Limiting

All API endpoints have rate limiting enabled by default:

- **Max Requests:** 100 per hour
- **Window:** 3600000 ms (1 hour)
- **Identifier:** Client IP address

Response headers include:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1710330000000
```

**Configuration:**
See `.env.local` for rate limiting options:
```
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=3600000
```

---

## Internationalization (i18n)

Supported languages: `zh-CN`, `en`

**Routing:**
- `http://localhost:3000/zh-CN/` → Chinese interface
- `http://localhost:3000/en/` → English interface
- `http://localhost:3000/` → Auto-detects or uses default

**Messages:**
All UI messages are defined in `lib/i18n.config.ts`. Add translations there.

---

## Running the App

### Development
```bash
npm run dev
# http://localhost:3000
```

### Build
```bash
npm run build
```

### Production
```bash
npm run start
```

---

## Key Technologies

| Library | Purpose | Module |
|---------|---------|--------|
| **iztro** | Ziwei (紫微) palace computation | `lib/charts/` |
| **lunar-javascript** | BaZi (八字) & lunar calendar | `lib/charts/`, `lib/utils/` |
| **@anthropic-ai/sdk** | Claude API integration | `app/api/chat/` |
| **next-intl** | i18n & locale routing | `middleware.ts` |
| **tailwindcss** | Styling & UI | `app/` components |

---

## OQ-1 Resolution: iztro Validation ✅

**Question:** Does iztro support 北派 (Northern Sect) palace computation?

**Answer:** YES - Validated and working!

**Evidence:**
- ✅ `iztro.astro.bySolar()` computes full Ziwei charts
- ✅ All 12 palaces correctly mapped
- ✅ Major, minor, and adjunctive stars positioned
- ✅ No need to implement 14-star placement from scratch

**Result:** No blocker for E2 (Personal Reading) in Sprint 3.

---

## Next Steps

### Sprint 2: E1 - Today's Luck Feature
- [ ] T-1.1: Create `/lucky` page UI
- [ ] T-1.2: Integrate daily-luck API
- [ ] T-1.3: Add date picker and filters

### Sprint 3: E2 - Personal Reading Feature
- [ ] T-2.1: Create birth form component
- [ ] T-2.2: Integrate charts API
- [ ] T-2.3: Build chart display components
- [ ] T-2.4: Integrate chat streaming
- [ ] T-2.5: Handle missing birth time (AC-2.7)

---

## Support

For issues or questions:
1. Check existing API responses for error messages
2. Review `lib/` modules for function signatures
3. Check `.env.local` for missing configuration
4. View server logs for detailed errors

Happy coding! 🚀
