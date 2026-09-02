# Karigar — Technical Build Guide

## Combined Tech Stack, Skill Passport, and No-Smartphone Access Plan

---

## Part 1 — Skill Passport: Tech Stack + Step-by-Step Implementation Plan

---

## 1. System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        MOBILE APP (Frontend)                    │
│         React Native / Flutter — voice-first, low-bandwidth      │
└───────────────────────────┬──────────────────────────────────┘
                            │ REST/WebSocket
┌───────────────────────────▼──────────────────────────────────┐
│                         BACKEND API                              │
│              Node.js (Express) or Django REST Framework            │
├──────────────┬───────────────┬───────────────┬─────────────────┤
│  Passport     │   Circles      │   CT Score     │   Auth &        │
│  Service      │   Service      │   Engine       │   User Mgmt      │
└──────┬────────┴───────┬────────┴───────┬────────┴───────┬─────────┘
      │                │                │                │
┌─────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
│ Sarvam AI   │  │ PostgreSQL   │  │ PostgreSQL   │  │ Firebase /   │
│ (STT/TTS/   │  │ (circles,    │  │ (score       │  │ Auth0        │
│ Translate)  │  │ payments)    │  │ history)     │  │              │
└─────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
      │
┌─────▼──────┐
│ LLM API     │
│ (Claude/    │
│ GPT) for    │
│ structuring │
└─────────────┘
```

---

## 2. Full Tech Stack

### Frontend
| Component | Tool | Why |
|---|---|---|
| Mobile app | **React Native** (or Flutter) | Cross-platform, single codebase for Android/iOS — Android matters most here given the user base |
| UI state | React Context / Redux Toolkit | Manage conversation state, circle data, score data |
| Voice recording | `react-native-audio-recorder-player` or `expo-av` | Capture worker's spoken responses for Sarvam STT |
| Offline support | `redux-persist` + SQLite (`react-native-sqlite-storage`) | Cache passport/circle data locally, sync when back online |
| Push notifications | Firebase Cloud Messaging | Payment reminders, circle updates |

### Backend
| Component | Tool | Why |
|---|---|---|
| API server | **Node.js + Express** (or Django REST Framework if the team is more Python-comfortable) | Fast to build REST endpoints for hackathon timeframe |
| Authentication | Firebase Auth or Auth0 (phone-number OTP login) | Most workers will log in via phone number, not email |
| Database | **PostgreSQL** | Relational data (users, circles, contributions, references) fits well; use Supabase for a free hosted Postgres + instant REST layer if time is tight |
| File storage | Firebase Storage / AWS S3 | Store uploaded work photos/videos |
| Background jobs | node-cron or a simple queue (BullMQ) | Payment reminders, freshness-check nudges |
| Hosting | Render / Railway / Vercel (backend) — all have generous free tiers, fast to deploy for a hackathon | Avoid AWS/GCP setup overhead unless someone on the team is already fluent in it |

### Conversational AI (Skill Passport intake)
| Component | Sarvam AI Model/Endpoint | What it does |
|---|---|---|
| Speech-to-Text | **Saaras v3** via `/speech-to-text` (REST) or `/speech-to-text/ws` (WebSocket, real-time) | Transcribes the worker's spoken answers; supports `transcribe`, `translate`, `verbatim`, `translit`, `codemix` modes |
| Speech-to-Text + Translate | `/speech-to-text-translate` | One call to transcribe *and* translate directly to English — useful if you want the passport summary auto-standardized |
| Text-to-Speech | **Bulbul v3** via `/text-to-speech` | Converts the AI's questions into natural spoken audio in the worker's language |
| Text Translation | **Sarvam-Translate** (formal, 22-language coverage) or **Mayura** (colloquial/code-mixed Hinglish) | Standardizes the final structured summary for employer search |
| Language ID | `/language-identification` (if needed) | Auto-detect the worker's spoken language if not manually selected |
| Chat/reasoning | Sarvam's own chat completion model, or route transcripts to Claude/GPT | Generates the AI's follow-up questions and the final structured skill summary |

**Practical note:** Use the **REST batch endpoint** for the hackathon MVP (record full answer → send audio file → get transcript back) rather than the WebSocket streaming API — it's far simpler to implement under time pressure. Streaming (`saaras:v3-realtime`) is worth mentioning in your pitch as the "production version" upgrade path.

**Pricing to know:** Sarvam's standard STT pricing is roughly ₹1.5/minute of audio — worth noting if a judge asks about unit economics, and cheap enough to demo freely with free signup credits.

### AI structuring layer
| Component | Tool | Why |
|---|---|---|
| LLM for summarization | Claude or GPT via API | Takes the transcribed conversation + Sarvam's translation and outputs a structured JSON skill profile (trade, years of experience, specializations, factual summary line) |
| Prompt design | Strict system prompt forcing factual, non-embellished output | Prevents the AI from generating résumé-style exaggeration — this was flagged earlier as a key credibility risk |

### Lending Circles
| Component | Tool | Why |
|---|---|---|
| Payments | **UPI deep links** (e.g., generate a `upi://pay` intent link, or integrate Razorpay/Cashfree UPI plugin for tracking) | Keeps actual money peer-to-peer; platform never holds custody, avoiding NBFC regulatory scope |
| Circle logic | Custom backend service — rotation scheduling, contribution tracking, dispute flags | This is core business logic, not a third-party tool |
| Reminders | Firebase Cloud Messaging + SMS fallback (Twilio or MSG91 for Indian SMS) | Many users may not have reliable app notifications |

