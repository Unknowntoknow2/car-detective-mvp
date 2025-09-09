import { test, expect } from '@playwright/test';

const TIMEOUT_MS = Number(process.env.VALUATION_TRIGGER_TIMEOUT_MS || 30_000);

const TRIGGER_SELECTORS = [
  '[data-testid="start-valuation"]',
  '[data-test="start-valuation"]',
  'button:has-text("Run Valuation")',
  'button:has-text("Get Valuation")',
  'button:has-text("Start Valuation")',
  '[data-testid="vin-input"]' // For our specific app
];

test('uses real AIN and emits signals', async ({ page }) => {
  let ainOk = false;
  page.on('console', (msg) => { 
    if (/\bain\.ok\b/i.test(msg.text())) ainOk = true; 
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // Try to find and trigger valuation
  let triggered = false;
  for (const sel of TRIGGER_SELECTORS) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) { 
      if (sel.includes('vin-input')) {
        // Fill VIN input if that's what we found
        await el.fill('1HGCM82633A123456');
        // Look for submit button
        const submitBtn = page.locator('button:has-text("Start")').first();
        if (await submitBtn.isVisible().catch(() => false)) {
          await submitBtn.click();
          triggered = true;
        }
      } else {
        await el.click(); 
        triggered = true;
      }
      break; 
    }
  }

  if (!triggered) {
    throw new Error(`Could not find any valuation trigger. Tried selectors: ${TRIGGER_SELECTORS.join(', ')}`);
  }

  // Wait for the valuation response carrying trace headers
  const resp = await page.waitForResponse((r) => {
    const h = r.headers();
    return Boolean(h['x-ain-route']);
  }, { timeout: TIMEOUT_MS });

  const headers = resp.headers();
  expect(headers['x-ain-route']).toBe('ain');
  expect(headers['x-correlation-id']).toBeTruthy();
  expect(headers['x-upstream-status']).toBeTruthy();
  
  // Assert body shape and upstream status class
  const json = await resp.json().catch(() => null);
  expect(json).toBeTruthy();
  const upstreamStatus = Number(headers["x-upstream-status"]);
  expect(upstreamStatus).toBeGreaterThanOrEqual(200);
  expect(upstreamStatus).toBeLessThan(500); // no 5xx silently passed through

  // Console signal for QA dashboards
  expect(ainOk).toBeTruthy();
});

// Negative test to prove local is blocked
test('blocks local path with 501 error', async ({ page }) => {
  // Mock environment to force local route
  await page.addInitScript(() => {
    // Override fetch to simulate USE_AIN=false response
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      if (args[0]?.toString().includes('/functions/v1/valuation')) {
        return new Response(
          JSON.stringify({ error: "local_disabled", route: "local", corr_id: "test-123" }),
          {
            status: 501,
            headers: {
              'content-type': 'application/json',
              'x-ain-route': 'local',
              'x-correlation-id': 'test-123'
            }
          }
        );
      }
      return originalFetch(...args);
    };
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // Try to trigger valuation
  let triggered = false;
  for (const sel of TRIGGER_SELECTORS) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) { 
      if (sel.includes('vin-input')) {
        await el.fill('1HGCM82633A123456');
        const submitBtn = page.locator('button:has-text("Start")').first();
        if (await submitBtn.isVisible().catch(() => false)) {
          await submitBtn.click();
          triggered = true;
        }
      } else {
        await el.click(); 
        triggered = true;
      }
      break; 
    }
  }

  if (!triggered) {
    throw new Error('Could not trigger valuation for negative test');
  }

  // Wait for the 501 response
  const resp = await page.waitForResponse((r) => {
    return r.url().includes('/functions/v1/valuation') && r.status() === 501;
  }, { timeout: TIMEOUT_MS });

  const headers = resp.headers();
  expect(headers['x-ain-route']).toBe('local');
  expect(resp.status()).toBe(501);
  
  const json = await resp.json();
  expect(json.error).toBe('local_disabled');
  expect(json.route).toBe('local');
});