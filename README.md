# 🌐 Universal Full-Stack Engineering Standards & Architecture Blueprints

[![Standards](https://img.shields.io/badge/Standards-Enterprise-blue.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](#)
[![React](https://img.shields.io/badge/React-18%2F19-61dafb.svg)](#)
[![React Native](https://img.shields.io/badge/React%20Native-Cross--Platform-61dafb.svg)](#)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-green.svg)](#)
[![MCP Server](https://img.shields.io/badge/MCP-Ready-purple.svg)](#)

A centralized repository containing production-tested engineering rules, architecture blueprints, code review checklists, starter templates, and an **MCP Server / Skill** for **Web (React/Next.js)**, **Mobile (React Native/Expo)**, and **Backend (Node.js/Express/NestJS)** projects.

---

## 📚 Table of Contents

- [Core Principles](#-the-7-core-engineering-commandments)
- [MCP Server & AI Skill Integration](#-mcp-server--ai-skill-integration)
- [Documentation Index](#-documentation-index)
- [Web & Frontend Standards](#-web--frontend-react-standards)
- [Mobile & React Native Standards](#-mobile--react-native-standards)
- [Backend & Node.js Standards](#-backend--nodejs-standards)
- [Multi-Provider AI Architecture](#-ai--multi-provider-architecture)
- [Background Schedulers & Cron Jobs](#-schedulers--cron-jobs)
- [Code Hygiene & Dead-Code Janitors](#-code-hygiene--janitors)
- [Code Review Checklist](#-code-review-checklist)

---

## ⚡ The 7 Core Engineering Commandments

1. **ZERO Inline Styles**: No `style={{ ... }}` in JSX or TSX. Use modular styles, StyleSheet, or design token utilities.
2. **ZERO Hardcoded Strings**: All user-facing strings must use internationalization (`i18n`).
3. **ZERO Hardcoded Endpoints**: All network calls must reference a centralized `ENDPOINTS` dictionary.
4. **ZERO Direct HTTP Calls in Presentation Components**: All networking must pass through domain API services.
5. **ZERO Component-Level Direction Overrides**: RTL/LTR must be driven globally by the root layout/theme.
6. **ZERO `any` Types**: Strict TypeScript contracts for all DTOs, parameters, and responses.
7. **Strict Separation of Concerns**: Divide features into UI Views, Logic Hooks, and Modular Styles.

---

## 🤖 MCP Server & AI Skill Integration

### 1. Using with Claude Code / Claude Desktop
Add the MCP Server to your `claude_desktop_config.json` or `.mcp.json`:

```json
{
  "mcpServers": {
    "fullstack-standards": {
      "command": "node",
      "args": ["/path/to/fullstack-standards-and-rules/mcp-server/dist/index.js"]
    }
  }
}
```

### 2. Available MCP Tools
- `list_standards`: Lists all available engineering rules categorized by domain.
- `get_standard(id)`: Returns full documentation and Good vs Bad examples for a specific rule.
- `audit_code_snippet(code)`: Automated linter that scans code for inline styles, hardcoded text, raw URLs, and manual direction overrides.

### 3. Using with Google Antigravity & Claude Code
- **Antigravity Custom Skill**: `skills/fullstack-standards/SKILL.md` is ready to drop into `.agents/skills/`.
- **Claude Code Standards**: `CLAUDE.md` can be copied directly to project roots to enforce rules during code generation.

---

## 📂 Documentation Index

| Guide | Description |
|---|---|
| 📄 [Frontend React Standards](rules/FRONTEND_REACT_STANDARDS.md) | Web rules: No inline styles, i18n, Emotion/MUI modular styles, CSS logical properties. |
| 📄 [React Native Standards](rules/MOBILE_REACT_NATIVE_STANDARDS.md) | Mobile rules: `StyleSheet.create`, SQLite offline-first, `I18nManager`, FlashList, Safe Area. |
| 📄 [Backend Node.js Standards](rules/BACKEND_NODE_STANDARDS.md) | Node.js rules: Clean Architecture (Controller-Service-Repo), Zod validation, Error handling, Security. |
| 📄 [Multi-Provider AI Architecture](rules/AI_AND_MULTI_PROVIDER_ARCHITECTURE.md) | Agnostic LLM engine with Claude, Gemini, OpenAI, Groq fallback and context sanitization. |
| 📄 [Schedulers & Background Cron Jobs](rules/CRON_JOBS_AND_BACKGROUND_WORKERS.md) | Clean cron architectures, rate syncing, notification dispatchers, and distributed locks. |
| 📄 [Code Hygiene & Dead-Code Janitors](rules/CODE_HYGIENE_AND_UNUSED_FILES_CLEANER.md) | AST-based orphaned file finders, console log strippers, and SonarQube quality gates. |
| 📄 [API & Network Architecture](rules/API_ARCHITECTURE_AND_ENDPOINTS.md) | Domain-driven API modules, Axios singleton, Interceptors, Zero-breakage shim strategy. |
| 📄 [State Management & Caching](rules/STATE_MANAGEMENT_AND_CACHING.md) | TanStack Query, Zustand stores, RTK Query, Redis cache-aside patterns. |
| 📄 [Testing & CI/CD Pipeline](rules/TESTING_AND_CI_CD_STANDARDS.md) | Vitest, React Testing Library, Playwright, GitHub Actions workflow. |
| 📄 [Code Review Checklist](rules/CODE_REVIEW_CHECKLIST.md) | Actionable PR reviewer checklist and automated CI/CD quality gates. |

---

## 📁 Repository Structure

```
├── rules/
│   ├── FRONTEND_REACT_STANDARDS.md             # React (Vite / Next.js / MUI / Tailwind)
│   ├── MOBILE_REACT_NATIVE_STANDARDS.md        # React Native, Expo & SQLite
│   ├── BACKEND_NODE_STANDARDS.md               # Node.js, Express & NestJS
│   ├── AI_AND_MULTI_PROVIDER_ARCHITECTURE.md   # Multi-Model AI Engine & Failover
│   ├── CRON_JOBS_AND_BACKGROUND_WORKERS.md     # Scheduler patterns & Background Tasks
│   ├── CODE_HYGIENE_AND_UNUSED_FILES_CLEANER.md# AST Dead-code finders & Log strippers
│   ├── API_ARCHITECTURE_AND_ENDPOINTS.md       # Domain-driven API Layer
│   ├── STATE_MANAGEMENT_AND_CACHING.md         # Zustand, React Query & Redis
│   ├── TESTING_AND_CI_CD_STANDARDS.md          # Testing pyramid & GitHub Actions
│   └── CODE_REVIEW_CHECKLIST.md                # PR Review Rules & Severity Matrix
├── mcp-server/                                 # Model Context Protocol Server
│   ├── src/index.ts                            # MCP Server implementation
│   ├── package.json
│   └── tsconfig.json
├── skills/
│   └── fullstack-standards/
│       └── SKILL.md                            # Antigravity & Claude Custom Skill
├── templates/
│   ├── frontend/api-module-template.ts
│   ├── react-native/screen-template.tsx
│   └── backend/controller-service.ts
├── CLAUDE.md                                   # Claude Code system prompt instructions
└── .agents/rules/coding_standards.md           # Agent workspace rules
```

---

## 📄 License
MIT License. Free to use and adapt in personal and commercial software projects.
