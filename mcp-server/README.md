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

### 3. `audit_code_snippet`
Scans code in real-time for anti-patterns:
- Inline styles (`style={{ ... }}`)
- Hardcoded text in JSX
- Hardcoded API URLs
- Component-level `dir="rtl"` / `dir="ltr"` overrides
