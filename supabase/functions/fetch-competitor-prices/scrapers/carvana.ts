
import { launchBrowser, setupStealthPage } from '../../_shared/puppeteer-launch.ts'

export async function fetchCarvanaPrice(vin: string, make?: string, model?: string, year?: string): Promise<string | null> {
  console.log(`🚗 Carvana scraper starting for VIN: ${vin}`)
  
  let browser
  try {
    browser = await launchBrowser(true)
    const page = await setupStealthPage(browser)
    
    // Try VIN search first
    const vinSearchUrl = `https://www.carvana.com/search?q=${vin}`
    console.log(`🌐 Navigating to: ${vinSearchUrl}`)
    
    await page.goto(vinSearchUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })

    // Wait for search results or try alternative search
    try {
      await page.waitForSelector('[data-test="SearchResultTile"], .no-results-message', { timeout: 15000 })
    } catch (timeoutError) {
      console.log('⏰ Timeout on VIN search, trying make/model search')
    }

    // Check if no results for VIN, try make/model search
    const noResults = await page.$('.no-results-message, [data-test="no-results"]')
    if (noResults && make && model) {
      const searchQuery = year ? `${year} ${make} ${model}` : `${make} ${model}`
      const makeModelUrl = `https://www.carvana.com/search?q=${encodeURIComponent(searchQuery)}`
      
      console.log(`🔄 Trying make/model search: ${makeModelUrl}`)
      await page.goto(makeModelUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      })
      
      await page.waitForSelector('[data-test="SearchResultTile"]', { timeout: 15000 })
    }

    // Extract pricing from the first matching result
    const priceData = await page.evaluate(() => {
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
      console.log(`💰 Found Carvana price: $${priceData}`)
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
