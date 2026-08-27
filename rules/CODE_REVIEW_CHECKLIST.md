# 📋 Pull Request Review Checklist & Severity Matrix

Reviewers must inspect code diffs against this checklist before merging.

## 🔴 Blocker (Must Request Changes):
- [ ] **Inline Styles**: Diff contains `style={{` in JSX $\to$ **BLOCK**.
- [ ] **Hardcoded Strings**: User-visible strings not wrapped in `t(...)` $\to$ **BLOCK**.
- [ ] **Hardcoded URLs**: Raw API paths found in components $\to$ **BLOCK**.
- [ ] **Direct Axios in UI**: Component imports `axios` directly $\to$ **BLOCK**.
- [ ] **Manual `dir` Attributes**: Component contains `dir='rtl'` / `dir='ltr'` $\to$ **BLOCK**.
- [ ] **Type `any`**: Unchecked `any` in business logic or API contracts $\to$ **BLOCK**.

---

## 🟠 Major (Must Fix Before Merge):
- [ ] **Physical Margins**: Uses `marginLeft`/`marginRight` instead of `marginInlineStart`/`marginInlineEnd`.
- [ ] **Missing Loading/Error States**: Network action has no feedback to user.
- [ ] **Unmemoized Callbacks**: Functions created in loop renders without `useCallback`.

---

## 🟡 Minor (Suggestions / Nitpicks):
- [ ] Code formatting / indentation inconsistencies.
- [ ] Missing JSDoc documentation on exported utilities.
