import { decodeVin } from '../api/decodeVin'
import supabase from './supabaseClient'

export async function runValuation(vin: string) {
  try {
    const decoded = await decodeVin(vin)

    // Save to Supabase
    await supabase.from('vin_history').insert([
      {
        vin,
        response: decoded
      }
    ])

    return decoded
  } catch (error) {
    console.error('Valuation failed:', error)
    throw error
  }
}