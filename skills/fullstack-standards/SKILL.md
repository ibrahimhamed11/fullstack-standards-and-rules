---
name: fullstack-standards
description: Universal Full-Stack Engineering Standards, Architecture Blueprints, and Code Review Enforcer for React, React Native, Node.js, and TypeScript.
---

# Full-Stack Engineering Standards & Architectural Skill

This skill provides an automated code quality engine and architectural guide for designing, reviewing, and modernizing full-stack applications.

## When to Activate This Skill
- Designing new feature modules or refactoring legacy codebases.
- Reviewing Pull Requests or auditing code for anti-patterns.
- Setting up API layers, state management, or theming (RTL/LTR).
- Implementing React, React Native, or Node.js features.

---

## ⚡ Non-Negotiable Review Rules

### 1. Web (React / Next.js)
- **NO Inline Styles**: Always extract styling to `<Component>.styles.ts` with `SxProps` or `styled()`.
- **NO Static Text**: Every string must use `useTranslation()` (`t('key', 'Default')`).
- **NO Hardcoded Endpoints**: Reference `ENDPOINTS.<domain>.<route>` from `core/endpoints.ts`.
- **NO Component-Level `dir=`**: RTL/LTR is handled globally by Root `CacheProvider` + `ThemeProvider`.
- **Logical CSS Properties**: Use `marginInlineStart`, `paddingInlineStart` instead of physical `marginLeft`/`marginRight`.

### 2. Mobile (React Native / Expo)
- **`StyleSheet.create` Only**: Never pass raw inline style objects to JSX.
- **Bi-directional Layout**: Use `I18nManager.isRTL` with `marginStart`, `marginEnd`, `paddingStart`.
- **High-Performance Lists**: Use `@shopify/flash-list` or `<FlatList>` with `getItemLayout` (Never map in `<ScrollView>`).
- **Safe Area**: Wrap screens with `useSafeAreaInsets()` / `SafeAreaProvider`.

### 3. Backend (Node.js / Express / NestJS)
- **3-Layer Architecture**: Controller (HTTP) $\to$ Service (Business Logic) $\to$ Repository (Database).
- **Zod Validation**: Validate all request body, params, and queries at the controller edge.
- **Centralized Errors**: Throw custom `AppError` instances, caught by the global error middleware.
- **Security**: Always enable `helmet`, CORS whitelist, rate limiting, and structured JSON logs.

---

## 🛠️ MCP Server Integration
This skill also operates as an MCP Server (`mcp-server/`) exposing:
- `list_standards`: Query all available engineering rules.
- `get_standard`: Get in-depth implementation rules and examples.
- `audit_code_snippet`: Check code for rule violations.
- `generate_template`: Generate standard-compliant boilerplate.
