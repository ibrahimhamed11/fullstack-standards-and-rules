---
description: Universal Full-Stack Coding Standards (No Inline Styles, No Static Strings, Centralized API & Global RTL)
---

# Universal Project Coding Standards

Always adhere strictly to these rules when writing or modifying code in this codebase:

1. **NO Inline `style={{ ... }}` Attributes**:
   - Web: Use modular `<Component>.styles.ts` files with `SxProps` or styled components.
   - Mobile: Use `StyleSheet.create({ ... })`.

2. **NO Hardcoded / Static Text Strings**:
   - All user-facing text must use `t('key', 'Default text')` via `useTranslation()`.

3. **NO Hardcoded API Route Strings**:
   - All endpoints must come from `ENDPOINTS` dictionary (`core/endpoints.ts`).

4. **NO Direct Axios / Fetch Calls in UI Components**:
   - Call typed domain API module functions (`modules/<domain>/`).

5. **NO Component-Level RTL/LTR Overrides**:
   - Never use `dir="rtl"`, `dir="ltr"`, or inline `direction: 'rtl' | 'ltr'`.

6. **Use CSS Logical Properties**:
   - Use `marginInlineStart`, `paddingInlineStart`, `marginInlineEnd`, `paddingInlineEnd`.

7. **Strict Separation of Concerns**:
   - Split complex features into: `<Feature>Page.tsx` (view), `use<Feature>Logic.ts` (logic), and `<Feature>.styles.ts` (styling).

8. **NO Emojis or Static Icon Glyphs**:
   - Not in UI, code, comments, commits, or docs. Use the project's icon component with a semantic name.

9. **NO Gradients or Invented Colors**:
   - Colors come from design-system tokens only. No hex/`rgba()` literals, no self-chosen palettes.

10. **NO New Markdown Files**:
   - Extend existing documentation. Create a new `.md` only when explicitly requested.

11. **Minimal Comments**:
   - Comment non-obvious intent only. No banners, no code narration, no commented-out blocks.

12. **Delete Dead Code**:
   - Remove unreachable code, unused imports/exports, and orphaned files in the same change.

13. **Reuse on Second Use**:
   - Needed in two or more files means one shared component, hook, or utility -- never a copy.
