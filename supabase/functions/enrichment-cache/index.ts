
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Comprehensive StatVin data fetcher matching the real STAT.vin format
async function fetchStatVinData(vin: string) {
  console.log(`Fetching comprehensive StatVin data for VIN: ${vin}`)
  
  // Mock comprehensive data structure matching your STAT.vin example
  return {
    vin,
    vehicleDetails: {
      year: 2018,
      make: 'ALFA ROMEO',
      model: 'GIULIA',
      trim: 'TI SPORT',
      engine: '2.0L 280HP I4 DI TURBO',
      fuelType: 'Gasoline',
      drivetrain: 'Rear Wheel Drive',
      bodyType: 'Sedan',
      country: 'Englishtown (NJ)'
    },
    photos: [
      {
        url: 'https://example.com/photo1.jpg',
        date: '2021.08.04',
        auction: 'IAAI'
      }
    ],
    auctionSalesHistory: [
      {
        date: '2021-10-25',
        auction: 'IAAI',
        lotNumber: '30883662',
        price: 6075,
        status: 'Sold',
        location: 'New Jersey'
      },
      {
        date: '2021-02-17',
        auction: 'IAAI',
        lotNumber: '29598760',
        price: 9025,
        status: 'Not Sold'
      },
      {
        date: '2021-02-10',
        auction: 'IAAI',
        lotNumber: '29598760',
        price: 9225,
        status: 'Not Sold'
      }
    ],
    ownershipHistory: [
      {
        ownerNumber: 1,
        yearPurchased: 2018,
        ownerType: 'Personal lease',
        estimatedOwnershipLength: '10 months',
        lastReportedOdometer: 9843
      },
      {
        ownerNumber: 2,
        yearPurchased: 2019,
        ownerType: 'Personal',
        estimatedOwnershipLength: '1 yr. 8 mo.',
        estimatedMilesPerYear: 16223,
        lastReportedOdometer: 35688
      },
      {
        ownerNumber: 3,
        yearPurchased: 2021,
        ownerType: 'Personal',
        estimatedOwnershipLength: '4 months',
        lastReportedOdometer: 35799
      }
    ],
    damageHistory: [
      {
        date: '2019-08-01',
        owner: 2,
        damageLocation: ['Front', 'Left Front'],
        severity: 'minor',
        description: 'Damage reported: minor damage - Damage to front - Damage to left front'
      },
      {
        date: '2019-08-30',
        owner: 2,
        damageLocation: ['Left Front'],
        severity: 'minor',
        description: 'Accident reported: minor damage - Vehicle involved in a front end collision with another motor vehicle - Damage to left front - Functional damage reported'
      },
      {
        date: '2020-10-24',
        owner: 2,
        damageLocation: ['Front', 'Rear'],
        severity: 'moderate',
        description: 'Accident reported: minor damage - Vehicle involved in a rear-end collision with another motor vehicle - Structural damage reported - Damage to front - Damage to rear - Vehicle damaged in multiple places'
      }
    ],
    titleHistory: [
      {
        date: '2018-06-04',
        state: 'California',
        titleType: 'Clean',
        description: 'Title issued or updated - First owner reported - Titled or registered as personal lease vehicle - Loan or lien reported',
        loanLienReported: true
      },
      {
        date: '2019-05-11',
        state: 'Florida',
        titleType: 'Clean',
        titleNumber: '0134814094',
        description: 'Title issued or updated - Registration issued or renewed - New owner reported - Titled or registered as personal vehicle - Loan or lien reported - Vehicle color noted as White',
        vehicleColor: 'White',
        loanLienReported: true
      },
      {
        date: '2021-10-01',
        state: 'New Jersey',
        titleType: 'Salvage',
        titleNumber: 'V320212740123',
        description: 'SALVAGE TITLE/CERTIFICATE ISSUED - NOT ACTUAL MILEAGE TITLE ISSUED - RECONSTRUCTED TITLE ISSUED - Vehicle color noted as White',
        vehicleColor: 'White'
      }
    ],
    serviceHistory: [
      {
        date: '2018-02-27',
        serviceProvider: 'Alfa Romeo and Fiat of San Diego',
        location: 'San Diego, CA',
        serviceType: ['Pre-delivery inspection'],
        description: 'Vehicle serviced - Pre-delivery inspection completed'
      },
      {
        date: '2019-07-31',
        mileage: 12957,
        serviceProvider: 'Arrigo Alfa Romeo FIAT of West Palm',
        location: 'West Palm Beach, FL',
        serviceType: ['Maintenance', 'Oil Change', 'Inspection'],
        description: 'Vehicle serviced - Maintenance inspection completed - Fluids checked - Oil and filter changed - Maintenance reminder reset - Tire condition and pressure checked - PCM reprogrammed'
      }
    ],
    detailedHistory: [
      {
        date: '2018-05-17',
        mileage: 406,
        source: 'Alfa Romeo and Fiat of San Diego',
        eventType: 'Sale',
        description: 'Vehicle sold',
        location: 'San Diego, CA',
        owner: 1
      },
      {
        date: '2019-04-18',
        mileage: 9732,
        source: 'Auto Auction',
        eventType: 'Sale',
        description: 'Vehicle sold',
        owner: 1
      },
      {
        date: '2021-10-01',
        source: 'Damage Report',
        eventType: 'Damage',
        description: 'TOTAL LOSS VEHICLE',
        owner: 3
      }
    ],
    salesHistory: [
      {
        date: '2018-05-17',
        seller: 'Alfa Romeo and Fiat of San Diego',
        sellerLocation: 'San Diego, CA',
        odometer: 406
      },
      {
        date: '2019-04-18',
        seller: 'Auto Auction',
        odometer: 9732
      },
      {
        date: '2019-05-10',
        seller: 'Florida Motor Vehicle Dept.',
        odometer: 9962
      },
      {
        date: '2021-01-25',
        seller: 'Auto Auction'
      }
    ],
    summaries: {
      totalRecords: 11,
      photoCount: 11,
      auctionSalesCount: 3,
      ownerCount: 3,
      damageRecordsCount: 3,
      titleRecordsCount: 3,
      serviceRecordsCount: 4,
      hasStructuralDamage: true,
      hasSalvageTitle: true,
      hasAirbagDeployment: false,
      hasOdometerIssues: true,
      hasOpenRecalls: true
    },
    reportDate: new Date().toISOString().split('T')[0]
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { vin, source = 'statvin' } = await req.json()
    
    if (!vin) {
      return new Response(
        JSON.stringify({ error: 'VIN is required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Processing enrichment request for VIN: ${vin}, source: ${source}`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check cache first (24-hour freshness)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    const { data: cached, error: cacheError } = await supabase
      .from('auction_enrichment_by_vin')
      .select('*')
      .eq('vin', vin)
      .eq('source', source)
      .gt('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (cached && !cacheError) {
      console.log(`Cache hit for VIN: ${vin}`)
      return new Response(
        JSON.stringify({ 
          data: cached.data, 
          cached: true, 
          lastUpdated: cached.created_at 
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Cache miss for VIN: ${vin}, fetching fresh data`)

    // Fetch fresh data
    let enrichedData
    if (source === 'statvin') {
      enrichedData = await fetchStatVinData(vin)
    } else {
      throw new Error(`Unsupported source: ${source}`)
    }

    if (!enrichedData) {
      return new Response(
        JSON.stringify({ error: 'No enrichment data found' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Store in cache
    const { error: insertError } = await supabase
      .from('auction_enrichment_by_vin')
      .insert([{ 
        vin, 
        source, 
        data: enrichedData 
      }])

    if (insertError) {
      console.error('Cache insert error:', insertError)
      // Continue anyway, just return the data without caching
    }

    return new Response(
      JSON.stringify({ 
        data: enrichedData, 
        cached: false, 
        lastUpdated: new Date().toISOString() 
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Enrichment cache error:', error)
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
