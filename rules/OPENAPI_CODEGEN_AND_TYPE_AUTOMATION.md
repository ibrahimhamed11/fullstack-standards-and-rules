# ⚡ Automated OpenAPI / Swagger Code Generation Pipeline

*Production-grade pattern for automatically generating type-safe API clients, endpoints, DTOs, and RTK Query / React Query hooks directly from backend Swagger/OpenAPI specs.*

---

## 1. Why OpenAPI Codegen?
- **Zero Drift**: Eliminates discrepancies between backend API responses and frontend TypeScript models.
- **Instant Productivity**: Developers run `npm run generate:api` to fetch new endpoints and types automatically without manually typing DTO interfaces.
- **Type-Safe Contract**: Compile-time errors immediately when backend models change.

---

## 2. Pipeline Architecture

```
scripts/generateApis/
├── config.json                 # Swagger URL & output configuration
├── config.ts                   # Environment resolution & headers
├── downloadApi.ts              # Downloads remote swagger.json / docs.json
├── typeUtils.ts                # TypeScript AST mapping (OpenAPI types -> TS types)
├── endpointUtils.ts            # URL parameter extraction & query formatting
├── apiSliceGenerator.ts        # Generates typed API services or RTK/React Query slices
└── generateApi.ts              # Master CLI generator script
```

---

## 3. Workflow Implementation

Add scripts to `package.json`:
```json
{
  "scripts": {
    "download:api": "npx tsx scripts/generateApis/downloadApi.ts",
    "generate:api": "npx tsx scripts/generateApis/generateApi.ts",
    "api:sync": "npm run download:api && npm run generate:api && npx prettier --write src/api"
  }
}
```

### Generator Script Template (`generateApi.ts`):
```typescript
import fs from 'fs';
import path from 'path';
import { generateTypesFromSwagger } from './typeUtils';
import { generateApiModules } from './apiSliceGenerator';

async function main() {
  const swaggerPath = path.resolve(__dirname, '../../src/api/docs.json');
  if (!fs.existsSync(swaggerPath)) {
    throw new Error('Swagger specification not found. Run "npm run download:api" first.');
  }

  const swaggerSpec = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
  console.log(`🚀 Parsing OpenAPI schema: ${swaggerSpec.info.title} v${swaggerSpec.info.version}`);

  // 1. Generate TypeScript Interfaces
  const typesOutput = generateTypesFromSwagger(swaggerSpec);
  fs.writeFileSync(path.resolve(__dirname, '../../src/api/types/index.ts'), typesOutput);

  // 2. Generate Domain Modules
  generateApiModules(swaggerSpec, path.resolve(__dirname, '../../src/api/modules'));

  console.log('✅ API modules and types generated successfully!');
}

main().catch(console.error);
```
