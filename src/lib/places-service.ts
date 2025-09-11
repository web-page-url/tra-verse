import axios from 'axios';

// Types for Google Places API responses
export interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  types: string[];
  photos?: Photo[];
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
  reviews?: Review[];
}

export interface Photo {
  photo_reference: string;
  width: number;
  height: number;
  html_attributions: string[];
}

export interface Review {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
}

export interface PlaceDetails extends Place {
  formatted_phone_number?: string;
  website?: string;
  url?: string;
  address_components?: any[];
  reviews?: Review[];
  price_level?: number;
}

export interface PlacesSearchResult {
  results: Place[];
  status: string;
  next_page_token?: string;
}

export interface EnhancedPlace extends Place {
  category: 'restaurant' | 'attraction' | 'activity' | 'hotel';
  description?: string;
  best_time_to_visit?: string;
  estimated_cost?: {
    currency: string;
    amount: number;
  };
  tags?: string[];
}

// Google Places Service Class
export class GooglePlacesService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';
  private geocodingUrl = 'https://maps.googleapis.com/maps/api/geocode';

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';

    if (!this.apiKey) {
      console.warn('⚠️ Google Places API key not found. Using mock data for development.');
    } else {
      console.log('🔑 Google Places API key loaded successfully');
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

      // First, geocode the location to get coordinates
      const coordinates = await this.geocodeLocation(location);
      if (!coordinates) {
        console.warn(`Could not geocode location: ${location}`);
        return this.getMockPlaces(location, type, limit);
      }

      const { lat, lng } = coordinates;

      // Search for places using legacy Places API (compatible with their setup)
      console.log(`🔍 Searching for ${type} places near ${lat}, ${lng} with radius ${radius}km`);

      const response = await axios.get(
        `${this.baseUrl}/nearbysearch/json`,
        {
          params: {
            location: `${lat},${lng}`,
            radius: radius,
            type: this.mapPlaceType(type),
            key: this.apiKey,
          },
        }
      );

      console.log('📊 Places API Response Status:', response.data.status);

      if (response.data.status !== 'OK') {
        console.warn(`Places API error: ${response.data.status}. Using mock data.`);
        return this.getMockPlaces(location, type, limit);
      }

      if (!response.data.results || response.data.results.length === 0) {
        console.warn('No places found, using mock data');
        return this.getMockPlaces(location, type, limit);
      }

      // Process the places from legacy API format
      const places = response.data.results.slice(0, limit).map((place: any) => {
        // Convert legacy API format to our internal format
        const convertedPlace: Place = {
          place_id: place.place_id,
          name: place.name || 'Unknown Place',
          formatted_address: place.formatted_address || '',
          rating: place.rating,
          user_ratings_total: place.user_ratings_total,
          price_level: place.price_level,
          types: place.types || [],
          geometry: {
            location: {
              lat: place.geometry?.location?.lat || 0,
              lng: place.geometry?.location?.lng || 0,
            },
          },
          opening_hours: place.opening_hours ? {
            open_now: place.opening_hours.open_now,
            weekday_text: place.opening_hours.weekday_text,
          } : undefined,
          vicinity: place.vicinity,
          reviews: place.reviews?.map((review: any) => ({
            author_name: review.author_name || 'Anonymous',
            rating: review.rating,
            text: review.text || '',
            time: review.time || Date.now() / 1000,
            relative_time_description: review.relative_time_description || 'Recent review',
          })),
        };

        return this.enhancePlaceData(convertedPlace, type);
      });

      console.log(`✅ Successfully processed ${places.length} real places from Google Places API`);
      return places;
    } catch (error) {
      console.error('Error searching places:', error);
      return this.getMockPlaces(location, type, limit);
    }
  }

  // Get detailed information about a specific place
  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      if (!this.apiKey) return null;

      const response = await axios.get(
        `${this.baseUrl}/details/json`,
        {
          params: {
            place_id: placeId,
            fields: 'name,formatted_address,rating,user_ratings_total,price_level,types,photos,geometry,opening_hours,formatted_phone_number,website,url,address_components,reviews',
            key: this.apiKey,
          },
        }
      );

      if (response.data.status === 'OK') {
        return response.data.result;
      }

      return null;
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }

  // Geocode a location to get coordinates
  private async geocodeLocation(location: string): Promise<{ lat: number; lng: number } | null> {
    try {
      if (!this.apiKey) return null;

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: location,
            key: this.apiKey,
          },
        }
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
      }

      return null;
    } catch (error) {
      console.error('Error geocoding location:', error);
      return null;
    }
  }

  // Map our types to Google Places API types (legacy)
  private mapPlaceType(type: string): string {
    const typeMap: { [key: string]: string } = {
      restaurant: 'restaurant',
      tourist_attraction: 'tourist_attraction',
      museum: 'museum',
      park: 'park',
      shopping_mall: 'shopping_mall',
      night_club: 'night_club',
    };

    return typeMap[type] || type;
  }

  // Map our types to new Google Places API types
  private mapPlaceTypeToNewAPI(type: string): string {
    const typeMap: { [key: string]: string } = {
      restaurant: 'restaurant',
      tourist_attraction: 'tourist_attraction',
      museum: 'museum',
      park: 'park',
      shopping_mall: 'shopping_mall',
      night_club: 'bar',
    };

    return typeMap[type] || type;
  }

  // Enhance place data with additional information
  private enhancePlaceData(place: Place | PlaceDetails, searchType: string): EnhancedPlace {
    const enhanced: EnhancedPlace = {
      ...place,
      category: this.categorizePlace(place.types, searchType),
      description: this.generateDescription(place, searchType),
      best_time_to_visit: this.getBestTimeToVisit(place.types),
      estimated_cost: this.estimateCost(place, searchType),
      tags: this.generateTags(place.types),
    };

    return enhanced;
  }

  // Categorize place based on types
  private categorizePlace(types: string[], searchType: string): 'restaurant' | 'attraction' | 'activity' | 'hotel' {
    if (types.includes('restaurant') || types.includes('food')) {
      return 'restaurant';
    }
    if (types.includes('lodging')) {
      return 'hotel';
    }
    if (types.includes('tourist_attraction') || types.includes('museum') || types.includes('park')) {
      return 'attraction';
    }
    return 'activity';
  }

  // Generate description based on place data
  private generateDescription(place: Place | PlaceDetails, searchType: string): string {
    const rating = place.rating ? ` (${place.rating}⭐)` : '';
    const price = place.price_level ? ' • ' + '₹'.repeat(place.price_level) : '';

    switch (searchType) {
      case 'restaurant':
        return `Popular dining spot${rating}${price} in ${place.vicinity || 'the area'}`;
      case 'tourist_attraction':
        return `Must-visit attraction${rating} featuring local culture and history`;
      case 'museum':
        return `Cultural museum${rating} showcasing art and history`;
      case 'park':
        return `Beautiful park${rating} perfect for relaxation and outdoor activities`;
      default:
        return `Popular local spot${rating} offering unique experiences`;
    }
  }

  // Get best time to visit
  private getBestTimeToVisit(types: string[]): string {
    if (types.includes('restaurant')) {
      return 'Lunch (12-2 PM) or Dinner (7-9 PM)';
    }
    if (types.includes('museum')) {
      return 'Morning (9 AM - 12 PM) for fewer crowds';
    }
    if (types.includes('park')) {
      return 'Morning or Evening for pleasant weather';
    }
    if (types.includes('night_club')) {
      return 'Evening (9 PM onwards)';
    }
    return 'Morning or Afternoon';
  }

  // Estimate cost based on place type and price level
  private estimateCost(place: Place | PlaceDetails, searchType: string): { currency: string; amount: number } {
    const baseCosts = {
      restaurant: { min: 500, max: 3000 },
      tourist_attraction: { min: 200, max: 1000 },
      museum: { min: 300, max: 800 },
      park: { min: 0, max: 100 },
      shopping_mall: { min: 0, max: 2000 },
      night_club: { min: 1000, max: 5000 },
    };

    const costs = baseCosts[searchType as keyof typeof baseCosts] || { min: 200, max: 1000 };
    const priceLevel = place.price_level || 2;

    // Adjust cost based on price level (1-4 scale)
    const multiplier = 0.5 + (priceLevel * 0.25);
    const amount = Math.round((costs.min + costs.max) / 2 * multiplier);

    return {
      currency: 'INR',
      amount,
    };
  }

  // Generate tags for the place
  private generateTags(types: string[]): string[] {
    const tagMap: { [key: string]: string[] } = {
      restaurant: ['food', 'dining', 'local cuisine'],
      tourist_attraction: ['sightseeing', 'photography', 'culture'],
      museum: ['art', 'history', 'education', 'culture'],
      park: ['nature', 'relaxation', 'outdoor', 'photography'],
      shopping_mall: ['shopping', 'entertainment', 'modern'],
      night_club: ['nightlife', 'music', 'social', 'entertainment'],
    };

    const tags: string[] = [];
    types.forEach(type => {
      if (tagMap[type]) {
        tags.push(...tagMap[type]);
      }
    });

    return [...new Set(tags)].slice(0, 5); // Remove duplicates and limit to 5
  }

  // Mock data for development when API is not available
  private getMockPlaces(location: string, type: string, limit: number): EnhancedPlace[] {
    const mockData = {
      restaurant: [
        {
          place_id: 'mock_rest_1',
          name: 'Spice Garden Restaurant',
          formatted_address: `${location}, Local Area`,
          rating: 4.5,
          user_ratings_total: 1250,
          types: ['restaurant', 'food'],
          geometry: { location: { lat: 28.6139, lng: 77.2090 } },
          vicinity: `${location} City Center`,
          category: 'restaurant' as const,
          description: 'Authentic local cuisine with fresh ingredients and traditional flavors',
          best_time_to_visit: 'Dinner (7-9 PM)',
          estimated_cost: { currency: 'INR', amount: 800 },
          tags: ['food', 'local cuisine', 'traditional', 'fresh'],
        },
        {
          place_id: 'mock_rest_2',
          name: 'Rooftop Café',
          formatted_address: `${location}, Downtown`,
          rating: 4.2,
          user_ratings_total: 890,
          types: ['restaurant', 'cafe'],
          geometry: { location: { lat: 28.6139, lng: 77.2090 } },
          vicinity: `${location} Downtown`,
          category: 'restaurant' as const,
          description: 'Modern café with stunning city views and international menu',
          best_time_to_visit: 'Lunch (12-2 PM)',
          estimated_cost: { currency: 'INR', amount: 600 },
          tags: ['cafe', 'views', 'modern', 'international'],
        },
      ],
      tourist_attraction: [
        {
          place_id: 'mock_attr_1',
          name: `${location} Historic Fort`,
          formatted_address: `${location}, Old City`,
          rating: 4.7,
          user_ratings_total: 2100,
          types: ['tourist_attraction', 'historical'],
          geometry: { location: { lat: 28.6139, lng: 77.2090 } },
          vicinity: `${location} Old City`,
          category: 'attraction' as const,
          description: 'Ancient fort with rich history and stunning architecture',
          best_time_to_visit: 'Morning (9 AM - 12 PM)',
          estimated_cost: { currency: 'INR', amount: 300 },
          tags: ['history', 'architecture', 'culture', 'photography'],
        },
        {
          place_id: 'mock_attr_2',
          name: `${location} City Palace`,
          formatted_address: `${location}, Palace Road`,
          rating: 4.6,
          user_ratings_total: 1800,
          types: ['tourist_attraction', 'museum'],
          geometry: { location: { lat: 28.6139, lng: 77.2090 } },
          vicinity: `${location} Palace Road`,
          category: 'attraction' as const,
          description: 'Magnificent palace showcasing royal heritage and intricate artwork',
          best_time_to_visit: 'Afternoon (2-5 PM)',
          estimated_cost: { currency: 'INR', amount: 500 },
          tags: ['palace', 'royalty', 'art', 'heritage'],
        },
      ],
    };

    const places = mockData[type as keyof typeof mockData] || mockData.tourist_attraction;
    return places.slice(0, limit);
  }
}

// Export singleton instance
export const placesService = new GooglePlacesService();

// Helper functions
export async function searchRestaurants(location: string, limit: number = 5): Promise<EnhancedPlace[]> {
  return placesService.searchPlaces(location, 'restaurant', 3000, limit);
}

export async function searchAttractions(location: string, limit: number = 5): Promise<EnhancedPlace[]> {
  return placesService.searchPlaces(location, 'tourist_attraction', 10000, limit);
}

export async function searchActivities(location: string, limit: number = 5): Promise<EnhancedPlace[]> {
  const activities = await Promise.all([
    placesService.searchPlaces(location, 'museum', 5000, Math.ceil(limit / 2)),
    placesService.searchPlaces(location, 'park', 5000, Math.ceil(limit / 2)),
  ]);

  return activities.flat().slice(0, limit);
}
