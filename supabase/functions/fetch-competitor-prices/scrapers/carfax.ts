
import { launchBrowser, setupStealthPage } from '../../_shared/puppeteer-launch.ts'

export async function fetchCarfaxPrice(vin: string, make?: string, model?: string, year?: string): Promise<string | null> {
  console.log(`📋 Carfax scraper starting for VIN: ${vin}`)
  
  let browser
  try {
    browser = await launchBrowser(true)
    const page = await setupStealthPage(browser)
    
    // Strategy 1: Try VIN-specific vehicle page
    try {
      const vinUrl = `https://www.carfax.com/vehicle/${vin}`
      console.log(`🌐 Navigating to Carfax VIN page: ${vinUrl}`)
      
      await page.goto(vinUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      })

      // Check if page loaded successfully (not a 404 or error page)
      const pageTitle = await page.title()
      if (pageTitle.toLowerCase().includes('sorry') || pageTitle.toLowerCase().includes('not found')) {
        console.log('⏰ VIN-specific page not found, trying search fallback')
        throw new Error('VIN page not found')
      }

      // Wait for potential price elements to load
      await page.waitForSelector('body', { timeout: 15000 })
      
      // Extract price using multiple strategies
      const vinPrice = await page.evaluate(() => {
        // Strategy 1: Look for specific Carfax price elements
        const priceSelectors = [
          '[data-testid="price"]',
          '.price',
          '[class*="price"]',
          '.vehicle-price',
          '.listing-price'
        ]
        
        for (const selector of priceSelectors) {
          const priceElement = document.querySelector(selector)
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
        
        // Strategy 2: Search for any price-like text in the page
        const allElements = document.querySelectorAll('*')
        for (const element of allElements) {
          const text = element.textContent || ''
          const priceMatches = text.match(/\$[\d,]{4,}/g)
          if (priceMatches) {
            for (const match of priceMatches) {
              const price = parseInt(match.replace(/[^\d]/g, ''))
              // Filter for realistic vehicle prices
              if (price >= 1000 && price <= 200000) {
                return match.replace(/[$,]/g, '')
              }
            }
          }
        }
        
        return null
      })
      
      if (vinPrice) {
        console.log(`✅ Carfax VIN price for ${vin}: $${vinPrice}`)
        return vinPrice
      }
      
    } catch (vinError) {
      console.log('⏰ VIN-specific lookup failed, trying search fallback')
    }
    
    // Strategy 2: Fallback to search if VIN-specific page fails
    if (make && model) {
      try {
        const searchQuery = year ? `${year} ${make} ${model}` : `${make} ${model}`
        const searchUrl = `https://www.carfax.com/Used-Cars/${encodeURIComponent(searchQuery)}`
        
        console.log(`🔄 Trying Carfax search: ${searchUrl}`)
        await page.goto(searchUrl, { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        })
        
        // Wait for search results
        await page.waitForSelector('body', { timeout: 15000 })
        
        const searchPrice = await page.evaluate(() => {
          // Look for listing cards or search results
          const listingSelectors = [
            '.listing-card',
            '.vehicle-card',
            '[data-testid="listing"]',
            '.search-result'
          ]
          
          for (const selector of listingSelectors) {
            const listings = document.querySelectorAll(selector)
            for (const listing of listings) {
              const priceElement = listing.querySelector('.price, [class*="price"], [data-testid="price"]')
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
          }
          
          // Fallback: any price on the page
          const allPrices = document.querySelectorAll('*')
          for (const element of allPrices) {
            const text = element.textContent || ''
            const priceMatch = text.match(/\$[\d,]{4,}/)
            if (priceMatch) {
              const price = parseInt(priceMatch[0].replace(/[^\d]/g, ''))
              if (price >= 1000 && price <= 200000) {
                return priceMatch[0].replace(/[$,]/g, '')
              }
            }
          }
          
          return null
        })
        
        if (searchPrice) {
          console.log(`✅ Carfax search price for VIN ${vin}: $${searchPrice}`)
          return searchPrice
        }
        
      } catch (searchError) {
        console.log('⏰ Search fallback also failed')
      }
    }
    
    console.log(`ℹ️ No Carfax price found for VIN: ${vin}`)
    return null

  } catch (error) {
    console.error(`❌ Carfax scraping failed for VIN ${vin}:`, error)
    return null
  } finally {
    if (browser) {
      try {
        await browser.close()
        console.log('🔒 Carfax browser closed')
      } catch (closeError) {
        console.error('Error closing Carfax browser:', closeError)
      }
    }
  }
}
