
import { launchBrowser, setupStealthPage } from '../../_shared/puppeteer-launch.ts'

export async function fetchFacebookMarketplaceListings(searchQuery: string, zipCode?: string): Promise<any[]> {
  console.log(`🔍 Facebook Marketplace scraper starting for: ${searchQuery}`)
  
  let browser
  try {
    // Use headful mode for Facebook to handle login sessions
    browser = await launchBrowser(false) // headful = false for now, can be changed to true for manual login
    const page = await setupStealthPage(browser)
    const results: any[] = []

    // Determine location based on zip code or default to Sacramento
    const location = getLocationFromZip(zipCode || '95814')
    const searchUrl = `https://www.facebook.com/marketplace/${location}/search/?query=${encodeURIComponent(searchQuery)}&category=vehicles`
    
    console.log(`🌐 Navigating to: ${searchUrl}`)
    await page.goto(searchUrl, { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    })

    // Wait for the marketplace feed to load
    try {
      await page.waitForSelector('[role="feed"], [data-pagelet="MarketplaceRoot"]', { timeout: 20000 })
    } catch (timeoutError) {
      console.log('⏰ Timeout waiting for Facebook feed, checking for login requirement')
      
      // Check if we need to log in
      const loginRequired = await page.$('input[name="email"], input[data-testid="royal_email"]')
      if (loginRequired) {
        console.log('🔐 Facebook login required - manual session needed')
        return []
      }
    }

    // Scroll to load more listings (Facebook uses infinite scroll)
    console.log('📜 Scrolling to load more listings...')
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, 2000)
      })
      await page.waitForTimeout(2000) // Natural scrolling delay
    }

    // Extract listings from the marketplace feed
    const listings = await page.evaluate(() => {
      const vehicles = []
      
      // Facebook marketplace listings selectors (multiple patterns)
      const listingSelectors = [
        '[role="feed"] > div',
        '[data-pagelet="MarketplaceRoot"] a[role="link"]',
        'div[data-testid="marketplace-item"]'
      ]
      
      let listingElements: NodeListOf<Element> | null = null
      
      // Try different selectors
      for (const selector of listingSelectors) {
        listingElements = document.querySelectorAll(selector)
        if (listingElements.length > 0) {
          console.log(`Found ${listingElements.length} listings with selector: ${selector}`)
          break
        }
      }
      
      if (!listingElements || listingElements.length === 0) {
        console.log('No listing elements found')
        return []
      }

      for (const element of listingElements) {
        try {
          // Extract title from various possible locations
          let titleElement = element.querySelector('span[dir="auto"]') || 
                           element.querySelector('[data-testid="marketplace-item-title"]') ||
                           element.querySelector('div[role="heading"]')
          
          const title = titleElement?.textContent?.trim() || ''
          
          // Skip if no meaningful title
          if (!title || title.length < 5) continue
          
          // Extract URL
          let linkElement = element.querySelector('a[href*="/marketplace/item/"]') || 
                          element.closest('a') ||
                          element.querySelector('a')
          
          const relativeUrl = linkElement?.getAttribute('href') || ''
          const url = relativeUrl.startsWith('http') ? relativeUrl : `https://www.facebook.com${relativeUrl}`
          
          // Skip if no valid URL
          if (!url.includes('marketplace')) continue
          
          // Extract price from title or separate price element
          let price: number | null = null
          const priceElement = element.querySelector('[data-testid="marketplace-item-price"], .marketplace-item-price')
          const priceText = priceElement?.textContent || title
          
          const priceMatch = priceText.match(/\$[\d,]+/)
          if (priceMatch) {
            price = parseInt(priceMatch[0].replace(/[^\d]/g, ''))
          }
          
          // Extract location if available
          const locationElement = element.querySelector('[data-testid="marketplace-item-location"]')
          const location = locationElement?.textContent?.trim() || 'Facebook Marketplace'
          
          // Try to extract mileage from title
          const mileageMatch = title.match(/(\d{1,3}[,\d]*)\s*(?:miles?|mi|k)/i)
          const mileage = mileageMatch ? parseInt(mileageMatch[1].replace(/,/g, '')) : null
          
          // Try to extract VIN from title (less common on Facebook)
          const vinMatch = title.match(/\b[A-HJ-NPR-Z0-9]{17}\b/i)
          const vin = vinMatch ? vinMatch[0] : null
          
          if (title && url) {
            vehicles.push({
              vin,
              title,
              price,
              mileage: mileage && mileage < 1000000 ? mileage : null, // Sanity check
              location,
              platform: 'Facebook',
              url,
            })
          }
        } catch (error) {
          console.error('Error parsing Facebook listing:', error)
        }
      }
      
      return vehicles
    })

    console.log(`📊 Found ${listings.length} Facebook Marketplace listings for query: ${searchQuery}`)
    results.push(...listings)

    return results

  } catch (error) {
    console.error(`❌ Facebook Marketplace scraping failed for query ${searchQuery}:`, error)
    return []
  } finally {
    if (browser) {
      try {
        await browser.close()
        console.log('🔒 Facebook browser closed')
      } catch (closeError) {
        console.error('Error closing Facebook browser:', closeError)
      }
    }
  }
}

function getLocationFromZip(zipCode: string): string {
  // Simplified location mapping for Facebook Marketplace URLs
  const zip = parseInt(zipCode)
  
  if (zip >= 90000 && zip <= 96699) return 'losangeles' // CA
  if (zip >= 94000 && zip <= 94999) return 'sanfrancisco' // SF Bay Area
  if (zip >= 95000 && zip <= 95999) return 'sacramento' // Sacramento
  if (zip >= 98000 && zip <= 99999) return 'seattle' // WA
  if (zip >= 10000 && zip <= 19999) return 'newyork' // NY
  if (zip >= 60000 && zip <= 60699) return 'chicago' // IL
  if (zip >= 75000 && zip <= 75999) return 'dallas' // TX
  if (zip >= 77000 && zip <= 77999) return 'houston' // TX
  if (zip >= 33000 && zip <= 34999) return 'miami' // FL
  if (zip >= 30000 && zip <= 31999) return 'atlanta' // GA
  
  // Default to Sacramento
  return 'sacramento'
}
