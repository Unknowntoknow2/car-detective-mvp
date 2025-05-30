
import { launchBrowser, setupStealthPage } from '../../_shared/puppeteer-launch.ts'

export async function fetchAutotraderPrice(vin: string, make?: string, model?: string, year?: string): Promise<string | null> {
  console.log(`🚙 Autotrader scraper starting for VIN: ${vin}`)
  
  let browser
  try {
    browser = await launchBrowser(true)
    const page = await setupStealthPage(browser)
    
    // Strategy 1: Try VIN-based search first
    const vinSearchUrl = `https://www.autotrader.com/cars-for-sale/all-cars?keywordPhrases=${vin}&zip=10001&searchRadius=0`
    console.log(`🌐 Navigating to Autotrader VIN search: ${vinSearchUrl}`)
    
    await page.goto(vinSearchUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })

    // Wait for listings to load
    try {
      await page.waitForSelector('.inventory-listing, .listing-container, .vehicle-card', { timeout: 15000 })
      
      // Extract pricing using multiple selector strategies
      const vinResult = await page.evaluate(() => {
        // Strategy 1: Look for inventory listings
        const inventoryListings = document.querySelectorAll('.inventory-listing')
        for (const listing of inventoryListings) {
          const priceElement = listing.querySelector('.first-price, .price-section, .vehicle-price')
          if (priceElement) {
            const priceText = priceElement.textContent?.trim() || ''
            const priceMatch = priceText.match(/\$?[\d,]+/)
            if (priceMatch) {
              const price = parseInt(priceMatch[0].replace(/[^\d]/g, ''))
              if (price >= 1000 && price <= 200000) {
                return priceMatch[0].replace(/[$,]/g, '')
              }
            }
          }
        }
        
        // Strategy 2: Look for listing containers
        const listingContainers = document.querySelectorAll('.listing-container, .vehicle-card')
        for (const container of listingContainers) {
          const priceElement = container.querySelector('.price, .listing-price, .vehicle-price')
          if (priceElement) {
            const priceText = priceElement.textContent?.trim() || ''
            const priceMatch = priceText.match(/\$?[\d,]+/)
            if (priceMatch) {
              const price = parseInt(priceMatch[0].replace(/[^\d]/g, ''))
              if (price >= 1000 && price <= 200000) {
                return priceMatch[0].replace(/[$,]/g, '')
              }
            }
          }
        }
        
        // Strategy 3: Generic price search
        const allPriceElements = document.querySelectorAll('[class*="price"], [data-test*="price"]')
        for (const element of allPriceElements) {
          const priceText = element.textContent?.trim() || ''
          const priceMatch = priceText.match(/\$[\d,]{4,}/)
          if (priceMatch) {
            const price = parseInt(priceMatch[0].replace(/[^\d]/g, ''))
            if (price >= 1000 && price <= 200000) {
              return priceMatch[0].replace(/[$,]/g, '')
            }
          }
        }
        
        return null
      })
      
      if (vinResult) {
        console.log(`✅ Autotrader VIN price for ${vin}: $${vinResult}`)
        return vinResult
      }
      
    } catch (vinSearchError) {
      console.log('⏰ VIN search failed, trying make/model fallback')
    }
    
    // Strategy 2: Fallback to make/model search if VIN search fails
    if (make && model) {
      try {
        const searchQuery = year ? `${year} ${make} ${model}` : `${make} ${model}`
        const makeModelUrl = `https://www.autotrader.com/cars-for-sale/all-cars/${make.toLowerCase()}/${model.toLowerCase()}?zip=10001&searchRadius=0`
        
        console.log(`🔄 Trying Autotrader make/model search: ${makeModelUrl}`)
        await page.goto(makeModelUrl, { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        })
        
        await page.waitForSelector('.inventory-listing, .listing-container, .vehicle-card', { timeout: 15000 })
        
        const makeModelResult = await page.evaluate(() => {
          // Same extraction logic as above
          const inventoryListings = document.querySelectorAll('.inventory-listing, .listing-container, .vehicle-card')
          for (const listing of inventoryListings) {
            const priceElement = listing.querySelector('.first-price, .price-section, .price, .listing-price, .vehicle-price')
            if (priceElement) {
              const priceText = priceElement.textContent?.trim() || ''
              const priceMatch = priceText.match(/\$?[\d,]+/)
              if (priceMatch) {
                const price = parseInt(priceMatch[0].replace(/[^\d]/g, ''))
                if (price >= 1000 && price <= 200000) {
                  return priceMatch[0].replace(/[$,]/g, '')
                }
              }
            }
          }
          return null
        })
        
        if (makeModelResult) {
          console.log(`✅ Autotrader make/model price for VIN ${vin}: $${makeModelResult}`)
          return makeModelResult
        }
        
      } catch (makeModelError) {
        console.log('⏰ Make/model search also failed')
      }
    }
    
    console.log(`ℹ️ No Autotrader price found for VIN: ${vin}`)
    return null

  } catch (error) {
    console.error(`❌ Autotrader scraping failed for VIN ${vin}:`, error)
    return null
  } finally {
    if (browser) {
      try {
        await browser.close()
        console.log('🔒 Autotrader browser closed')
      } catch (closeError) {
        console.error('Error closing Autotrader browser:', closeError)
      }
    }
  }
}
