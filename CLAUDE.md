# CLAUDE.md - Engineering Standards for Claude Code

When generating, editing, or reviewing code in any project, you MUST strictly adhere to the following rules:

## 1. Frontend Rules (React / Next.js)
- **NEVER use inline styles (`style={{ ... }}`)**. Always create modular style files (`*.styles.ts`) or use Theme tokens.
- **NEVER hardcode text strings in JSX**. Wrap every user-facing string in `t('key', 'Default text')` via `useTranslation()`.
- **NEVER hardcode API URLs**. Use the centralized `ENDPOINTS` dictionary (`src/utils/api/core/endpoints.ts`).
- **NEVER import Axios or make fetch calls directly in UI components**. Use typed functions from `src/utils/api/modules/<domain>/`.
- **NEVER add manual `dir='rtl'` or `dir='ltr'` to components**. Allow the root layout and theme to govern direction globally.
- **ALWAYS use CSS logical properties** (`marginInlineStart`, `paddingInlineStart`, `marginInlineEnd`).

## 2. Mobile Rules (React Native / Expo)
- **ALWAYS use `StyleSheet.create`**. Never write inline style objects in JSX.
- **ALWAYS use `FlashList` or `FlatList` for dynamic data**. Never render array maps inside `ScrollView`.
- **ALWAYS support Safe Area** with `useSafeAreaInsets()`.

## 3. Backend Rules (Node.js / Express / NestJS)
- **ALWAYS follow 3-Layer Clean Architecture**: Controllers handle HTTP $\to$ Services handle Logic $\to$ Repositories handle DB.
- **ALWAYS validate payloads with Zod** before reaching the service layer.
- **ALWAYS throw custom `AppError`** classes and catch them in global error handling middleware.
- **ALWAYS use parameterized queries / ORMs** to prevent SQL/NoSQL injection.
