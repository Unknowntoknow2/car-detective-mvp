
import { launchBrowser, setupStealthPage } from '../../_shared/puppeteer-launch.ts'

export async function fetchCraigslistListings(query: string, zip: string): Promise<any[]> {
  console.log(`🏠 Craigslist scraper starting for: ${query} in ${zip}`)
  
  let browser
  try {
    browser = await launchBrowser(true)
    const page = await setupStealthPage(browser)
    const results: any[] = []

    // Determine Craigslist region based on zip code (simplified mapping)
    const region = getCraigslistRegion(zip)
    const searchUrl = `https://${region}.craigslist.org/search/cta?query=${encodeURIComponent(query)}&postal=${zip}&search_distance=50`
    
    console.log(`🌐 Navigating to: ${searchUrl}`)
    await page.goto(searchUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })

    // Wait for search results
    try {
      await page.waitForSelector('.result-info, .cl-search-result', { timeout: 15000 })
    } catch (timeoutError) {
      console.log('⏰ Timeout waiting for results, checking page content')
    }

    // Check for no results
    const noResults = await page.$('.no-results, .empty-results')
    if (noResults) {
      console.log(`ℹ️ No Craigslist results found for query: ${query}`)
      return []
    }

    // Extract listings - try both old and new Craigslist layouts
    const listings = await page.evaluate(() => {
      const vehicles = []
      
      // Try new layout first
      let listingElements = document.querySelectorAll('.cl-search-result')
      
      // Fallback to old layout
      if (listingElements.length === 0) {
        listingElements = document.querySelectorAll('.result-row')
      }

      for (const element of listingElements) {
        try {
          // New layout selectors
          let titleElement = element.querySelector('.cl-search-result-title, .posting-title')
          let priceElement = element.querySelector('.priceinfo, .result-price')
          let linkElement = element.querySelector('a[href]')
          let locationElement = element.querySelector('.location, .result-hood')

          // Fallback to old layout selectors
          if (!titleElement) {
            titleElement = element.querySelector('.result-title')
            linkElement = titleElement
          }
          if (!priceElement) {
            priceElement = element.querySelector('.result-price')
          }
          if (!locationElement) {
            locationElement = element.querySelector('.result-hood')
          }

          const title = titleElement?.textContent?.trim() || ''
          const url = linkElement?.getAttribute('href') || ''
          const priceText = priceElement?.textContent?.trim() || ''
          const location = locationElement?.textContent?.replace(/[()]/g, '').trim() || ''

          // Extract price
          const priceMatch = priceText.match(/\$?[\d,]+/)
          const price = priceMatch ? parseInt(priceMatch[0].replace(/[$,]/g, '')) : null

          // Extract mileage from title if available
          const mileageMatch = title.match(/(\d{1,3}[,\d]*)\s*(?:miles?|mi|k)/i)
          const mileage = mileageMatch ? parseInt(mileageMatch[1].replace(/,/g, '')) : null

          // Try to extract VIN from title
          const vinMatch = title.match(/\b[A-HJ-NPR-Z0-9]{17}\b/i)
          const vin = vinMatch ? vinMatch[0] : null

          if (title && url) {
            vehicles.push({
              vin,
              title,
              price,
              mileage: mileage && mileage < 1000000 ? mileage : null, // Sanity check
              location,
              platform: 'Craigslist',
              url: url.startsWith('http') ? url : `https://craigslist.org${url}`,
            })
          }
        } catch (error) {
          console.error('Error parsing listing:', error)
        }
      }
      
      return vehicles
    })

    console.log(`📊 Found ${listings.length} Craigslist listings for query: ${query}`)
    results.push(...listings)

    return results

  } catch (error) {
    console.error(`❌ Craigslist scraping failed for query ${query}:`, error)
    return []
  } finally {
    if (browser) {
      try {
        await browser.close()
        console.log('🔒 Craigslist browser closed')
      } catch (closeError) {
        console.error('Error closing Craigslist browser:', closeError)
      }
    }
  }
}

function getCraigslistRegion(zipCode: string): string {
  // Simplified region mapping based on zip code
  const zip = parseInt(zipCode)
  
  if (zip >= 90000 && zip <= 96699) return 'losangeles' // CA
  if (zip >= 94000 && zip <= 94999) return 'sfbay' // SF Bay Area
  if (zip >= 95000 && zip <= 95999) return 'sacramento' // Sacramento
  if (zip >= 98000 && zip <= 99999) return 'seattle' // WA
  if (zip >= 10000 && zip <= 19999) return 'newyork' // NY
  if (zip >= 60000 && zip <= 60699) return 'chicago' // IL
  if (zip >= 75000 && zip <= 75999) return 'dallas' // TX
  if (zip >= 77000 && zip <= 77999) return 'houston' // TX
  if (zip >= 33000 && zip <= 34999) return 'miami' // FL
  if (zip >= 30000 && zip <= 31999) return 'atlanta' // GA
  
  // Default to a major region
  return 'sfbay'
}
