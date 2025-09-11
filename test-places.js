// Simple test script to check Google Places API
const axios = require('axios');

async function testGooglePlacesAPI() {
  const apiKey = 'AIzaSyC4TQVz0zicFzb_HOg4v_5TgAHRXJ-dLBU';

  console.log('🧪 Testing Google Places API directly...');
  console.log('🔑 API Key loaded:', apiKey ? 'YES' : 'NO');

  try {
    // First, geocode Mumbai to get coordinates
    console.log('📍 Geocoding Mumbai...');
    const geocodeResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=Mumbai, India&key=${apiKey}`
    );

    if (geocodeResponse.data.status !== 'OK') {
      console.error('❌ Geocoding failed:', geocodeResponse.data.status);
      return;
    }

    const { lat, lng } = geocodeResponse.data.results[0].geometry.location;
    console.log(`✅ Coordinates: ${lat}, ${lng}`);

    // Now search for restaurants using legacy Places API
    console.log('🍽️ Searching for restaurants with legacy API...');
    const placesResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=restaurant&key=${apiKey}`
    );

    console.log('📊 Places API Response Status:', placesResponse.data.status);

    if (placesResponse.data.status === 'OK' && placesResponse.data.results && placesResponse.data.results.length > 0) {
      console.log(`✅ Found ${placesResponse.data.results.length} restaurants:`);
      placesResponse.data.results.slice(0, 3).forEach((place, index) => {
        console.log(`${index + 1}. ${place.name || 'Unknown'}`);
        console.log(`   Rating: ${place.rating || 'N/A'} (${place.user_ratings_total || 0} reviews)`);
        console.log(`   Address: ${place.vicinity || place.formatted_address || 'N/A'}`);
        console.log('');
      });
    } else {
      console.error('❌ Places API Error:', placesResponse.data.status || 'Unknown error');
      console.log('Response data:', JSON.stringify(placesResponse.data, null, 2));
    }

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testGooglePlacesAPI();
