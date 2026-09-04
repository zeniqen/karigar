# Karigar — AI Coding Instructions

## 1. Project Overview

Karigar is a hackathon prototype focused on empowering the informal workforce (artisans and workers) through an AI-powered, voice-first ecosystem. It bridges the gap between skill and opportunity by focusing on three core pillars:

- **Skill Passport (Identity)**: A professional identity built via natural voice interaction, structured by AI to recognize expertise without needing formal resumes.
- **CT Score (Trust)**: A "Community Trust" score that converts reliability and tenure into a verifiable credit-like metric.
- **Lending Circles (Finance)**: Community-powered rotating savings and credit groups to enable financial growth without traditional banking.

The primary objective is to produce a **functional, high-fidelity MVP** that demonstrates these core ideas clearly and reliably.

---

## 2. Development Philosophy

This is a **hackathon prototype**. Priorities, in order:

1. Working end-to-end functionality
2. High-fidelity, intuitive user experience
3. Reliable AI interaction
4. Fast development and iteration
5. Clean, understandable code
6. Production-grade scalability/security only where necessary

Do NOT over-engineer. Prefer a simple implementation that works and looks great over a complex architecture.

---

## 3. AI Model

The primary AI model for this prototype is: **Nemotron 3 Nano 30B**.

When implementing AI functionality:
- Keep prompts explicit and structured.
- Keep AI responsibilities clearly defined.
- Do not rely on the model for deterministic logic when normal code can handle it.
- Validate important model outputs before use.
- Handle model failures gracefully.
- Never expose API keys, credentials, or secrets in source code.

---

## 4. MVP Mindset

Evaluate every feature against: *"Does this help demonstrate the core Karigar identity and trust system?"*

Avoid premature building of:
- Complex authentication systems
- Microservices/Kubernetes
- Unnecessary databases
- Elaborate design systems (keep it lean but polished)
- Analytics infrastructure

---

## 5. Design Identity

Karigar uses a "Modern Heritage" aesthetic—combining traditional warmth with high-end digital polish.

### Visual Language
- **Style**: Glassmorphism (backdrop-blur, translucency, soft shadows), minimalist animations, and organic interactions (e.g., ink effects).
- **Palette**:
  - `Cream (#FFF8EA)`: Dominant background.
  - `Brown (#5A4636)`: Primary text/headings.
  - `Green (#2F6B4F)`: Primary accent and CTAs.
- **Typography**:
  - `Yatra One`: Headings (cultural/heritage feel).
  - `Astra Sans` / `Manrope`: Body and UI (clean, modern readability).

---

## 6. Architecture

Keep the architecture modular but simple:
`Frontend (HTML/CSS/JS)` $\rightarrow$ `Backend / API` $\rightarrow$ `AI Layer` $\rightarrow$ `Nemotron 3 Nano 30B`

- **Frontend**: Handles presentation and user interaction.
- **Backend**: Handles application logic, orchestration, and API communication.
- **AI Layer**: Isolates prompts, model calls, and response parsing.

---

## 7. Coding Rules

### General
- Write straightforward, readable code.
- Prefer explicit code over clever code.
- Reuse existing utilities before creating duplicates.
- Do not modify unrelated parts of the application while implementing a feature.

### Dependencies
- Check if the existing stack can accomplish the task first.
- Prefer mature and lightweight dependencies.

### Configuration
- Use environment variables for API keys, endpoints, and secrets.
- Maintain a `.env.example`.

---

## 8. AI Implementation Rules

Isolate AI calls from the rest of the application.
- Store prompts in a maintainable location.
- Prefer structured output and validate results.
- Never blindly trust an AI response when deterministic validation is possible.

---

## 9. Error Handling

The prototype should fail gracefully. Handle:
- AI/model unavailability or timeouts.
- Invalid AI responses.
- Network failures and invalid user input.
- Missing environment variables.

---

## 10. User Experience

Design for the end-user (artisans), not the technology.
- Keep interactions simple, clear, and forgiving.
- Avoid technical terminology in the UI.
- Provide clear feedback: What is the system asking? Is it processing? Did something go wrong?

---

## 11. Scope Control

Categorize features:
- **Must Have**: Required for core MVP/demo.
- **Should Have**: Meaningfully improves the demo.
- **Nice to Have**: Only if time permits.
- **Out of Scope**: Not required for the prototype.

---

## 12. Planning & Testing

For substantial features:
1. Define user-facing behavior.
2. Plan frontend, backend, and AI changes.
3. Identify data requirements and API changes.

**Testing**: Prioritize end-to-end "Happy Path" verification over exhaustive coverage. Verify:
- Happy path $\rightarrow$ Invalid input $\rightarrow$ AI failure $\rightarrow$ Network failure.

---

## 13. Git

- Small, meaningful commits.
- Follow convention: `feat:`, `fix:`, `style:`, `refactor:`.
- End commit messages with: `Co-Authored-By: Claude Code <noreply@anthropic.com>`.

---

## 14. Current Project Status

The core frontend structure is established:
- **Landing Page**: Completed with Hero, Value Proposition, and Feature sections.
- **Onboarding Flow**: Implemented interactive screens for Welcome, Voice Conversation (with visual feedback), Passport Generation, and Work Sample uploads.
- **Marketplace**: Basic implementation for artisan discovery and gallery view.
- **Design System**: Established core palette and Glassmorphism visual language.

---

## 15. Definition of Done

A feature is complete when:
- The intended behavior works end-to-end.
- The implementation fits the architecture.
- Basic failure cases are handled.
- No secrets are exposed.
- **Visual Polish**: The UI matches the Design Identity (Glassmorphism, correct colors, smooth transitions).
- The feature can be demonstrated easily.
