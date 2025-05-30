
import { launchBrowser, setupStealthPage } from '../../_shared/puppeteer-launch.ts'

export async function fetchCarvanaPrice(vin: string, make?: string, model?: string, year?: string): Promise<string | null> {
  console.log(`🚗 Carvana scraper starting for VIN: ${vin}`)
  
  let browser
  try {
    browser = await launchBrowser(true)
    const page = await setupStealthPage(browser)
    
    // Try VIN-specific URL first
    const vinSearchUrl = `https://www.carvana.com/cars/${vin}`
    console.log(`🌐 Navigating to VIN-specific URL: ${vinSearchUrl}`)
    
    await page.goto(vinSearchUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })

    // Wait for price element or try alternative selectors
    try {
      await page.waitForSelector('[data-testid="VehicleDetailsPricingSection"], [data-test="price"], .price, [class*="price"]', { timeout: 15000 })
    } catch (timeoutError) {
      console.log('⏰ Timeout on VIN-specific page, trying search fallback')
      
      // Fallback to search if VIN-specific page doesn't load
      if (make && model) {
        const searchQuery = year ? `${year} ${make} ${model}` : `${make} ${model}`
        const searchUrl = `https://www.carvana.com/search?q=${encodeURIComponent(searchQuery)}`
        
        console.log(`🔄 Trying search fallback: ${searchUrl}`)
        await page.goto(searchUrl, { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        })
        
        await page.waitForSelector('[data-test="SearchResultTile"]', { timeout: 15000 })
      }
    }

    // Extract pricing using multiple selector strategies
    const priceData = await page.evaluate(() => {
      // Strategy 1: VIN-specific page pricing section
      const pricingSection = document.querySelector('[data-testid="VehicleDetailsPricingSection"]')
      if (pricingSection) {
        const priceText = pricingSection.textContent?.trim() || ''
        const priceMatch = priceText.match(/\$?[\d,]+/)
        if (priceMatch) {
          return priceMatch[0].replace(/[$,]/g, '')
        }
      }

      // Strategy 2: General price selectors
      const priceSelectors = [
        '[data-test="price"]',
        '.price',
        '[class*="price"]',
        '[data-testid="price"]'
      ]
      
      for (const selector of priceSelectors) {
        const priceElement = document.querySelector(selector)
        if (priceElement) {
          const priceText = priceElement.textContent?.trim() || ''
          const priceMatch = priceText.match(/\$?[\d,]+/)
          if (priceMatch) {
            return priceMatch[0].replace(/[$,]/g, '')
          }
        }
      }

      // Strategy 3: Search results (fallback)
      const tiles = document.querySelectorAll('[data-test="SearchResultTile"]')
      for (const tile of tiles) {
        const priceElement = tile.querySelector('[data-test="price"], .price, [class*="price"]')
        if (priceElement) {
          const priceText = priceElement.textContent?.trim() || ''
          const priceMatch = priceText.match(/\$?[\d,]+/)
          if (priceMatch) {
            return priceMatch[0].replace(/[$,]/g, '')
          }
        }
      }
      
      return null
    })

    if (priceData) {
      console.log(`✅ Carvana price for VIN ${vin}: $${priceData}`)
      return priceData
    }

    console.log(`ℹ️ No Carvana price found for VIN: ${vin}`)
    return null

  } catch (error) {
    console.error(`❌ Carvana scraping failed for VIN ${vin}:`, error)
    return null
  } finally {
    if (browser) {
      try {
        await browser.close()
        console.log('🔒 Carvana browser closed')
      } catch (closeError) {
        console.error('Error closing Carvana browser:', closeError)
      }
    }
  }
}
