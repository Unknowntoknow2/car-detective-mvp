
import { test, expect } from '@playwright/test';

test.describe('Vehicle Make/Model Dropdown', () => {
  test('loads vehicle makes', async ({ page }) => {
    await page.goto('http://localhost:8080'); // Update if needed

    // Go to the form or route where the vehicle selector exists
    await page.waitForTimeout(1000); // wait a moment in case of animations or loading

    // Click the Make dropdown or focus the field
    const makeDropdown = page.getByLabel('Make');
    await makeDropdown.click();

    // Capture all dropdown options
    const makeOptions = await page.locator('[role="option"]').allTextContents();

    // Log them in the test output
    console.log('Available Makes:', makeOptions);

    // Fail if no makes are loaded
    expect(makeOptions.length).toBeGreaterThan(0);
  });

  test('loads models after selecting a make', async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.waitForTimeout(1000);

    // Click Make field
    await page.getByLabel('Make').click();

    // Select Toyota or first option
    const firstMakeOption = page.locator('[role="option"]').first();
    const makeText = await firstMakeOption.textContent();
    await firstMakeOption.click();
    console.log('Selected Make:', makeText);

    // Click Model dropdown
    await page.getByLabel('Model').click();

    // Capture model options
    const modelOptions = await page.locator('[role="option"]').allTextContents();
    console.log('Available Models:', modelOptions);

    // Fail if models list is empty
    expect(modelOptions.length).toBeGreaterThan(0);
  });
});
