# 📱 React Native & Mobile Engineering Standards

## 1. Mandatory Path Aliases
- **Rule**: Always import using project-configured path aliases (e.g. `@/...`, `@components/...`, `@screens/...`, `@hooks/...`, `@styles/...`, `@utils/...`).
- **Rationale**: Eliminates fragile relative import chains (`../../../../`) and keeps code relocatable.

```typescript
// ❌ REJECT:
import { Header } from '../../../../components/Header';
import { useAuth } from '../../../hooks/useAuth';

// ✅ APPROVED:
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
```

---

## 2. Mandatory i18n Translation Keys (Zero Hardcoded Text)
- **Rule**: All user-facing strings, button labels, placeholders, dialog titles, and alert messages must be internationalized via `useTranslation()` (`t('domain.key')` or `i18n.t('domain.key')`).
- **Rationale**: Eliminates hardcoded language text and guarantees full Arabic/English bilingual support.

```tsx
// ❌ REJECT:
<Text>Welcome to Market Whales</Text>
<TextInput placeholder="Phone number" />
Alert.alert("Error", "Please check your network");

// ✅ APPROVED:
const { t } = useTranslation();
<Text>{t('auth.welcome')}</Text>
<TextInput placeholder={t('forms.phonePlaceholder')} />
Alert.alert(t('common.error'), t('errors.networkCheck'));
```

---

## 3. Strict 3-Way File Separation (UI, Logic, Styles)
- **Rule**: Screens and components must be separated into 3 dedicated files:
  1. `<Screen>.styles.js` (or `.ts`): Contains `StyleSheet.create({ ... })` only. No JSX, no business logic.
  2. `use<Screen>.js` (or `.ts`): Custom hook containing navigation hooks, `useState`, `useEffect`, handlers, and Redux/API queries. No JSX.
  3. `<Screen>.js` (or `.tsx`): Pure UI view. Calls `use<Screen>()` and renders React Native primitives (`<View>`, `<Text>`, `<TouchableOpacity>`). Zero inline styles, zero inline state.

```tsx
// 1. In ProfileScreen.styles.ts (Pure Styles)
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#0A0F1D',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginVertical: 12,
  },
});

// 2. In useProfileScreen.ts (Pure Logic)
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { fetchUserProfile } from '@/utils/api/user';

export const useProfileScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  return { t, profile, loading, navigation };
};

// 3. In ProfileScreen.tsx (Pure UI)
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useProfileScreen } from './useProfileScreen';
import { styles } from './ProfileScreen.styles';

export const ProfileScreen: React.FC = () => {
  const { t, profile, loading } = useProfileScreen();

  if (loading) {
    return <ActivityIndicator style={styles.container} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile.title')}</Text>
      <Text>{profile?.name}</Text>
    </View>
  );
};
```

---

## 4. No Boilerplate Comments / Explain Complex Intent Only
- **Rule**: Never write obvious comments narrating standard React Native code (e.g. `// render screen`, `// navigation hook`, `// state for loading`, `// imports`).
- **Rule**: Only explain complex, non-obvious, platform-specific or algorithmic logic with simple phrasing.

```typescript
// ❌ REJECT:
// State for modal
const [isOpen, setIsOpen] = useState(false);
// Navigate to home screen
navigation.navigate('Home');

// ✅ APPROVED:
// Android okhttp requires explicit SSL handshake fallback for older Android 7 devices.
const customAgent = Platform.OS === 'android' ? createFallbackAgent() : undefined;
```

---

## 5. Styling Standards: `StyleSheet.create` Only
- **Rule**: Never pass raw inline style objects directly in JSX (`style={{ marginTop: 20 }}`). Always use `StyleSheet.create` in a dedicated `.styles.ts` file.

---

## 6. Mobile RTL & Bi-directional Support (`I18nManager`)
- **Rule**: Never manually invert coordinates with raw math. Utilize `I18nManager.isRTL` and logical style keys (`marginStart`, `marginEnd`, `paddingStart`, `paddingEnd`).

---

## 7. List Performance: `FlashList` over `ScrollView`
- **Rule**: Never map large arrays inside a `<ScrollView>`. Use `@shopify/flash-list` or `<FlatList>` with `getItemLayout`, `keyExtractor`, and `maxToRenderPerBatch`.
