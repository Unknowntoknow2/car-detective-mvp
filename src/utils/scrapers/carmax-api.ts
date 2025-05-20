import axios from 'axios';

export async function fetchCarMaxApiListings(
  make: string,
  model: string,
  zipCode = '95814',
  maxResults = 10
) {
  const url = `https://www.carmax.com/cars/api/search/run`;

  const payload = {
    search: {
      facet: {
        make: [make],
        model: [model],
      },
      geo: {
        userInput: zipCode,
        radius: 250,
      },
      pagination: {
        page: 1,
        pageSize: maxResults,
      },
    },
    size: maxResults,
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: 'https://www.carmax.com',
        Referer: 'https://www.carmax.com/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      },
    });

    const listings = response.data?.results || [];

    return listings.map((car: any) => ({
      title: car?.year + ' ' + car?.make + ' ' + car?.model,
      price: car?.price,
      mileage: car?.mileage,
      year: car?.year,
      vin: car?.vin,
      image: car?.imageUrl,
      url: `https://www.carmax.com/car/${car?.stockNumber}`,
      location: car?.locationName || 'Online',
      postedDate: new Date().toISOString(),
      source: 'carmax',
    }));
  } catch (err: any) {
    console.error('❌ CarMax API fetch failed:', err.message);
    return [];
  }
}
