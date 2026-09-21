---
name: neobit-standards
description: >-
  Neobit Full-Stack Code Quality, Architecture Standards, and Automated Audit Engine for React, React Native, Node.js, and TypeScript. Use when auditing codebases, enforcing architectural invariants, checking code against Neobit standards, reviewing PRs, removing dead code, or utilizing the neobit MCP server.
---

# 🛡️ Neobit Full-Stack Architecture, Standards & Audit Skill

This skill provides an automated code quality engine and architectural rulebook for designing, reviewing, modernizing, and auditing full-stack web, mobile, and backend systems using the **Neobit Standards Engine** and **neobit MCP Server**.

---

## ⚡ When to Activate This Skill
- When auditing any project or code snippet for architectural anti-patterns or standards compliance.
- When designing or refactoring React (Next.js/Vite), React Native, or Node.js services.
- When creating new frontend/mobile components (requires the 3-way file separation pattern).
- When reviewing Pull Requests or doing automated code hygiene / dead code elimination.
- When the user asks to "audit with neobit", "check neobit standards", "apply fullstack rules", or "clean unused code".

---

## 🛠️ Neobit MCP Server Integration

When the `neobit` MCP server is available, invoke tools via `call_mcp_tool`:

| MCP Tool | Primary Arguments | Purpose |
| :--- | :--- | :--- |
| `audit_project` | `{ path: "/path/to/project", rule?: "optional-rule-id" }` | Audits every source file against all standards. Detects per-file violations, orphaned files, and markdown sprawl. |
| `audit_file` | `{ path: "/path/to/file.tsx" }` | Audits a single file on disk against all engineering standards. Returns line-by-line violations. |
| `audit_code_snippet` | `{ code: "const x = ...", filePath: "src/Foo.tsx" }` | Audits a specific block of code for rule violations before writing to disk. |
| `scan_project_structure` | `{ path: "/path/to/project" }` | Analyzes project stack, directory weights, source vs markdown counts. |
| `list_standards` | `{ category?: "Frontend" }` | Returns all 20 registered Neobit architectural standards. |
| `get_standard` | `{ id: "standard-id" }` | Returns in-depth rule description, severity, regex patterns, and examples. |

---

## 📋 The Core Neobit Standards & Rules

Detailed reference manuals are located in [`./references/`](./references/) and boilerplate templates in [`./templates/`](./templates/):

### 1. Clean Architecture & Structure
- **`use-path-aliases`** (`BLOCKER`):
  - *Rule*: Never use deep, fragile relative imports like `../../..`. Always use configured path aliases (`@/...`, `@components/...`, `@utils/...`, `@hooks/...`, `@services/...`).
- **`separate-ui-logic-styles`** (`ARCHITECTURAL`):
  - *Rule*: For every component, enforce the strict 3-way file separation:
    1. `<Component>.styles.ts`: Style declarations only (`SxProps`, `StyleSheet.create`).
    2. `use<Component>.ts`: Logic hook (state, handlers, side effects).
    3. `<Component>.tsx`: Pure UI presentation layer consuming the hook and styles.
  - *Template*: [templates/frontend/component-3way-template/](./templates/frontend/component-3way-template/)
- **`node-layered-architecture`** (`ARCHITECTURAL`):
  - *Rule*: Strict 3-Layer separation: Controller (HTTP) $\to$ Service (Business Logic) $\to$ Repository/Model (Database). Controllers must never execute direct DB queries.
  - *Ref*: [references/BACKEND_NODE_STANDARDS.md](./references/BACKEND_NODE_STANDARDS.md)
- **`centralized-endpoints`** (`BLOCKER`):
  - *Rule*: Never write raw URL strings (`axios.get('/api/v1/...')`). All endpoints must be declared in `core/endpoints.ts`.
  - *Ref*: [references/API_ARCHITECTURE_AND_ENDPOINTS.md](./references/API_ARCHITECTURE_AND_ENDPOINTS.md)
- **`no-direct-axios`** (`BLOCKER`):
  - *Rule*: Never import `axios` directly in UI components. Use domain-specific API service modules.