### CT Score Engine
| Component | Tool | Why |
|---|---|---|
| Scoring logic | Custom backend service (weighted formula over repayment %, completion rate, tenure, references, disputes) | This is your core IP — keep it in your own service, not a third-party black box |
| Score history | PostgreSQL table logging score changes over time | Needed for the "freshness" and "trend" features |

---

## 3. Data Model (Simplified Schema)

```
users
 ├─ id, phone_number, preferred_language, created_at

skill_passports
 ├─ id, user_id, trade_category, years_experience,
 │   structured_summary (text), raw_transcript (text),
 │   verified_at, freshness_score

work_samples
 ├─ id, passport_id, media_url, type (photo/video), ai_verified (bool)

references
 ├─ id, passport_id, referrer_name, referrer_phone,
 │   verification_status, verification_transcript

circles
 ├─ id, name, contribution_amount, cycle_length, max_members, status

circle_members
 ├─ id, circle_id, user_id, join_order, joined_at

contributions
 ├─ id, circle_id, user_id, cycle_number, amount, status (paid/missed), paid_at

payouts
 ├─ id, circle_id, user_id, cycle_number, amount, paid_at

ct_scores
 ├─ id, user_id, tier, score_breakdown (json), computed_at
```

---

## 4. Step-by-Step Build Plan

### Phase 0 — Setup (Day 1, first few hours)
1. Set up repo, choose Node/Express or Django, scaffold basic REST API
2. Set up PostgreSQL (Supabase is fastest for a hackathon — free tier, instant connection string)
3. Sign up for a Sarvam AI API key, test a basic STT call with a sample audio file via `curl` before writing any app code
4. Set up React Native app shell with basic navigation (Login → Passport → Circles → Score)

### Phase 1 — Skill Passport (core feature, build first)
1. Build phone-number OTP login (Firebase Auth is fastest)
2. Build the conversation screen: record audio → send to Sarvam `/speech-to-text` → get transcript
3. Hardcode a simple sequence of 4-5 questions to start (don't build dynamic follow-up logic yet — that's a stretch goal)
4. Send the full transcript to an LLM with a strict prompt: *"Summarize this worker's skills factually in 1-2 sentences. Do not embellish. Extract: trade, years of experience, specializations."*
5. Display the structured passport to the user for confirmation
6. Add photo/video upload for work samples (basic file upload, skip AI verification for MVP)

### Phase 2 — Lending Circles
1. Build circle creation (name, contribution amount, cycle length, member limit)
2. Build join-circle flow
3. Build a simple rotation scheduler (member order = join order, one payout per cycle)
4. Build contribution tracking — mark paid/unpaid manually or via UPI deep link confirmation
5. Build a basic circle dashboard showing cycle progress, who's paid, whose turn is next

### Phase 3 — CT Score
1. Write the scoring formula as a simple weighted function:
   ```
   score = (0.4 × repayment_rate) + (0.25 × completion_rate) +
           (0.2 × tenure_normalized) + (0.15 × reference_count_normalized)
   ```
2. Map the numeric output to tiers (New / Building / Reliable / Highly Trusted)
3. Build the score display screen with the breakdown ("why this score")
4. Recompute score after every contribution/payout event

### Phase 4 — Polish for demo
1. Seed the database with 2-3 realistic demo circles and passports so the live demo doesn't start from zero
2. Record a demo video as backup in case live Sarvam API calls fail on stage (Wi-Fi at venues is unreliable)
3. Prepare the answers to the three questions judges will likely ask: *"How do you prevent fake accounts?", "Why not just use CIBIL?", "How do you avoid holding money/regulatory issues?"*

---

## 5. What to Cut for a Hackathon Timeframe (Be Honest About Scope)

Build these for the demo:
- Sarvam-powered voice intake (even with fixed questions, not dynamic follow-ups)
- Basic circle creation, joining, and contribution tracking
- CT Score v1 with explainable breakdown

Fake/mock these for the demo, but mention them as "next":
- Reference verification calls (show a mockup screen instead of building live outbound calling)
- Government scheme matching (a static lookup table for 3-4 schemes is enough to demo the concept)
- Video work verification via computer vision (mention as roadmap; genuinely hard to build well in hackathon time)

