# Configuration Management

This document outlines the configuration system that replaces `import.meta.env.VITE_*` usage.

## Overview

The application uses a centralized configuration system located in `src/config/index.ts` that:
- Validates configuration at startup
- Supports both build-time and runtime configuration injection
- Provides type safety for all configuration values
- Prevents accidental exposure of secrets

## Usage

```typescript
import { appConfig } from '@/config';

// Use config values instead of import.meta.env.VITE_*
const apiUrl = appConfig.API_BASE_URL;
const isDebugMode = appConfig.ENABLE_DIAGNOSTICS;
```

## Adding New Configuration

1. **Add to schema in `src/config/index.ts`:**
```typescript
const ConfigSchema = z.object({
  // ... existing config
  NEW_CONFIG_KEY: z.string().optional(),
});
```

2. **Add to derived config:**
```typescript
export const appConfig = {
  ...config,
  NEW_FEATURE_ENABLED: config.NEW_CONFIG_KEY === 'true',
};
```

3. **Set environment variable:**
```bash
VITE_NEW_CONFIG_KEY=value
```

## Runtime Configuration Injection

For production deployments, configuration is injected at runtime via `window.__APP_CONFIG__`:

1. **Build time:** Placeholder is added to `index.html`
2. **Deploy time:** `scripts/inject-runtime-config.ts` replaces placeholder with actual values
3. **Runtime:** Configuration system reads from `window.__APP_CONFIG__`

## Banned Patterns

**❌ Never use these patterns:**

```typescript
// BANNED - Direct env access
import.meta.env.VITE_SUPABASE_URL
process.env.VITE_API_KEY

// BANNED - Hardcoded URLs
"http://localhost:3000/api"
"https://localhost:8080"

// BANNED - Console logging in production
console.log('debug info')
console.info('startup')
debugger;
```

**✅ Use these instead:**

```typescript
// CORRECT - Centralized config
import { appConfig } from '@/config';
appConfig.SUPABASE_URL
appConfig.API_BASE_URL

// CORRECT - Proper logging
import { logger } from '@/lib/logger';
logger.log('debug info'); // Only logs in development
logger.error('error info'); // Always logs
```

## Validation Commands

Check for banned patterns before committing:

```bash
# Check for VITE_ usage
grep -r "import\.meta\.env\.VITE_" src/

# Check for localhost URLs  
grep -r "localhost:" src/

# Check for console.log statements
grep -r "console\.log(" src/

# Run full validation
./scripts/validate-no-banned-patterns.sh
```

## CI/CD Integration

The CI pipeline automatically validates:
- No `import.meta.env.VITE_*` usage
- No hardcoded localhost URLs  
- No console.log statements
- TypeScript compilation passes
- ESLint production rules pass

Any violations will fail the build.

## Security Considerations

- **Public config:** Only non-sensitive values are injected into `window.__APP_CONFIG__`
- **Secrets:** Server-side environment variables are never exposed to the client
- **Validation:** Zod schema ensures configuration integrity at startup
- **Type safety:** TypeScript prevents invalid configuration access

## Migration Guide

When migrating from `import.meta.env.VITE_*`:

1. **Import config:** Add `import { appConfig } from '@/config'`
2. **Replace usage:** Change `import.meta.env.VITE_KEY` to `appConfig.KEY` 
3. **Update logging:** Replace `console.log` with `logger.log`
4. **Remove hardcoded URLs:** Use `appConfig.API_BASE_URL` etc.
5. **Test:** Run validation script to ensure compliance
