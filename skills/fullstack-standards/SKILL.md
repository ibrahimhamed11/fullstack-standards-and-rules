---
name: fullstack-standards
description: Universal Full-Stack Engineering Standards, Multi-Provider AI Architecture, and Code Review Enforcer for React, React Native, Node.js, and TypeScript.
---

# Full-Stack Engineering Standards & Architectural Skill

This skill provides an automated code quality engine and architectural blueprints for designing, reviewing, and modernizing full-stack web, mobile, and backend systems.

## When to Activate This Skill
- Designing new feature modules or refactoring legacy codebases.
- Implementing AI engines (Gemini, Claude, OpenAI, Groq) with provider failover.
- Setting up offline-first mobile databases (SQLite/op-sqlite), Zustand stores, or RevenueCat IAP.
- Reviewing Pull Requests or auditing code for anti-patterns.
- Architecting Node.js backend services, S3 pre-signed uploads, and background schedulers.

---

## ⚡ Core Domain Blueprints

### 1. Web (React / Next.js)
- **NO Inline Styles**: Always extract styling to `<Component>.styles.ts` with `SxProps` or `styled()`.
- **NO Static Text**: Every string must use `useTranslation()` (`t('key', 'Default')`).
- **NO Hardcoded Endpoints**: Reference `ENDPOINTS.<domain>.<route>` from `core/endpoints.ts`.
- **NO Component-Level `dir=`**: RTL/LTR is handled globally by Root `CacheProvider` + `ThemeProvider`.
- **Logical CSS Properties**: Use `marginInlineStart`, `paddingInlineStart` instead of physical `marginLeft`/`marginRight`.

### 2. Mobile (React Native / Expo)
- **`StyleSheet.create` Only**: Never pass raw inline style objects to JSX.
- **Offline-First SQLite Architecture**: High-performance local caching using `@op-engineering/op-sqlite` + sync queues.
- **Zustand Domain Stores**: Slice global state into isolated domain stores (`authStore`, `balanceStore`, `offlineQueueStore`).
- **Bi-directional Layout**: Use `I18nManager.isRTL` with `marginStart`, `marginEnd`, `paddingStart`.
- **High-Performance Lists**: Use `@shopify/flash-list` with `getItemLayout` (Never map in `<ScrollView>`).

### 3. Backend (Node.js / Express / NestJS)
- **3-Layer Architecture**: Controller (HTTP) $\to$ Service (Business Logic) $\to$ Repository (Database).
- **Multi-Provider AI Engine**: Provider abstraction (Claude / OpenAI / Gemini / Groq) with prompt localization, context sanitization, and fallback retry.
- **Background Schedulers**: Resilient `node-cron` / BullMQ services for market price polling, reports, and notification dispatches.
- **Pre-signed Cloud Storage**: Direct-to-S3 uploads with `@aws-sdk/s3-request-presigner` and Sharp optimization.
- **RevenueCat Subscriptions**: Webhook-driven entitlement synchronization and tier verification.
- **Zod & Centralized Errors**: Strong input validation and custom `AppError` handling middleware.

---

## 🛠️ MCP Server Integration
This skill also operates as an MCP Server (`mcp-server/`) exposing:
- `list_standards`: Query all available engineering rules.
- `get_standard`: Get in-depth implementation rules and examples.
- `audit_code_snippet`: Check code for rule violations.
- `generate_template`: Generate standard-compliant boilerplate.
