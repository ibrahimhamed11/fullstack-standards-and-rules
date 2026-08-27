---
name: fullstack-standards
description: Universal Full-Stack Engineering Standards, OpenAPI Codegen, Real-time WebRTC/SignalR, Multi-Provider AI, and Code Review Enforcer.
---

# Full-Stack Engineering Standards & Architectural Skill

This skill provides an automated code quality engine and architectural blueprints for designing, reviewing, and modernizing full-stack web, mobile, and backend systems.

## When to Activate This Skill
- Designing new feature modules or refactoring legacy codebases.
- Automating OpenAPI / Swagger client code generation (`generate:api`).
- Implementing real-time communication (WebRTC, SignalR, WebSockets) and video calls.
- Implementing AI engines (Gemini, Claude, OpenAI, Groq) with provider failover.
- Setting up offline-first mobile databases (SQLite/op-sqlite), Zustand stores, or RevenueCat IAP.
- Running automated code hygiene (dead file detection, console log stripping, SonarQube checks).

---

## ⚡ Core Domain Blueprints

### 1. Web (React / Next.js)
- **NO Inline Styles**: Always extract styling to `<Component>.styles.ts` with `SxProps` or `styled()`.
- **NO Static Text**: Every string must use `useTranslation()` (`t('key', 'Default')`).
- **NO Hardcoded Endpoints**: Reference `ENDPOINTS.<domain>.<route>` or use OpenAPI Codegen.
- **NO Component-Level `dir=`**: RTL/LTR is handled globally by Root `CacheProvider` + `ThemeProvider`.
- **Logical CSS Properties**: Use `marginInlineStart`, `paddingInlineStart` instead of physical `marginLeft`/`marginRight`.

### 2. Mobile (React Native / Expo)
- **`StyleSheet.create` Only**: Never pass raw inline style objects to JSX.
- **OpenAPI Client Generation**: Auto-generate type-safe RTK/Axios modules from Swagger specs.
- **Real-Time Video & Chat**: SignalR reconnection lifecycle + WebRTC jitter buffering.
- **Offline-First SQLite Architecture**: High-performance local caching using `@op-engineering/op-sqlite` + sync queues.
- **Zustand Domain Stores**: Slice global state into isolated domain stores.
- **Bi-directional Layout**: Use `I18nManager.isRTL` with `marginStart`, `marginEnd`, `paddingStart`.

### 3. Backend (Node.js / Express / NestJS)
- **3-Layer Architecture**: Controller (HTTP) $\to$ Service (Business Logic) $\to$ Repository (Database).
- **Multi-Provider AI Engine**: Provider abstraction (Claude / OpenAI / Gemini / Groq) with fallback retry.
- **Background Schedulers**: Resilient `node-cron` / BullMQ services for market price polling, reports, and notification dispatches.
- **Pre-signed Cloud Storage**: Direct-to-S3 uploads with `@aws-sdk/s3-request-presigner` and Sharp optimization.
- **Code Hygiene & Janitors**: AST-based unused file discovery and console log stripping.
- **Zod & Centralized Errors**: Strong input validation and custom `AppError` handling middleware.

---

## 🛠️ MCP Server Integration
This skill also operates as an MCP Server (`mcp-server/`) exposing:
- `list_standards`: Query all available engineering rules.
- `get_standard`: Get in-depth implementation rules and examples.
- `audit_code_snippet`: Check code for rule violations.
- `generate_template`: Generate standard-compliant boilerplate.
