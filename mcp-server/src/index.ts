import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

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

// Rule engine shared by snippet and project audits
type Severity = 'BLOCKER' | 'WARNING';

interface Rule {
  id: string;
  severity: Severity;
  pattern: RegExp;
  message: string;
  skipFile?: RegExp;
  requiresAbsent?: RegExp;
}

const RULES: Rule[] = [
  {
    id: 'no-inline-styles',
    severity: 'BLOCKER',
    pattern: /style\s*=\s*\{\{/,
    message: 'Inline styles (`style={{ ... }}`). Extract to *.styles.ts or StyleSheet.create.',
  },
  {
    id: 'no-component-dir',
    severity: 'BLOCKER',
    pattern: /dir\s*=\s*['"`](rtl|ltr)['"`]|direction\s*:\s*['"`](rtl|ltr)['"`]/,
    message: 'Manual direction override. Let the root layout theme manage direction.',
  },
  {
    id: 'centralized-endpoints',
    severity: 'BLOCKER',
    pattern: /(axios|fetch)\s*\.?\s*(get|post|put|patch|delete)?\s*\(\s*['"`](https?:)?\/api\//i,
    message: 'Hardcoded API route. Reference ENDPOINTS from core/endpoints.ts.',
  },
  {
    id: 'no-emojis-or-icon-glyphs',
    severity: 'BLOCKER',
    pattern: /[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F2FF}\u{2600}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}]/u,
    message: 'Emoji or static icon glyph. Use the project icon component with a semantic name.',
  },
  {
    id: 'no-gradients-or-invented-colors',
    severity: 'BLOCKER',
    pattern: /linear-gradient|radial-gradient|LinearGradient/,
    message: 'Gradient. Use a flat design-system color token.',
  },
  {
    id: 'no-raw-color-literals',
    severity: 'BLOCKER',
    pattern: /#[0-9a-fA-F]{3,8}\b|rgba?\s*\(/,
    message: 'Raw color literal. Reference a theme token instead.',
    skipFile: /theme|colors|tokens|palette|appStyles|assets\/svgs|\.svg\.tsx$/i,
  },
  {
    id: 'minimal-comments',
    severity: 'WARNING',
    pattern: /^\s*\/\/\s*[=*-]{4,}|^\s*\/\/\s*(const|let|function|return|if|import|<)/m,
    message: 'Banner comment or commented-out code. Keep comments intent-only, delete dead code.',
  },
  {
    id: 'no-static-text',
    severity: 'WARNING',
    pattern: />[A-Za-z؀-ۿ]{3,}[^<{]*</,
    message: 'Potential static text in JSX. Wrap user-facing strings in t("key").',
    requiresAbsent: /\bt\(|i18n\.t\(/,
  },
  {
    id: 'no-any-types',
    severity: 'WARNING',
    pattern: /:\s*any\b|as\s+any\b/,
    message: 'Explicit `any`. Declare a strict type or DTO.',
  },
];

interface Finding {
  rule: string;
  severity: Severity;
  line: number;
  message: string;
}

function auditCode(code: string, filePath = ''): Finding[] {
  const lines = code.split('\n');
  const findings: Finding[] = [];

  for (const rule of RULES) {
    if (rule.skipFile?.test(filePath)) continue;
    if (!rule.pattern.test(code)) continue;
    if (rule.requiresAbsent?.test(code)) continue;

    const single = new RegExp(rule.pattern.source, rule.pattern.flags.replace('m', ''));
    const idx = lines.findIndex(l => single.test(l));
    findings.push({ rule: rule.id, severity: rule.severity, line: idx + 1, message: rule.message });
  }

  return findings;
}

const SOURCE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx']);
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage', '.next', 'ios', 'android',
  'patched_node_modules', '__generated__', '.expo', 'vendor', 'Pods',
]);
const MAX_LISTED_FILES = 100;

function walkProject(root: string): { source: string[]; markdown: string[] } {
  const source: string[] = [];
  const markdown: string[] = [];

  const visit = (dir: string) => {
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.startsWith('.') && entry !== '.agents') continue;
      const full = join(dir, entry);
      let isDir: boolean;
      try {
        isDir = statSync(full).isDirectory();
      } catch {
        continue;
      }
      if (isDir) {
        if (!SKIP_DIRS.has(entry)) visit(full);
        continue;
      }
      const ext = extname(entry);
      if (SOURCE_EXT.has(ext)) source.push(relative(root, full));
      else if (ext === '.md') markdown.push(relative(root, full));
    }
  };

  visit(root);
  return { source, markdown };
}

function detectStack(root: string): string[] {
  const pkgPath = join(root, 'package.json');
  if (!existsSync(pkgPath)) return ['unknown'];
  let deps: Record<string, string> = {};
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    deps = { ...pkg.dependencies, ...pkg.devDependencies };
  } catch {
    return ['unknown'];
  }
  const stack: string[] = [];
  if (deps['react-native']) stack.push('React Native');
  if (deps['next']) stack.push('Next.js');
  if (deps['react'] && !deps['react-native'] && !deps['next']) stack.push('React (web)');
  if (deps['express'] || deps['@nestjs/core']) stack.push('Node backend');
  if (deps['@reduxjs/toolkit']) stack.push('Redux Toolkit');
  if (deps['zustand']) stack.push('Zustand');
  if (deps['@tanstack/react-query']) stack.push('TanStack Query');
  return stack.length ? stack : ['unknown'];
}

