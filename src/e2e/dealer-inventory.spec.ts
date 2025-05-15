
import { test, expect } from '@playwright/test';

test.describe('Dealer Inventory Management', () => {
  const dealerEmail = 'test-dealer@example.com';
  const dealerPassword = 'testPassword123!';
  
  test.beforeEach(async ({ page }) => {
    // Login as a dealer
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', dealerEmail);
    await page.fill('input[name="password"]', dealerPassword);
    await page.click('button[type="submit"]');
    
    // Wait for redirection to dealer dashboard
    await page.waitForURL('**/dealer**');
    
    // Navigate to inventory page
    await page.click('a:has-text("Inventory")');
  });
  
  test('should display dealer inventory correctly', async ({ page }) => {
    // Check that the inventory table is present
    await expect(page.locator('table')).toBeVisible();
    
    // If we have vehicles, check that they are displayed
    const vehicleCount = await page.locator('table tbody tr').count();
    if (vehicleCount > 0) {
      await expect(page.locator('table tbody tr').first()).toBeVisible();
    } else {
      // If no vehicles, check for empty state
      await expect(page.getByText(/No Vehicles Found/i)).toBeVisible();
    }
  });
  
  test('can add a new vehicle to inventory', async ({ page }) => {
    // Click add vehicle button
    await page.click('button:has-text("Add Vehicle")');
    
    // Fill the form
    await page.fill('input[id="make"]', 'Test Make');
    await page.fill('input[id="model"]', 'Test Model');
    await page.fill('input[id="year"]', '2022');
    await page.fill('input[id="mileage"]', '15000');
    await page.fill('input[id="price"]', '25000');
    await page.fill('input[id="zip_code"]', '90210');
    
    // Submit the form
    await page.click('button:has-text("Add Vehicle")');
    
    // Check for success message
    await expect(page.getByText(/added to inventory/i)).toBeVisible();
    
    // Verify the new vehicle appears in the table
    await expect(page.getByText('Test Make Test Model')).toBeVisible();
  });
  
  test('can delete a vehicle from inventory', async ({ page }) => {
    // Add a vehicle to delete (assuming we have the add vehicle test working)
    await page.click('button:has-text("Add Vehicle")');
    await page.fill('input[id="make"]', 'Delete Test');
    await page.fill('input[id="model"]', 'Delete Model');
    await page.fill('input[id="year"]', '2020');
    await page.fill('input[id="mileage"]', '25000');
    await page.fill('input[id="price"]', '18000');
    await page.click('button:has-text("Add Vehicle")');
    
    // Wait for the new vehicle to appear
    await expect(page.getByText('Delete Test Delete Model')).toBeVisible();
    
    // Find the row with our test vehicle
    const vehicleRow = page.locator('tr', { hasText: 'Delete Test Delete Model' });
    
    // Click delete button in that row
    await vehicleRow.locator('button[aria-label="Delete vehicle"]').click();
    
    // Confirm deletion
    await page.click('button:has-text("Delete")');
    
    // Check for success message
    await expect(page.getByText(/removed from inventory/i)).toBeVisible();
    
    // Verify the vehicle is no longer in the table
    await expect(page.getByText('Delete Test Delete Model')).not.toBeVisible();
  });
});
