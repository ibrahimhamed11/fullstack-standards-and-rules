# 🌐 API & Network Layer Architecture

## 1. Domain-Driven Folder Organization
Group network operations into cohesive domain folders rather than monolithic single files:

```
src/utils/api/
├── core/                               # Shared Network Core
│   ├── baseUrl.ts                      # Dynamic API host resolution
│   ├── endpoints.ts                    # Single Source of Truth for ALL URLs
│   ├── axiosInstance.ts                # Axios singleton with auth & interceptors
│   └── index.ts
│
├── modules/                            # Feature Modules
│   ├── auth/                           # Authentication domain
│   │   ├── types.ts                    # DTO & Response interfaces
│   │   ├── auth.api.ts                 # API methods
│   │   └── index.ts
│   ├── user/                           # User domain
│   └── products/                       # Products domain
│
└── index.ts                            # Master API Registry
```

---

## 2. Centralized Endpoints Dictionary (`core/endpoints.ts`)
- **Rule**: All API paths must be declared in `endpoints.ts`. No raw URL strings in components or services.

```typescript
export const ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    refreshToken: '/api/auth/refresh',
  },
  users: {
    profile: '/api/users/profile',
    byId: (id: string) => `/api/users/${id}`,
  },
} as const;
```

---

## 3. Axios Singleton with Interceptors (`core/axiosInstance.ts`)
- Configures automatic Bearer token injection on outgoing requests.
- Handles centralized 401 token refresh or redirection.
- Configures default request timeout (30 seconds).

---

## 4. Zero-Breakage Legacy Migration Strategy
When modernizing an existing codebase without breaking existing imports:
1. Move implementation into `src/utils/api/modules/<domain>/`.
2. Convert the old root file (`src/utils/api/<domain>.ts`) into a re-export shim:
   ```typescript
   export * from './modules/auth';
   export { default } from './modules/auth/auth.api';
   ```
3. Re-export all domains in master `src/utils/api/index.ts`.
