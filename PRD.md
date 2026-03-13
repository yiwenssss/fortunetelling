# Product Requirements Document: Fortune Telling App

**Version:** 1.0
**Date:** 2026-03-13
**Status:** Draft

---

## 1. Product Overview

A fortune telling app rooted in Chinese metaphysics. It gives users insight into their luck and destiny using two classical systems:

- **生辰八字 (BaZi / Eight Characters):** A person's fate chart derived from their birth year, month, day, and hour.
- **紫微斗数 (Zi Wei Dou Shu / Purple Star Astrology):** A detailed destiny chart that maps personality, relationships, career, and life phases using birth data.

The app also consults the **万年历 (Chinese Perpetual Calendar / Almanac)** to give daily, date-specific guidance.

---

## 2. Target Users

| Persona | Description |
|---|---|
| Curious casual user | Wants a quick daily fortune check with no setup |
| Spiritually engaged user | Wants a personal reading tied to their birth data |

---

## 3. Features

### Feature 1 — Today's Luck

**Summary:** A user can ask about their luck for today (or any given date) and receive a reading based on the 万年历.

#### User Stories

**US-1.1 — Daily Luck Query**
> As a user, I want to ask "what is my luck today?" so that I can get guidance for the current day without providing personal information.

**US-1.2 — Date-Specific Luck Query**
> As a user, I want to specify a date (e.g. "what is the luck on March 20?") so that I can plan ahead for important events.

**US-1.3 — Luck Category Breakdown**
> As a user, I want to see luck broken down by category (e.g. wealth, relationships, health, career) so that I can focus on what matters to me.

#### Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-1.1 | The app defaults to the current date (in the user's local timezone) when no date is specified. |
| AC-1.2 | The app accepts natural language date input (e.g. "today", "tomorrow", "March 20", "2026-03-20"). |
| AC-1.3 | The reading is derived from 万年历 data: the Chinese date, 干支 (Heavenly Stems & Earthly Branches) of the day, and relevant 黄历 (almanac) indicators such as 宜 (auspicious activities) and 忌 (inauspicious activities). |
| AC-1.4 | The response includes at least: overall luck rating, one auspicious activity, one activity to avoid. |
| AC-1.5 | The response is presented in both Chinese and English. |
| AC-1.6 | No personal data (name, birthday) is required for this feature. |

---

### Feature 2 — Personalized Fortune Reading

**Summary:** A user provides their name and full birth date/time to receive a deep personal fortune reading using 生辰八字 and 紫微斗数.

#### User Stories

**US-2.1 — Birth Data Input**
> As a user, I want to enter my name and birthday (including birth time if I know it) so that the app can generate a fortune reading specific to me.

**US-2.2 — 八字 Chart Reading**
> As a user, I want to see my 生辰八字 chart so that I can understand my elemental composition and the energies shaping my life.

**US-2.3 — 紫微 Chart Reading**
> As a user, I want to receive a 紫微斗数 reading so that I can get insight into my personality, current life phase, and key life areas.

**US-2.4 — Specific Life Question**
> As a user, I want to ask a specific question (e.g. "Should I change jobs this year?", "When will I find love?") and get an answer grounded in my personal chart.

**US-2.5 — Saving My Profile**
> As a user, I want to save my birth data so that I don't have to re-enter it every time I ask a question.

#### Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-2.1 | The app collects: name, birth date (year, month, day), birth time (optional; defaults to noon if unknown), and biological sex (required for 紫微斗数 chart calculation). |
| AC-2.2 | The app converts the Gregorian birth date to the Chinese lunar calendar date for chart derivation. |
| AC-2.3 | The app calculates and displays the 四柱 (Four Pillars): 年柱, 月柱, 日柱, 时柱 — each showing its 天干 (Heavenly Stem) and 地支 (Earthly Branch). |
| AC-2.4 | The app identifies the user's 日主 (day master element) and provides an interpretation of their elemental balance (五行). |
| AC-2.5 | The app generates a 紫微斗数 命盘 (destiny chart) and interprets at least three key palaces: 命宫 (life palace), 财帛宫 (wealth palace), and 感情宫 (relationships palace). |
| AC-2.6 | When a specific question is asked, the response is grounded in the user's chart and references relevant stars or pillars. |
| AC-2.7 | If birth time is unknown, the app discloses that the reading may be less accurate and omits time-sensitive chart elements. |
| AC-2.8 | User profile (name + birth data) can be saved locally and retrieved on subsequent sessions. |
| AC-2.9 | The response is presented in both Chinese and English. |

---

## 4. Out of Scope (v1.0)

- User accounts / cloud sync of profiles
- Push notifications for daily luck reminders
- Compatibility readings between two people (合八字)
- Feng shui recommendations
- Paid readings or subscription model

---

## 5. Open Questions

| # | Question | Owner |
|---|---|---|
| OQ-1 | What is the source for 万年历 data — a local dataset, an open-source library, or a third-party API? | Engineering |
| OQ-2 | Should birth time use the local time zone of the birth location or the user's current time zone? | Product |
| OQ-3 | What language should the app default to — Chinese, English, or auto-detect? | Product |
| OQ-4 | Is the 紫微斗数 algorithm using 北派 or 南派 system? | Domain Expert |
| OQ-5 | What platform is the v1.0 target — web, iOS, Android, or CLI? | Product |
