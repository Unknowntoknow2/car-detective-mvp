
export async function decodeVin(vin: string) {
  const anonToken = import.meta.env.VITE_SUPABASE_ANON_KEY

  const response = await fetch(
    import.meta.env.VITE_SUPABASE_URL + '/functions/v1/decode-vin',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${anonToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vin }),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`❌ VIN decode failed: ${response.status} ${err}`)
  }

  return await response.json()
}
