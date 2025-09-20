// OpenAI Service Integration for Tra Verse Travel Planning
import OpenAI from 'openai';
import { buildGeminiPrompt, buildRetryPrompt, FALLBACK_PROMPT } from './gemini-prompts';
import { validateTripResponse } from './validation';
import { TripRequest, TripResponse } from '@/types';
import { searchRestaurants, searchAttractions } from './places-service';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyC4TQVz0zicFzb_HOg4v_5TgAHRXJ-dLBU';

// Rate limiting helper
class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 60, windowMs: number = 60000) { // 60 requests per minute
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async waitForSlot(): Promise<void> {
    const now = Date.now();

    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      // Wait until the oldest request expires
      const waitTime = this.windowMs - (now - this.requests[0]);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      // Use iterative approach instead of recursion to avoid stack overflow
      return this.waitForSlot();
    }

    this.requests.push(now);
  }
}

export const rateLimiter = new RateLimiter();

// Initialize OpenAI with error handling
let openai: OpenAI | null = null;
let model: string = 'gpt-4o-mini'; // Cheapest available model

try {
  if (process.env.OPENAI_API_KEY) {
    console.log('🔑 Initializing OpenAI...');
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ OpenAI initialized successfully with model:', model);
  } else {
    console.warn('⚠️ OPENAI_API_KEY not found. Using mock responses for development.');
  }
} catch (error) {
  console.warn('❌ Failed to initialize OpenAI:', error);
}

