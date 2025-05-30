
import { launchBrowser, setupStealthPage } from '../../_shared/puppeteer-launch.ts'

export async function fetchEbayMotorsListings(query: string, zipCode: string): Promise<any[]> {
  console.log(`🚗 eBay Motors scraper starting for: ${query} near ${zipCode}`)
  
  let browser
  try {
    browser = await launchBrowser(true)
    const page = await setupStealthPage(browser)
    const results: any[] = []

    // Loop through first 3 pages for comprehensive results
    for (let pageNum = 1; pageNum <= 3; pageNum++) {
      console.log(`📄 Scraping eBay Motors page ${pageNum}`)
      
      const searchUrl = `https://www.ebay.com/sch/Cars-Trucks/6001/i.html?_nkw=${encodeURIComponent(query)}&_pgn=${pageNum}&LH_ItemCondition=3000|1000&_sop=1`
      
      await page.goto(searchUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      })

      // Wait for search results
      try {
        await page.waitForSelector('.s-item', { timeout: 15000 })
      } catch (timeoutError) {
        console.log(`⏰ Timeout on page ${pageNum}, checking for results`)
      }

      // Check for no results
      const noResults = await page.$('.srp-save-null-search')
      if (noResults) {
        console.log(`ℹ️ No eBay results found on page ${pageNum}`)
        break
      }

      // Extract listings from current page
      const listings = await page.evaluate(() => {
        const vehicles = []
        const listingElements = document.querySelectorAll('.s-item')

        for (const element of listingElements) {
          try {
            // Skip sponsored/ad items
            if (element.querySelector('.s-item__subtitle')?.textContent?.includes('Sponsored')) {
              continue
            }

            const titleElement = element.querySelector('.s-item__title')
            const priceElement = element.querySelector('.s-item__price')
            const linkElement = element.querySelector('.s-item__link')
            const locationElement = element.querySelector('.s-item__location')
            const conditionElement = element.querySelector('.SECONDARY_INFO, .s-item__subtitle')
            const shippingElement = element.querySelector('.s-item__shipping')

            const title = titleElement?.textContent?.trim() || ''
            const priceText = priceElement?.textContent?.trim() || ''
            const url = linkElement?.getAttribute('href') || ''
            const location = locationElement?.textContent?.trim() || ''
            const condition = conditionElement?.textContent?.trim() || ''
            const shipping = shippingElement?.textContent?.trim() || ''

            // Extract price - handle various formats
            let price = null
            const priceMatch = priceText.match(/\$?[\d,]+/)
            if (priceMatch) {
              price = parseInt(priceMatch[0].replace(/[$,]/g, ''))
            }

            // Extract VIN from title if available
            const vinMatch = title.match(/\b[A-HJ-NPR-Z0-9]{17}\b/i)
            const vin = vinMatch ? vinMatch[0].toUpperCase() : null

            // Extract mileage from title
            const mileageMatch = title.match(/(\d{1,3}[,\d]*)\s*(?:miles?|mi|k)/i)
            let mileage = null
            if (mileageMatch) {
              mileage = parseInt(mileageMatch[1].replace(/,/g, ''))
              // Convert if it's in thousands (e.g., "120k miles")
              if (title.toLowerCase().includes('k miles') || title.toLowerCase().includes('k mi')) {
                mileage = mileage * 1000
              }
            }

            // Extract year from title
            const yearMatch = title.match(/\b(19|20)\d{2}\b/)
            const year = yearMatch ? parseInt(yearMatch[0]) : null

            // Skip items that don't look like vehicles
            if (!title || title.length < 10 || !url || url.includes('javascript:')) {
              continue
            }

            // Filter out parts/accessories
            const partsKeywords = ['part', 'tire', 'wheel', 'engine', 'transmission', 'bumper', 'hood', 'door', 'mirror']
            const isPartListing = partsKeywords.some(keyword => 
              title.toLowerCase().includes(keyword) && !title.toLowerCase().includes('car') && !title.toLowerCase().includes('vehicle')
            )
            
            if (isPartListing) {
              continue
            }

            vehicles.push({
              vin,
              title,
              price,
              mileage: mileage && mileage < 1000000 ? mileage : null, // Sanity check
              location,
              platform: 'eBay',
              url: url.split('?')[0], // Clean URL
              condition: condition || 'Used',
              year,
              shipping_info: shipping
            })
          } catch (error) {
            console.error('Error parsing eBay listing:', error)
          }
        }

        return vehicles
      })

      console.log(`📊 Found ${listings.length} eBay listings on page ${pageNum}`)
      results.push(...listings)

      // Add delay between pages to avoid rate limiting
      if (pageNum < 3) {
        await page.waitForTimeout(2000)
      }
    }

    console.log(`✅ eBay scraping completed: ${results.length} total results`)
    return results

  } catch (error) {
    console.error(`❌ eBay scraping failed for query ${query}:`, error)
    return []
  } finally {
    if (browser) {
      try {
        await browser.close()
        console.log('🔒 eBay browser closed')
      } catch (closeError) {
        console.error('Error closing eBay browser:', closeError)
      }
    }
  }
}
