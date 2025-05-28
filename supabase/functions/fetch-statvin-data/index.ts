
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { vin } = await req.json()
    
    if (!vin) {
      return new Response(
        JSON.stringify({ error: 'VIN is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`🔍 Fetching STAT.vin data for VIN: ${vin}`)

    // For now, return mock data structure that matches our interface
    // In production, this would integrate with BrightData's browser automation
    // to scrape STAT.vin or use their API if available
    
    const mockStatVinData = {
      vin: vin,
      salePrice: "12500",
      damage: "Front End",
      status: "Salvage Title",
      auctionDate: "2023-08-15",
      location: "Phoenix, AZ",
      images: [
        `https://via.placeholder.com/300x200?text=Auction+Photo+1`,
        `https://via.placeholder.com/300x200?text=Auction+Photo+2`,
        `https://via.placeholder.com/300x200?text=Auction+Photo+3`
      ],
      make: "Toyota",
      model: "Camry",
      year: "2019",
      mileage: "85000",
      bodyType: "Sedan",
      engine: "2.5L I4",
      transmission: "Automatic",
      fuelType: "Gasoline",
      drivetrain: "FWD",
      exteriorColor: "Silver",
      interiorColor: "Black",
      keys: 1,
      seller: "Insurance Company",
      lot: "78432",
      estimatedRepairCost: "8500",
      estimatedRetailValue: "18000",
      condition: "Fair",
      titleType: "Salvage",
      primaryDamage: "Front End",
      secondaryDamage: "Minor Hail",
      saleType: "Online Auction",
      runAndDrive: false
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Randomly return data or no data found (for demo purposes)
    const hasData = Math.random() > 0.3 // 70% chance of having data

    if (!hasData) {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: 'No auction history found for this VIN',
          vin: vin 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        vin: vin,
        ...mockStatVinData
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in fetch-statvin-data function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
