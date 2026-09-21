# 🤖 `neobit` MCP Server

Model Context Protocol (MCP) server for enterprise full-stack engineering standards, architecture blueprints, and real-time code auditing.

## Installation & Setup

```bash
cd mcp-server
npm install
npm run build
```

## Running with Claude Desktop / Claude Code
Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "neobit": {
      "command": "node",
      "args": ["/path/to/fullstack-standards-and-rules/mcp-server/dist/index.js"]
    }
  }
}
```

## Running with Google Antigravity
Add to `/Users/<username>/.gemini/config/mcp_config.json`:

```json
{
  "mcpServers": {
    "neobit": {
      "command": "node",
      "args": ["/path/to/fullstack-standards-and-rules/mcp-server/dist/index.js"]
    }
  }
}
```

## Available Tools

### 1. `list_standards`
Lists all 20 available engineering rules and architecture patterns.
- Optional input: `{ "category": "Frontend" | "Mobile" | "Backend" | "API" | "AI" | "Clean Code" }`

### 2. `get_standard`
Returns the complete specification, good vs bad code examples, and rationale for a rule ID.
- Required input: `{ "id": "<rule_id>" }` (e.g. `no-inline-styles`, `use-path-aliases`, `no-direct-axios`, `no-console-logs`, `use-logical-properties`, `offline-first-sqlite`, `ai-multi-provider`, `node-layered-architecture`)

### 3. `scan_project_structure`
Walks a project directory and reports its tech stack, file counts, and directory weights.
- Optional input: `{ "path": "/abs/path/to/project" }` (defaults to current directory)
- Returns: multi-package/monorepo detected stack (React, Next.js, React Native, Express, NestJS, MongoDB, Zustand, etc.), source and markdown file count, largest directories.

### 4. `audit_project`
Audits every source file in a project against all rules in one call.
- Optional input: `{ "path": "/abs/path", "rule": "no-emojis-or-icon-glyphs" }`
- Returns: per-file violations with rule id, severity, and line numbers; per-rule totals; orphaned files (filtering out route handlers, configs, tests, and scripts); reuse candidates; markdown sprawl.
- Automatically skips `node_modules`, `.git`, `dist`, `build`, `ios`, `android`, `Pods`, `coverage`, `patched_node_modules`.

### 5. `audit_file`
Audits a single file on disk against all engineering standards.
- Required input: `{ "path": "/path/to/file.tsx" }`
- Returns: line-by-line violations directly from disk.

### 6. `audit_code_snippet`
Audits an in-memory code snippet for anti-patterns:
- Inline styles (`style={{ ... }}`)
- Hardcoded text in JSX (must use i18n translation keys `t('key')`)
- Deep fragile relative imports (`../../..`, must use path aliases `@/...`)
- Direct Axios imports in UI components (`no-direct-axios`)
- Console statements in production code (`no-console-logs`)
- Physical CSS properties (`marginLeft`, `marginRight` $\to$ `use-logical-properties`)
- Boilerplate narration comments (`// state`, `// render`, etc.)
- Hardcoded API URLs
- Component-level `dir="rtl"` / `dir="ltr"` overrides
- Emojis and static icon glyphs
- Gradients and raw color literals
- Banner comments and commented-out code
- Explicit `any` types
- Optional `filePath` lets file-scoped exemptions apply (theme token files, SVG assets).
