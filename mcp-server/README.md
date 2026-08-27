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
Lists all available engineering rules and architecture patterns.
- Optional input: `{ "category": "Frontend" | "Mobile" | "Backend" | "API" | "AI" }`

### 2. `get_standard`
Returns the complete specification, good vs bad code examples, and rationale for a rule ID.
- Required input: `{ "id": "<rule_id>" }` (e.g. `no-inline-styles`, `offline-first-sqlite`, `ai-multi-provider`, `node-layered-architecture`)

### 3. `scan_project_structure`
Walks a project directory and reports what it is before any auditing.
- Optional input: `{ "path": "/abs/path/to/project" }` (defaults to the working directory)
- Returns: detected stack, source file count, markdown file list, and the largest directories.

### 4. `audit_project`
Audits every source file in a project against all rules in one call.
- Optional input: `{ "path": "/abs/path", "rule": "no-emojis-or-icon-glyphs" }`
- Returns: per-file violations with rule id, severity and line number; per-rule totals; orphaned files (never imported anywhere); reuse candidates (same component or hook declared in more than one file); markdown sprawl.
- Skips `node_modules`, `.git`, `dist`, `build`, `ios`, `android`, `Pods`, `coverage`, `patched_node_modules`.
- The file list is capped at 100 entries; the response reports how many were omitted.

### 5. `audit_code_snippet`
Scans a single snippet for anti-patterns:
- Inline styles (`style={{ ... }}`)
- Hardcoded text in JSX
- Hardcoded API URLs
- Component-level `dir="rtl"` / `dir="ltr"` overrides
- Emojis and static icon glyphs
- Gradients and raw color literals
- Banner comments and commented-out code
- Explicit `any` types

Optional `filePath` lets file-scoped exemptions apply (theme token files, SVG assets).
