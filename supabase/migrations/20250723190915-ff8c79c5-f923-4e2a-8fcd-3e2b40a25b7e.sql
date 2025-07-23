-- Clean up fake test data from enhanced_market_listings table
DELETE FROM enhanced_market_listings 
WHERE listing_url LIKE '%example.com%' 
   OR listing_url LIKE '%listing1%' 
   OR listing_url LIKE '%listing2%' 
   OR listing_url LIKE '%listing3%' 
   OR listing_url LIKE '%listing4%' 
   OR listing_url LIKE '%listing5%' 
   OR listing_url LIKE '%listing6%'
   OR photos::text LIKE '%example.com%';