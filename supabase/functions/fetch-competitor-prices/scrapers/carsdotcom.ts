
import { launchBrowser, setupStealthPage } from '../../_shared/puppeteer-launch.ts'

export async function fetchCarsDotComPrice(vin: string, make?: string, model?: string, year?: string): Promise<string | null> {
  console.log(`🚙 Cars.com scraper starting for VIN: ${vin}`)
  
  let browser
  try {
    browser = await launchBrowser(true)
    const page = await setupStealthPage(browser)
    
    // Strategy 1: Try VIN-based search first
    const vinSearchUrl = `https://www.cars.com/shopping/results/?stock_type=used&makes[]=&models[]=&list_price_max=&maximum_distance=all&zip=10001&keyword=${vin}`
    console.log(`🌐 Navigating to Cars.com VIN search: ${vinSearchUrl}`)
    
    await page.goto(vinSearchUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })

    // Wait for listings to load
    try {
      await page.waitForSelector('.vehicle-card, .listing-row, .srp-list-item', { timeout: 15000 })
      
      // Extract pricing using multiple selector strategies
      const vinResult = await page.evaluate(() => {
        // Strategy 1: Look for vehicle cards
        const vehicleCards = document.querySelectorAll('.vehicle-card')
        for (const card of vehicleCards) {
          const priceElement = card.querySelector('.primary-price, .price-section, .price')
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
        
        // Strategy 2: Look for listing rows
        const listingRows = document.querySelectorAll('.listing-row, .srp-list-item')
        for (const row of listingRows) {
          const priceElement = row.querySelector('.price, .listing-price, .vehicle-price')
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
        console.log(`✅ Cars.com VIN price for ${vin}: $${vinResult}`)
        return vinResult
      }
      
    } catch (vinSearchError) {
      console.log('⏰ VIN search failed, trying make/model fallback')
    }
    
    // Strategy 2: Fallback to make/model search if VIN search fails
    if (make && model) {
      try {
        const searchQuery = year ? `${year} ${make} ${model}` : `${make} ${model}`
        const makeModelUrl = `https://www.cars.com/shopping/results/?stock_type=used&makes[]=${make.toLowerCase()}&models[]=${model.toLowerCase()}&list_price_max=&maximum_distance=all&zip=10001`
        
        console.log(`🔄 Trying Cars.com make/model search: ${makeModelUrl}`)
        await page.goto(makeModelUrl, { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        })
        
        await page.waitForSelector('.vehicle-card, .listing-row, .srp-list-item', { timeout: 15000 })
        
        const makeModelResult = await page.evaluate(() => {
          // Same extraction logic as above
          const vehicleCards = document.querySelectorAll('.vehicle-card, .listing-row, .srp-list-item')
          for (const card of vehicleCards) {
            const priceElement = card.querySelector('.primary-price, .price-section, .price, .listing-price, .vehicle-price')
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
          console.log(`✅ Cars.com make/model price for VIN ${vin}: $${makeModelResult}`)
          return makeModelResult
        }
        
      } catch (makeModelError) {
        console.log('⏰ Make/model search also failed')
      }
    }
    
    console.log(`ℹ️ No Cars.com price found for VIN: ${vin}`)
    return null

  } catch (error) {
    console.error(`❌ Cars.com scraping failed for VIN ${vin}:`, error)
    return null
  } finally {
    if (browser) {
      try {
        await browser.close()
        console.log('🔒 Cars.com browser closed')
      } catch (closeError) {
        console.error('Error closing Cars.com browser:', closeError)
      }
    }
  }
}
