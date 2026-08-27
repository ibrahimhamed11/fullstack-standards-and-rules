# 📱 React Native & Mobile Engineering Standards

## 1. Styling Standards: `StyleSheet.create` Only
- **Rule**: Never pass raw inline style objects directly in JSX (`style={{ marginTop: 20 }}`). Always use `StyleSheet.create` or designated design system components.
- **Rationale**: `StyleSheet.create` sends styles over the native bridge only once and validates properties ahead of render time.

```tsx
// ❌ REJECT:
<View style={{ flex: 1, padding: 16, backgroundColor: '#0A0F1D' }}>
  <Text style={{ fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' }}>Dashboard</Text>
</View>

// ✅ APPROVED:
import { StyleSheet, View, Text } from 'react-native';

export const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0A0F1D',
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
```

---

## 2. Mobile RTL & Bi-directional Support (`I18nManager`)
- **Rule**: Never manually invert coordinates with raw math. Utilize `I18nManager.isRTL` and logical style keys (`marginStart`, `marginEnd`, `paddingStart`, `paddingEnd`).

```typescript
// ✅ APPROVED:
const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: 16,
    paddingEnd: 12,
    marginStart: 8,
  },
});
```

---

## 3. List Performance: `FlashList` over `ScrollView`
- **Rule**: Never map large arrays inside a `<ScrollView>`. Use `@shopify/flash-list` or `<FlatList>` with `getItemLayout`, `keyExtractor`, and `maxToRenderPerBatch`.

```tsx
// ❌ REJECT:
<ScrollView>
  {items.map(item => <ItemCard key={item.id} data={item} />)}
</ScrollView>

// ✅ APPROVED:
<FlashList
  data={items}
  renderItem={({ item }) => <ItemCard data={item} />}
  estimatedItemSize={88}
  keyExtractor={(item) => item.id}
/>
```

---

## 4. Safe Area & Keyboard Handling
- Always wrap screen roots in `SafeAreaProvider` / `useSafeAreaInsets()`.
- Wrap forms in `<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>`.
- Dismiss keyboard on outside touch via `<TouchableWithoutFeedback onPress={Keyboard.dismiss}>`.

---

## 5. Mobile Asset Management
- Store icons as SVGs via `react-native-svg`.
- Provide `@2x` and `@3x` variants for raster images.
- Cache remote images with `react-native-fast-image` or Expo Image with blurhash placeholders.
