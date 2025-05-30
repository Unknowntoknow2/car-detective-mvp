
// File: supabase/functions/_shared/puppeteer-launch.ts

import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'

export async function launchBrowser(headless = true) {
  try {
    const browser = await puppeteer.launch({
      headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--no-first-run',
        '--disable-default-apps',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-field-trial-config',
      ],
      defaultViewport: {
        width: 1280,
        height: 800,
      },
    })

    console.log('🚀 Puppeteer browser launched successfully')
    return browser
  } catch (error) {
    console.error('❌ Failed to launch Puppeteer browser:', error)
    throw error
  }
}

export async function setupStealthPage(browser: any) {
  const page = await browser.newPage()
  
  // Set realistic user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
  
  // Set extra headers
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  })

  // Override webdriver detection
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    })
  })

  console.log('🥷 Stealth page configured')
  return page
}
