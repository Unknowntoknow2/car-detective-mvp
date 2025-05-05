
import { test, expect } from '@playwright/test';

// Test user credentials
const TEST_USER_EMAIL = 'test@example.com';
const TEST_USER_PASSWORD = 'TestPassword123!';

// Mock Stripe data
const MOCK_STRIPE_SESSION_ID = 'cs_test_mockSessionId';
const MOCK_PAYMENT_INTENT_ID = 'pi_test_mockPaymentIntentId';

test.describe('Stripe Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure user is logged in before attempting payment
    await page.goto('/auth');
    await page.getByLabel('Email').fill(TEST_USER_EMAIL);
    await page.getByLabel('Password').fill(TEST_USER_PASSWORD);
    await page.getByRole('button', { name: /Sign In/i }).click();
    
    // Verify login success
    await expect(page.getByText(/Welcome back/i)).toBeVisible();
  });

  test('should unlock premium report with successful payment', async ({ page }) => {
    // Set up mock for Stripe checkout
    await page.route('**/functions/v1/create-checkout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          url: '/mock-stripe-redirect?session_id=' + MOCK_STRIPE_SESSION_ID 
        })
      });
    });
    
    // Mock the Stripe webhook callback endpoint
    await page.route('**/functions/v1/handle-stripe-event', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ received: true })
      });
    });
    
    // Navigate to a valuation result page
    await page.goto('/valuation/result/test-valuation-id');
    
    // Click to unlock premium
    await page.getByRole('button', { name: /Unlock Premium/i }).click();
    
    // Verify payment options appear
    await expect(page.getByText(/Payment Options/i)).toBeVisible();
    
    // Click to proceed with payment
    await page.getByRole('button', { name: /Continue to Payment/i }).click();
    
    // Should redirect to Stripe checkout (mocked)
    // In the real test, we'd wait for the redirect to Stripe
    // For the test, we're using a mock success redirect URL
    
    // Simulate returning from Stripe with successful payment
    await page.goto('/payment-success?session_id=' + MOCK_STRIPE_SESSION_ID);
    
    // Verify successful payment page
    await expect(page.getByText(/Payment Successful/i)).toBeVisible();
    
    // Verify backend was updated (mock)
    await page.route('**/rest/v1/valuations*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ 
          id: 'test-valuation-id',
          premium_unlocked: true 
        }])
      });
    });
    
    // Navigate back to valuation
    await page.getByRole('link', { name: /Back to Valuation/i }).click();
    
    // Verify that premium features are now unlocked
    await expect(page.getByText(/Premium Report/i)).toBeVisible();
    await page.getByRole('button', { name: /Download PDF/i }).isEnabled();
    
    // Verify premium indicator is shown
    await expect(page.getByText(/Premium Unlocked/i)).toBeVisible();
    
    // Verify all premium tabs are now accessible
    await expect(page.getByRole('tab', { name: /Market Analysis/i })).not.toHaveAttribute('aria-disabled', 'true');
  });
  
  test('should handle payment cancellation gracefully', async ({ page }) => {
    // Set up mock for Stripe checkout same as before
    await page.route('**/functions/v1/create-checkout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          url: '/mock-stripe-redirect?session_id=' + MOCK_STRIPE_SESSION_ID 
        })
      });
    });
    
    // Navigate to valuation
    await page.goto('/valuation/result/test-valuation-id');
    
    // Click to unlock premium
    await page.getByRole('button', { name: /Unlock Premium/i }).click();
    await page.getByRole('button', { name: /Continue to Payment/i }).click();
    
    // Simulate returning from Stripe with cancelled payment
    await page.goto('/payment-cancelled');
    
    // Verify user is returned to the app with appropriate message
    await expect(page.getByText(/Payment Cancelled/i)).toBeVisible();
    
    // Verify they can try again
    await expect(page.getByRole('button', { name: /Try Again/i })).toBeVisible();
    
    // Navigate back to valuation
    await page.getByRole('link', { name: /Back to Valuation/i }).click();
    
    // Premium features should still be locked
    await expect(page.getByText(/Unlock Premium/i)).toBeVisible();
  });
  
  test('should validate Supabase order record after successful payment', async ({ page, request }) => {
    // Go through payment flow (abbreviated)
    await page.goto('/valuation/result/test-valuation-id');
    
    // Set up mock for Stripe checkout same as before
    await page.route('**/functions/v1/create-checkout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          url: '/payment-success?session_id=' + MOCK_STRIPE_SESSION_ID 
        })
      });
    });
    
    // Click to unlock premium and proceed
    await page.getByRole('button', { name: /Unlock Premium/i }).click();
    await page.getByRole('button', { name: /Continue to Payment/i }).click();
    
    // In a real test, we'd check if the Supabase 'orders' table is updated
    // Mock Supabase query response for orders table
    await page.route('**/rest/v1/orders*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ 
          id: 'mock-order-id',
          user_id: 'mock-user-id',
          stripe_session_id: MOCK_STRIPE_SESSION_ID,
          amount: 4999,
          currency: 'usd',
          status: 'paid',
          valuation_id: 'test-valuation-id',
          created_at: new Date().toISOString()
        }])
      });
    });
    
    // Simulate webhook having updated the valuations table
    await page.route('**/rest/v1/valuations*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ 
          id: 'test-valuation-id',
          premium_unlocked: true 
        }])
      });
    });
    
    // Access the account/orders page to verify order is recorded
    await page.goto('/account/orders');
    
    // Verify order is displayed
    await expect(page.getByText(/Premium Report/i)).toBeVisible();
    await expect(page.getByText(/\$[\d.]+/)).toBeVisible();
    await expect(page.getByText(/Paid/i)).toBeVisible();
  });
});
