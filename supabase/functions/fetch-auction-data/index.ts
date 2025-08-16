import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { vin } = await req.json()

    if (!vin || vin.length !== 17) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Valid 17-character VIN required' 
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`🔍 Fetching auction data for VIN: ${vin}`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // First check if we have cached auction data
    const { data: existingData } = await supabase
      .from('auction_results_by_vin')
      .select('*')
      .eq('vin', vin)
      .order('inserted_at', { ascending: false })
      .limit(5)

    if (existingData && existingData.length > 0) {
      console.log(`✅ Found ${existingData.length} cached auction records for VIN ${vin}`)
      
      // Convert to our expected format
      const mostRecent = existingData[0]
      const auctionData = {
        vin,
        salePrice: mostRecent.price ? parseFloat(mostRecent.price.replace(/[^0-9.]/g, '')) : undefined,
        condition: mostRecent.condition_grade || 'Unknown',
        saleDate: mostRecent.sold_date,
        location: mostRecent.location,
        images: mostRecent.photo_urls || [],
        auctionHouse: mostRecent.auction_source,
        vehicleInfo: {
          mileage: mostRecent.odometer ? parseInt(mostRecent.odometer.replace(/[^0-9]/g, '')) : undefined
        },
        confidence: 85
      }

      return new Response(JSON.stringify({ 
        success: true,
        data: auctionData,
        source: 'cached',
        recordCount: existingData.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // If no cached data, try to fetch from multiple auction sources
    console.log(`🌐 No cached data, fetching from auction sources...`)
    
    const auctionSources = [
      { name: 'Copart', url: `https://www.copart.com/vehicleFinderSearch/vehicleFinderSearchResults/?searchStr=${vin}` },
      { name: 'IAAI', url: `https://www.iaai.com/Search?url=fEXf7p3g4YpFbFGJnO4RJJ*Rp8rIJmYCZ0` },
      { name: 'Manheim', url: `https://members.manheim.com/members/vehicledetails.do?vin=${vin}` }
    ]

    const fetchPromises = auctionSources.map(async (source) => {
      try {
        console.log(`🔍 Checking ${source.name} for VIN ${vin}`)
        
        const response = await fetch(source.url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive'
          },
          signal: AbortSignal.timeout(10000) // 10s timeout
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const html = await response.text()
        return { source: source.name, html, success: true }

      } catch (error) {
        console.warn(`⚠️ ${source.name} fetch failed:`, error.message)
        return { source: source.name, error: error.message, success: false }
      }
    })

    const results = await Promise.allSettled(fetchPromises)
    const successfulFetches = results
      .filter(result => result.status === 'fulfilled' && result.value.success)
      .map(result => (result as PromiseFulfilledResult<any>).value)

    console.log(`📊 Successful fetches: ${successfulFetches.length}/${auctionSources.length}`)

    // Parse auction data from HTML responses
    let auctionData = null
    
    for (const fetch of successfulFetches) {
      const parsed = parseAuctionHTML(fetch.html, fetch.source, vin)
      if (parsed) {
        auctionData = parsed
        break // Use first successful parse
      }
    }

    if (auctionData) {
      // Store in database for caching
      try {
        await supabase.from('auction_results_by_vin').insert({
          vin,
          auction_source: auctionData.auctionHouse || 'Mixed Sources',
          price: auctionData.salePrice?.toString() || '0',
          sold_date: auctionData.saleDate || new Date().toISOString().split('T')[0],
          location: auctionData.location || 'Unknown',
          odometer: auctionData.vehicleInfo.mileage?.toString() || '0',
          condition_grade: auctionData.condition,
          photo_urls: auctionData.images
        })
        console.log(`💾 Stored auction data in cache`)
      } catch (dbError) {
        console.warn('⚠️ Failed to cache auction data:', dbError)
      }

      return new Response(JSON.stringify({ 
        success: true,
        data: auctionData,
        source: 'live_fetch',
        sourceCount: successfulFetches.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // No auction data found
    console.log(`ℹ️ No auction data found for VIN ${vin}`)
    return new Response(JSON.stringify({ 
      success: false,
      error: 'No auction data available',
      sourcesChecked: auctionSources.length,
      sourcesSuccessful: successfulFetches.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('💥 fetch-auction-data failed:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Internal server error' 
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function parseAuctionHTML(html: string, source: string, vin: string): any | null {
  try {
    console.log(`🔍 Parsing ${source} HTML for auction data`)
    
    // Copart parsing
    if (source === 'Copart') {
      const priceMatch = html.match(/\$([0-9,]+)/g)
      const salePrice = priceMatch ? parseInt(priceMatch[0].replace(/[$,]/g, '')) : undefined
      
      const conditionMatch = html.match(/Condition[^:]*:\s*([^<\n]+)/i)
      const condition = conditionMatch ? conditionMatch[1].trim() : 'Unknown'
      
      const locationMatch = html.match(/Location[^:]*:\s*([^<\n]+)/i)
      const location = locationMatch ? locationMatch[1].trim() : undefined
      
      if (salePrice || condition !== 'Unknown') {
        return {
          vin,
          salePrice,
          condition,
          location,
          images: extractImages(html),
          auctionHouse: 'Copart',
          confidence: 75,
          vehicleInfo: {}
        }
      }
    }
    
    // IAAI parsing  
    if (source === 'IAAI') {
      const bidMatch = html.match(/Current Bid[^$]*\$([0-9,]+)/i)
      const salePrice = bidMatch ? parseInt(bidMatch[1].replace(/,/g, '')) : undefined
      
      const gradeMatch = html.match(/Grade[^:]*:\s*([^<\n]+)/i)
      const condition = gradeMatch ? gradeMatch[1].trim() : 'Unknown'
      
      if (salePrice || condition !== 'Unknown') {
        return {
          vin,
          salePrice,
          condition,
          images: extractImages(html),
          auctionHouse: 'IAAI',
          confidence: 70,
          vehicleInfo: {}
        }
      }
    }

    // Generic parsing fallback
    const pricePattern = /\$\s*([0-9,]+(?:\.[0-9]{2})?)/g
    const prices = []
    let match
    while ((match = pricePattern.exec(html)) !== null) {
      const price = parseInt(match[1].replace(/,/g, ''))
      if (price > 1000 && price < 100000) {
        prices.push(price)
      }
    }

    if (prices.length > 0) {
      return {
        vin,
        salePrice: Math.max(...prices), // Use highest price found
        condition: 'Unknown',
        images: extractImages(html),
        auctionHouse: source,
        confidence: 60,
        vehicleInfo: {}
      }
    }

    return null

  } catch (error) {
    console.warn(`⚠️ Failed to parse ${source} HTML:`, error)
    return null
  }
}

function extractImages(html: string): string[] {
  const images: string[] = []
  const imgPattern = /<img[^>]+src=['"]([^'"]+)['"][^>]*>/gi
  let match

  while ((match = imgPattern.exec(html)) !== null) {
    const src = match[1]
    if (src.includes('vehicle') || src.includes('car') || src.includes('auto')) {
      if (src.startsWith('http') || src.startsWith('//')) {
        images.push(src.startsWith('//') ? `https:${src}` : src)
      }
    }
  }

  return images.slice(0, 5) // Limit to first 5 images
}