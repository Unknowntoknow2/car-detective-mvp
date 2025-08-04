import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bmpwwtgtwxxuabuhkami.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtcHd3dGd0d3h4dWFidWhrYW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0ODYyMTIsImV4cCI6MjA2OTA2MjIxMn0.sNjcI1db8RBx17p2BHk07K7pz5XHStXyeGEoytdpqJM'
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  let { data, error } = await supabase
    .from('vin_history')
    .select('*')
    .eq('vin', '5N1BT3AB7PC852920')
  console.log(data, error)
}

main()

