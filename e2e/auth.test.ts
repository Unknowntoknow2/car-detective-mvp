
import { test, expect } from '@playwright/test';

// Generate a unique email for each test run to avoid conflicts
const testEmail = `test-${Date.now()}@cardetective.example.com`;
const testPassword = 'Test1234!';
const dealerEmail = `dealer-${Date.now()}@cardetective.example.com`;

test.describe('Authentication Flows', () => {
  test('allows a user to sign up with email and password', async ({ page }) => {
    // Navigate to authentication page
    await page.goto('/auth');
    
    // Click the sign up tab
    await page.getByRole('tab', { name: /register/i }).click();
    
    // Fill out the sign up form
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    
    // Submit the form
    await page.getByRole('button', { name: /sign up|register/i }).click();
    
    // Check if registration was successful (redirect to dashboard or success message)
    await expect(page).toHaveURL(/\/dashboard|\/$/);
    
    // Alternative success check if there's a success toast
    await expect(page.getByText(/successfully|account created/i)).toBeVisible({ timeout: 10000 });
  });
  
  test('allows a user to log in with correct credentials', async ({ page }) => {
    // Navigate to authentication page
    await page.goto('/auth');
    
    // Fill out the login form
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    
    // Submit the form
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    
    // Check if login was successful (redirect to dashboard or home)
    await expect(page).toHaveURL(/\/dashboard|\/$/);
    
    // Check for user-specific element that confirms logged-in state
    await expect(page.getByText(/dashboard|account|profile/i)).toBeVisible();
  });
  
  test('shows error message with incorrect login credentials', async ({ page }) => {
    // Navigate to authentication page
    await page.goto('/auth');
    
    // Fill out the login form with incorrect password
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', 'WrongPassword123!');
    
    // Submit the form
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    
    // Check for error message
    await expect(page.getByText(/incorrect|invalid|wrong password|failed/i)).toBeVisible();
  });
  
  test('allows dealer signup with additional fields', async ({ page }) => {
    // Navigate to dealer signup page
    await page.goto('/dealer/signup');
    
    // Fill out the dealer signup form
    await page.fill('input[name="email"]', dealerEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="fullName"]', 'Test Dealer');
    await page.fill('input[name="dealershipName"]', 'Test Dealership');
    await page.fill('input[name="phone"]', '555-123-4567');
    
    // Submit the form
    await page.getByRole('button', { name: /sign up|register|create account/i }).click();
    
    // Check if registration was successful
    await expect(page).toHaveURL(/\/dealer\/dashboard|\/dealer|\/$/);
    
    // Alternative success check
    await expect(page.getByText(/successfully|account created|welcome/i)).toBeVisible({ timeout: 10000 });
  });
  
  test('allows user to log out', async ({ page }) => {
    // First login
    await page.goto('/auth');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    
    // Wait for login to complete
    await expect(page).toHaveURL(/\/dashboard|\/$/);
    
    // Click on user menu/profile button
    await page.getByRole('button', { name: /account|profile|user/i }).click();
    
    // Click logout option
    await page.getByRole('menuitem', { name: /log out|sign out/i }).click();
    
    // Verify user is logged out and redirected to home page
    await expect(page).toHaveURL(/\/$/);
    
    // Check that login/signup options are now visible
    await expect(page.getByRole('link', { name: /log in|sign in|sign up/i })).toBeVisible();
  });
});
