---
name: fullstack-standards
description: Universal Full-Stack Engineering Standards, Multi-Provider AI Architecture, and Code Review Enforcer for React, React Native, Node.js, and TypeScript.
---

# Full-Stack Engineering Standards & Architectural Skill

This skill provides an automated code quality engine and architectural blueprints for designing, reviewing, modernizing, and auditing full-stack web, mobile, and backend systems. It incorporates the complete **Neobit Standards Engine** and **neobit MCP Server** tools.

## When to Activate This Skill
- Designing new feature modules or refactoring legacy codebases.
- Implementing AI engines (Gemini, Claude, OpenAI, Groq) with provider failover.
- Setting up offline-first mobile databases (SQLite/op-sqlite), Zustand stores, or RevenueCat IAP.
- Running automated code hygiene (dead file detection, console log stripping, SonarQube checks).
- Reviewing Pull Requests or auditing code for anti-patterns.
- Architecting Node.js backend services, S3 pre-signed uploads, and background schedulers.

---

## ⚡ Core Domain Blueprints & References

Detailed standard specifications are linked below in [`./references/`](./references/):

### 1. Web (React / Next.js)
- **NO Inline Styles**: Always extract styling to `<Component>.styles.ts` with `SxProps` or `styled()`.
- **NO Static Text**: Every string must use `useTranslation()` (`t('key', 'Default')`).
- **NO Hardcoded Endpoints**: Reference `ENDPOINTS.<domain>.<route>` from `core/endpoints.ts`.
- **NO Component-Level `dir=`**: RTL/LTR is handled globally by Root `CacheProvider` + `ThemeProvider`.
- **Logical CSS Properties**: Use `marginInlineStart`, `paddingInlineStart` instead of physical `marginLeft`/`marginRight`.
- 📖 [Frontend Standards Guide](./references/FRONTEND_REACT_STANDARDS.md)

### 2. Mobile (React Native / Expo)
- **`StyleSheet.create` Only**: Never pass raw inline style objects to JSX.
- **Offline-First SQLite Architecture**: High-performance local caching using `@op-engineering/op-sqlite` + sync queues.
- **Zustand Domain Stores**: Slice global state into isolated domain stores.
- **Bi-directional Layout**: Use `I18nManager.isRTL` with `marginStart`, `marginEnd`, `paddingStart`.
- **High-Performance Lists**: Use `@shopify/flash-list` with `getItemLayout` (Never map in `<ScrollView>`).
- 📖 [Mobile Standards Guide](./references/MOBILE_REACT_NATIVE_STANDARDS.md)

### 3. Backend (Node.js / Express / NestJS)
- **3-Layer Architecture**: Controller (HTTP) $\to$ Service (Business Logic) $\to$ Repository (Database).
- **Multi-Provider AI Engine**: Provider abstraction (Claude / OpenAI / Gemini / Groq) with fallback retry.
- **Background Schedulers**: Resilient `node-cron` / BullMQ services for market price polling, reports, and notification dispatches.
- **Pre-signed Cloud Storage**: Direct-to-S3 uploads with `@aws-sdk/s3-request-presigner` and Sharp optimization.
- **Code Hygiene & Janitors**: AST-based unused file discovery and console log stripping.
- **Zod & Centralized Errors**: Strong input validation and custom `AppError` handling middleware.
- 📖 [Backend Standards Guide](./references/BACKEND_NODE_STANDARDS.md)
- 📖 [AI Multi-Provider Architecture](./references/AI_AND_MULTI_PROVIDER_ARCHITECTURE.md)
- 📖 [API Endpoints Architecture](./references/API_ARCHITECTURE_AND_ENDPOINTS.md)
- 📖 [Background Workers & Crons](./references/CRON_JOBS_AND_BACKGROUND_WORKERS.md)

### 4. Code Hygiene, Reviews & Testing
- 📖 [Code Review Checklist](./references/CODE_REVIEW_CHECKLIST.md)
- 📖 [Dead Code Cleaner Guide](./references/CODE_HYGIENE_AND_UNUSED_FILES_CLEANER.md)
- 📖 [Testing & CI/CD Standards](./references/TESTING_AND_CI_CD_STANDARDS.md)
- 📖 [State Management & Caching](./references/STATE_MANAGEMENT_AND_CACHING.md)
- 📖 [Machine-Readable Rules JSON](./references/rules.json)

---

## 🛠️ Neobit MCP Server Integration

This skill connects to the `neobit` MCP server exposing:
- `list_standards`: Query all 20 available engineering rules.
- `get_standard`: Get in-depth implementation rules, regexes, and examples (`id`).
- `scan_project_structure`: Scan directory tree, stack, and file metrics.
- `audit_project`: Run full project compliance audit for violations, dead code, and doc sprawl.
- `audit_file`: Directly audit a single file on disk against all engineering standards.
- `audit_code_snippet`: Check code snippets for rule violations before committing.
