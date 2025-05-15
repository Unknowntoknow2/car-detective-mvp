
import { test, expect } from '@playwright/test';

test.describe('Dealer Dashboard', () => {
  // Dealer credentials
  const dealerEmail = 'dealer@example.com';
  const dealerPassword = 'dealerpass123';

  test.beforeEach(async ({ page }) => {
    // Login as dealer before each test
    await page.goto('/auth');
    await page.fill('input[name="email"]', dealerEmail);
    await page.fill('input[name="password"]', dealerPassword);
    await page.click('button[type="submit"]');
    
    // Navigate to dealer dashboard
    await page.goto('/dealer/dashboard');
  });

  test('should display dealer stats correctly', async ({ page }) => {
    // Check for key statistics
    await expect(page.getByText(/inventory/i)).toBeVisible();
    await expect(page.getByText(/active listing/i)).toBeVisible();
    await expect(page.getByText(/leads/i)).toBeVisible();
  });

  test('should allow adding a new vehicle to inventory', async ({ page }) => {
    // Navigate to inventory
    await page.click('a:has-text("Inventory")');
    
    // Click add vehicle button
    await page.click('button:has-text("Add Vehicle")');
    
    // Fill out the vehicle form
    await page.fill('input[name="make"]', 'Toyota');
    await page.fill('input[name="model"]', 'Corolla');
    await page.fill('input[name="year"]', '2021');
    await page.fill('input[name="mileage"]', '15000');
    await page.fill('input[name="price"]', '18500');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Check that the vehicle was added
    await expect(page.getByText(/Toyota Corolla/)).toBeVisible();
  });

  test('should allow editing an existing vehicle', async ({ page }) => {
    // Navigate to inventory
    await page.click('a:has-text("Inventory")');
    
    // Find and click edit on first vehicle
    await page.click('button[aria-label="Edit vehicle"]');
    
    // Update the price
    await page.fill('input[name="price"]', '19500');
    
    // Save changes
    await page.click('button:has-text("Save")');
    
    // Check that the price was updated
    await expect(page.getByText('$19,500')).toBeVisible();
  });
});
