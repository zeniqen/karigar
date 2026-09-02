# Karigar — AI Coding Instructions

## 1. Project Overview

Karigar is a hackathon prototype focused on helping workers/artisans through an AI-powered, voice-based interaction.

The repository is intended to produce a **functional MVP/prototype for demonstration**, not a production-grade platform.

The primary objective is to demonstrate the core idea clearly, reliably, and with as little unnecessary complexity as possible.

---

## 2. Development Philosophy

This is a **hackathon prototype**.

Priorities, in order:

1. Working end-to-end functionality
2. Clear and simple user experience
3. Reliable AI interaction
4. Fast development and iteration
5. Clean, understandable code
6. Production-grade scalability/security only where necessary

Do NOT over-engineer the project.

Prefer a simple implementation that works over a theoretically superior architecture that takes significantly longer to build.

---

## 3. AI Model

The primary AI model for this prototype is:

**Nemotron 3 Nano 30B**

The model will be used for the AI functionality of the application.

When implementing AI functionality:

- Keep prompts explicit and structured.
- Keep AI responsibilities clearly defined.
- Do not rely on the model to perform deterministic logic when normal application code can do it.
- Validate important model outputs before using them.
- Handle model failures gracefully.
- Never expose API keys, credentials, or secrets in source code.
- Keep model configuration in environment variables where appropriate.

The AI should support the application's intended workflow rather than becoming an unnecessarily general-purpose chatbot.

---

## 4. MVP Mindset

Every feature should be evaluated against:

> "Does this help us demonstrate the core Karigar idea?"

If the answer is no, defer the feature unless it is required by another feature.

### Avoid building prematurely

Do not add:

- Complex authentication systems
- Microservices
- Kubernetes
- Unnecessary databases
- Complicated state-management systems
- Elaborate design systems
- Excessive abstractions
- Analytics infrastructure
- Production-scale infrastructure
- Features that are not required for the demo

unless the project requirements explicitly make them necessary.

---

## 5. Architecture

Keep the architecture modular enough to allow iteration, but simple enough that the entire prototype can be understood by the team.

Prefer:

```text
Frontend
   ↓
Backend / API
   ↓
AI Layer
   ↓
Nemotron 3 Nano 30B
```

Add additional services only when there is a concrete requirement for them.

The frontend should handle presentation and user interaction.

The backend should handle application logic, API communication, validation, and orchestration.

The AI layer should isolate model-specific logic such as prompts, model calls, response parsing, and validation.

---

## 6. Coding Rules

### General

- Write straightforward, readable code.
- Prefer explicit code over clever code.
- Keep functions reasonably small and focused.
- Avoid unnecessary abstractions.
- Reuse existing utilities before creating duplicates.
- Do not introduce a dependency unless it provides meaningful value.
- Do not modify unrelated parts of the application while implementing a feature.
- Preserve working functionality.

### Dependencies

Before adding a new dependency:

1. Check whether the existing stack can accomplish the task.
2. Consider whether the dependency is actually necessary.
3. Prefer mature and lightweight dependencies.

Do not add libraries simply because they are popular.

### Configuration

Use environment variables for:

- API keys
- Model endpoints
- Credentials
- Environment-specific configuration
- Other secrets

Never hardcode secrets.

Maintain a `.env.example` containing the required environment variable names without real credentials.

---

## 7. AI Implementation Rules

AI calls should be isolated from the rest of the application as much as practical.

For example:

```text
backend/
└── ai/
    ├── model client
    ├── prompts
    ├── response parsing
    └── validation
```

Do not scatter raw model calls throughout the codebase.

Prompts should be stored in a maintainable location rather than being duplicated across multiple files.

When the model returns structured information, prefer structured output and validate the result.

The application should never blindly trust an AI response when deterministic validation is possible.

---

## 8. Error Handling

The prototype should fail gracefully.

At minimum, handle:

- AI/model unavailable
- AI request timeout
- Invalid AI response
- Network failure
- Invalid user input
- Missing environment variables
- Backend errors

Do not expose raw stack traces or sensitive implementation details to end users.

During development, useful errors may be logged for debugging.

---

## 9. User Experience

The application should be designed around the intended user rather than around the underlying technology.

Keep interactions:

- Simple
- Clear
- Minimal
- Forgiving
- Easy to understand

Avoid unnecessary technical terminology in the user-facing interface.

The user should always have a clear indication of:

- What the application is asking
- What they should do next
- Whether their input was received
- Whether the system is processing
- Whether something went wrong

---

## 10. Scope Control

Before implementing a new feature, determine whether it is:

### Must Have
Required for the core MVP/demo.

### Should Have
Meaningfully improves the demonstration but is not essential.

### Nice to Have
Useful only if time permits.

### Out of Scope
Not required for the current prototype.

Build **Must Have** features first.

Do not allow Nice-to-Have features to delay the core working demo.

---

## 11. Working With the User

When asked to implement something:

### First

Understand the existing project structure and relevant code.

### Then

Briefly state:

- What you intend to change
- Which files you expect to modify/create
- Any important assumptions

### Then

Implement the requested change.

Do not ask unnecessary questions when the intent is sufficiently clear.

If an important requirement is genuinely ambiguous and could materially change the implementation, ask before making a large architectural decision.

---

## 12. Planning

For substantial features, plan before coding.

A useful plan should identify:

1. User-facing behavior
2. Required frontend changes
3. Required backend changes
4. AI/model changes
5. Data requirements
6. API changes
7. Testing approach

Do not create a massive plan for a small feature.

Plans should be proportional to the task.

---

## 13. Testing

Every implemented feature should have a practical way to verify it.

For each feature, consider:

- Happy path
- Invalid input
- AI failure
- Network/backend failure
- Empty/missing data

For a hackathon prototype, prioritize meaningful end-to-end testing over exhaustive test coverage.

---

## 14. Git

Keep commits small and meaningful.

Prefer commits such as:

```text
feat: initialize application
feat: add worker registration
feat: add language selection
feat: add voice interaction
feat: integrate AI conversation
fix: handle AI request failures
```

Do not combine unrelated changes into one commit.

Do not rewrite or delete existing history unless explicitly asked.

---

## 15. Important Rule

**Do not make assumptions about product requirements that are not documented.**

If the project requirements are unclear:

- Identify the uncertainty.
- Make the smallest reasonable assumption if it does not materially affect the architecture.
- Otherwise ask the user.

Do not invent major features, workflows, user types, or technical requirements.

---

## 16. Current Project Status

The repository is currently empty and is being built from scratch.

The immediate goal is to establish the basic project structure and then implement the Karigar MVP incrementally.

Do not assume that technologies, frameworks, databases, APIs, or deployment platforms have already been selected unless they are explicitly documented in this repository or provided by the user.

---

## 17. Definition of Done

A feature is considered complete when:

- The intended behavior works end-to-end.
- The implementation fits the existing architecture.
- Basic failure cases are handled.
- No secrets are exposed.
- Existing functionality is not unnecessarily broken.
- The feature can be demonstrated easily.
- The implementation is appropriate for a hackathon prototype.

When in doubt:

> **Keep it simple. Make it work. Make it demonstrable.**