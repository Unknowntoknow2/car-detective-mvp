
import { launchBrowser, setupStealthPage } from '../../_shared/puppeteer-launch.ts'

export async function fetchEdmundsPrice(vin: string, make?: string, model?: string, year?: string): Promise<string | null> {
  console.log(`📊 Edmunds scraper starting for VIN: ${vin}`)
  
  let browser
  try {
    browser = await launchBrowser(true)
    const page = await setupStealthPage(browser)
    
    // Use provided vehicle info or extract from VIN (basic fallback)
    const vehicleYear = year || '2020'
    const vehicleMake = make?.toLowerCase() || 'honda'
    const vehicleModel = model?.toLowerCase() || 'accord'
    
    console.log(`🔍 Looking up Edmunds price for ${vehicleYear} ${vehicleMake} ${vehicleModel}`)
    
    // Strategy 1: Try TMV (True Market Value) page
    try {
      const tmvUrl = `https://www.edmunds.com/${vehicleMake}/${vehicleModel}/${vehicleYear}/`
      console.log(`🌐 Navigating to TMV page: ${tmvUrl}`)
      
      await page.goto(tmvUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      })
      
      // Wait for TMV section to load
      await page.waitForSelector('body', { timeout: 15000 })
      
      // Extract TMV price using multiple strategies
      const tmvPrice = await page.evaluate(() => {
        // Strategy 1: Look for TMV specific elements
        const tmvSelectors = [
          '[data-testid="tmv-price"]',
          '.tmv-price',
          '.true-market-value',
          '[class*="tmv"]',
          '[data-test*="tmv"]'
        ]
        
        for (const selector of tmvSelectors) {
          const element = document.querySelector(selector)
          if (element) {
            const priceText = element.textContent?.trim() || ''
            const priceMatch = priceText.match(/\$?[\d,]+/)
            if (priceMatch) {
              return priceMatch[0].replace(/[$,]/g, '')
            }
          }
        }
        
        // Strategy 2: Search for TMV text patterns
        const allElements = document.querySelectorAll('*')
        for (const element of allElements) {
          const text = element.textContent || ''
          const tmvMatch = text.match(/(?:True Market Value|TMV).*?\$?([\d,]+)/i)
          if (tmvMatch) {
            return tmvMatch[1].replace(/,/g, '')
          }
        }
        
        // Strategy 3: Look for general pricing elements
        const priceSelectors = [
          '.price',
          '[data-test="price"]',
          '.vehicle-price',
          '[class*="price"]'
        ]
        
        for (const selector of priceSelectors) {
          const element = document.querySelector(selector)
          if (element) {
            const priceText = element.textContent?.trim() || ''
            const priceMatch = priceText.match(/\$?[\d,]+/)
            if (priceMatch) {
              const price = parseInt(priceMatch[0].replace(/[^\d]/g, ''))
              // Filter reasonable vehicle prices
              if (price >= 1000 && price <= 200000) {
                return priceMatch[0].replace(/[$,]/g, '')
              }
            }
          }
        }
        
        return null
      })
      
      if (tmvPrice) {
        console.log(`✅ Edmunds TMV price for VIN ${vin}: $${tmvPrice}`)
        return tmvPrice
      }
      
    } catch (tmvError) {
      console.log('⏰ TMV lookup failed, trying inventory search')
    }
    
    // Strategy 2: Fallback to inventory/listing search
    try {
      const searchQuery = `${vehicleYear} ${vehicleMake} ${vehicleModel}`
      const inventoryUrl = `https://www.edmunds.com/inventory/srp.html?make=${vehicleMake}&model=${vehicleModel}&year=${vehicleYear}`
      
      console.log(`🔄 Trying inventory search: ${inventoryUrl}`)
      await page.goto(inventoryUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      })
      
      // Wait for inventory listings
      await page.waitForSelector('body', { timeout: 15000 })
      
      const listingPrice = await page.evaluate(() => {
        // Strategy 1: Look for inventory listing prices
        const inventorySelectors = [
          '.inventory-listing-price',
          '.listing-price',
          '[data-test="listing-price"]',
          '.vehicle-listing-price',
          '[data-testid="price"]'
        ]
        
        for (const selector of inventorySelectors) {
          const priceElement = document.querySelector(selector)
          if (priceElement) {
            const priceText = priceElement.textContent?.trim() || ''
            const priceMatch = priceText.match(/\$?[\d,]+/)
            if (priceMatch) {
              return priceMatch[0].replace(/[$,]/g, '')
            }
          }
        }
        
        // Strategy 2: Look for any price in listing cards
        const listingCards = document.querySelectorAll('.inventory-card, .listing-card, .vehicle-card')
        for (const card of listingCards) {
          const priceElement = card.querySelector('.price, [class*="price"]')
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
      
      if (listingPrice) {
        console.log(`✅ Edmunds listing price for VIN ${vin}: $${listingPrice}`)
        return listingPrice
      }
      
    } catch (inventoryError) {
      console.log('⏰ Inventory search also failed')
    }
    
    console.log(`ℹ️ No Edmunds price found for VIN: ${vin}`)
    return null

  } catch (error) {
    console.error(`❌ Edmunds scraping failed for VIN ${vin}:`, error)
    return null
  } finally {
    if (browser) {
      try {
        await browser.close()
        console.log('🔒 Edmunds browser closed')
      } catch (closeError) {
        console.error('Error closing Edmunds browser:', closeError)
      }
    }
  }
}
