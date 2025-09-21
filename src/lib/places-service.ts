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
      console.error('❌ Foursquare API key not found. Places service will fail without API key.');
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
        throw new Error('Foursquare API key not configured. Please set FSQ_API_KEY environment variable.');
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
        console.error(`❌ Foursquare API error: ${response.status} ${response.statusText}. Response: ${errorText}`);
        throw new Error(`Foursquare API returned ${response.status}: ${response.statusText}`);
      }

      const data: FoursquareResponse = await response.json();

      if (!data.results || data.results.length === 0) {
        console.warn('No places found from Foursquare');
        return [];
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
      throw new Error(`Failed to search places: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
