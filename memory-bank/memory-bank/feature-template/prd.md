The PRD is written, committed, and pushed to `claude/fortune-app-prd-RLJmU`. Here's a summary of what was formalized:

---

### What's in the PRD

**Feature 1 — Today's Luck** (万年历-based)
- 3 user stories: default daily query, date-specific query, category breakdown
- 6 acceptance criteria covering: date defaulting, natural language input, 干支/黄历 data sourcing, 宜/忌 output, bilingual response, no personal data required

**Feature 2 — Personalized Reading** (生辰八字 + 紫微斗数)
- 5 user stories: data input, 八字 chart, 紫微 chart, specific life question, profile saving
- 9 acceptance criteria covering: required fields (name, date, time, sex), Gregorian→lunar conversion, 四柱 display, 日主 element analysis, 紫微 palace interpretations (命/财/感情), handling unknown birth time, local profile persistence, bilingual output

**Also included:**
- Out-of-scope list for v1.0 (cloud sync, compatibility readings, subscriptions, etc.)
- 5 open questions flagged for the team — particularly important ones are the 万年历 data source and whether to use 北派 vs 南派 for 紫微斗数
