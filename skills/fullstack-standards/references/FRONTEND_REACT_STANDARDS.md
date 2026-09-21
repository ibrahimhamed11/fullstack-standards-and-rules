# 🖥️ Frontend (React & Next.js) Coding Standards

## 1. Mandatory Path Aliases
- **Rule**: Always import using project-configured path aliases (e.g. `@/...`, `@components/...`, `@utils/...`, `@hooks/...`, `@services/...`).
- **Rationale**: Prevents brittle, unreadable relative paths (`../../../../components/Button`) that break upon refactoring and file relocation.

```typescript
// ❌ REJECT IN REVIEW:
import { Button } from '../../../../components/shared/Button';
import { useAuth } from '../../../hooks/useAuth';

// ✅ APPROVED:
import { Button } from '@/components/shared/Button';
import { useAuth } from '@/hooks/useAuth';
```

---

## 2. Mandatory i18n Translation Keys (Zero Hardcoded Text)
- **Rule**: Every user-facing text, button label, error message, placeholder, and dialog title MUST use translation keys via `useTranslation()` (`t('domain.key')` or `i18n.t('domain.key')`).
- **Rationale**: Guarantees seamless bilingual / multilingual support (Arabic & English) and prevents untranslated strings from escaping into production.

```tsx
// ❌ REJECT:
<Button>Submit Application</Button>
<TextField placeholder="Enter your email" />
<Typography>جميع الحقوق محفوظة</Typography>
const errorMsg = "Payment failed. Please try again.";

// ✅ APPROVED:
const { t } = useTranslation();
<Button>{t('actions.submit')}</Button>
<TextField placeholder={t('forms.emailPlaceholder')} />
<Typography>{t('footer.copyright')}</Typography>
const errorMsg = t('errors.paymentFailed');
```

---

## 3. Strict 3-Way File Separation (UI, Logic, Styles)
- **Rule**: Every component or screen must be strictly decomposed into 3 dedicated files:
  1. `<Component>.styles.ts`: Pure styles only (MUI `SxProps`, Emotion, or styled-components). No JSX, no business logic.
  2. `use<Component>.ts` (or `<Component>.logic.ts`): Custom hook containing all state (`useState`), handlers, API queries, and side effects. No JSX.
  3. `<Component>.tsx`: Pure presentational view. Consumes the hook and styles. Zero inline state, zero inline styles.

```tsx
// 1. In UserCard.styles.ts (Pure Styling)
import { SxProps, Theme } from '@mui/material';

export const cardSx = (theme: Theme): SxProps => ({
  display: 'flex',
  flexDirection: 'column',
  p: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
});

export const nameSx: SxProps = {
  fontWeight: 700,
  fontSize: '1.125rem',
  marginInlineEnd: 'auto',
};

// 2. In useUserCard.ts (Pure Logic)
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateUserStatus } from '@/utils/api/user';

export const useUserCard = (userId: string) => {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    setLoading(true);
    try {
      await updateUserStatus(userId, !isActive);
      setIsActive(prev => !prev);
    } finally {
      setLoading(false);
    }
  };

  return { t, isActive, loading, toggleStatus };
};

// 3. In UserCard.tsx (Pure UI)
import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { useUserCard } from './useUserCard';
import { cardSx, nameSx } from './UserCard.styles';

export const UserCard: React.FC<{ userId: string; name: string }> = ({ userId, name }) => {
  const theme = useTheme();
  const { t, isActive, loading, toggleStatus } = useUserCard(userId);

  return (
    <Box sx={cardSx(theme)}>
      <Typography sx={nameSx}>{name}</Typography>
      <Button onClick={toggleStatus} disabled={loading}>
        {isActive ? t('actions.deactivate') : t('actions.activate')}
      </Button>
    </Box>
  );
};
```

---

## 4. No Boilerplate Comments / Explain Complex Intent Only
- **Rule**: Never write obvious, redundant comments narrating routine code (e.g. `// render button`, `// state for open modal`, `// imports`, `// handle click`).
- **Rule**: Only write comments when documenting complex, non-obvious business requirements, edge cases, or algorithmic calculations, using simple, clear phrasing.

```typescript
// ❌ REJECT (Pointless Narration):
// Import React
import React, { useState } from 'react';
// State for dialog open
const [isOpen, setIsOpen] = useState(false);
// Handle submit button click
const handleClick = () => { ... };
// Render the modal
return <Modal>...</Modal>;

// ✅ APPROVED (Explains Complex Business Rationale):
// Webhook timestamp comes as seconds from Mux; convert to milliseconds for Date constructor.
const receivedAt = new Date(payload.created_at * 1000);
```

---

## 5. Zero Inline Styles (`style={{ ... }}`)
- **Rule**: Never use HTML inline `style` attributes in React components.
- **Enforcement**: Extract all styles to `<Component>.styles.ts` with `SxProps` or Emotion/Styled components.

---

## 6. Centralized RTL/LTR Layout Resolution
- **Rule**: Never hardcode `dir='rtl'`, `dir='ltr'`, or inline `direction: 'rtl'` inside component JSX.
- **Rationale**: Direction is controlled centrally at the application root via Emotion `CacheProvider` (`stylis-plugin-rtl`) and MUI `ThemeProvider`.

---

## 7. CSS Logical Properties
- **Rule**: Always prefer CSS logical properties over physical directions (`left` / `right`).
- Use `marginInlineStart`, `paddingInlineStart`, `marginInlineEnd`, `paddingInlineEnd`.
