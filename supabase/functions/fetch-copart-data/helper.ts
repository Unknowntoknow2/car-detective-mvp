
// Helper functions for Copart auction data fetching
import { launchBrowser, setupStealthPage } from '../_shared/puppeteer-launch.ts'

export async function fetchCopartData(vin: string): Promise<any[]> {
  console.log(`🔧 Copart scraper starting for VIN: ${vin}`)
  
  let browser
  try {
    browser = await launchBrowser(true)
    const page = await setupStealthPage(browser)
    const results: any[] = []

    const searchUrl = `https://www.copart.com/public/search/vehicles?query=${vin}`
    console.log(`🌐 Navigating to: ${searchUrl}`)
    
    await page.goto(searchUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })

    // Wait for search results or no results message
    try {
      await page.waitForSelector('.search-results-container, .no-results', { timeout: 15000 })
    } catch (timeoutError) {
      console.log('⏰ Timeout waiting for search results, checking page content')
    }

    // Check if no results
    const noResults = await page.$('.no-results')
    if (noResults) {
      console.log(`ℹ️ No Copart results found for VIN: ${vin}`)
      return []
    }

    // Extract auction data
    const entries = await page.evaluate(() => {
      const vehicles = []
      const cards = document.querySelectorAll('.search-result-item, .lot-listing')
      
      for (const card of cards) {
        try {
          const titleElement = card.querySelector('.lot-title, .vehicle-desc, h3')
          const priceElement = card.querySelector('.lot-current-bid, .current-bid, .price')
          const locationElement = card.querySelector('.lot-location, .location')
          const dateElement = card.querySelector('.sale-date, .auction-date')
          const mileageElement = card.querySelector('.odometer, .mileage')
          const conditionElement = card.querySelector('.lot-condition, .condition')
          const imageElement = card.querySelector('img')

          const title = titleElement?.textContent?.trim() || ''
          const priceText = priceElement?.textContent?.trim() || '0'
          const location = locationElement?.textContent?.trim() || ''
          const dateText = dateElement?.textContent?.trim() || ''
          const mileageText = mileageElement?.textContent?.trim() || '0'
          const condition = conditionElement?.textContent?.trim() || ''
          const imageUrl = imageElement?.src || ''

          // Extract numeric price
          const priceMatch = priceText.match(/\$?[\d,]+/)
          const price = priceMatch ? parseInt(priceMatch[0].replace(/[$,]/g, '')) : 0

          // Extract numeric mileage
          const mileageMatch = mileageText.match(/[\d,]+/)
          const mileage = mileageMatch ? parseInt(mileageMatch[0].replace(/,/g, '')) : 0

          if (title || price > 0) {
            vehicles.push({
              title,
              price,
              location,
              dateText,
              mileage,
              condition: condition || title,
              imageUrl
            })
          }
        } catch (error) {
          console.error('Error parsing vehicle card:', error)
        }
      }
      
      return vehicles
    })

    console.log(`📊 Found ${entries.length} Copart entries for VIN: ${vin}`)

    // Normalize data format
    for (const entry of entries) {
      results.push({
        vin,
        auction_source: 'Copart',
        price: entry.price?.toString() || '0',
        sold_date: entry.dateText || new Date().toISOString().split('T')[0],
        odometer: entry.mileage?.toString() || '0',
        condition_grade: entry.condition || 'Unknown',
        location: entry.location || 'Unknown',
        photo_urls: entry.imageUrl ? [entry.imageUrl] : [],
        source_priority: 3
      })
    }

    console.log(`✅ Copart scraping completed: ${results.length} results`)
    return results

  } catch (error) {
    console.error(`❌ Copart scraping failed for VIN ${vin}:`, error)
    return []
  } finally {
    if (browser) {
      try {
        await browser.close()
        console.log('🔒 Copart browser closed')
      } catch (closeError) {
        console.error('Error closing Copart browser:', closeError)
      }
    }
  }
}

// Example of what the real implementation would return:
/*
[{
  vin: "1HGBH41JXMN109186",
  auction_source: "Copart",
  price: "15000",
  sold_date: "2024-01-15",
  odometer: "75000",
  condition_grade: "Run and Drive",
  location: "Phoenix, AZ",
  photo_urls: ["https://copart.com/photo1.jpg"],
  source_priority: 3
}]
*/
