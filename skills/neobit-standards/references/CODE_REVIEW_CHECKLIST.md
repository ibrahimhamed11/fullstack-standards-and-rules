# 📋 Pull Request Review Checklist & Severity Matrix

Reviewers must inspect code diffs against this checklist before merging.

## 🔴 Blocker (Must Request Changes):
- [ ] **Path Aliases**: Contains deep/fragile relative imports (`../../..`) instead of `@/...` $\to$ **BLOCK**.
- [ ] **Separation of Concerns**: Component mixes JSX markup, complex state/logic, and styling in one file instead of separating into 3 files (`<Component>.tsx`, `use<Component>.ts`, `<Component>.styles.ts`) $\to$ **BLOCK**.
- [ ] **Hardcoded Strings**: User-visible strings, labels, errors, or placeholders not using `t('domain.key')` $\to$ **BLOCK**.
- [ ] **Inline Styles**: Diff contains `style={{` in JSX $\to$ **BLOCK**.
- [ ] **Hardcoded URLs**: Raw API paths found in components $\to$ **BLOCK**.
- [ ] **Direct Axios in UI**: Component imports `axios` directly instead of domain API module $\to$ **BLOCK**.
- [ ] **Manual `dir` Attributes**: Component contains `dir='rtl'` / `dir='ltr'` $\to$ **BLOCK**.
- [ ] **Type `any`**: Unchecked `any` in business logic or API contracts $\to$ **BLOCK**.

---

## 🟠 Major (Must Fix Before Merge):
- [ ] **Boilerplate Comments**: Code contains obvious narration comments (`// state`, `// render button`, `// handle click`, `// component creation`) instead of commenting only non-obvious/complex logic $\to$ **FIX**.
- [ ] **Physical Margins**: Uses `marginLeft`/`marginRight` instead of `marginInlineStart`/`marginInlineEnd`.
- [ ] **Missing Loading/Error States**: Network action has no feedback to user.
- [ ] **Unmemoized Callbacks**: Functions created in loop renders without `useCallback`.

---

## 🟡 Minor (Suggestions / Nitpicks):
- [ ] Code formatting / indentation inconsistencies.
- [ ] Missing JSDoc documentation on exported complex utilities.
