
// Update the code to handle both array and object price range formats correctly:
const priceRange = data?.priceRange || data?.price_range;
const formattedPriceRange = {
  low: Array.isArray(priceRange) 
    ? priceRange[0] 
    : (priceRange?.low || Math.round((data?.estimatedValue || 0) * 0.95)),
  high: Array.isArray(priceRange) 
    ? priceRange[1] 
    : (priceRange?.high || Math.round((data?.estimatedValue || 0) * 1.05))
};
