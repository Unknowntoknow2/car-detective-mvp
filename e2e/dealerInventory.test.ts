
import { test, expect } from '@playwright/test';

// Dealer credentials
const dealerEmail = `dealer-${Date.now()}@cardetective.example.com`;
const dealerPassword = 'Dealer1234!';

test.describe('Dealer Inventory Management', () => {
  // Create and log in as dealer before each test
  test.beforeEach(async ({ page }) => {
    // Try to sign up as a dealer
    await page.goto('/dealer/signup');
    
    await page.fill('input[name="email"]', dealerEmail);
    await page.fill('input[name="password"]', dealerPassword);
    await page.fill('input[name="fullName"]', 'Test Dealer');
    await page.fill('input[name="dealershipName"]', 'Test Dealership');
    await page.fill('input[name="phone"]', '555-123-4567');
    
    await page.getByRole('button', { name: /sign up|register|create account/i }).click();
    
    // If already exists, just login
    await page.goto('/auth');
    await page.fill('input[name="email"]', dealerEmail);
    await page.fill('input[name="password"]', dealerPassword);
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    
    // Navigate to dealer inventory section
    await page.goto('/dealer/inventory');
  });
  
  test('allows dealer to add a new vehicle to inventory', async ({ page }) => {
    // Click on Add Vehicle button
    await page.getByRole('button', { name: /add vehicle|create listing/i }).click();
    
    // Wait for modal/form to appear
    await expect(page.getByText(/add vehicle|create listing/i)).toBeVisible();
    
    // Fill out the vehicle details
    await page.fill('input[name="make"]', 'Honda');
    await page.fill('input[name="model"]', 'Accord');
    await page.fill('input[name="year"]', '2020');
    await page.fill('input[name="price"]', '25000');
    await page.fill('input[name="mileage"]', '30000');
    
    // Select condition, transmission, etc if needed
    await page.selectOption('select[name="condition"]', 'Excellent');
    await page.selectOption('select[name="transmission"]', 'Automatic');
    await page.selectOption('select[name="fuel_type"]', 'Gasoline');
    
    // Submit the form
    await page.getByRole('button', { name: /save|submit|add/i }).click();
    
    // Verify success message
    await expect(page.getByText(/vehicle added|listing created|success/i)).toBeVisible();
    
    // Check if the new vehicle appears in the inventory list
    await expect(page.getByText(/honda accord/i)).toBeVisible();
    await expect(page.getByText(/2020/)).toBeVisible();
    await expect(page.getByText(/\$25,000|\$25000/)).toBeVisible();
  });
  
  test('allows dealer to edit an existing vehicle', async ({ page }) => {
    // First add a vehicle if inventory is empty
    if (await page.getByText(/no vehicles|empty inventory/i).isVisible()) {
      // Add a vehicle
      await page.getByRole('button', { name: /add vehicle|create listing/i }).click();
      await page.fill('input[name="make"]', 'Ford');
      await page.fill('input[name="model"]', 'Mustang');
      await page.fill('input[name="year"]', '2019');
      await page.fill('input[name="price"]', '35000');
      await page.fill('input[name="mileage"]', '25000');
      await page.selectOption('select[name="condition"]', 'Good');
      await page.getByRole('button', { name: /save|submit|add/i }).click();
      
      // Wait for vehicle to appear in inventory
      await expect(page.getByText(/ford mustang/i)).toBeVisible();
    }
    
    // Click edit button on the first vehicle
    await page.getByRole('button', { name: /edit/i }).first().click();
    
    // Modify vehicle details
    await page.fill('input[name="price"]', '32500');
    await page.fill('input[name="mileage"]', '27500');
    
    // Save changes
    await page.getByRole('button', { name: /save|update/i }).click();
    
    // Verify success message
    await expect(page.getByText(/updated|changes saved|success/i)).toBeVisible();
    
    // Check if the updated information appears
    await expect(page.getByText(/\$32,500|\$32500/)).toBeVisible();
  });
  
  test('allows dealer to delete a vehicle', async ({ page }) => {
    // First add a vehicle if inventory is empty
    if (await page.getByText(/no vehicles|empty inventory/i).isVisible()) {
      // Add a vehicle
      await page.getByRole('button', { name: /add vehicle|create listing/i }).click();
      await page.fill('input[name="make"]', 'Chevrolet');
      await page.fill('input[name="model"]', 'Camaro');
      await page.fill('input[name="year"]', '2018');
      await page.fill('input[name="price"]', '30000');
      await page.fill('input[name="mileage"]', '40000');
      await page.getByRole('button', { name: /save|submit|add/i }).click();
      
      // Wait for vehicle to appear in inventory
      await expect(page.getByText(/chevrolet camaro/i)).toBeVisible();
    }
    
    // Store the make/model of the first vehicle before deletion
    const vehicleText = await page.locator('tbody tr').first().textContent();
    
    // Click delete button on the first vehicle
    await page.getByRole('button', { name: /delete|remove/i }).first().click();
    
    // Confirm deletion in the dialog
    await page.getByRole('button', { name: /confirm|yes|delete/i }).click();
    
    // Verify success message
    await expect(page.getByText(/deleted|removed|success/i)).toBeVisible();
    
    // Check that the vehicle no longer appears
    if (vehicleText) {
      const distinctiveText = vehicleText.substring(0, 10); // Get a snippet of the text
      await expect(page.getByText(distinctiveText)).not.toBeVisible();
    }
  });
  
  test('filters inventory by search and status', async ({ page }) => {
    // Add two different vehicles for testing filters
    // First vehicle
    await page.getByRole('button', { name: /add vehicle|create listing/i }).click();
    await page.fill('input[name="make"]', 'Toyota');
    await page.fill('input[name="model"]', 'Corolla');
    await page.fill('input[name="year"]', '2021');
    await page.fill('input[name="price"]', '22000');
    await page.fill('input[name="mileage"]', '15000');
    await page.selectOption('select[name="status"]', 'available');
    await page.getByRole('button', { name: /save|submit|add/i }).click();
    
    // Wait for success and add second vehicle
    await expect(page.getByText(/vehicle added|listing created|success/i)).toBeVisible();
    
    // Second vehicle
    await page.getByRole('button', { name: /add vehicle|create listing/i }).click();
    await page.fill('input[name="make"]', 'Nissan');
    await page.fill('input[name="model"]', 'Altima');
    await page.fill('input[name="year"]', '2020');
    await page.fill('input[name="price"]', '19000');
    await page.fill('input[name="mileage"]', '25000');
    await page.selectOption('select[name="status"]', 'pending');
    await page.getByRole('button', { name: /save|submit|add/i }).click();
    
    // Test search filter
    await page.fill('input[placeholder*="Search"]', 'Toyota');
    
    // Check if only Toyota is visible and Nissan is not
    await expect(page.getByText(/toyota corolla/i)).toBeVisible();
    await expect(page.getByText(/nissan altima/i)).not.toBeVisible();
    
    // Clear search and test status filter
    await page.fill('input[placeholder*="Search"]', '');
    
    // Select status filter for pending
    await page.selectOption('select[name="statusFilter"]', 'pending');
    
    // Check if only Nissan is visible and Toyota is not
    await expect(page.getByText(/nissan altima/i)).toBeVisible();
    await expect(page.getByText(/toyota corolla/i)).not.toBeVisible();
  });
  
  test('prevents non-dealer users from accessing inventory management', async ({ page }) => {
    // Log out first
    await page.getByRole('button', { name: /account|profile|user/i }).click();
    await page.getByRole('menuitem', { name: /log out|sign out/i }).click();
    
    // Create regular user
    const regularUserEmail = `user-${Date.now()}@cardetective.example.com`;
    await page.goto('/auth');
    await page.getByRole('tab', { name: /register/i }).click();
    await page.fill('input[name="email"]', regularUserEmail);
    await page.fill('input[name="password"]', 'User1234!');
    await page.getByRole('button', { name: /sign up|register/i }).click();
    
    // Try to access dealer inventory page
    await page.goto('/dealer/inventory');
    
    // Should be redirected or see access denied
    await expect(page).not.toHaveURL('/dealer/inventory');
    
    // Either redirected to login or seeing access denied message
    const isAccessDenied = await Promise.race([
      page.getByText(/access denied|not authorized|dealer only/i).isVisible().then(visible => visible ? 'denied' : ''),
      page.getByText(/sign in|log in|login required/i).isVisible().then(visible => visible ? 'login' : '')
    ]);
    
    expect(isAccessDenied).toMatch(/denied|login/);
  });
});
