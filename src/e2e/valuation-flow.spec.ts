
import { test, expect } from '@playwright/test';

test.describe('Valuation Flow', () => {
  test('should complete manual valuation flow and display results', async ({ page }) => {
    // Visit the free valuation page
    await page.goto('/valuation');
    
    // Fill out the form
    await page.getByLabel('Make').selectOption('Honda');
    await page.getByLabel('Model').selectOption('Accord');
    await page.getByLabel('Year').selectOption('2019');
    await page.getByLabel('Mileage').fill('45000');
    await page.getByLabel('Condition').selectOption('Good');
    await page.getByLabel('ZIP Code').fill('94103');
    
    // Submit the form
    await page.getByRole('button', { name: /get valuation/i }).click();
    
    // Wait for valuation to complete
    await page.waitForSelector('text=Estimated Value', { timeout: 10000 });
    
    // Check that the valuation result displays the correct vehicle info
    await expect(page.getByText('Honda')).toBeVisible();
    await expect(page.getByText('Accord')).toBeVisible();
    await expect(page.getByText('2019')).toBeVisible();
    await expect(page.getByText(/45,000 miles/i)).toBeVisible();
    
    // Check that the estimated value is displayed
    await expect(page.getByText('Estimated Value')).toBeVisible();
    await expect(page.locator('.text-primary').filter({ hasText: '$' })).toBeVisible();
    
    // Try downloading a PDF report
    await page.getByRole('button', { name: /download report/i }).click();
    
    // Verify that a success toast appears
    await expect(page.getByText(/PDF report downloaded/i)).toBeVisible();
  });
  
  test('should display and interact with AI chat bubble', async ({ page }) => {
    // Go to a valuation detail page
    await page.goto('/my-valuations');
    
    // Click on the first valuation in the list
    await page.getByRole('button', { name: 'View' }).first().click();
    
    // Check that the valuation details page is loaded
    await expect(page.getByText('Valuation Details')).toBeVisible();
    
    // Check that the chat bubble is visible
    await expect(page.getByText('Ask about your valuation')).toBeVisible();
    
    // Click on the chat bubble
    await page.getByText('Ask about your valuation').click();
    
    // Check that the chat interface appears
    await expect(page.getByPlaceholder('Type your message...')).toBeVisible();
    
    // Type a message and send it
    await page.getByPlaceholder('Type your message...').fill('What factors affect my car value?');
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Wait for AI response
    await page.waitForSelector('.chat-message-ai', { timeout: 15000 });
    
    // Verify that we got a response about valuation factors
    await expect(page.getByText(/factors.*value/i)).toBeVisible();
  });
  
  test('should upgrade to premium valuation', async ({ page }) => {
    // Visit a free valuation page
    await page.goto('/valuation/test-valuation-id');
    
    // Click on the upgrade button
    await page.getByRole('button', { name: /upgrade to premium/i }).click();
    
    // Check that we're on the payment page
    await expect(page.getByText(/payment details/i)).toBeVisible();
    
    // Fill in payment details (mock for E2E test)
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '1230');
    await page.fill('[data-testid="card-cvc"]', '123');
    
    // Submit payment
    await page.getByRole('button', { name: /pay now/i }).click();
    
    // Wait for success page
    await page.waitForURL('**/premium-success*', { timeout: 20000 });
    
    // Verify success message
    await expect(page.getByText(/payment successful/i)).toBeVisible();
    
    // Navigate to premium report
    await page.getByRole('button', { name: /view premium report/i }).click();
    
    // Verify we now have premium valuation
    await expect(page.getByText(/premium valuation/i)).toBeVisible();
  });
});
