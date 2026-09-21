# 🔄 State Management & Caching Standards

## 1. Server State vs Client State
- **Server State (API Data, Caching, Polling)**: Use **TanStack Query (React Query)** or **RTK Query**. Never store raw server responses in unstructured global state.
- **Client UI State (Modals, Theme, Active Filter)**: Use lightweight state management like **Zustand** or **Redux Toolkit slices**.
- **Form State**: Use **React Hook Form** with **Zod resolver**.

```typescript
// ✅ APPROVED React Query Pattern:
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userAPI.getProfile(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes fresh
    gcTime: 30 * 60 * 1000,    // 30 minutes in cache
  });
};
```

---

## 2. Backend Caching with Redis
- Cache high-read/low-write endpoints (Brokers list, Course catalog, Leaderboards).
- Always set an explicit **TTL (Time to Live)** to prevent stale cache accumulation.
- Invalidate cache tags on mutations (`POST`, `PUT`, `DELETE`).

```typescript
// Cache-aside pattern
export const getCachedOrFetch = async <T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> => {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const fresh = await fetchFn();
  await redis.setex(key, ttlSeconds, JSON.stringify(fresh));
  return fresh;
};
```
