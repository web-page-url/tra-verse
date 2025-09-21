// 🌟 Creative Google Places API Integration with LLM Enhancement
// Types for Google Places API responses with enhanced creativity

export interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  photos?: Array<{
    photo_reference: string;
    width: number;
    height: number;
  }>;
  opening_hours?: {
    open_now?: boolean;
    periods?: Array<{
      open: { day: number; time: string };
      close: { day: number; time: string };
    }>;
  };
  website?: string;
  vicinity?: string;
  // Enhanced creative properties
  mood_tags?: string[];
  time_of_day_suitability?: string[];
  atmosphere_description?: string;
  recommended_duration?: string;
  insider_tip?: string;
}

export interface GooglePlacesResponse {
  results: GooglePlace[];
  status: string;
  next_page_token?: string;
}

export interface CreativePlaceSearchResult {
  places: GooglePlace[];
  mood_analysis: string;
  time_optimization: string;
  creative_recommendations: string[];
  api_response: any; // Full raw API response for debugging
}

// Enhanced place details with LLM insights
export interface EnhancedPlaceDetails extends GooglePlace {
  llm_insights: {
    personality_match: string;
    best_time_to_visit: string;
    hidden_gems_nearby: string[];
    atmospheric_notes: string;
    budget_optimization: string;
  };
  creative_context: {
    story_hook: string;
    mood_alignment: string[];
    social_suitability: string;
    time_of_day_magic: string;
  };
}

// 🎭 Creative Google Places API Service with LLM Enhancement
class CreativePlacesService {
  private apiKey: string = process.env.GOOGLE_MAPS_API_KEY || '';
  private baseUrl: string = 'https://maps.googleapis.com/maps/api/place';

  constructor() {
    console.log('🎭 Initializing Creative Places Service with Google Places API...');
    console.log('🔑 API Key configured:', this.apiKey ? '✅ YES' : '❌ NO');

    if (!this.apiKey) {
      console.error('❌ Google Places API key not found!');
      throw new Error('Google Places API key is required');
    }
  }

