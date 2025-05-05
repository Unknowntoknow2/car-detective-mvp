
import { test, expect } from '@playwright/test';

// Test credentials
const TEST_USER_EMAIL = 'test@example.com';
const TEST_USER_PASSWORD = 'TestPassword123!';
const TEST_DEALER_EMAIL = 'dealer@example.com';
const TEST_DEALER_PASSWORD = 'DealerPassword123!';

// Test data
const TEST_VALUATION_ID = 'test-valuation-id';
const TEST_OFFER_AMOUNT = 20000;
const TEST_OFFER_MESSAGE = 'We are interested in your vehicle. Please contact us.';

test.describe('Dealer Offer Flow', () => {
  test('dealer should be able to submit an offer for a vehicle', async ({ page }) => {
    // Log in as a dealer
    await page.goto('/auth');
    await page.getByLabel('Email').fill(TEST_DEALER_EMAIL);
    await page.getByLabel('Password').fill(TEST_DEALER_PASSWORD);
    await page.getByRole('button', { name: /Sign In/i }).click();
    
    // Navigate to available vehicles
    await page.goto('/dealer/marketplace');
    
    // Find a vehicle listing and click to view details
    await page.getByText(/Honda Civic/i).first().click();
    
    // Verify vehicle details page is displayed
    await expect(page.getByText(/Vehicle Details/i)).toBeVisible();
    
    // Mock the dealer offer submission
    await page.route('**/rest/v1/dealer_offers*', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ 
            id: 'test-offer-id',
            report_id: TEST_VALUATION_ID,
            dealer_id: 'test-dealer-id',
            offer_amount: TEST_OFFER_AMOUNT,
            message: TEST_OFFER_MESSAGE,
            status: 'pending',
            created_at: new Date().toISOString()
          })
        });
      }
    });
    
    // Fill out and submit an offer
    await page.getByLabel(/Offer Amount/i).fill(TEST_OFFER_AMOUNT.toString());
    await page.getByLabel(/Message to Owner/i).fill(TEST_OFFER_MESSAGE);
    await page.getByRole('button', { name: /Submit Offer/i }).click();
    
    // Verify confirmation message
    await expect(page.getByText(/Offer Submitted/i)).toBeVisible();
    
    // Navigate to dealer's offers page to see the offer
    await page.goto('/dealer/offers');
    
    // Verify the offer appears in the dealer's list
    await expect(page.getByText(/Honda Civic/i)).toBeVisible();
    await expect(page.getByText(/\$20,000/)).toBeVisible();
    await expect(page.getByText(/Pending/i)).toBeVisible();
  });
  
  test('user should be able to view and accept a dealer offer', async ({ page }) => {
    // Log in as a regular user
    await page.goto('/auth');
    await page.getByLabel('Email').fill(TEST_USER_EMAIL);
    await page.getByLabel('Password').fill(TEST_USER_PASSWORD);
    await page.getByRole('button', { name: /Sign In/i }).click();
    
    // Mock Supabase to show a dealer offer notification
    await page.route('**/rest/v1/dealer_offers*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ 
          id: 'test-offer-id',
          report_id: TEST_VALUATION_ID,
          user_id: 'test-user-id',
          dealer_id: 'test-dealer-id',
          dealer_name: 'Test Dealership',
          offer_amount: TEST_OFFER_AMOUNT,
          message: TEST_OFFER_MESSAGE,
          status: 'pending',
          created_at: new Date().toISOString()
        }])
      });
    });
    
    // Navigate to user dashboard
    await page.goto('/dashboard');
    
    // Verify offer notification is displayed
    await expect(page.getByText(/New Offer/i)).toBeVisible();
    
    // Navigate to offers page
    await page.getByText(/View Offers/i).click();
    
    // Verify offer details are displayed
    await expect(page.getByText(/Test Dealership/i)).toBeVisible();
    await expect(page.getByText(/\$20,000/)).toBeVisible();
    
    // View offer details
    await page.getByText(/View Details/i).click();
    
    // Mock the update offer status endpoint
    await page.route('**/rest/v1/dealer_offers*', async (route) => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ 
            id: 'test-offer-id',
            status: 'accepted'
          })
        });
      }
    });
    
    // Accept the offer
    await page.getByRole('button', { name: /Accept Offer/i }).click();
    
    // Confirm the acceptance
    await page.getByRole('button', { name: /Confirm/i }).click();
    
    // Verify success message
    await expect(page.getByText(/Offer Accepted/i)).toBeVisible();
    
    // Navigate back to offers page
    await page.goto('/dashboard/offers');
    
    // Verify the offer now shows as accepted
    await expect(page.getByText(/Accepted/i)).toBeVisible();
  });
  
  test('dealer should see updates when user accepts offer', async ({ page }) => {
    // Log in as dealer
    await page.goto('/auth');
    await page.getByLabel('Email').fill(TEST_DEALER_EMAIL);
    await page.getByLabel('Password').fill(TEST_DEALER_PASSWORD);
    await page.getByRole('button', { name: /Sign In/i }).click();
    
    // Mock Supabase to show an accepted offer
    await page.route('**/rest/v1/dealer_offers*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ 
          id: 'test-offer-id',
          report_id: TEST_VALUATION_ID,
          user_id: 'test-user-id',
          dealer_id: 'test-dealer-id',
          offer_amount: TEST_OFFER_AMOUNT,
          message: TEST_OFFER_MESSAGE,
          status: 'accepted',
          vehicle_make: 'Honda',
          vehicle_model: 'Civic',
          vehicle_year: 2018,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
      });
    });
    
    // Navigate to dealer offers page
    await page.goto('/dealer/offers');
    
    // Verify the accepted offer is visible
    await expect(page.getByText(/Honda Civic/i)).toBeVisible();
    await expect(page.getByText(/Accepted/i)).toBeVisible();
    
    // View offer details
    await page.getByText(/View Details/i).click();
    
    // Verify contact information is now available
    await expect(page.getByText(/Contact Information/i)).toBeVisible();
    await expect(page.getByText(/Next Steps/i)).toBeVisible();
  });
});
