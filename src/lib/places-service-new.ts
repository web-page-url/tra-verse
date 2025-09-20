// Types for Foursquare Places API responses
export interface Place {
  fsq_id: string;
  name: string;
  location: {
    address?: string;
    locality?: string;
    region?: string;
    country?: string;
    formatted_address?: string;
    lat: number;
    lng: number;
  };
  categories?: Array<{
    id: number;
    name: string;
    icon: {
      prefix: string;
      suffix: string;
    };
  }>;
  distance?: number;
  rating?: number;
  price?: number;
  description?: string;
  website?: string;
  hours?: {
    display?: string;
    is_open?: boolean;
  };
  photos?: Array<{
    id: string;
    prefix: string;
    suffix: string;
    width: number;
    height: number;
  }>;
  tips?: Array<{
    id: string;
    text: string;
    created_at: string;
  }>;
}

export interface FoursquareResponse {
  results: Place[];
  context: {
    geo_bounds: {
      circle: {
        center: {
          latitude: number;
          longitude: number;
        };
        radius: number;
      };
    };
  };
}

export interface PlacesSearchResult {
  results: Place[];
  status: string;
  next_page_token?: string;
}

export interface EnhancedPlace {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  types: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  vicinity?: string;
  reviews?: any[];
  description?: string;
  website?: string;
  estimated_cost?: {
    currency: string;
    amount: number;
  };
  tags?: string[];
}

// Foursquare Places Service Class
export class FoursquarePlacesService {
  private apiKey: string;
  private baseUrl = 'https://api.foursquare.com/v3/places';

  constructor() {
    this.apiKey = process.env.FSQ_API_KEY || '';

    if (!this.apiKey) {
      console.warn('⚠️ Foursquare API key not found. Using mock data for development.');
    } else {
      console.log('🔑 Foursquare API key loaded successfully');
    }
  }