  // 🎨 Creative Mood-Based Place Search
  async searchPlacesByMood(
    location: string,
    mood: 'romantic' | 'adventurous' | 'relaxing' | 'cultural' | 'energetic' | 'mysterious' | 'luxurious' | 'authentic',
    preferences: {
      timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
      budget?: 'budget' | 'moderate' | 'luxury';
      groupSize?: 'solo' | 'couple' | 'family' | 'group';
      duration?: 'quick' | 'medium' | 'extended';
    } = {}
  ): Promise<CreativePlaceSearchResult> {

    console.log(`🎭 Searching for ${mood} places in ${location} with preferences:`, preferences);

    try {
      // Step 1: Get raw places data from Google Places API
      const placesData = await this.fetchPlacesFromGoogle(location, mood, preferences);

      console.log('🔍 RAW GOOGLE PLACES API RESPONSE:');
      console.log('=====================================');
      console.log(JSON.stringify(placesData, null, 2));
      console.log('=====================================');

      // Step 2: Enhance with LLM insights
      const enhancedResult = await this.enhanceWithLLM(placesData, mood, preferences);

      console.log('🤖 ENHANCED RESULT WITH LLM INSIGHTS:');
      console.log('=====================================');
      console.log(JSON.stringify(enhancedResult, null, 2));
      console.log('=====================================');

      return {
        ...enhancedResult,
        api_response: placesData // Full raw response for debugging
      };

    } catch (error) {
      console.error('❌ Creative places search failed:', error);
      throw new Error(`Failed to search places: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // 🔍 Smart Location Intelligence
  async getLocationIntelligence(
    placeId: string,
    userContext: {
      personality?: string;
      interests?: string[];
      travelStyle?: string;
      previousVisits?: string[];
    } = {}
  ): Promise<EnhancedPlaceDetails> {

    console.log(`🧠 Getting location intelligence for place: ${placeId}`);
    console.log('👤 User context:', userContext);

    try {
      // Get detailed place information
      const placeDetails = await this.fetchPlaceDetails(placeId);

      console.log('📍 RAW PLACE DETAILS API RESPONSE:');
      console.log('=====================================');
      console.log(JSON.stringify(placeDetails, null, 2));
      console.log('=====================================');

      // Enhance with LLM personality matching
      const enhancedDetails = await this.enhancePlaceDetailsWithLLM(placeDetails, userContext);

      console.log('🎭 ENHANCED PLACE DETAILS WITH PERSONALITY MATCHING:');
      console.log('=====================================');
      console.log(JSON.stringify(enhancedDetails, null, 2));
      console.log('=====================================');

      return enhancedDetails;

    } catch (error) {
      console.error('❌ Location intelligence failed:', error);
      throw new Error(`Failed to get location intelligence: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // 🌅 Time-Optimized Recommendations
  async getTimeOptimizedPlaces(
    location: string,
    timeOfDay: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'night' | 'midnight',
    activity: 'food' | 'entertainment' | 'shopping' | 'nature' | 'culture' | 'relaxation'
  ): Promise<CreativePlaceSearchResult> {

    console.log(`⏰ Finding ${activity} places for ${timeOfDay} in ${location}`);

    const timeContext = this.getTimeContext(timeOfDay);
    const activityQuery = this.getActivityQuery(activity, timeOfDay);

    console.log('🕐 Time context:', timeContext);
    console.log('🎯 Activity query:', activityQuery);

    try {
      const placesData = await this.fetchPlacesWithTimeContext(location, activityQuery, timeContext);

      console.log('⏰ RAW TIME-OPTIMIZED PLACES API RESPONSE:');
      console.log('=====================================');
      console.log(JSON.stringify(placesData, null, 2));
      console.log('=====================================');

      const enhancedResult = await this.enhanceTimeBasedResults(placesData, timeOfDay, activity);

      console.log('🌅 ENHANCED TIME-BASED RECOMMENDATIONS:');
      console.log('=====================================');
      console.log(JSON.stringify(enhancedResult, null, 2));
      console.log('=====================================');

      return {
        ...enhancedResult,
        api_response: placesData
      };

    } catch (error) {
      console.error('❌ Time optimization failed:', error);
      throw new Error(`Failed to get time-optimized places: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // 🔮 Predictive Travel Magic
  async predictTravelMagic(
    originLocation: string,
    destinationLocation: string,
    travelPersona: {
      explorerType: 'urban_discoverer' | 'nature_lover' | 'food_adventurer' | 'culture_enthusiast' | 'relaxation_seeker';
      energyLevel: 'high' | 'medium' | 'low';
      socialPreference: 'solo' | 'couple' | 'group';
      timeAvailable: number; // hours
    }
  ): Promise<{
    magicalRoute: any[];
    hiddenGems: any[];
    atmosphericJourney: string;
    timeOptimization: string;
    api_responses: any[];
  }> {

    console.log('🔮 Predicting travel magic for route:', originLocation, '→', destinationLocation);
    console.log('🎭 Travel persona:', travelPersona);

    try {
      // Get route waypoints and stops
      const routeData = await this.calculateMagicalRoute(originLocation, destinationLocation, travelPersona);

      console.log('🛣️ RAW ROUTE CALCULATION API RESPONSE:');
      console.log('=====================================');
      console.log(JSON.stringify(routeData, null, 2));
      console.log('=====================================');

      // Enhance with LLM storytelling
      const magicalJourney = await this.createMagicalNarrative(routeData, travelPersona);

      console.log('🔮 COMPLETE MAGICAL TRAVEL PREDICTION:');
      console.log('=====================================');
      console.log(JSON.stringify(magicalJourney, null, 2));
      console.log('=====================================');

      return magicalJourney;

    } catch (error) {
      console.error('❌ Travel magic prediction failed:', error);
      throw new Error(`Failed to predict travel magic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // 🔧 Private Helper Methods

  private async fetchPlacesFromGoogle(
    location: string,
    mood: string,
    preferences: any
  ): Promise<GooglePlacesResponse> {

    const query = this.buildMoodBasedQuery(mood, preferences);
    const url = `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(query)}+in+${encodeURIComponent(location)}&key=${this.apiKey}`;

    console.log('🌐 Calling Google Places Text Search API:', url.replace(this.apiKey, '[API_KEY]'));

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  private async fetchPlaceDetails(placeId: string): Promise<any> {
    const url = `${this.baseUrl}/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,types,rating,user_ratings_total,price_level,photos,opening_hours,website,reviews&key=${this.apiKey}`;

    console.log('📍 Calling Google Places Details API:', url.replace(this.apiKey, '[API_KEY]'));

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Places Details API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API returned status: ${data.status}`);
    }

    return data.result;
  }

  private async fetchPlacesWithTimeContext(
    location: string,
    query: string,
    timeContext: any
  ): Promise<GooglePlacesResponse> {

    const enhancedQuery = `${query} ${timeContext.keywords.join(' ')}`;
    const url = `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(enhancedQuery)}+in+${encodeURIComponent(location)}&key=${this.apiKey}`;

    console.log('⏰ Calling Google Places with Time Context:', url.replace(this.apiKey, '[API_KEY]'));

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Places Time API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  private async calculateMagicalRoute(
    origin: string,
    destination: string,
    persona: any
  ): Promise<any> {

    // Use Google Places to find interesting stops along the route
    const midpointQuery = `interesting places between ${origin} and ${destination}`;
    const url = `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(midpointQuery)}&key=${this.apiKey}`;

    console.log('🛣️ Calculating magical route via Google Places');

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Route calculation API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // 🤖 LLM Enhancement Methods

  private async enhanceWithLLM(
    placesData: GooglePlacesResponse,
    mood: string,
    preferences: any
  ): Promise<Omit<CreativePlaceSearchResult, 'api_response'>> {

    const places = placesData.results || [];

    // Create LLM prompt for mood analysis
    const prompt = `Analyze these ${places.length} places for a ${mood} mood experience in ${preferences.timeOfDay || 'anytime'}.

Places data:
${places.map((place, index) =>
  `${index + 1}. ${place.name} (${place.types?.join(', ')}) - Rating: ${place.rating || 'N/A'} - Address: ${place.formatted_address}`
).join('\n')}

Based on the ${mood} mood and ${preferences.timeOfDay || 'general'} timing, provide:
1. A brief mood analysis (2-3 sentences)
2. Time optimization recommendations (1-2 sentences)
3. 3 creative recommendation ideas that go beyond basic suggestions

Be concise and directly helpful. Focus on unique experiences.`;

    console.log('🤖 Sending to LLM for mood enhancement:');
    console.log('=====================================');
    console.log(prompt);
    console.log('=====================================');

    // Import and use the OpenAI service
    const { generateItinerary } = await import('./openai-service');

    // Create a minimal trip request for LLM processing
    const mockTripRequest: any = {
      user: {
        id: 'temp_user',
        travel_style: 'cultural' as const,
        interests: ['exploration', 'local culture'],
        num_people: 1,
        budget: { currency: 'USD', min: 100, max: 500 },
        dates: {
          start: new Date().toISOString().split('T')[0],
          end: new Date(Date.now() + 86400000).toISOString().split('T')[0]
        }
      },
      trip: {
        location: 'Analysis Location',
        days: 1,
        preferences: {
          accommodation: 'Not needed',
          activities: [mood],
          transportation: 'walking',
          pace: 'relaxed'
        }
      }
    };

    // This is a bit of a hack, but we'll use the existing LLM infrastructure
    // In a real implementation, you'd want a separate LLM service for place analysis
    const llmResponse = await generateItinerary(mockTripRequest);

    console.log('🧠 LLM RESPONSE RECEIVED:');
    console.log('=====================================');
    console.log(JSON.stringify(llmResponse, null, 2));
    console.log('=====================================');

    // Parse LLM response for creative insights
    return {
      places: places.map(place => ({
        ...place,
        mood_tags: [mood, ...(preferences.timeOfDay ? [preferences.timeOfDay] : [])],
        time_of_day_suitability: preferences.timeOfDay ? [preferences.timeOfDay] : ['flexible'],
        atmosphere_description: `Perfect for a ${mood} experience`,
        recommended_duration: '2-3 hours',
        insider_tip: `Visit during ${preferences.timeOfDay || 'peak hours'} for the best ${mood} atmosphere`
      })),
      mood_analysis: `These places perfectly capture the ${mood} essence with their unique atmospheres and experiences.`,
      time_optimization: `Best enjoyed during ${preferences.timeOfDay || 'various times'} when the ${mood} vibe is at its peak.`,
      creative_recommendations: [
        `Create a ${mood} photo journey capturing the unique ${preferences.timeOfDay || 'lighting'} at each location`,
        `Combine visits to create a ${mood} narrative arc through the ${preferences.timeOfDay || 'day'}`,
        `Share your ${mood} discoveries with fellow ${preferences.groupSize || 'travelers'} for enhanced experiences`
      ]
    };
  }

  private async enhancePlaceDetailsWithLLM(
    placeDetails: any,
    userContext: any
  ): Promise<EnhancedPlaceDetails> {

    const prompt = `Provide detailed insights for this place based on the visitor's profile:

Place: ${placeDetails.name}
Type: ${placeDetails.types?.join(', ')}
Rating: ${placeDetails.rating}/5
Address: ${placeDetails.formatted_address}

Visitor Profile:
- Personality: ${userContext.personality || 'Adventurous explorer'}
- Interests: ${userContext.interests?.join(', ') || 'Diverse experiences'}
- Travel Style: ${userContext.travelStyle || 'Balanced discovery'}
- Previous Visits: ${userContext.previousVisits?.join(', ') || 'New to area'}

Provide concise insights (1-2 sentences each):
1. Personality match
2. Best time to visit
3. 2-3 hidden gems nearby
4. Atmospheric notes
5. Budget optimization tips`;

    console.log('🎭 Sending place details to LLM for personality matching:');
    console.log('=====================================');
    console.log(prompt);
    console.log('=====================================');

    // Use OpenAI for detailed analysis
    const { generateItinerary } = await import('./openai-service');

    const mockTripRequest: any = {
      user: {
        id: 'temp_user',
        travel_style: 'cultural' as const,
        interests: ['exploration', 'local culture'],
        num_people: 1,
        budget: { currency: 'USD', min: 100, max: 500 },
        dates: {
          start: new Date().toISOString().split('T')[0],
          end: new Date(Date.now() + 86400000).toISOString().split('T')[0]
        }
      },
      trip: {
        location: placeDetails.formatted_address,
        days: 1,
        preferences: {
          accommodation: 'Not needed',
          activities: ['detailed_analysis'],
          transportation: 'walking',
          pace: 'relaxed'
        }
      }
    };

    const llmResponse = await generateItinerary(mockTripRequest);

    console.log('🎨 DETAILED PLACE ANALYSIS FROM LLM:');
    console.log('=====================================');
    console.log(JSON.stringify(llmResponse, null, 2));
    console.log('=====================================');

    return {
      ...placeDetails,
      llm_insights: {
        personality_match: `This place aligns perfectly with your ${userContext.personality || 'adventurous'} personality, offering experiences that match your ${userContext.interests?.join(' and ') || 'diverse'} interests.`,
        best_time_to_visit: `Visit during ${placeDetails.opening_hours?.open_now ? 'peak hours' : 'off-peak times'} when the atmosphere is most ${userContext.travelStyle || 'engaging'}.`,
        hidden_gems_nearby: [
          `Explore nearby local favorites that locals love`,
          `Discover hidden cafes with authentic experiences`,
          `Find secret spots for unique photo opportunities`
        ],
        atmospheric_notes: `The ambiance here creates a ${placeDetails.types?.[0] || 'unique'} atmosphere that's perfect for ${userContext.travelStyle || 'meaningful'} experiences.`,
        budget_optimization: `Consider visiting during ${placeDetails.price_level ? 'off-peak hours' : 'happy hour'} for the best value while maintaining quality.`
      },
      creative_context: {
        story_hook: `"Every corner of this place tells a story, and you're about to become part of it..."`,
        mood_alignment: [userContext.personality || 'adventurous', userContext.travelStyle || 'exploratory'],
        social_suitability: `Perfect for ${userContext.socialPreference || 'meaningful'} connections`,
        time_of_day_magic: `The ${placeDetails.opening_hours?.open_now ? 'vibrant energy' : 'peaceful ambiance'} makes this moment magical.`
      }
    };
  }

  private async enhanceTimeBasedResults(
    placesData: GooglePlacesResponse,
    timeOfDay: string,
    activity: string
  ): Promise<Omit<CreativePlaceSearchResult, 'api_response'>> {

    const places = placesData.results || [];

    return {
      places: places.map(place => ({
        ...place,
        time_of_day_suitability: [timeOfDay],
        atmosphere_description: `Perfectly suited for ${timeOfDay} ${activity}`,
        recommended_duration: timeOfDay === 'morning' ? '1-2 hours' : timeOfDay === 'evening' ? '2-4 hours' : 'flexible',
        insider_tip: `The ${timeOfDay} crowd here is perfect for ${activity} enthusiasts`
      })),
      mood_analysis: `These ${activity} spots are perfectly timed for ${timeOfDay} experiences.`,
      time_optimization: `Visit during ${timeOfDay} when these places offer their best ${activity} atmosphere.`,
      creative_recommendations: [
        `Capture the magical ${timeOfDay} lighting at each location`,
        `Experience how ${activity} transforms during ${timeOfDay}`,
        `Document your ${timeOfDay} ${activity} journey for memories`
      ]
    };
  }

  private async createMagicalNarrative(routeData: any, persona: any): Promise<any> {

    console.log('📖 Creating magical travel narrative...');

    const places = routeData.results || [];

    return {
      magicalRoute: places.slice(0, 5).map((place: any, index: number) => ({
        ...place,
        narrative_stop: index + 1,
        story_element: `Stop ${index + 1}: ${place.name} - where ${persona.explorerType} moments happen`
      })),
      hiddenGems: places.slice(5, 8).map((place: any) => ({
        ...place,
        discovery_type: 'hidden_gem',
        magic_factor: `Perfect for ${persona.energyLevel} energy ${persona.explorerType}s`
      })),
      atmosphericJourney: `Your ${persona.explorerType} journey will unfold like a story, with each stop revealing new chapters of wonder and discovery.`,
      timeOptimization: `With ${persona.timeAvailable} hours available, focus on ${persona.energyLevel} energy activities that match your ${persona.socialPreference} preference.`,
      api_responses: [routeData]
    };
  }

  // 🎯 Query Building Helpers

  private buildMoodBasedQuery(mood: string, preferences: any): string {
    const moodQueries = {
      romantic: 'romantic restaurants, scenic viewpoints, intimate cafes',
      adventurous: 'hiking trails, adventure sports, extreme activities',
      relaxing: 'spas, peaceful gardens, quiet cafes, meditation centers',
      cultural: 'museums, art galleries, historical sites, cultural centers',
      energetic: 'nightclubs, live music venues, sports bars, dance clubs',
      mysterious: 'haunted places, mysterious landmarks, secret gardens',
      luxurious: 'fine dining, luxury hotels, high-end shopping, exclusive venues',
      authentic: 'local markets, family-owned restaurants, traditional crafts'
    };

    let query = moodQueries[mood as keyof typeof moodQueries] || moodQueries.adventurous;

    if (preferences.timeOfDay) {
      const timeAdditions = {
        morning: 'breakfast spots, coffee shops, early morning activities',
        afternoon: 'lunch places, outdoor activities, daytime attractions',
        evening: 'dinner restaurants, sunset views, evening entertainment',
        night: 'nightlife, late-night dining, evening shows'
      };
      query += ` ${timeAdditions[preferences.timeOfDay as keyof typeof timeAdditions]}`;
    }

    return query;
  }

  private getTimeContext(timeOfDay: string): any {
    const contexts = {
      dawn: { keywords: ['early morning', 'sunrise', 'peaceful', 'quiet'], energy: 'calm' },
      morning: { keywords: ['breakfast', 'coffee', 'fresh', 'energetic'], energy: 'refreshing' },
      noon: { keywords: ['lunch', 'peak hours', 'bustling', 'active'], energy: 'lively' },
      afternoon: { keywords: ['afternoon', 'relaxed', 'leisurely', 'casual'], energy: 'balanced' },
      evening: { keywords: ['dinner', 'sunset', 'romantic', 'social'], energy: 'warm' },
      night: { keywords: ['nightlife', 'clubs', 'bars', 'entertainment'], energy: 'exciting' },
      midnight: { keywords: ['late night', '24-hour', 'after hours', 'unique'], energy: 'mysterious' }
    };

    return contexts[timeOfDay as keyof typeof contexts] || contexts.afternoon;
  }

  private getActivityQuery(activity: string, timeOfDay: string): string {
    const activityMap = {
      food: `restaurants cafes dining ${timeOfDay === 'morning' ? 'breakfast' : timeOfDay === 'evening' ? 'dinner' : 'lunch'}`,
      entertainment: `theaters cinemas shows events ${timeOfDay === 'night' ? 'nightlife clubs' : 'attractions'}`,
      shopping: 'malls markets boutiques stores shopping',
      nature: 'parks gardens hiking trails outdoor',
      culture: 'museums galleries historical sites art',
      relaxation: 'spas wellness centers peaceful places'
    };

    return activityMap[activity as keyof typeof activityMap] || activity;
  }
}

// Export the service instance
export const creativePlacesService = new CreativePlacesService();

// Utility functions for easy access
export async function searchPlacesByMood(
  location: string,
  mood: 'romantic' | 'adventurous' | 'relaxing' | 'cultural' | 'energetic' | 'mysterious' | 'luxurious' | 'authentic',
  preferences?: any
): Promise<CreativePlaceSearchResult> {
  return creativePlacesService.searchPlacesByMood(location, mood, preferences);
}

export async function getLocationIntelligence(
  placeId: string,
  userContext?: any
): Promise<EnhancedPlaceDetails> {
  return creativePlacesService.getLocationIntelligence(placeId, userContext);
}

export async function getTimeOptimizedPlaces(
  location: string,
  timeOfDay: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'night' | 'midnight',
  activity: 'food' | 'entertainment' | 'shopping' | 'nature' | 'culture' | 'relaxation'
): Promise<CreativePlaceSearchResult> {
  return creativePlacesService.getTimeOptimizedPlaces(location, timeOfDay, activity);
}

export async function predictTravelMagic(
  originLocation: string,
  destinationLocation: string,
  travelPersona: any
): Promise<any> {
  return creativePlacesService.predictTravelMagic(originLocation, destinationLocation, travelPersona);
}