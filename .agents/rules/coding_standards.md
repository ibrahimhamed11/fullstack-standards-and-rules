---
description: Universal Full-Stack Coding Standards (Path Aliases, i18n Keys, 3-File Separation, No Boilerplate Comments, Zero Inline Styles)
---

# Universal Project Coding Standards

Always adhere strictly to these rules when writing or modifying code in this codebase:

1. **Mandatory Path Aliases**:
   - Always import using configured path aliases (e.g. `@/...`, `@components/...`, `@utils/...`, `@hooks/...`, `@services/...`).
   - Never use deep relative imports like `../../../../`.

2. **Mandatory i18n Translation Keys (Zero Hardcoded Text)**:
   - All user-facing strings, button labels, placeholders, dialog titles, error messages, and toast notifications MUST use translation keys via `t('domain.key')` or `i18n.t('domain.key')`.
   - Never hardcode raw strings in JSX, TSX, components, or services.

3. **Strict 3-Way File Separation (UI, Logic, Styles)**:
   - For every component or screen, separate concerns into distinct files:
     - `<Component>.styles.ts`: Pure styles only (MUI `SxProps`, Emotion, or React Native `StyleSheet.create`). Zero JSX.
     - `use<Component>.ts` (or `<Component>.logic.ts`): Pure logic hook (state, handlers, API mutations, side effects). Zero JSX.
     - `<Component>.tsx`: Pure UI view. Calls `use<Component>()` and renders visual markup using the styles. Zero inline state, zero inline styles.

4. **No Boilerplate Comments / Explain Complex Intent Only**:
   - Never write obvious, redundant, or boilerplate comments (e.g., `// state`, `// render button`, `// handle click`, `// component creation`, `// imports`, `// return JSX`).
   - Only comment non-obvious, complex, or tricky business/algorithmic logic, using simple, clear explanations.

5. **NO Inline `style={{ ... }}` Attributes**:
   - Web: Use `<Component>.styles.ts` with `SxProps` or styled components.
   - Mobile: Use `StyleSheet.create({ ... })` in `<Component>.styles.ts`.

6. **NO Hardcoded API Route Strings**:
   - All endpoints must come from `ENDPOINTS` dictionary (`core/endpoints.ts`).

7. **NO Direct Axios / Fetch Calls in UI Components**:
   - Call typed domain API module functions (`modules/<domain>/` or `utils/api/`).

8. **NO Component-Level RTL/LTR Overrides**:
   - Never use `dir="rtl"`, `dir="ltr"`, or inline `direction: 'rtl' | 'ltr'`. Let the root layout theme handle direction globally.

9. **Use CSS Logical Properties**:
   - Use `marginInlineStart`, `paddingInlineStart`, `marginInlineEnd`, `paddingInlineEnd` instead of physical `marginLeft`/`marginRight`.

10. **NO Emojis or Static Icon Glyphs**:
    - Not in UI, code, comments, commits, or docs. Use the project's icon component with a semantic name.

11. **NO Gradients or Invented Colors**:
    - Colors come from design-system tokens only. No hex/`rgba()` literals, no self-chosen palettes.

12. **NO New Markdown Files**:
    - Extend existing documentation. Create a new `.md` only when explicitly requested.

13. **Delete Dead Code**:
    - Remove unreachable code, unused imports/exports, and orphaned files in the same change.

14. **Reuse on Second Use**:
    - Needed in two or more files means one shared component, hook, or utility -- never copy-paste.
