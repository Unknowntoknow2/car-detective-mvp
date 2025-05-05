
import { test, expect } from '@playwright/test';

test.describe('Explanation Feature', () => {
  test('should generate and display valuation explanation', async ({ page }) => {
    // Navigate to the valuation form
    await page.goto('/valuation');
    
    // Fill out the form with minimal required fields
    await page.fill('input[name="make"]', 'Ford');
    await page.fill('input[name="model"]', 'Mustang');
    await page.fill('input[name="year"]', '2020');
    await page.fill('input[name="mileage"]', '25000');
    await page.selectOption('select[name="condition"]', 'Excellent');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Verify valuation result appears
    await expect(page.locator('h2:has-text("Valuation Result")')).toBeVisible();
    
    // Verify explanation section is present
    const explanationSection = page.locator('h3:has-text("Why this price?")');
    await expect(explanationSection).toBeVisible();
    
    // Verify explanation content is not empty
    const explanationText = page.locator('h3:has-text("Why this price?") + p');
    await expect(explanationText).not.toBeEmpty();
    
    // Check that explanation includes key elements (vehicle info)
    const explanationContent = await explanationText.textContent();
    expect(explanationContent).toContain('Ford');
    expect(explanationContent).toContain('Mustang');
    
    // Test the regenerate explanation button
    await page.click('button:has-text("Regenerate Explanation")');
    
    // Verify that a loading state appears
    await expect(page.locator('text=Regenerating...')).toBeVisible();
    
    // Wait for the new explanation to load
    await expect(page.locator('text=Regenerating...')).not.toBeVisible();
    
    // Verify that we still have content after regeneration
    await expect(explanationText).not.toBeEmpty();
  });

  test('should display AI confidence score in the explanation', async ({ page }) => {
    // Navigate to the premium valuation page with mock data
    await page.goto('/premium-valuation');
    
    // Mock completion of premium valuation with AI condition
    await page.evaluate(() => {
      // Simulate successful premium valuation
      window.dispatchEvent(new CustomEvent('test:mockPremiumValuationSuccess', {
        detail: {
          make: 'BMW',
          model: '3 Series',
          year: 2021,
          mileage: 15000,
          condition: 'Excellent',
          zipCode: '10001',
          valuation: 35000,
          aiCondition: {
            condition: 'Excellent',
            confidenceScore: 92,
            issuesDetected: [],
          }
        }
      }));
    });
    
    // Verify AI Condition Assessment appears
    await expect(page.locator('text=AI Condition Assessment')).toBeVisible();
    
    // Verify confidence score
    await expect(page.locator('text=AI Trust Score:')).toBeVisible();
    await expect(page.locator('text=92%')).toBeVisible();
    
    // Verify badge shows verified status
    await expect(page.locator('text=AI Verified')).toBeVisible();
    
    // Verify explanation includes AI assessment
    await expect(page.locator('text=This valuation has been AI-verified')).toBeVisible();
  });

  test('should handle explanation generation failures gracefully', async ({ page }) => {
    // Navigate to the valuation page
    await page.goto('/valuation');
    
    // Fill out the form
    await page.fill('input[name="make"]', 'Honda');
    await page.fill('input[name="model"]', 'Accord');
    await page.fill('input[name="year"]', '2018');
    await page.fill('input[name="mileage"]', '50000');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Mock a failure in the explanation generation
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('test:mockExplanationFailure', {}));
    });
    
    // Verify that an error message appears
    await expect(page.locator('text=Failed to load explanation')).toBeVisible();
    
    // Verify that the regenerate button is available
    await expect(page.locator('button:has-text("Regenerate Explanation")')).toBeVisible();
    
    // Click regenerate and mock success this time
    await page.click('button:has-text("Regenerate Explanation")');
    
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('test:mockExplanationSuccess', {
        detail: {
          explanation: 'This is a successfully regenerated explanation for your Honda Accord.'
        }
      }));
    });
    
    // Verify success message now appears
    await expect(page.locator('text=This is a successfully regenerated explanation')).toBeVisible();
  });
});
