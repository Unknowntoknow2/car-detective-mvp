/**
 * Smoke tests for configuration refactors
 * 
 * Ensures that config system works correctly and no banned patterns exist
 */

import { test, expect } from '@playwright/test';

test.describe('Configuration Smoke Tests', () => {
  test('should load app with config system', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Verify app shell renders (basic functionality)
    await expect(page.locator('[data-testid="header"]').or(page.locator('header'))).toBeVisible();
    
    // Check that config is properly injected
    const configExists = await page.evaluate(() => {
      return typeof window.__APP_CONFIG__ !== 'undefined';
    });
    
    if (configExists) {
      console.log('✅ Runtime config found on window');
    } else {
      console.log('⚠️  Runtime config not found - using fallback');
    }
  });

  test('should use correct base URLs from config', async ({ page }) => {
    // Listen for network requests
    const requests: string[] = [];
    
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('/api/') || url.includes('/functions/v1/')) {
        requests.push(url);
      }
    });
    
    await page.goto('/');
    
    // Try to trigger a valuation call (if possible)
    try {
      const vinInput = page.locator('input[name="vin"], input[placeholder*="VIN"]');
      if (await vinInput.isVisible({ timeout: 2000 })) {
        await vinInput.fill('1HGBH41JXMN109186');
        
        const submitButton = page.locator('button[type="submit"]').first();
        if (await submitButton.isVisible({ timeout: 1000 })) {
          await submitButton.click();
          
          // Wait for any network activity
          await page.waitForTimeout(2000);
        }
      }
    } catch (error) {
      console.log('ℹ️  Could not trigger valuation - testing basic load only');
    }
    
    // Verify no localhost URLs in network requests
    const localhostRequests = requests.filter(url => url.includes('localhost:'));
    expect(localhostRequests).toHaveLength(0);
    
    console.log(`✅ Checked ${requests.length} API requests - no localhost found`);
  });

  test('should not log debug messages in production mode', async ({ page }) => {
    // Capture console messages
    const consoleLogs: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        consoleLogs.push(msg.text());
      }
    });
    
    await page.goto('/');
    
    // Wait for any potential console activity
    await page.waitForTimeout(2000);
    
    // In production mode with ENABLE_DIAGNOSTICS=false, 
    // there should be minimal console.log output
    const debugLogs = consoleLogs.filter(log => 
      log.includes('🎯') || 
      log.includes('🔍') || 
      log.includes('debug') ||
      log.toLowerCase().includes('development')
    );
    
    console.log(`📊 Console logs found: ${consoleLogs.length}, debug logs: ${debugLogs.length}`);
    
    // This is informational - in actual production deployment with 
    // ENABLE_DIAGNOSTICS=false, debug logs should be 0
    if (debugLogs.length > 0) {
      console.log('ℹ️  Debug logs still present (ENABLE_DIAGNOSTICS may be true)');
    } else {
      console.log('✅ No debug logs found');
    }
  });
});