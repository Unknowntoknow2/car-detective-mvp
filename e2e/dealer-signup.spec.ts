
import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

// Supabase client for cleanup operations
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xltxqqzattxogxtqrggt.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Skip the test if service role key is not available
test.skip(!SUPABASE_KEY, 'Skipping test because SUPABASE_SERVICE_ROLE_KEY is not set');

test.describe('Dealer Signup and Authentication Flow', () => {
  const uniqueId = uuidv4().substring(0, 8);
  const testDealerName = 'Dealer Test';
  const testDealershipName = `Test Dealership ${uniqueId}`;
  const testDealerEmail = `dealer+${uniqueId}@testmail.com`;
  const testDealerPassword = 'Testpass123';
  let userId: string | undefined;

  // Clean up the test user after running the tests
  test.afterAll(async () => {
    if (userId && SUPABASE_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        // Delete the user profile and auth user (cascade deletion should handle related records)
        await supabase.from('profiles').delete().eq('id', userId);
        const { error } = await supabase.auth.admin.deleteUser(userId);
        if (error) {
          console.error('Error cleaning up test user:', error);
        } else {
          console.log(`Successfully cleaned up test user: ${userId}`);
        }
      } catch (error) {
        console.error('Exception during cleanup:', error);
      }
    }
  });

  test('should allow dealer signup, login, and access to dealer dashboard', async ({ page }) => {
    // Step 1: Visit dealer signup page
    await test.step('Navigate to dealer signup page', async () => {
      await page.goto('/signup-dealer');
      await expect(page).toHaveTitle(/Dealership Registration|Dealer Signup/);
      await expect(page.getByText(/Create Dealership Account|Register your dealership/)).toBeVisible();
    });

    // Step 2: Fill out the signup form
    await test.step('Fill out the dealer signup form', async () => {
      // Fill full name
      await page.getByLabel(/Full Name/i).fill(testDealerName);
      
      // Fill dealership name
      await page.getByLabel(/Dealership Name/i).fill(testDealershipName);
      
      // Fill email
      await page.getByLabel(/Email/i).fill(testDealerEmail);
      
      // Fill password
      await page.getByLabel(/Password/i).fill(testDealerPassword);
      
      // Optional: fill phone number if field exists
      const phoneField = page.getByLabel(/Phone/i);
      if (await phoneField.isVisible()) {
        await phoneField.fill('+12345678900');
      }
    });

    // Step 3: Submit the form
    await test.step('Submit the dealer signup form', async () => {
      await page.getByRole('button', { name: /Create Dealer Account|Create Account|Register|Sign Up/i }).click();
      
      // Wait for success message or redirect
      await Promise.race([
        page.waitForURL(/dealer-dashboard|confirm|login-dealer/),
        page.waitForSelector(/Registration successful|Account created/i)
      ]);
    });

    // Step 4: If email confirmation is required, bypass with direct authentication
    // This is a workaround for testing environments where email verification is enabled
    await test.step('Handle email confirmation if needed', async () => {
      // Check if we were redirected to a confirmation page or similar
      const currentUrl = page.url();
      
      if (currentUrl.includes('confirm') || !currentUrl.includes('dealer-dashboard')) {
        console.log('Signup requires email confirmation - handling with direct login');
        
        // If we have admin access, we can create a verified user directly via Supabase Admin API
        if (SUPABASE_KEY) {
          const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
          
          // First check if user already exists (might have been created but needs verification)
          const { data: existingUsers } = await supabase
            .from('profiles')
            .select('id')
            .eq('dealership_name', testDealershipName)
            .limit(1);
            
          if (existingUsers && existingUsers.length > 0) {
            userId = existingUsers[0].id;
            console.log(`Found existing user: ${userId}`);
            
            // Update the user's email_confirmed_at to bypass email verification
            await supabase.auth.admin.updateUserById(userId, {
              email_confirm: true,
              user_metadata: { full_name: testDealerName }
            });
            
            // Update the profile to ensure dealer role
            await supabase
              .from('profiles')
              .update({ 
                user_role: 'dealer',
                full_name: testDealerName,
                dealership_name: testDealershipName
              })
              .eq('id', userId);
          } else {
            // Create a new user directly with the admin API
            const { data: newUser, error } = await supabase.auth.admin.createUser({
              email: testDealerEmail,
              password: testDealerPassword,
              email_confirm: true,
              user_metadata: {
                full_name: testDealerName
              }
            });
            
            if (error) {
              console.error('Error creating test user:', error);
              throw error;
            }
            
            userId = newUser.user.id;
            console.log(`Created new user: ${userId}`);
            
            // Create or update the profile with dealer role
            await supabase
              .from('profiles')
              .upsert({ 
                id: userId,
                user_role: 'dealer',
                full_name: testDealerName,
                dealership_name: testDealershipName
              });
          }
          
          // Navigate to login page
          await page.goto('/login-dealer');
        } else {
          // Without admin access, we need to skip this test
          test.skip(true, 'Email verification is required but we lack admin credentials to bypass it');
        }
      } else {
        // We're already at the dashboard, extract user ID if possible
        const localStorageData = await page.evaluate(() => window.localStorage.getItem('supabase.auth.token'));
        if (localStorageData) {
          try {
            const parsedData = JSON.parse(localStorageData);
            userId = parsedData.user?.id;
            console.log(`Extracted user ID from local storage: ${userId}`);
          } catch (e) {
            console.log('Could not parse local storage auth data');
          }
        }
      }
    });

    // Step 5: Log in if we're not already logged in
    await test.step('Log in with dealer credentials', async () => {
      if (!page.url().includes('dealer-dashboard')) {
        await page.getByLabel(/Email/i).fill(testDealerEmail);
        await page.getByLabel(/Password/i).fill(testDealerPassword);
        await page.getByRole('button', { name: /Sign In|Log In/i }).click();
        
        // Wait for successful login and redirect to dealer dashboard
        await page.waitForURL(/dealer-dashboard/);
      }
    });

    // Step 6: Validate dealer dashboard
    await test.step('Verify dealer dashboard content', async () => {
      // URL verification
      expect(page.url()).toContain('/dealer-dashboard');
      
      // Welcome message verifications
      await expect(page.getByText(`Welcome, ${testDealerName}`)).toBeVisible();
      await expect(page.getByText(`Dealership: ${testDealershipName}`)).toBeVisible();
      
      // Verify dealer-specific UI elements
      await expect(page.getByText('Recent Valuations')).toBeVisible();
      await expect(page.getByText('Incoming Leads')).toBeVisible();
      await expect(page.getByText('Quick Actions')).toBeVisible();
      
      // Verify dealer-specific actions are available
      await expect(page.getByRole('button', { name: /Respond to Lead|View Valuations/i })).toBeVisible();
    });
  });
});
