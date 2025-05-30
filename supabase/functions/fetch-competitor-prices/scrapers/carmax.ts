
import { launchBrowser, setupStealthPage } from '../../_shared/puppeteer-launch.ts'

export async function fetchCarmaxPrice(vin: string, make?: string, model?: string, year?: string): Promise<string | null> {
  console.log(`🏪 CarMax scraper starting for VIN: ${vin}`)
  
  let browser
  try {
    browser = await launchBrowser(true)
    const page = await setupStealthPage(browser)
    
    // Navigate to CarMax search page
    const searchUrl = 'https://www.carmax.com/cars'
    console.log(`🌐 Navigating to CarMax search: ${searchUrl}`)
    
    await page.goto(searchUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })

    // Wait for and interact with search input
    try {
      await page.waitForSelector('input[type="search"], [data-test="search-input"], .search-input', { timeout: 15000 })
      
      // Clear any existing text and enter VIN
      await page.evaluate(() => {
        const searchInputs = document.querySelectorAll('input[type="search"], [data-test="search-input"], .search-input')
        for (const input of searchInputs) {
          if (input instanceof HTMLInputElement) {
            input.value = ''
            input.focus()
          }
        }
      })
      
      await page.type('input[type="search"], [data-test="search-input"], .search-input', vin)
      await page.keyboard.press('Enter')
      
      console.log(`🔍 Searching CarMax for VIN: ${vin}`)
      
      // Wait for search results to load
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 })
      
    } catch (searchError) {
      console.log('⏰ VIN search failed, trying make/model fallback')
      
      // Fallback to make/model search if VIN search fails
      if (make && model) {
        const searchQuery = year ? `${year} ${make} ${model}` : `${make} ${model}`
        const fallbackUrl = `https://www.carmax.com/cars?search=${encodeURIComponent(searchQuery)}`
        
        console.log(`🔄 Trying make/model search: ${fallbackUrl}`)
        await page.goto(fallbackUrl, { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        })
      }
    }

    // Wait for listing results with multiple selector strategies
    try {
      await page.waitForSelector('.car-tile, [data-test="car-tile"], .vehicle-card, .listing-card', { timeout: 15000 })
    } catch (noResults) {
      console.log('ℹ️ No CarMax results found')
      return null
    }

    // Extract pricing using multiple selector strategies
    const priceData = await page.evaluate(() => {
      // Strategy 1: Look for car tiles with prices
      const carTiles = document.querySelectorAll('.car-tile, [data-test="car-tile"], .vehicle-card, .listing-card')
      
      for (const tile of carTiles) {
        // Try multiple price selector patterns
        const priceSelectors = [
          '.price',
          '[data-test="price"]',
          '.listing-price',
          '.vehicle-price',
          '[class*="price"]',
          '.amount'
        ]
        
        for (const selector of priceSelectors) {
          const priceElement = tile.querySelector(selector)
          if (priceElement) {
            const priceText = priceElement.textContent?.trim() || ''
            const priceMatch = priceText.match(/\$?[\d,]+/)
            if (priceMatch) {
              return priceMatch[0].replace(/[$,]/g, '')
            }
          }
        }
      }
      
      // Strategy 2: Look for any price elements on the page
      const allPriceElements = document.querySelectorAll('[class*="price"], [data-test*="price"]')
      for (const element of allPriceElements) {
        const priceText = element.textContent?.trim() || ''
        const priceMatch = priceText.match(/\$?[\d,]+/)
        if (priceMatch) {
          const price = parseInt(priceMatch[0].replace(/[^\d]/g, ''))
          // Filter out unrealistic prices (likely not vehicle prices)
          if (price >= 1000 && price <= 200000) {
            return priceMatch[0].replace(/[$,]/g, '')
          }
        }
      }
      
      return null
    })

    if (priceData) {
      console.log(`✅ CarMax price for VIN ${vin}: $${priceData}`)
      return priceData
    }

    console.log(`ℹ️ No CarMax price found for VIN: ${vin}`)
    return null

  } catch (error) {
    console.error(`❌ CarMax scraping failed for VIN ${vin}:`, error)
    return null
  } finally {
    if (browser) {
      try {
        await browser.close()
        console.log('🔒 CarMax browser closed')
      } catch (closeError) {
        console.error('Error closing CarMax browser:', closeError)
      }
    }
  }
}
