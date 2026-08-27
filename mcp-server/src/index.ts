import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Standards & Architecture Database
const STANDARDS_DB: Record<
  string,
  { title: string; category: string; description: string; rule: string; goodExample: string; badExample: string }
> = {
  'no-inline-styles': {
    title: 'Zero Inline Styles',
    category: 'Frontend & Mobile',
    description: 'Never use style={{ ... }} in JSX or TSX.',
    rule: 'Extract all styling to dedicated *.styles.ts files using SxProps, Theme tokens, or StyleSheet.create.',
    badExample: '<div style={{ display: "flex", color: "#0092BE" }}>Title</div>',
    goodExample: 'export const containerSx = (theme: Theme): SxProps => ({ display: "flex", color: theme.palette.primary.main });',
  },
  'no-static-text': {
    title: 'Zero Static / Hardcoded Text',
    category: 'Frontend & Mobile',
    description: 'All user-facing strings must use internationalization.',
    rule: 'Wrap all text in t("key", "Default text") via react-i18next.',
    badExample: '<Button>Submit Application</Button>',
    goodExample: 'const { t } = useTranslation();\n<Button>{t("actions.submit", "Submit Application")}</Button>',
  },
  'centralized-endpoints': {
    title: 'Centralized API Endpoints',
    category: 'API & Architecture',
    description: 'Never write raw URL strings in components or services.',
    rule: 'All endpoints must be declared in core/endpoints.ts under domain namespaces.',
    badExample: 'axios.get("/api/v1/user/profile")',
    goodExample: 'axiosInstance.get(ENDPOINTS.user.profile)',
  },
  'no-component-dir': {
    title: 'Centralized RTL/LTR Theming',
    category: 'Frontend',
    description: 'Never hardcode dir="rtl" or dir="ltr" on components.',
    rule: 'Direction is managed globally by root CacheProvider (stylis-plugin-rtl) and ThemeProvider.',
    badExample: '<Card dir="ltr"><Box sx={{ direction: "rtl" }}>...</Box></Card>',
    goodExample: '<Card><Box>...</Box></Card>',
  },
  'offline-first-sqlite': {
    title: 'Offline-First SQLite Architecture',
    category: 'Mobile (React Native)',
    description: 'Use fast embedded SQLite for instant zero-latency local operations.',
    rule: 'Store user data in op-sqlite with an action queue for background syncing with the REST backend.',
    badExample: 'Fetching data over network on every screen focus without local persistence',
    goodExample: 'Query local SQLite table first, render UI instantly, trigger background sync in parallel.',
  },
  'ai-multi-provider': {
    title: 'Multi-Provider AI Architecture',
    category: 'Backend & AI',
    description: 'Abstract LLM providers with automatic fallback and failover.',
    rule: 'Implement an AIProvider interface for Claude, Gemini, OpenAI, and Groq with fallback orchestration.',
    badExample: 'Direct hardcoded single SDK calls with no retry or provider failover',
    goodExample: 'AIService trying primary provider (Gemini) -> fallback (Claude) -> secondary fallback (OpenAI)',
  },
  'no-emojis-or-icon-glyphs': {
    title: 'Zero Emojis & Static Icon Glyphs',
    category: 'Frontend & Mobile',
    description: 'No emojis or hardcoded icon glyphs in UI, code, comments, commits, or docs.',
    rule: 'Render icons through the project icon component with a semantic name.',
    badExample: '<Text>Booking confirmed \u2705</Text>',
    goodExample: '<Icon name="check-circle" /><Text>{t("booking.confirmed")}</Text>',
  },
  'no-gradients-or-invented-colors': {
    title: 'Zero Gradients & Invented Colors',
    category: 'Frontend & Mobile',
    description: 'Colors must be traceable to the design system, never chosen ad hoc.',
    rule: 'Use theme tokens only. No hex/rgb()/rgba() literals, no linear-gradient, no self-picked palettes.',
    badExample: 'background: "linear-gradient(135deg, #667eea, #764ba2)"',
    goodExample: 'backgroundColor: theme.palette.primary.main',
  },
  'no-doc-file-sprawl': {
    title: 'No Markdown File Sprawl',
    category: 'Process',
    description: 'Every change should not spawn a new summary document.',
    rule: 'Extend the documentation that already exists. Create a new .md file only when explicitly requested.',
    badExample: 'CHANGES_SUMMARY.md, IMPLEMENTATION_NOTES.md, FIX_REPORT.md added alongside the code change',
    goodExample: 'A section appended to the existing README or standards document',
  },
  'minimal-comments': {
    title: 'Minimal, Intent-Only Comments',
    category: 'Process',
    description: 'Comments explain why, never what the code already says.',
    rule: 'No banner comments, no line-by-line narration, no commented-out code.',
    badExample: '// ===== FETCH DATA =====\n// set loading to true\nsetLoading(true);',
    goodExample: '// Backend returns UTC even when a timezone header is sent (see #4412).',
  },
  'delete-dead-code': {
    title: 'Delete Dead Code',
    category: 'Process',
    description: 'Unreachable code, unused exports, and orphaned files are removed in the same change.',
    rule: 'Run the AST orphan finder and remove imports/variables/exports your change orphaned.',
    badExample: 'Legacy function kept "just in case", wrapped in a commented-out block',
    goodExample: 'Dead branch deleted; git history is the archive',
  },
  'reuse-on-second-use': {
    title: 'Reuse On Second Use',
    category: 'Frontend & Mobile',
    description: 'Anything needed in two or more files belongs in the shared layer.',
    rule: 'The second consumer triggers extraction into a shared component, hook, or utility -- never a copy-paste.',
    badExample: 'The same status badge JSX duplicated across three screens',
    goodExample: 'components/shared/StatusBadge.tsx consumed by all three screens',
  },
  'node-layered-architecture': {
    title: '3-Layer Backend Architecture',
    category: 'Backend',
    description: 'Enforce strict separation between Controller, Service, and Repository.',
    rule: 'Controllers handle HTTP req/res -> Services handle pure business logic -> Repositories handle DB.',
    badExample: '// Controller querying DB directly with SQL/Mongoose logic inside req handler',
    goodExample: 'class UserController { async getProfile(req, res) { const user = await this.userService.getUser(req.user.id); res.json(user); } }',
  },
};

