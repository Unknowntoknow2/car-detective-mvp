
// Helper functions for IAAI (Insurance Auto Auctions) data fetching
import { launchBrowser, setupStealthPage } from '../_shared/puppeteer-launch.ts'

export async function fetchIAAIData(vin: string): Promise<any[]> {
  console.log(`🏭 IAAI scraper starting for VIN: ${vin}`)
  
  let browser
  try {
    browser = await launchBrowser(true)
    const page = await setupStealthPage(browser)
    const results: any[] = []

    const searchUrl = `https://www.iaai.com/Search?keyword=${vin}`
    console.log(`🌐 Navigating to: ${searchUrl}`)
    
    await page.goto(searchUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })

    // Wait for search results or no results message
    try {
      await page.waitForSelector('.table-striped, .search-results, .no-results-found', { timeout: 15000 })
    } catch (timeoutError) {
      console.log('⏰ Timeout waiting for IAAI search results, checking page content')
    }

    // Check if no results
    const noResults = await page.$('.no-results-found, .no-vehicles-found')
    if (noResults) {
      console.log(`ℹ️ No IAAI results found for VIN: ${vin}`)
      return []
    }

    // Extract auction data
    const entries = await page.evaluate(() => {
      const vehicles = []
      
      // Try multiple selectors for IAAI's different page layouts
      const rows = document.querySelectorAll('tr.search-result, .vehicle-card, .auction-item')
      
      for (const row of rows) {
        try {
          const titleElement = row.querySelector('.vehicle-title, .stock-no, td:nth-child(2)')
          const priceElement = row.querySelector('.current-bid, .sale-price, .bid-amount, td:nth-child(4)')
          const locationElement = row.querySelector('.branch-name, .location, td:nth-child(3)')
          const dateElement = row.querySelector('.sale-date, .auction-date, td:nth-child(5)')
          const mileageElement = row.querySelector('.odometer, .mileage, td:nth-child(6)')
          const conditionElement = row.querySelector('.condition, .grade, td:nth-child(7)')
          const imageElement = row.querySelector('img')

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
              condition: condition || 'Enhanced Vehicle',
              imageUrl
            })
          }
        } catch (error) {
          console.error('Error parsing IAAI vehicle row:', error)
        }
      }
      
      return vehicles
    })

    console.log(`📊 Found ${entries.length} IAAI entries for VIN: ${vin}`)

    // Normalize data format
    for (const entry of entries) {
      results.push({
        vin,
        auction_source: 'IAAI',
        price: entry.price?.toString() || '0',
        sold_date: entry.dateText || new Date().toISOString().split('T')[0],
        odometer: entry.mileage?.toString() || '0',
        condition_grade: entry.condition || 'Enhanced Vehicle',
        location: entry.location || 'Unknown',
        photo_urls: entry.imageUrl ? [entry.imageUrl] : [],
        source_priority: 4
      })
    }

    console.log(`✅ IAAI scraping completed: ${results.length} results`)
    return results

  } catch (error) {
    console.error(`❌ IAAI scraping failed for VIN ${vin}:`, error)
    return []
  } finally {
    if (browser) {
      try {
        await browser.close()
        console.log('🔒 IAAI browser closed')
      } catch (closeError) {
        console.error('Error closing IAAI browser:', closeError)
      }
    }
  }
}

// Example of what the real implementation would return:
/*
[{
  vin: "1HGBH41JXMN109186",
  auction_source: "IAAI",
  price: "12500",
  sold_date: "2024-01-20",
  odometer: "68000",
  condition_grade: "Enhanced Vehicle",
  location: "Dallas, TX",
  photo_urls: ["https://iaai.com/photo1.jpg"],
  source_priority: 4
}]
*/
