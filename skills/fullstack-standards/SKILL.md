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
- Running automated code hygiene (dead file detection, console log stripping, SonarQube checks).
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
- **Zustand Domain Stores**: Slice global state into isolated domain stores.
- **Bi-directional Layout**: Use `I18nManager.isRTL` with `marginStart`, `marginEnd`, `paddingStart`.
- **High-Performance Lists**: Use `@shopify/flash-list` with `getItemLayout` (Never map in `<ScrollView>`).

### 3. Backend (Node.js / Express / NestJS)
- **3-Layer Architecture**: Controller (HTTP) -> Service (Business Logic) -> Repository (Database).
- **Multi-Provider AI Engine**: Provider abstraction (Claude / OpenAI / Gemini / Groq) with fallback retry.
- **Background Schedulers**: Resilient `node-cron` / BullMQ services for market price polling, reports, and notification dispatches.
- **Pre-signed Cloud Storage**: Direct-to-S3 uploads with `@aws-sdk/s3-request-presigner` and Sharp optimization.
- **Code Hygiene & Janitors**: AST-based unused file discovery and console log stripping.
- **Zod & Centralized Errors**: Strong input validation and custom `AppError` handling middleware.

### 4. Universal (every stack)
- **No Emojis / Static Icons**: Never in UI, code, comments, commits, or docs. Icons go through the project's icon component with a semantic name.
- **No Gradients / Invented Colors**: Only design-system tokens. No hex or `rgba()` literals and no self-chosen palette.
- **No New Markdown Files**: Extend the existing docs unless a new file is explicitly requested.
- **Minimal Comments**: Explain why, never what. No banners, no commented-out code.
- **Delete Dead Code**: Unreachable code, unused exports, and orphaned files are removed, not left behind.
- **Reuse on Second Use**: Used in two or more files means one shared component, hook, or utility.

---

## 🛠️ MCP Server Integration
This skill also operates as an MCP Server (`mcp-server/`) exposing:
- `list_standards`: Query all available engineering rules.
- `get_standard`: Get in-depth implementation rules and examples.
- `audit_code_snippet`: Check a single snippet for rule violations.
- `scan_project_structure`: Read a whole project's file structure and detected stack before changing anything.
- `audit_project`: Audit every source file at once; returns violations by file and line, orphaned files, and reuse candidates.

### Standard Working Order
1. `scan_project_structure` to learn the stack and layout.
2. `audit_project` to get the full violation set.
3. Fix by rule, highest severity first, one rule per commit.
4. Re-run `audit_project` to confirm the count dropped.
