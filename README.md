# 🌐 Universal Full-Stack Engineering Standards & Architecture Blueprints

[![Standards](https://img.shields.io/badge/Standards-Enterprise-blue.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](#)
[![React](https://img.shields.io/badge/React-18%2F19-61dafb.svg)](#)
[![React Native](https://img.shields.io/badge/React%20Native-Cross--Platform-61dafb.svg)](#)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-green.svg)](#)

A centralized repository containing production-tested engineering rules, architecture blueprints, code review checklists, and reusable templates for **Web (React/Next.js)**, **Mobile (React Native/Expo)**, and **Backend (Node.js/Express/NestJS)** projects.

---

## 📚 Table of Contents

- [Core Principles](#-the-7-core-engineering-commandments)
- [Documentation Index](#-documentation-index)
- [Web & Frontend Standards](#-web--frontend-react-standards)
- [Mobile & React Native Standards](#-mobile--react-native-standards)
- [Backend & Node.js Standards](#-backend--nodejs-standards)
- [API Layer & Network Architecture](#-api-layer--network-architecture)
- [Code Review & PR Checklist](#-code-review--pr-checklist)
- [Starter Templates](#-starter-templates)

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

## 📂 Documentation Index

| Guide | Description |
|---|---|
| 📄 [Frontend React Standards](rules/FRONTEND_REACT_STANDARDS.md) | Web rules: No inline styles, i18n, Emotion/MUI modular styles, CSS logical properties. |
| 📄 [React Native Standards](rules/MOBILE_REACT_NATIVE_STANDARDS.md) | Mobile rules: `StyleSheet.create`, `I18nManager`, FlashList, Safe Area, Memory management. |
| 📄 [Backend Node.js Standards](rules/BACKEND_NODE_STANDARDS.md) | Node.js rules: Clean Architecture (Controller-Service-Repo), Zod validation, Error handling, Security. |
| 📄 [API & Network Architecture](rules/API_ARCHITECTURE_AND_ENDPOINTS.md) | Domain-driven API modules, Axios singleton, Interceptors, Zero-breakage shim strategy. |
| 📄 [Code Review Checklist](rules/CODE_REVIEW_CHECKLIST.md) | Actionable PR reviewer checklist and automated CI/CD quality gates. |

---

## 📁 Repository Structure

```
├── rules/
│   ├── FRONTEND_REACT_STANDARDS.md     # React (Vite / Next.js / MUI / Tailwind)
│   ├── MOBILE_REACT_NATIVE_STANDARDS.md# React Native & Expo
│   ├── BACKEND_NODE_STANDARDS.md       # Node.js, Express & NestJS
│   ├── API_ARCHITECTURE_AND_ENDPOINTS.md # Domain-driven API Layer
│   └── CODE_REVIEW_CHECKLIST.md        # PR Review Rules & Severity Matrix
├── templates/
│   ├── frontend/
│   │   └── api-module-template.ts      # Domain API module template
│   ├── react-native/
│   │   └── screen-template.tsx         # Clean React Native screen template
│   └── backend/
│       └── controller-service.ts       # Clean Node.js controller & service template
└── .agents/
    └── rules/
        └── coding_standards.md         # Ready-to-use AI Agent instructions
```

---

## 🚀 How to Use in Your Projects

1. **For Team Onboarding**: Share this repository with new developers as the canonical engineering standard.
2. **For PR Reviews**: Link to specific rules in [Code Review Checklist](rules/CODE_REVIEW_CHECKLIST.md) when requesting changes.
3. **For AI Agents (Antigravity, Cursor, Copilot)**: Copy `.agents/rules/coding_standards.md` into your project's `.agents/rules/` directory to automatically enforce these rules during AI generation.

---

## 📄 License
MIT License. Free to use and adapt in personal and commercial software projects.
