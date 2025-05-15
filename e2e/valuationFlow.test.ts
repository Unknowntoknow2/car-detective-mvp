
import { test, expect } from '@playwright/test';

// User credentials for testing
const userEmail = `test-${Date.now()}@cardetective.example.com`;
const userPassword = 'Test1234!';

// Vehicle data for testing
const testVehicle = {
  make: 'Toyota',
  model: 'Camry',
  year: '2019',
  mileage: '45000',
  condition: 'Good',
  zipCode: '90210'
};

test.describe('Valuation Flow', () => {
  // Log in before tests
  test.beforeEach(async ({ page }) => {
    // Create account if needed
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
  });
  
  test('completes a free valuation flow successfully', async ({ page }) => {
    // Go to home page or valuation entry point
    await page.goto('/');
    
    // Navigate to the valuation form
    await page.getByRole('link', { name: /valuation|estimate|appraisal/i }).click();
    
    // Select manual entry to enter vehicle details
    await page.getByRole('button', { name: /manual entry|enter manually/i }).click();
    
    // Fill out the form
    await page.fill('input[name="make"]', testVehicle.make);
    await page.fill('input[name="model"]', testVehicle.model);
    await page.selectOption('select[name="year"]', testVehicle.year);
    await page.fill('input[name="mileage"]', testVehicle.mileage);
    await page.selectOption('select[name="condition"]', testVehicle.condition);
    await page.fill('input[name="zipCode"]', testVehicle.zipCode);
    
    // Submit valuation request
    await page.getByRole('button', { name: /submit|get valuation|next/i }).click();
    
    // Check if valuation results display
    await expect(page.getByText(/valuation result|estimate|value/i)).toBeVisible({ timeout: 15000 });
    
    // Verify vehicle details are displayed correctly
    await expect(page.getByText(testVehicle.make)).toBeVisible();
    await expect(page.getByText(testVehicle.model)).toBeVisible();
    await expect(page.getByText(testVehicle.year)).toBeVisible();
    
    // Check for value estimate display
    await expect(page.getByText(/\$[0-9,]+/)).toBeVisible();
  });
  
  test('offers premium upgrade option on valuation results', async ({ page }) => {
    // Go to home page
    await page.goto('/');
    
    // Navigate to valuation
    await page.getByRole('link', { name: /valuation|estimate|appraisal/i }).click();
    
    // Select manual entry
    await page.getByRole('button', { name: /manual entry|enter manually/i }).click();
    
    // Fill form with test data
    await page.fill('input[name="make"]', testVehicle.make);
    await page.fill('input[name="model"]', testVehicle.model);
    await page.selectOption('select[name="year"]', testVehicle.year);
    await page.fill('input[name="mileage"]', testVehicle.mileage);
    await page.selectOption('select[name="condition"]', testVehicle.condition);
    await page.fill('input[name="zipCode"]', testVehicle.zipCode);
    
    // Submit form
    await page.getByRole('button', { name: /submit|get valuation|next/i }).click();
    
    // Wait for results
    await expect(page.getByText(/valuation result|estimate|value/i)).toBeVisible({ timeout: 15000 });
    
    // Check for premium upgrade option
    await expect(page.getByText(/premium|upgrade|detailed report/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /upgrade|get premium|unlock/i })).toBeVisible();
  });
  
  test('restricts premium features until payment', async ({ page }) => {
    // Go to valuation result page
    await page.goto('/');
    await page.getByRole('link', { name: /valuation|estimate|appraisal/i }).click();
    await page.getByRole('button', { name: /manual entry|enter manually/i }).click();
    
    // Fill form
    await page.fill('input[name="make"]', testVehicle.make);
    await page.fill('input[name="model"]', testVehicle.model);
    await page.selectOption('select[name="year"]', testVehicle.year);
    await page.fill('input[name="mileage"]', testVehicle.mileage);
    await page.selectOption('select[name="condition"]', testVehicle.condition);
    await page.fill('input[name="zipCode"]', testVehicle.zipCode);
    await page.getByRole('button', { name: /submit|get valuation|next/i }).click();
    
    // Wait for results
    await expect(page.getByText(/valuation result|estimate|value/i)).toBeVisible({ timeout: 15000 });
    
    // Look for locked premium features
    await expect(page.getByText(/locked|premium only|upgrade to access/i)).toBeVisible();
    
    // Try to access a premium feature
    const premiumElement = page.getByText(/detailed history|forecast|dealer offers/i).first();
    await premiumElement.click();
    
    // Should show payment/upgrade prompt
    await expect(page.getByText(/payment|upgrade required|unlock now/i)).toBeVisible();
  });
  
  test('includes explanation for the valuation result', async ({ page }) => {
    // Go to valuation page
    await page.goto('/');
    await page.getByRole('link', { name: /valuation|estimate|appraisal/i }).click();
    await page.getByRole('button', { name: /manual entry|enter manually/i }).click();
    
    // Fill form
    await page.fill('input[name="make"]', testVehicle.make);
    await page.fill('input[name="model"]', testVehicle.model);
    await page.selectOption('select[name="year"]', testVehicle.year);
    await page.fill('input[name="mileage"]', testVehicle.mileage);
    await page.selectOption('select[name="condition"]', testVehicle.condition);
    await page.fill('input[name="zipCode"]', testVehicle.zipCode);
    await page.getByRole('button', { name: /submit|get valuation|next/i }).click();
    
    // Wait for results
    await expect(page.getByText(/valuation result|estimate|value/i)).toBeVisible({ timeout: 15000 });
    
    // Check for explanation section
    await expect(page.getByText(/how we calculated|explanation|factors/i)).toBeVisible();
    
    // Check for specific valuation factors
    await expect(page.getByText(/mileage|condition|market|location/i)).toBeVisible();
  });
});
