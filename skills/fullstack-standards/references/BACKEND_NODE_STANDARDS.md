# ⚙️ Backend (Node.js, Express & NestJS) Standards

## 1. Clean Layered Architecture
Every backend module must adhere to the 3-layer architecture:
1. **Controller Layer**: Handles HTTP routing, extracts params/body, calls services, sends standardized HTTP responses.
2. **Service Layer**: Pure business logic, orchestration, validation, transactions. Contains NO `req` or `res` objects.
3. **Repository / Data Access Layer**: Database queries (Prisma, TypeORM, Mongoose, Knex).

```
src/
├── modules/
│   └── users/
│       ├── users.controller.ts    # HTTP layer
│       ├── users.service.ts       # Business logic
│       ├── users.repository.ts    # Database access
│       ├── dto/                   # Request/Response validation schemas
│       └── users.types.ts         # Domain models
```

---

## 2. Request Validation with Zod
- **Rule**: No unvalidated request body, query parameter, or route param may enter the service layer.

```typescript
// ✅ APPROVED:
import { z } from 'zod';

export const CreateUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});

export type CreateUserInput = z.infer<typeof CreateUserDto>;
```

---

## 3. Centralized Error Handling & Custom AppErrors
- **Rule**: Never return raw database errors or stack traces to the client.
- **Rule**: Use custom HTTP error classes (`BadRequestError`, `UnauthorizedError`, `NotFoundError`, `ConflictError`).

```typescript
export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
  }
}

// Global Express Error Middleware:
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[${err.code || 'ERROR'}] ${message}`, { stack: err.stack });

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
    },
  });
};
```

---

## 4. Security & Production Best Practices
1. **Helmet & Security Headers**: Always apply `helmet()` middleware.
2. **CORS Configuration**: Explicit origin whitelist (never `origin: '*'` with credentials).
3. **Rate Limiting**: Protect authentication endpoints with `express-rate-limit`.
4. **Environment Variables**: Validate `.env` on startup with Zod. Do not let server boot if keys are missing.
5. **Structured Logging**: Use `winston` or `pino` with JSON format for log ingestion (Datadog/CloudWatch).
