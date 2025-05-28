
import { test, expect } from '@playwright/test';

const fakeEmail = 'testuser+' + Date.now() + '@example.com';
const fakePhone = '+1555123' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
const password = 'Test1234!';

test.describe('Auth Flow', () => {
  test('Sign up with email', async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('tab', { name: /sign up/i }).click();
    await page.fill('input[name="email"]', fakeEmail);
    await page.fill('input[name="password"]', password);
    await page.getByRole('button', { name: /sign up/i }).click();
    await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });
  });

  test('Sign up with phone', async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('tab', { name: /sign up/i }).click();
    await page.click('text=Phone'); // switch to phone tab
    await page.fill('input[name="phone"]', fakePhone);
    await page.fill('input[name="password"]', password);
    await page.getByRole('button', { name: /sign up/i }).click();
    await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });
  });

  test('Login with wrong password', async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[name="email"]', fakeEmail);
    await page.fill('input[name="password"]', 'WrongPassword!');
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page.locator('text=Invalid')).toBeVisible();
  });

  test('Forgot password flow', async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('link', { name: /forgot password/i }).click();
    await page.fill('input[name="email"]', fakeEmail);
    await page.getByRole('button', { name: /send reset link/i }).click();
    await expect(page.locator('text=check your email')).toBeVisible();
  });

  test('Existing account email detection', async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('tab', { name: /sign up/i }).click();
    await page.fill('input[name="email"]', fakeEmail); // same email as before
    await page.fill('input[name="password"]', password);
    await page.getByRole('button', { name: /sign up/i }).click();
    await expect(page.locator('text=already exists')).toBeVisible();
  });
});
