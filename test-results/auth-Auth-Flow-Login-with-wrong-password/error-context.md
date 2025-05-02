# Test info

- Name: Auth Flow >> Login with wrong password
- Location: C:\Users\Farid wolasyar\Documents\Valauations\tests\auth.spec.ts:28:3

# Error details

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="email"]')

    at C:\Users\Farid wolasyar\Documents\Valauations\tests\auth.spec.ts:30:16
```

# Page snapshot

```yaml
- img
- heading "Something went wrong" [level=2]
- paragraph: We encountered an unexpected error while rendering this component.
- group: Error Details
- button "Try Again":
  - img
  - text: Try Again
- button "Go to Home":
  - img
  - text: Go to Home
```

# Test source

```ts
   1 |
   2 | import { test, expect } from '@playwright/test';
   3 |
   4 | const fakeEmail = 'testuser+' + Date.now() + '@example.com';
   5 | const fakePhone = '+1555123' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
   6 | const password = 'Test1234!';
   7 |
   8 | test.describe('Auth Flow', () => {
   9 |   test('Sign up with email', async ({ page }) => {
  10 |     await page.goto('/auth');
  11 |     await page.getByRole('tab', { name: /sign up/i }).click();
  12 |     await page.fill('input[name="email"]', fakeEmail);
  13 |     await page.fill('input[name="password"]', password);
  14 |     await page.getByRole('button', { name: /sign up/i }).click();
  15 |     await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });
  16 |   });
  17 |
  18 |   test('Sign up with phone', async ({ page }) => {
  19 |     await page.goto('/auth');
  20 |     await page.getByRole('tab', { name: /sign up/i }).click();
  21 |     await page.click('text=Phone'); // switch to phone tab
  22 |     await page.fill('input[name="phone"]', fakePhone);
  23 |     await page.fill('input[name="password"]', password);
  24 |     await page.getByRole('button', { name: /sign up/i }).click();
  25 |     await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });
  26 |   });
  27 |
  28 |   test('Login with wrong password', async ({ page }) => {
  29 |     await page.goto('/auth');
> 30 |     await page.fill('input[name="email"]', fakeEmail);
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  31 |     await page.fill('input[name="password"]', 'WrongPassword!');
  32 |     await page.getByRole('button', { name: /log in/i }).click();
  33 |     await expect(page.locator('text=Invalid')).toBeVisible();
  34 |   });
  35 |
  36 |   test('Forgot password flow', async ({ page }) => {
  37 |     await page.goto('/auth');
  38 |     await page.getByRole('link', { name: /forgot password/i }).click();
  39 |     await page.fill('input[name="email"]', fakeEmail);
  40 |     await page.getByRole('button', { name: /send reset link/i }).click();
  41 |     await expect(page.locator('text=check your email')).toBeVisible();
  42 |   });
  43 |
  44 |   test('Existing account email detection', async ({ page }) => {
  45 |     await page.goto('/auth');
  46 |     await page.getByRole('tab', { name: /sign up/i }).click();
  47 |     await page.fill('input[name="email"]', fakeEmail); // same email as before
  48 |     await page.fill('input[name="password"]', password);
  49 |     await page.getByRole('button', { name: /sign up/i }).click();
  50 |     await expect(page.locator('text=already exists')).toBeVisible();
  51 |   });
  52 | });
  53 |
```