// Files whose basename is never referenced by an import elsewhere
function findOrphans(root: string, source: string[]): string[] {
  const imported = new Set<string>();
  for (const file of source) {
    let code: string;
    try {
      code = readFileSync(join(root, file), 'utf8');
    } catch {
      continue;
    }
    for (const match of code.matchAll(/(?:from|require\()\s*['"`]([^'"`]+)['"`]/g)) {
      const spec = match[1];
      imported.add(spec.split('/').pop()!.replace(/\.(t|j)sx?$/, ''));
    }
  }
  return source.filter(file => {
    const name = file.split('/').pop()!.replace(/\.(t|j)sx?$/, '');
    if (name === 'index' || /^(App|main|server|jest\.config|metro\.config)$/.test(name)) return false;
    return !imported.has(name);
  });
}

// Same component or hook name declared in more than one file
function findReuseCandidates(root: string, source: string[]): Record<string, string[]> {
  const declared: Record<string, string[]> = {};
  for (const file of source) {
    let code: string;
    try {
      code = readFileSync(join(root, file), 'utf8');
    } catch {
      continue;
    }
    for (const match of code.matchAll(/(?:function|const)\s+([A-Z][A-Za-z0-9]+|use[A-Z][A-Za-z0-9]+)\s*[=(<]/g)) {
      const name = match[1];
      (declared[name] ||= []).push(file);
    }
  }
  return Object.fromEntries(
    Object.entries(declared).filter(([, files]) => new Set(files).size > 1)
  );
}

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
        name: 'scan_project_structure',
        description: 'Walks a project directory and returns its detected stack, source/markdown file counts, and the largest directories.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Absolute path to the project root. Defaults to the working directory.',
            },
          },
        },
      },
      {
        name: 'audit_project',
        description: 'Audits every source file in a project against all standards. Returns per-file violations, per-rule counts, orphaned files, reuse candidates, and markdown sprawl.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Absolute path to the project root. Defaults to the working directory.',
            },
            rule: {
              type: 'string',
              description: 'Optional single rule id to audit (e.g. no-emojis-or-icon-glyphs).',
            },
          },
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
            filePath: {
              type: 'string',
              description: 'Optional file path, used to skip file-scoped exemptions such as theme token files.',
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
    const findings = auditCode(code, (args?.filePath as string) || '');

    if (findings.length === 0) {
      return { content: [{ type: 'text', text: 'Audit passed: no violations detected.' }] };
    }

    const text = findings
      .map(f => `[${f.severity}] ${f.rule} (line ${f.line}): ${f.message}`)
      .join('\n');
    return { content: [{ type: 'text', text: `Found ${findings.length} violation(s):\n\n${text}` }] };
  }

  if (name === 'scan_project_structure') {
    const root = (args?.path as string) || process.cwd();
    if (!existsSync(root)) {
      return { content: [{ type: 'text', text: `Path not found: ${root}` }], isError: true };
    }

    const { source, markdown } = walkProject(root);
    const byDir: Record<string, number> = {};
    for (const file of source) {
      const dir = file.split('/').slice(0, 2).join('/') || '.';
      byDir[dir] = (byDir[dir] || 0) + 1;
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              root,
              stack: detectStack(root),
              sourceFiles: source.length,
              markdownFiles: markdown.length,
              markdown,
              topDirectories: Object.fromEntries(
                Object.entries(byDir).sort((a, b) => b[1] - a[1]).slice(0, 25)
              ),
            },
            null,
            2
          ),
        },
      ],
    };
  }

  if (name === 'audit_project') {
    const root = (args?.path as string) || process.cwd();
    if (!existsSync(root)) {
      return { content: [{ type: 'text', text: `Path not found: ${root}` }], isError: true };
    }
    const ruleFilter = args?.rule as string | undefined;

    const { source, markdown } = walkProject(root);
    const byRule: Record<string, number> = {};
    const files: { file: string; violations: Finding[] }[] = [];

    for (const file of source) {
      let code: string;
      try {
        code = readFileSync(join(root, file), 'utf8');
      } catch {
        continue;
      }
      const findings = auditCode(code, file).filter(f => !ruleFilter || f.rule === ruleFilter);
      if (!findings.length) continue;
      for (const f of findings) byRule[f.rule] = (byRule[f.rule] || 0) + 1;
      files.push({ file, violations: findings });
    }

    files.sort((a, b) => b.violations.length - a.violations.length);
    const orphans = findOrphans(root, source);
    const reuse = findReuseCandidates(root, source);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              root,
              stack: detectStack(root),
              filesScanned: source.length,
              filesWithViolations: files.length,
              byRule,
              projectChecks: {
                markdownFileCount: markdown.length,
                markdownSprawl: markdown.length > 5 ? markdown : [],
                orphanedFiles: orphans.slice(0, MAX_LISTED_FILES),
                orphanedFileCount: orphans.length,
                reuseCandidates: Object.fromEntries(Object.entries(reuse).slice(0, 25)),
                reuseCandidateCount: Object.keys(reuse).length,
              },
              files: files.slice(0, MAX_LISTED_FILES),
              listTruncated:
                files.length > MAX_LISTED_FILES
                  ? `${files.length - MAX_LISTED_FILES} more offending file(s) not listed`
                  : null,
            },
            null,
            2
          ),
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
  console.error('neobit standards MCP server running on stdio');
}

main().catch(error => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