  // Search for places by location and type
  async searchPlaces(
    location: string,
    type: 'restaurant' | 'tourist_attraction' | 'museum' | 'park' | 'shopping_mall' | 'night_club',
    radius: number = 5000,
    limit: number = 10
  ): Promise<EnhancedPlace[]> {
    try {
      if (!this.apiKey) {
        console.log('🔄 Using mock places data for development...');
        return this.getMockPlaces(location, type, limit);
      }

      // Map place type to Foursquare query
      const query = this.mapPlaceTypeToQuery(type);

      console.log(`🔍 Searching for ${type} places near ${location} with query "${query}"`);

      const url = `${this.baseUrl}/search?query=${encodeURIComponent(query)}&near=${encodeURIComponent(location)}&limit=${limit}`;

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': this.apiKey
        }
      });

      console.log('📊 Foursquare API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Foursquare API error: ${response.status} ${response.statusText}. Response: ${errorText}. Using mock data.`);
        return this.getMockPlaces(location, type, limit);
      }

      const data: FoursquareResponse = await response.json();

      if (!data.results || data.results.length === 0) {
        console.warn('No places found from Foursquare, using mock data');
        return this.getMockPlaces(location, type, limit);
      }

      // Convert Foursquare places to our enhanced format
      const places = data.results.slice(0, limit).map((place: Place) => {
        // Convert Foursquare format to our internal format
        const convertedPlace: Place = {
          fsq_id: place.fsq_id,
          name: place.name || 'Unknown Place',
          location: {
            address: place.location.address || '',
            locality: place.location.locality || '',
            region: place.location.region || '',
            country: place.location.country || '',
            formatted_address: place.location.formatted_address || '',
            lat: place.location.lat,
            lng: place.location.lng,
          },
          categories: place.categories || [],
          distance: place.distance,
          rating: place.rating,
          price: place.price,
          description: place.description,
          website: place.website,
          hours: place.hours,
          photos: place.photos,
          tips: place.tips,
        };

        return this.enhancePlaceData(convertedPlace, type);
      });

      console.log(`✅ Successfully processed ${places.length} real places from Foursquare API`);
      return places;
    } catch (error) {
      console.error('Error searching places:', error);
      return this.getMockPlaces(location, type, limit);
    }
  }

  // Map place type to Foursquare query
  private mapPlaceTypeToQuery(type: string): string {
    const typeMap: Record<string, string> = {
      restaurant: 'restaurant',
      tourist_attraction: 'tourist attraction',
      museum: 'museum',
      park: 'park',
      shopping_mall: 'shopping mall',
      night_club: 'night club'
    };
    return typeMap[type] || type;
  }

  // Enhance place data with additional information
  private enhancePlaceData(place: Place, type: string): EnhancedPlace {
    // Convert Foursquare place to our enhanced format
    const formattedAddress = [
      place.location.address,
      place.location.locality,
      place.location.region,
      place.location.country
    ].filter(Boolean).join(', ') || 'Address not available';

    const enhanced: EnhancedPlace = {
      place_id: place.fsq_id,
      name: place.name,
      formatted_address: place.location.formatted_address || formattedAddress,
      rating: place.rating,
      user_ratings_total: place.rating ? Math.floor(Math.random() * 1000) + 50 : undefined,
      price_level: place.price ? place.price : undefined,
      types: place.categories?.map(cat => cat.name.toLowerCase()) || [type],
      geometry: {
        location: {
          lat: place.location.lat,
          lng: place.location.lng,
        },
      },
      opening_hours: place.hours ? {
        open_now: place.hours.is_open,
        weekday_text: place.hours.display ? [place.hours.display] : undefined,
      } : undefined,
      vicinity: place.location.address,
      description: place.description,
      website: place.website,
      estimated_cost: this.estimateCost(type, place.price),
      tags: place.categories?.slice(0, 3).map(cat => cat.name) || [type]
    };

    return enhanced;
  }

  // Estimate cost based on place type and price level
  private estimateCost(type: string, priceLevel?: number): { currency: string; amount: number } {
    const baseCosts: Record<string, number> = {
      restaurant: 500,
      tourist_attraction: 200,
      museum: 300,
      park: 0,
      shopping_mall: 0,
      night_club: 800
    };

    const baseCost = baseCosts[type] || 100;
    const multiplier = priceLevel ? Math.pow(2, priceLevel - 1) : 1;

    return {
      currency: 'INR',
      amount: Math.round(baseCost * multiplier)
    };
  }

  // Get mock places for development
  private getMockPlaces(location: string, type: string, limit: number): EnhancedPlace[] {
    const mockPlaces: Record<string, EnhancedPlace[]> = {
      restaurant: [
        {
          place_id: 'mock_rest_1',
          name: 'Local Delight Restaurant',
          formatted_address: `${location}, India`,
          rating: 4.5,
          user_ratings_total: 250,
          price_level: 2,
          types: ['restaurant'],
          geometry: { location: { lat: 28.6139, lng: 77.2090 } },
          opening_hours: { open_now: true },
          vicinity: 'Near city center',
          estimated_cost: { currency: 'INR', amount: 500 },
          tags: ['local cuisine', 'authentic']
        },
        {
          place_id: 'mock_rest_2',
          name: 'Modern Fusion Cafe',
          formatted_address: `${location}, India`,
          rating: 4.2,
          user_ratings_total: 180,
          price_level: 3,
          types: ['restaurant'],
          geometry: { location: { lat: 28.6140, lng: 77.2091 } },
          opening_hours: { open_now: true },
          vicinity: 'Downtown area',
          estimated_cost: { currency: 'INR', amount: 800 },
          tags: ['fusion', 'modern']
        }
      ],
      tourist_attraction: [
        {
          place_id: 'mock_attr_1',
          name: 'Historic Landmark',
          formatted_address: `${location}, India`,
          rating: 4.7,
          user_ratings_total: 1200,
          price_level: 1,
          types: ['tourist_attraction'],
          geometry: { location: { lat: 28.6138, lng: 77.2089 } },
          opening_hours: { open_now: true },
          vicinity: 'City center',
          estimated_cost: { currency: 'INR', amount: 200 },
          tags: ['historical', 'landmark']
        },
        {
          place_id: 'mock_attr_2',
          name: 'Cultural Site',
          formatted_address: `${location}, India`,
          rating: 4.4,
          user_ratings_total: 800,
          price_level: 1,
          types: ['tourist_attraction'],
          geometry: { location: { lat: 28.6137, lng: 77.2088 } },
          opening_hours: { open_now: true },
          vicinity: 'Near market area',
          estimated_cost: { currency: 'INR', amount: 150 },
          tags: ['cultural', 'heritage']
        }
      ]
    };

    const places = mockPlaces[type] || mockPlaces.restaurant;
    return places.slice(0, limit);
  }
}

// Export the service instance
export const placesService = new FoursquarePlacesService();

// Utility functions
export async function searchRestaurants(location: string, limit: number = 8): Promise<EnhancedPlace[]> {
  return placesService.searchPlaces(location, 'restaurant', 5000, limit);
}

export async function searchAttractions(location: string, limit: number = 8): Promise<EnhancedPlace[]> {
  return placesService.searchPlaces(location, 'tourist_attraction', 10000, limit);
}
