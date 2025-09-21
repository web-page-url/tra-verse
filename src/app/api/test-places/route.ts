// Test endpoint for Google Places API integration
import { NextRequest, NextResponse } from 'next/server';
import { searchRestaurants, searchAttractions } from '@/lib/places-service';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Google Places API integration...');

    // Check if API key is loaded
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
    console.log('🔑 API Key loaded:', apiKey ? 'YES' : 'NO');
    console.log('🔑 API Key value:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined');

    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'Mumbai, India';
    const type = searchParams.get('type') || 'restaurants';

    console.log(`🔍 Searching for ${type} in ${location}...`);

    let places;
    if (type === 'restaurants') {
      places = await searchRestaurants(location, 5);
    } else {
      places = await searchAttractions(location, 5);
    }

    console.log(`✅ Found ${places.length} places`);
    console.log('📋 First place sample:', places[0] ? {
      name: places[0].name,
      rating: places[0].rating,
      reviews: places[0].user_ratings_total,
      address: places[0].formatted_address,
    } : 'No places found');

    return NextResponse.json({
      success: true,
      data: {
        apiKeyLoaded: !!apiKey,
        location,
        type,
        placesCount: places.length,
        places: places.map(place => ({
          name: place.name,
          rating: place.rating,
          reviews: place.user_ratings_total,
          address: place.formatted_address,
          type: place.types?.join(', ') || 'Unknown',
          description: place.description,
          cost: place.estimated_cost,
        })),
      },
    });
  } catch (error) {
    console.error('❌ Places API test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch places data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
