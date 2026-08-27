# 🖥️ Frontend (React & Next.js) Coding Standards

## 1. Zero Inline Styles (`style={{ ... }}`)
- **Rule**: Never use HTML inline `style` attributes in React components.
- **Rationale**: Inline styles bypass caching, create specificity bugs, break theme responsiveness, and clutter the JSX markup.
- **Enforcement**:
  - Use modular style files: `<Component>.styles.ts`
  - Use MUI `SxProps` or Emotion/Styled components
  - Reference theme tokens directly (`theme.palette.primary.main`, `theme.spacing(2)`)

```tsx
// ❌ REJECT IN REVIEW:
<div style={{ display: 'flex', padding: '16px', color: '#0092BE' }}>
  <span style={{ fontSize: '14px', fontWeight: 600 }}>Title</span>
</div>

// ✅ APPROVED:
// In Header.styles.ts
export const containerSx = (theme: Theme): SxProps => ({
  display: 'flex',
  p: 2,
  color: theme.palette.primary.main,
});

export const titleSx: SxProps = {
  fontSize: '0.875rem',
  fontWeight: 600,
};

// In Header.tsx
<Box sx={containerSx(theme)}>
  <Typography sx={titleSx}>Title</Typography>
</Box>
```

---

## 2. Zero Hardcoded / Static Text Strings
- **Rule**: All user-facing text must be rendered through `useTranslation()` (`t('key', 'Default text')`).
- **Rationale**: Prevents untranslated text in production and guarantees seamless multilingual support (English & Arabic).

```tsx
// ❌ REJECT:
<Button>Submit Application</Button>
<Typography>جميع الحقوق محفوظة</Typography>

// ✅ APPROVED:
const { t } = useTranslation();
<Button>{t('actions.submit', 'Submit Application')}</Button>
<Typography>{t('footer.copyright', 'جميع الحقوق محفوظة')}</Typography>
```

---

## 3. Centralized RTL/LTR Layout Resolution
- **Rule**: Never hardcode `dir='rtl'`, `dir='ltr'`, or inline `direction: 'rtl'` inside component JSX.
- **Rationale**: Direction is controlled centrally at the application root via Emotion `CacheProvider` (`stylis-plugin-rtl`) and MUI `ThemeProvider`. Manual overrides cause double-inversion bugs with tabs, modals, and flex layouts.

---

## 4. CSS Logical Properties
- **Rule**: Always prefer CSS logical properties over physical directions (`left` / `right`).

```typescript
// ❌ REJECT (Ternary conditionals):
marginRight: theme.direction === 'rtl' ? 16 : 0,
marginLeft: theme.direction === 'rtl' ? 0 : 16,

// ✅ APPROVED (Auto-mirrored by theme):
marginInlineStart: theme.spacing(2),
paddingInlineEnd: theme.spacing(3),
```

---

## 5. Separation of Concerns (View / Logic / Styles)
Every non-trivial page or complex component must be split into:
1. `Component.tsx` - Pure presentation.
2. `useComponentLogic.ts` - State, effects, handlers, network requests.
3. `Component.styles.ts` - All styling definitions.
4. `Component.types.ts` - TypeScript interfaces and props.