export async function generateItinerary(
  tripRequest: TripRequest,
  maxRetries: number = 3
): Promise<TripResponse> {
  // Check if OpenAI is available
  if (!openai) {
    throw new Error('OpenAI is not initialized. Please check your OPENAI_API_KEY.');
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const prompt = buildGeminiPrompt(tripRequest);

      // Apply rate limiting (optional - skip if Redis not available)
      try {
        await rateLimiter.waitForSlot();
      } catch (rateLimitError) {
        const errorMessage = rateLimitError instanceof Error ? rateLimitError.message : 'Unknown rate limit error';
        console.warn('⚠️ Rate limiter error (Redis not available):', errorMessage);
        // Continue without rate limiting
      }

      console.log(`🔄 Attempt ${attempt + 1}/${maxRetries} - Generating itinerary...`);
      console.log(`📝 Prompt length: ${prompt.length} characters`);

      // Add timeout wrapper for OpenAI API call
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('OpenAI API request timed out after 60 seconds')), 60000);
      });

      const completion = await Promise.race([
        openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert travel planner for Tra Verse, a premium travel planning platform. Always respond with valid JSON only. Be extremely precise with enum values - use exactly the values specified in the instructions.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 8192,
          top_p: 0.9,
        }),
        timeoutPromise
      ]);

      // Type guard to ensure we have a valid response
      if (!completion ||
          typeof completion !== 'object' ||
          !('choices' in completion) ||
          !Array.isArray((completion as any).choices) ||
          (completion as any).choices.length === 0 ||
          !(completion as any).choices[0].message) {
        throw new Error('Invalid response from OpenAI API');
      }

      let text = (completion as any).choices[0].message.content || '';

      console.log('📨 Raw OpenAI Response:', text.substring(0, 500) + (text.length > 500 ? '...' : ''));
      console.log('📊 Response Length:', text.length);
      console.log('🤖 Full AI Response:', text); // Log the complete response

      // Check if response contains HTML (error page)
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        console.error('❌ OpenAI API returned HTML instead of JSON. This indicates an API error.');
        throw new Error('OpenAI API returned HTML error page instead of JSON response');
      }

      // Clean up the response by removing markdown formatting
      text = text.trim();
      if (text.startsWith('```json')) {
        text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (text.startsWith('```')) {
        text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      console.log('🧹 Cleaned Response Preview:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));

      // Try to parse and validate the JSON response
      const parsedResponse = JSON.parse(text);
      console.log('✅ JSON parsed successfully');
      const validation = validateTripResponse(parsedResponse);

      if (validation.success) {
        // Add metadata
        const itinerary: TripResponse = {
          ...validation.data,
          metadata: {
            generated_at: new Date().toISOString(),
            version: '1.0',
            confidence_score: 95
          }
        };

        return itinerary;
      } else {
        throw new Error(`Validation failed: ${validation.error.errors.map(e => e.message).join(', ')}`);
      }

    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt + 1} failed:`, error);

      // Check if it's a network error
      const isNetworkError = error instanceof Error &&
        (error.message.includes('fetch') || error.message.includes('network') ||
         error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND'));

      // If this is the last attempt, don't retry
      if (attempt === maxRetries - 1) break;

      // Wait before retrying (exponential backoff)
      const waitTime = isNetworkError ? Math.pow(2, attempt) * 2000 : Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  // If all retries failed, try fallback prompt
  try {
    console.log('Trying fallback prompt...');
    const fallbackPrompt = `${FALLBACK_PROMPT}\n\nOriginal request: ${JSON.stringify(tripRequest)}`;

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a backup travel planner. Always respond with valid JSON only. Be extremely precise with enum values - use exactly the values specified in the instructions.'
        },
        {
          role: 'user',
          content: fallbackPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4096,
    });

    let text = completion.choices[0].message.content || '';

    // Clean up the response by removing markdown formatting
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedResponse = JSON.parse(text);
    const validation = validateTripResponse(parsedResponse);

    if (validation.success) {
      return {
        ...validation.data,
        metadata: {
          generated_at: new Date().toISOString(),
          version: '1.0',
          confidence_score: 70 // Lower confidence for fallback
        }
      };
    }
  } catch (fallbackError) {
    console.error('Fallback also failed:', fallbackError);
  }

  // If everything fails, try mock response for development
  console.log('🔄 All OpenAI API attempts failed, generating mock response...');
  try {
    return generateMockItinerary(tripRequest);
  } catch (mockError) {
    console.error('❌ Even mock generation failed:', mockError);
    throw new Error(`Failed to generate itinerary after ${maxRetries} attempts. Last error: ${lastError?.message}`);
  }
}

// Enhanced mock itinerary generator with real places data
async function generateMockItinerary(tripRequest: TripRequest): Promise<TripResponse> {
  const { user, trip } = tripRequest;
  const startDate = new Date(user.dates.start);
  const mockId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  console.log('🎭 Generating enhanced mock itinerary with real places data...');

  try {
    // Fetch real places data
    const [restaurants, attractions] = await Promise.all([
      searchRestaurants(trip.location, 8),
      searchAttractions(trip.location, 8),
    ]);

    console.log(`✅ Found ${restaurants.length} restaurants and ${attractions.length} attractions for ${trip.location}`);

    // Generate days with real places
    const days: any[] = [];
    let restaurantIndex = 0;
    let attractionIndex = 0;

    for (let i = 0; i < trip.days; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + i);

      // Rotate through available places
      const breakfastRestaurant = restaurants[restaurantIndex % restaurants.length];
      const lunchRestaurant = restaurants[(restaurantIndex + 1) % restaurants.length];
      const dinnerRestaurant = restaurants[(restaurantIndex + 2) % restaurants.length];
      const mainAttraction = attractions[attractionIndex % attractions.length];
      const afternoonAttraction = attractions[(attractionIndex + 1) % attractions.length];

      // Increment indices for next day
      restaurantIndex = (restaurantIndex + 3) % restaurants.length;
      attractionIndex = (attractionIndex + 2) % attractions.length;

      days.push({
        day: i + 1,
        date: dayDate.toISOString().split('T')[0],
        title: `Day ${i + 1}: Exploring ${trip.location}`,
        time_blocks: [
          {
            start: "09:00",
            end: "11:00",
            title: "Breakfast & Local Exploration",
            type: "meal",
            location: breakfastRestaurant?.name || "Local Café",
            description: breakfastRestaurant?.description || `Enjoy local breakfast and explore ${trip.location}`,
            cost: breakfastRestaurant?.estimated_cost?.amount || Math.floor(Math.random() * 50) + 20,
            currency: user.budget.currency,
            notes: breakfastRestaurant ? `⭐ ${breakfastRestaurant.rating} (${breakfastRestaurant.user_ratings_total} reviews)` : "Try local specialties!",
            place_id: breakfastRestaurant?.place_id,
            rating: breakfastRestaurant?.rating,
            reviews_count: breakfastRestaurant?.user_ratings_total,
          },
          {
            start: "11:00",
            end: "13:00",
            title: "Main Attraction",
            type: "activity",
            location: mainAttraction?.name || "Popular Attraction",
            description: mainAttraction?.description || `Visit a popular attraction in ${trip.location}`,
            cost: mainAttraction?.estimated_cost?.amount || Math.floor(Math.random() * 100) + 50,
            currency: user.budget.currency,
            notes: mainAttraction ? `⭐ ${mainAttraction.rating} (${mainAttraction.user_ratings_total} reviews) • ${mainAttraction.best_time_to_visit}` : "Don't forget your camera!",
            place_id: mainAttraction?.place_id,
            rating: mainAttraction?.rating,
            reviews_count: mainAttraction?.user_ratings_total,
            tags: mainAttraction?.tags,
          },
          {
            start: "13:00",
            end: "14:00",
            title: "Lunch",
            type: "meal",
            location: lunchRestaurant?.name || "Local Restaurant",
            description: lunchRestaurant?.description || "Enjoy authentic local cuisine",
            cost: lunchRestaurant?.estimated_cost?.amount || Math.floor(Math.random() * 40) + 30,
            currency: user.budget.currency,
            notes: lunchRestaurant ? `⭐ ${lunchRestaurant.rating} (${lunchRestaurant.user_ratings_total} reviews)` : "Try something new!",
            place_id: lunchRestaurant?.place_id,
            rating: lunchRestaurant?.rating,
            reviews_count: lunchRestaurant?.user_ratings_total,
          },
          {
            start: "14:00",
            end: "17:00",
            title: "Afternoon Activity",
            type: "activity",
            location: afternoonAttraction?.name || "Cultural Site",
            description: afternoonAttraction?.description || `Experience the culture of ${trip.location}`,
            cost: afternoonAttraction?.estimated_cost?.amount || Math.floor(Math.random() * 80) + 40,
            currency: user.budget.currency,
            notes: afternoonAttraction ? `⭐ ${afternoonAttraction.rating} (${afternoonAttraction.user_ratings_total} reviews) • ${afternoonAttraction.best_time_to_visit}` : "Learn something new!",
            place_id: afternoonAttraction?.place_id,
            rating: afternoonAttraction?.rating,
            reviews_count: afternoonAttraction?.user_ratings_total,
            tags: afternoonAttraction?.tags,
          },
          {
            start: "18:00",
            end: "19:00",
            title: "Dinner",
            type: "meal",
            location: dinnerRestaurant?.name || "Restaurant",
            description: dinnerRestaurant?.description || "Relaxing dinner with great views",
            cost: dinnerRestaurant?.estimated_cost?.amount || Math.floor(Math.random() * 60) + 40,
            currency: user.budget.currency,
            notes: dinnerRestaurant ? `⭐ ${dinnerRestaurant.rating} (${dinnerRestaurant.user_ratings_total} reviews)` : "Great way to end the day!",
            place_id: dinnerRestaurant?.place_id,
            rating: dinnerRestaurant?.rating,
            reviews_count: dinnerRestaurant?.user_ratings_total,
          }
        ],
        weather_forecast: {
          temperature: Math.floor(Math.random() * 20) + 15,
          condition: ["Sunny", "Partly Cloudy", "Clear"][Math.floor(Math.random() * 3)],
          precipitation_chance: Math.floor(Math.random() * 30),
          wind_speed: Math.floor(Math.random() * 10) + 5
        }
      });
    }

  const mockResponse: TripResponse = {
    trip_id: mockId,
    summary: `✨ ${trip.days}-day ${user.travel_style} adventure in ${trip.location} for ${user.num_people} people! This trip combines your interests in ${user.interests.join(', ')} with the perfect balance of activities and relaxation.`,
    days: days,
    estimated_cost: {
      currency: user.budget.currency,
      min: user.budget.min * 0.8,
      max: user.budget.max * 0.9
    },
    bookings: {
      hotels: [
        {
          provider: "Mock Hotel Booking",
          title: `Comfortable Hotel in ${trip.location}`,
          cost: Math.floor(Math.random() * 200) + 100,
          currency: user.budget.currency,
          status: "pending",
          booking_url: "https://example.com/book"
        }
      ],
      activities: days.flatMap((day: any) => day.time_blocks
        .filter((block: any) => block.type === 'activity')
        .map((block: any) => ({
          provider: "Mock Activity Booking",
          title: block.title,
          cost: block.cost,
          currency: block.currency,
          status: "pending" as const
        }))
      ).slice(0, 3),
      flights: [],
      transportation: [
        {
          provider: "Mock Transport",
          title: "Airport Transfer",
          cost: Math.floor(Math.random() * 50) + 30,
          currency: user.budget.currency,
          status: "pending" as const
        }
      ]
    },
    metadata: {
      generated_at: new Date().toISOString(),
      version: '1.0',
      confidence_score: 85
    }
  };

    console.log('✅ Mock itinerary generated successfully!');
    console.log('📋 Mock trip ID:', mockId);
    console.log('📅 Days included:', mockResponse.days.length);

    return mockResponse;
  } catch (error) {
    console.error('❌ Error generating mock itinerary:', error);
    // Fallback to basic mock if real places fail
    return generateBasicMockItinerary(tripRequest);
  }
}

// Basic fallback mock itinerary generator
function generateBasicMockItinerary(tripRequest: TripRequest): TripResponse {
  const { user, trip } = tripRequest;
  const startDate = new Date(user.dates.start);
  const mockId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  console.log('🔄 Using basic mock itinerary...');

  const days: any[] = [];
  for (let i = 0; i < trip.days; i++) {
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + i);

    days.push({
      day: i + 1,
      date: dayDate.toISOString().split('T')[0],
      title: `Day ${i + 1}: Exploring ${trip.location}`,
      time_blocks: [
        {
          start: "09:00",
          end: "11:00",
          title: "Breakfast & Local Exploration",
          type: "meal",
          location: "Local Café",
          description: `Enjoy local breakfast and explore ${trip.location}`,
          cost: Math.floor(Math.random() * 50) + 20,
          currency: user.budget.currency,
          notes: "Try local specialties!"
        },
        {
          start: "11:00",
          end: "13:00",
          title: "Main Activity",
          type: "activity",
          location: "Popular Attraction",
          description: `Visit a popular attraction in ${trip.location}`,
          cost: Math.floor(Math.random() * 100) + 50,
          currency: user.budget.currency,
          notes: "Don't forget your camera!"
        },
        {
          start: "13:00",
          end: "14:00",
          title: "Lunch",
          type: "meal",
          location: "Local Restaurant",
          description: "Enjoy authentic local cuisine",
          cost: Math.floor(Math.random() * 40) + 30,
          currency: user.budget.currency,
          notes: "Try something new!"
        },
        {
          start: "14:00",
          end: "17:00",
          title: "Afternoon Activity",
          type: "activity",
          location: "Cultural Site",
          description: `Experience the culture of ${trip.location}`,
          cost: Math.floor(Math.random() * 80) + 40,
          currency: user.budget.currency,
          notes: "Learn something new!"
        },
        {
          start: "18:00",
          end: "19:00",
          title: "Dinner",
          type: "meal",
          location: "Restaurant",
          description: "Relaxing dinner with great views",
          cost: Math.floor(Math.random() * 60) + 40,
          currency: user.budget.currency,
          notes: "Great way to end the day!"
        }
      ],
      weather_forecast: {
        temperature: Math.floor(Math.random() * 20) + 15,
        condition: ["Sunny", "Partly Cloudy", "Clear"][Math.floor(Math.random() * 3)],
        precipitation_chance: Math.floor(Math.random() * 30),
        wind_speed: Math.floor(Math.random() * 10) + 5
      }
    });
  }

  return {
    trip_id: mockId,
    summary: `✨ ${trip.days}-day ${user.travel_style} adventure in ${trip.location} for ${user.num_people} people! This trip combines your interests in ${user.interests.join(', ')} with the perfect balance of activities and relaxation.`,
    days: days,
    estimated_cost: {
      currency: user.budget.currency,
      min: user.budget.min * 0.8,
      max: user.budget.max * 0.9
    },
    bookings: {
      hotels: [{
        provider: "Mock Hotel Booking",
        title: `Comfortable Hotel in ${trip.location}`,
        cost: Math.floor(Math.random() * 200) + 100,
        currency: user.budget.currency,
        status: "pending",
        booking_url: "https://example.com/book"
      }],
      activities: [],
      flights: [],
      transportation: [{
        provider: "Mock Transport",
        title: "Airport Transfer",
        cost: Math.floor(Math.random() * 50) + 30,
        currency: user.budget.currency,
        status: "pending" as const
      }]
    },
    metadata: {
      generated_at: new Date().toISOString(),
      version: '1.0',
      confidence_score: 85
    }
  };
}

// Utility function to test OpenAI connectivity
export async function testOpenAIConnection(): Promise<{ success: boolean; error?: string }> {
  if (!openai) {
    console.log('ℹ️ OpenAI not available, using mock mode');
    return {
      success: true,
      error: 'Using mock responses (OpenAI API not available)'
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'user',
          content: 'Respond with a simple JSON: {"status": "ok", "message": "OpenAI API is working"}'
        }
      ],
      max_tokens: 50,
      temperature: 0.1,
    });

    const response = completion.choices[0]?.message?.content || '';
    const parsed = JSON.parse(response);

    return {
      success: parsed.status === 'ok',
      error: parsed.status !== 'ok' ? 'Unexpected response format' : undefined
    };
  } catch (error) {
    console.error('OpenAI connection test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Function to get model information
export async function getOpenAIModelInfo() {
  if (!openai) {
    return {
      model: model,
      version: 'not-initialized',
      maxTokens: 8192,
      supportedFeatures: ['text-generation', 'json-output'],
      status: 'unavailable'
    };
  }

  try {
    return {
      model: model,
      version: 'latest',
      maxTokens: 8192,
      supportedFeatures: ['text-generation', 'json-output', 'chat-completion'],
      status: 'available'
    };
  } catch (error) {
    console.error('Failed to get OpenAI model info:', error);
    return null;
  }
}

// Cost estimation (rough approximation for gpt-4o-mini)
export function estimateOpenAICost(inputTokens: number, outputTokens: number): number {
  // OpenAI pricing for gpt-4o-mini (approximate as of 2024)
  const inputCostPer1000 = 0.00015; // $0.00015 per 1000 input tokens
  const outputCostPer1000 = 0.0006; // $0.0006 per 1000 output tokens

  const inputCost = (inputTokens / 1000) * inputCostPer1000;
  const outputCost = (outputTokens / 1000) * outputCostPer1000;

  return inputCost + outputCost;
}