Skip entirely, mention only in the pitch:
- e-Shram interoperability
- Micro-insurance
- Employer reliability signal

---

## 6. Suggested Team Split (if working in a team)

| Role | Owns |
|---|---|
| Backend/API | Circle logic, CT Score engine, database schema |
| AI/Integration | Sarvam API integration, LLM prompt design, structuring pipeline |
| Frontend/Mobile | React Native app, screens, offline caching |
| Design/Pitch | UI polish, demo script, slide deck, judge Q&A prep |

---

## 7. Quick Reference — Sarvam AI Endpoints Used

| Endpoint | Purpose |
|---|---|
| `POST /speech-to-text` | Transcribe worker's recorded audio (batch, REST) |
| `POST /speech-to-text-translate` | Transcribe + translate directly to English in one call |
| `POST /text-to-speech` | Convert AI questions into spoken audio (Bulbul v3) |
| `POST /translate` | Translate structured summaries between languages (Sarvam-Translate / Mayura) |
| `POST /language-identification` | Auto-detect spoken language if not pre-selected |
| `/speech-to-text/ws` | Real-time streaming STT — upgrade path post-hackathon, not needed for MVP |

Docs: `docs.sarvam.ai` — get an API key from the Sarvam dashboard, test with a `curl` call before wiring it into the app.


---

## Part 2 — Feature: Access Without a Smartphone

## Problem

Karigar's target users are informal workers/artisans, many of whom do not own
a smartphone or have reliable internet access. A design that assumes an
app-based, always-online experience excludes the core user this project is
meant to serve.

## Goal

Let a worker interact with Karigar using only a basic phone (any handset,
voice call, no app install, no internet required).

## Chosen Approach: IVR (voice call system)

The worker dials a phone number (or receives a callback) and interacts
entirely by speaking or pressing keys.

- No smartphone or internet required.
- Matches the project's voice-first concept directly.
- The AI reasoning layer (Nemotron) sits behind ASR/TTS — the phone call is
  just the transport; the model never "knows" it's a phone call.
- **Sarvam AI** handles the ASR/TTS layer, since it supports Indian
  languages that Nemotron itself does not — this closes the language gap
  noted in Open Question 3 below.
- DTMF (keypad input) is supported as a fallback when speech recognition is
  uncertain.
- Call flows are kept short — aim for 3–4 prompts per session for the demo.

## Other Approaches Considered

| Approach | Verdict |
|---|---|
| Missed-call + callback | Good for onboarding/sign-up step; pairs well with IVR |
| USSD menus | Requires telecom partnership; out of scope for hackathon timeframe |
| SMS-based interaction | Useful fallback channel, not primary |
| Assisted access (agent/kiosk) | Good narrative for judges, not something to build |

## Architecture Impact

```text
Phone call (voice or DTMF)
   ↓
Telephony layer (webhook / call handling)
   ↓
ASR — Sarvam AI (speech-to-text, local language)
   ↓
Backend / AI Layer (existing Nemotron pipeline)
   ↓
TTS — Sarvam AI (text-to-speech, local language)
   ↓
Response spoken back to caller
```

This adds a **telephony layer** to the existing architecture. It does not
replace the AI layer — it's a new front door in addition to (or instead of)
a web/app front door.

## Open Questions (need answers before building)

1. Is real telephony integration (e.g. Exotel/Knowlarity/Twilio) in scope for
   the hackathon, or will the demo simulate the call flow (e.g. a mic button
   that mimics prompt–response turns) while the phone deployment path is
   described to judges rather than built?
2. Does the entire user flow happen over the phone call, or is voice one
   input method into a system that also has a lightweight web view (e.g. for
   NGOs/organizers to see worker data)?
3. ~~Which language(s) must ASR/TTS support for the demo?~~ **Resolved:**
   Sarvam AI handles ASR/TTS and supports Indian languages, so Nemotron
   itself can operate on the English/normalized text Sarvam produces. Still
   to decide: which specific language(s) to demo with, out of the ones
   Sarvam supports.

## MVP Scope

**Must Have**
- One working voice interaction over a real or simulated phone call
- ASR → AI layer → TTS round trip in at least one local language (or English,
  if language scope is deferred per Q3 above)

**Should Have**
- DTMF fallback for unclear speech input
- Missed-call callback as an onboarding step

**Nice to Have**
- SMS fallback channel

**Out of Scope (for this hackathon)**
- USSD integration
- Multi-language support beyond the single demo language
- Production-grade telephony infrastructure (queueing, scaling, redundancy)

## Testing Considerations

- Happy path: worker completes a full call successfully
- Noisy audio / unclear speech → falls back to DTMF or a clarifying prompt
- Call drops mid-interaction → system doesn't lose partial progress silently
- AI/model timeout during a call → caller hears a graceful message, not dead air