- **`offline-first-sqlite`** (`ARCHITECTURAL`):
  - *Rule*: Embedded SQLite (`@op-engineering/op-sqlite`) and sync queue before remote REST calls.
  - *Ref*: [references/MOBILE_REACT_NATIVE_STANDARDS.md](./references/MOBILE_REACT_NATIVE_STANDARDS.md)

### 2. Frontend & React (Next.js / Vite)
- **`no-inline-styles`** (`BLOCKER`):
  - *Rule*: Zero `style={{ ... }}` in JSX/TSX. Use `<Component>.styles.ts`.
  - *Ref*: [references/FRONTEND_REACT_STANDARDS.md](./references/FRONTEND_REACT_STANDARDS.md)
- **`no-static-text` (Mandatory i18n Translation Keys)** (`BLOCKER / WARNING`):
  - *Rule*: Zero hardcoded user strings. All UI text, buttons, placeholders, dialog titles, errors, and toasts must use translation keys via `t("domain.key")`.
- **`no-component-dir`** (`BLOCKER`):
  - *Rule*: Never hardcode `dir="rtl"` or `dir="ltr"` on components. Direction is managed globally at the root.
- **`use-logical-properties`** (`WARNING`):
  - *Rule*: Always use CSS logical properties (`marginInlineStart`, `paddingInlineStart`, etc.) instead of physical `marginLeft`/`marginRight` for full RTL/LTR compatibility.
- **`no-gradients-or-invented-colors`** (`BLOCKER`):
  - *Rule*: Zero ad-hoc gradients (`linear-gradient`) or invented hex/rgb literals. Colors must trace to the theme design tokens.
- **`no-raw-color-literals`** (`BLOCKER`):
  - *Rule*: No hardcoded hex `#ffffff` or `rgba(...)` inside component files. Reference `theme.palette.*`.
- **`no-emojis-or-icon-glyphs`** (`BLOCKER`):
  - *Rule*: No raw unicode emojis or hardcoded glyphs in UI or code. Render semantic icon components.
- **`reuse-on-second-use`** (`INFO`):
  - *Rule*: Any component, hook, or utility needed in 2+ files belongs in the shared layer.

### 3. Clean Code, Types & Comments
- **`no-any-types`** (`BLOCKER`):
  - *Rule*: Never widen a type to `any` to silence the compiler. Declare strict interfaces or use `unknown` with type guards.
- **`minimal-comments` (No Boilerplate Comments)** (`WARNING`):
  - *Rule*: Ban obvious boilerplate comments (`// Render the button`, `// State for loading`, `// Handle click`). Only comment complex, non-obvious business/algorithmic logic.
- **`no-console-logs`** (`WARNING`):
  - *Rule*: Strip `console.log`, `console.debug`, and `console.info` before shipping to staging or production.
- **`delete-dead-code`**:
  - *Rule*: Delete unreachable code, unused exports, and orphaned files in the same change.
  - *Ref*: [references/CODE_HYGIENE_AND_UNUSED_FILES_CLEANER.md](./references/CODE_HYGIENE_AND_UNUSED_FILES_CLEANER.md)
- **`no-doc-file-sprawl`**:
  - *Rule*: Extend existing documentation. Do not create new markdown files (`SUMMARY.md`, `NOTES.md`) unless explicitly requested.

---

## 🔍 How to Perform a Neobit Audit

When auditing a project:
1. **Run MCP Audit**:
   ```json
   call_mcp_tool({
     "ServerName": "neobit",
     "ToolName": "audit_project",
     "Arguments": { "path": "<absolute_project_path>" }
   })
   ```
2. **Review Violations by Severity**:
   - `BLOCKER`: Must be resolved immediately before merge.
   - `WARNING`: High-priority fixes (e.g. static text, untyped anys, boilerplate comments).
   - `INFO`: Architectural and clean-up recommendations.
3. **Verify Compliance**:
   Re-run `audit_project` or `audit_code_snippet` to confirm 0 violations remain.
