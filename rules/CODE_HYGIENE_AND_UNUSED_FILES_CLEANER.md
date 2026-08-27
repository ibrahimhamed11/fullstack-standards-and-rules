# 🧹 Code Hygiene, AST Cleaners & Dead-Code Janitors

*Automated repository maintenance scripts for stripping console logs, discovering unused files, and enforcing SonarQube quality gates.*

---

## 1. Automated Unused File Detection (`checkUnusedFiles.ts`)

Build an AST dependency graph from project entrypoints (`index.tsx`, `App.tsx`, routes) to find unreferenced files and assets:

```typescript
import fs from 'fs';
import path from 'path';

// Scans imports recursively to find orphaned components
export function findUnusedFiles(srcDir: string, entryFiles: string[]): string[] {
  const allFiles = getAllSourceFiles(srcDir);
  const referencedFiles = new Set<string>();

  function traverse(filePath: string) {
    if (referencedFiles.has(filePath)) return;
    referencedFiles.add(filePath);

    const content = fs.readFileSync(filePath, 'utf-8');
    const imports = extractImportPaths(content, filePath);

    for (const imp of imports) {
      traverse(imp);
    }
  }

  entryFiles.forEach(entry => traverse(entry));

  return allFiles.filter(file => !referencedFiles.has(file));
}
```

---

## 2. Production Console Log Stripper (`removeConsoleLogs.ts`)

Automatically strip debugging `console.log` statements before staging/production deployments:

```typescript
import fs from 'fs';
import glob from 'glob';

export function stripConsoleLogs(directory: string) {
  const files = glob.sync(`${directory}/**/*.{ts,tsx,js,jsx}`);
  let count = 0;

  files.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Remove console.log and console.debug lines
    content = content.replace(/^\s*console\.(log|debug|info)\([^)]*\);\s*$/gm, '');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      count++;
    }
  });

  console.log(`✅ Stripped console statements from ${count} files.`);
}
```

---

## 3. SonarQube / SonarCloud Quality Gate Configuration

Add `sonar-project.properties`:

```ini
sonar.projectKey=fullstack-enterprise-app
sonar.projectName=Fullstack Enterprise App
sonar.sources=src
sonar.tests=src/__tests__
sonar.exclusions=**/node_modules/**,**/build/**,**/dist/**,**/*.styles.ts
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.typescript.tsconfigPath=tsconfig.json
```
