
import { launchBrowser, setupStealthPage } from '../../_shared/puppeteer-launch.ts'

export async function fetchOfferUpListings(query: string, zipCode: string): Promise<any[]> {
  console.log(`🏷️ OfferUp scraper starting for: ${query} near ${zipCode}`)
  
  let browser
  try {
    browser = await launchBrowser(true)
    const page = await setupStealthPage(browser)
    const results: any[] = []

    // OfferUp search URL with location
    const searchUrl = `https://offerup.com/search/?q=${encodeURIComponent(query)}&sort=distance&location=${encodeURIComponent(zipCode)}`
    
    console.log(`🌐 Navigating to: ${searchUrl}`)
    await page.goto(searchUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })

    // Wait for initial content load
    try {
      await page.waitForSelector('[data-testid="item-tile"], .item-tile, .listing-card', { timeout: 15000 })
    } catch (timeoutError) {
      console.log('⏰ Timeout waiting for OfferUp results, checking for alternative selectors')
    }

    // Check for no results
    const noResults = await page.$('.no-results, .empty-search, .no-items-found')
    if (noResults) {
      console.log(`ℹ️ No OfferUp results found for query: ${query}`)
      return []
    }

    // Scroll multiple times to trigger lazy loading and load more items
    console.log('📜 Scrolling to load more OfferUp listings...')
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 1500))
      await page.waitForTimeout(2000)
      
      // Check if more items loaded
      const itemCount = await page.$$eval('[data-testid="item-tile"], .item-tile, .listing-card', els => els.length)
      console.log(`📊 Found ${itemCount} items after scroll ${i + 1}`)
    }

    // Extract listings using multiple selector strategies
    const listings = await page.evaluate(() => {
      const vehicles = []
      
      // Try multiple selector strategies for OfferUp's different layouts
      let listingElements = document.querySelectorAll('[data-testid="item-tile"]')
      
      // Fallback selectors if the main one doesn't work
      if (listingElements.length === 0) {
        listingElements = document.querySelectorAll('.item-tile, .listing-card, .item-card')
      }

      for (const element of listingElements) {
        try {
          // Try different title selectors
          let titleElement = element.querySelector('[data-testid="item-title"]')
          if (!titleElement) {
            titleElement = element.querySelector('.item-title, .listing-title, h3, h4')
          }

          // Try different price selectors
          let priceElement = element.querySelector('[data-testid="item-price"]')
          if (!priceElement) {
            priceElement = element.querySelector('.item-price, .listing-price, .price')
          }

          // Try different location selectors
          let locationElement = element.querySelector('[data-testid="item-location"]')
          if (!locationElement) {
            locationElement = element.querySelector('.item-location, .listing-location, .location')
          }

          // Try different URL selectors
          let linkElement = element.querySelector('a[href]')

          const title = titleElement?.textContent?.trim() || ''
          const priceText = priceElement?.textContent?.trim() || ''
          const location = locationElement?.textContent?.trim() || ''
          const url = linkElement?.getAttribute('href') || ''

          // Extract price - handle various formats
          let price = null
          const priceMatch = priceText.match(/\$?[\d,]+/)
          if (priceMatch) {
            price = parseInt(priceMatch[0].replace(/[$,]/g, ''))
          }

          // Extract mileage from title if available
          const mileageMatch = title.match(/(\d{1,3}[,\d]*)\s*(?:miles?|mi|k)/i)
          let mileage = null
          if (mileageMatch) {
            mileage = parseInt(mileageMatch[1].replace(/,/g, ''))
            // Convert if it's in thousands (e.g., "120k miles")
            if (title.toLowerCase().includes('k miles') || title.toLowerCase().includes('k mi')) {
              mileage = mileage * 1000
            }
          }

          // Try to extract VIN from title
          const vinMatch = title.match(/\b[A-HJ-NPR-Z0-9]{17}\b/i)
          const vin = vinMatch ? vinMatch[0].toUpperCase() : null

          // Extract year from title
          const yearMatch = title.match(/\b(19|20)\d{2}\b/)
          const year = yearMatch ? parseInt(yearMatch[0]) : null

          // Skip items that don't look like vehicles or don't have essential data
          if (!title || title.length < 10 || !url) {
            continue
          }

          // Filter out non-vehicle items (common on OfferUp)
          const nonVehicleKeywords = ['phone', 'laptop', 'furniture', 'clothing', 'book', 'toy', 'game']
          const isNonVehicle = nonVehicleKeywords.some(keyword => 
            title.toLowerCase().includes(keyword)
          )
          
          if (isNonVehicle) {
            continue
          }

          // Ensure URL is absolute
          let fullUrl = url
          if (url && !url.startsWith('http')) {
            fullUrl = `https://offerup.com${url}`
          }

          vehicles.push({
            vin,
            title,
            price,
            mileage: mileage && mileage < 1000000 ? mileage : null, // Sanity check
            location: location || 'OfferUp',
            platform: 'OfferUp',
            url: fullUrl,
            year
          })
        } catch (error) {
          console.error('Error parsing OfferUp listing:', error)
        }
      }

      return vehicles
    })

    console.log(`📊 Found ${listings.length} OfferUp listings for query: ${query}`)
    results.push(...listings)

    return results

  } catch (error) {
    console.error(`❌ OfferUp scraping failed for query ${query}:`, error)
    return []
  } finally {
    if (browser) {
      try {
        await browser.close()
        console.log('🔒 OfferUp browser closed')
      } catch (closeError) {
        console.error('Error closing OfferUp browser:', closeError)
      }
    }
  }
}