// Initialize MCP Server
const server = new Server(
  {
    name: 'neobit',
    version: '1.2.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register Available Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_standards',
        description: 'List all engineering standards and architectural rules.',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Optional filter by category (Frontend, Mobile, Backend, API, AI)',
            },
          },
        },
      },
      {
        name: 'get_standard',
        description: 'Get in-depth rule description, good vs bad examples for a standard.',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Standard ID (e.g. no-inline-styles, no-emojis-or-icon-glyphs, no-gradients-or-invented-colors, reuse-on-second-use, node-layered-architecture)',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'audit_code_snippet',
        description: 'Audits a code snippet for anti-patterns (inline styles, hardcoded text, raw URLs, dir overrides).',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'The code snippet to analyze',
            },
          },
          required: ['code'],
        },
      },
    ],
  };
});

// Handle Tool Execution
server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args } = request.params;

  if (name === 'list_standards') {
    const category = args?.category as string | undefined;
    const list = Object.entries(STANDARDS_DB)
      .filter(([_, item]) => !category || item.category.toLowerCase().includes(category.toLowerCase()))
      .map(([id, item]) => ({ id, title: item.title, category: item.category, description: item.description }));

    return {
      content: [{ type: 'text', text: JSON.stringify(list, null, 2) }],
    };
  }

  if (name === 'get_standard') {
    const id = args?.id as string;
    const standard = STANDARDS_DB[id];
    if (!standard) {
      return {
        content: [{ type: 'text', text: `Standard "${id}" not found. Use list_standards to see available rules.` }],
        isError: true,
      };
    }
    return {
      content: [{ type: 'text', text: JSON.stringify(standard, null, 2) }],
    };
  }

  if (name === 'audit_code_snippet') {
    const code = (args?.code as string) || '';
    const violations: string[] = [];

    if (/style\s*=\s*\{\{/i.test(code)) {
      violations.push('❌ [BLOCKER] Inline styles detected (`style={{ ... }}`). Extract to *.styles.ts or StyleSheet.create.');
    }
    if (/dir\s*=\s*['"`](rtl|ltr)['"`]/i.test(code) || /direction\s*:\s*['"`](rtl|ltr)['"`]/i.test(code)) {
      violations.push('❌ [BLOCKER] Manual direction override detected (`dir="rtl/ltr"`). Let root layout theme manage direction.');
    }
    if (/axios\.(get|post|put|delete)\s*\(\s*['"`]\/api\//i.test(code) || /fetch\s*\(\s*['"`]\/api\//i.test(code)) {
      violations.push('❌ [BLOCKER] Hardcoded API route detected. Reference ENDPOINTS from core/endpoints.ts.');
    }
    if (/[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F2FF}\u{2600}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}]/u.test(code)) {
      violations.push('\u274C [BLOCKER] Emoji or static icon glyph detected. Use the project icon component with a semantic name.');
    }
    if (/linear-gradient|radial-gradient|LinearGradient/i.test(code)) {
      violations.push('\u274C [BLOCKER] Gradient detected. Use a flat design-system color token.');
    }
    if (/#[0-9a-f]{3,8}\b|rgba?\s*\(/i.test(code)) {
      violations.push('\u274C [BLOCKER] Raw color literal detected. Reference a theme token instead.');
    }
    if (/^\s*\/\/\s*[=*-]{4,}/m.test(code) || /^\s*\/\/\s*(const|let|function|return|if|import|<)/m.test(code)) {
      violations.push('\u26A0\uFE0F [WARNING] Banner comment or commented-out code detected. Keep comments intent-only and delete dead code.');
    }
    if (/>[A-Za-z\u0600-\u06FF]{3,}[^<]*</i.test(code) && !/t\(/.test(code)) {
      violations.push('⚠️ [WARNING] Potential static text detected in JSX. Ensure user-facing strings use t("key", "Text").');
    }

    if (violations.length === 0) {
      return {
        content: [{ type: 'text', text: '✅ Audit Passed: Code conforms to all full-stack engineering standards!' }],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `Found ${violations.length} violation(s):\n\n` + violations.join('\n\n'),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start Server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Full-Stack Standards MCP Server running on stdio');
}

main().catch(error => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
