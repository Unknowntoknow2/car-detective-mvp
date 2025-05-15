
import { test, expect } from '@playwright/test';

// User credentials
const userEmail = `dashboard-${Date.now()}@cardetective.example.com`;
const userPassword = 'Test1234!';

test.describe('User Dashboard', () => {
  // Create account and log in before tests
  test.beforeEach(async ({ page }) => {
    // Sign up with a new account
    await page.goto('/auth');
    await page.getByRole('tab', { name: /register/i }).click();
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', userPassword);
    await page.getByRole('button', { name: /sign up|register/i }).click();
    
    // If already exists, just log in
    await page.goto('/auth');
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', userPassword);
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    
    // Wait for login to complete
    await expect(page).toHaveURL(/\/dashboard|\/$/);
    
    // Navigate to dashboard if not there
    if (!page.url().includes('/dashboard')) {
      await page.goto('/dashboard');
    }
  });
  
  test('displays user profile information correctly', async ({ page }) => {
    // Navigate to dashboard/profile section
    await page.goto('/dashboard/profile');
    
    // Check if user email is displayed
    await expect(page.getByText(userEmail)).toBeVisible();
    
    // Check for profile elements
    await expect(page.getByText(/profile|account details/i)).toBeVisible();
  });
  
  test('shows valuation history for the user', async ({ page }) => {
    // First create a valuation to have history
    await page.goto('/');
    
    // Navigate to valuation
    await page.getByRole('link', { name: /valuation|estimate|appraisal/i }).click();
    
    // Select manual entry
    await page.getByRole('button', { name: /manual entry|enter manually/i }).click();
    
    // Fill form
    await page.fill('input[name="make"]', 'BMW');
    await page.fill('input[name="model"]', 'X5');
    await page.selectOption('select[name="year"]', '2018');
    await page.fill('input[name="mileage"]', '60000');
    await page.selectOption('select[name="condition"]', 'Good');
    await page.fill('input[name="zipCode"]', '10001');
    
    // Submit form
    await page.getByRole('button', { name: /submit|get valuation|next/i }).click();
    
    // Wait for results
    await expect(page.getByText(/valuation result|estimate|value/i)).toBeVisible({ timeout: 15000 });
    
    // Now go to dashboard/history
    await page.goto('/dashboard/valuations');
    
    // Verify valuation appears in history
    await expect(page.getByText(/bmw x5/i)).toBeVisible();
    await expect(page.getByText(/2018/)).toBeVisible();
  });
  
  test('allows navigation between dashboard sections', async ({ page }) => {
    // Check that dashboard navigation links exist
    await expect(page.getByRole('link', { name: /profile|account/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /valuations|history/i })).toBeVisible();
    
    // Navigate to profile section
    await page.getByRole('link', { name: /profile|account/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/profile|\/profile/);
    
    // Navigate to valuations section
    await page.getByRole('link', { name: /valuations|history/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/valuations|\/valuations/);
  });
  
  test('updates user profile information', async ({ page }) => {
    // Navigate to profile section
    await page.goto('/dashboard/profile');
    
    // Check if edit button exists and click it
    await page.getByRole('button', { name: /edit|update profile/i }).click();
    
    // Fill out profile form
    const newName = `Test User ${Date.now()}`;
    await page.fill('input[name="name"]', newName);
    
    // Save changes
    await page.getByRole('button', { name: /save|update/i }).click();
    
    // Verify success message
    await expect(page.getByText(/profile updated|changes saved|success/i)).toBeVisible();
    
    // Verify new name is displayed
    await expect(page.getByText(newName)).toBeVisible();
  });
  
  test('displays empty state when no valuations exist', async ({ page }) => {
    // Create a fresh user with no history
    const freshUser = `fresh-${Date.now()}@cardetective.example.com`;
    
    // Log out current user
    await page.getByRole('button', { name: /account|profile|user/i }).click();
    await page.getByRole('menuitem', { name: /log out|sign out/i }).click();
    
    // Create and log in as new user
    await page.goto('/auth');
    await page.getByRole('tab', { name: /register/i }).click();
    await page.fill('input[name="email"]', freshUser);
    await page.fill('input[name="password"]', userPassword);
    await page.getByRole('button', { name: /sign up|register/i }).click();
    
    // Navigate to valuations
    await page.goto('/dashboard/valuations');
    
    // Check for empty state
    await expect(page.getByText(/no valuations|empty|start by getting/i)).toBeVisible();
    
    // Verify CTA to create valuation exists
    await expect(page.getByRole('link', { name: /get valuation|start now/i })).toBeVisible();
  });
});
