# CLAUDE.md - Engineering Standards for Claude Code

When generating, editing, or reviewing code in any project, you MUST strictly adhere to the following rules:

## 1. Mandatory Path Aliases (All Stacks)
- **ALWAYS use project path aliases** (e.g. `@/...`, `@components/...`, `@utils/...`, `@hooks/...`, `@services/...`).
- **NEVER use deep relative imports** (`../../../../`).

## 2. Mandatory i18n Translation Keys (Zero Hardcoded Text)
- **NEVER hardcode raw text strings** in JSX, TSX, components, or services.
- **ALWAYS wrap every user-facing string** in `t('domain.key')` or `i18n.t('domain.key')` via `useTranslation()`.

## 3. Strict 3-Way File Separation (UI, Logic, Styles)
- **ALWAYS separate components into 3 dedicated files**:
  1. `<Component>.styles.ts`: Pure styles (MUI `SxProps`, Emotion, or `StyleSheet.create`). Zero JSX.
  2. `use<Component>.ts`: Custom hook containing state, handlers, and API queries. Zero JSX.
  3. `<Component>.tsx`: Pure presentational UI view consuming the hook and styles. Zero inline state, zero inline styles.

## 4. No Boilerplate Comments / Explain Complex Intent Only
- **NEVER write obvious, redundant narration comments** (e.g. `// state`, `// render button`, `// handle click`, `// component creation`, `// imports`).
- **ONLY write comments when explaining complex, non-obvious business/algorithmic rationale**, using simple, concise explanations.

## 5. Frontend Rules (React / Next.js)
- **NEVER use inline styles (`style={{ ... }}`)**. Always create modular style files (`*.styles.ts`) or use Theme tokens.
- **NEVER hardcode API URLs**. Use the centralized `ENDPOINTS` dictionary (`src/utils/api/core/endpoints.ts`).
- **NEVER import Axios or make fetch calls directly in UI components**. Use typed functions from `src/utils/api/modules/<domain>/`.
- **NEVER add manual `dir='rtl'` or `dir='ltr'` to components**. Allow the root layout and theme to govern direction globally.
- **ALWAYS use CSS logical properties** (`marginInlineStart`, `paddingInlineStart`, `marginInlineEnd`).

## 6. Mobile Rules (React Native / Expo)
- **ALWAYS use `StyleSheet.create`** in dedicated `.styles.ts` files. Never write inline style objects in JSX.
- **ALWAYS use `FlashList` or `FlatList` for dynamic data**. Never render array maps inside `ScrollView`.
- **ALWAYS support Safe Area** with `useSafeAreaInsets()`.

## 7. Backend Rules (Node.js / Express / NestJS)
- **ALWAYS follow 3-Layer Clean Architecture**: Controllers handle HTTP -> Services handle Logic -> Repositories handle DB.
- **ALWAYS validate payloads with Zod** before reaching the service layer.
- **ALWAYS throw custom `AppError`** classes and catch them in global error handling middleware.
- **ALWAYS use parameterized queries / ORMs** to prevent SQL/NoSQL injection.

## 8. Universal Rules (all stacks)
- **NEVER use emojis or hardcoded icon glyphs** in UI, source, comments, commit messages, or documentation. Render icons through the project's icon component with a semantic name.
- **NEVER use gradients or invented colors**. Every color must be a design-system token; no hex, `rgb()`, or `rgba()` literals, and no palette you chose yourself.
- **NEVER leave console.log / console.debug statements** in production source files. Strip them before staging/production or use an enterprise logger.
- **NEVER use physical CSS properties (`marginLeft`, `marginRight`)**. Always use CSS logical properties (`marginInlineStart`, `marginInlineEnd`, `paddingInlineStart`, `paddingInlineEnd`) for bi-directional RTL/LTR compatibility.
- **NEVER create new markdown files** unless explicitly asked. Extend the documents that already exist.
- **Delete dead code you orphan**: unreachable branches, unused imports, unused exports, dead files.
- **Extract on second use**: the moment a component, hook, or utility is needed in a second file, move it to the shared layer instead of copying it.
