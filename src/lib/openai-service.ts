// OpenAI Service Integration for Tra Verse Travel Planning
import OpenAI from 'openai';
import { buildGeminiPrompt, buildRetryPrompt, FALLBACK_PROMPT } from './gemini-prompts';
import { validateTripResponse } from './validation';
import { TripRequest, TripResponse } from '@/types';
import { searchPlacesByMood } from './places-service';

// Google Maps API Key from environment
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

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

// Location validation function to ensure accuracy
async function validateAndCorrectLocations(tripResponse: any, requestedLocation: string): Promise<any> {
  console.log('🔍 Validating location accuracy for:', requestedLocation);

  // Extract city name from requested location (e.g., "Manali, Himachal Pradesh" -> "Manali")
  const cityName = requestedLocation.split(',')[0].trim();

  // Extract all unique locations from the itinerary
  const locations = new Set<string>();
  tripResponse.days.forEach((day: any) => {
    day.time_blocks.forEach((block: any) => {
      if (block.location && block.location.trim()) {
        locations.add(block.location.trim());
      }
    });
  });

  console.log('📍 Locations found in itinerary:', Array.from(locations));

  // For now, we'll do basic validation - in production, you might want to:
  // 1. Use Google Places API to verify locations exist
  // 2. Check if locations are in the correct geographic area
  // 3. Use a location database for validation

  // Basic checks for common issues
  const correctedBlocks = tripResponse.days.map((day: any) => ({
    ...day,
    time_blocks: day.time_blocks.map((block: any) => {
      let correctedLocation = block.location;

      // Fix common generic names with more specific alternatives
      if (block.location === 'Local Restaurant' || block.location === 'Restaurant') {
        correctedLocation = `${cityName} Specialty Restaurant`;
      }
      if (block.location === 'Local Cafe' || block.location === 'Cafe') {
        correctedLocation = `${cityName} Coffee House`;
      }
      if (block.location === 'Hotel Restaurant') {
        correctedLocation = `${cityName} Hotel Dining`;
      }
      if (block.location === 'Popular Attraction' || block.location === 'Attraction') {
        correctedLocation = `${cityName} Main Landmark`;
      }

      // CRITICAL: Ensure every location includes the city name for Google Maps accuracy
      if (correctedLocation && !correctedLocation.includes(cityName)) {
        // If the location doesn't contain the city name, append it
        correctedLocation = `${correctedLocation}, ${cityName}`;
        console.log(`📍 Added city name: "${block.location}" → "${correctedLocation}"`);
      }

      return {
        ...block,
        location: correctedLocation
      };
    })
  }));

  return {
    ...tripResponse,
    days: correctedBlocks
  };
}

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
              content: 'You are an expert travel planner for Tra Verse, a premium travel planning platform. Always respond with valid JSON only. Be extremely precise with enum values - use exactly the values specified in the instructions. CRITICAL: ALL location names MUST be REAL, EXISTING places in the requested destination. NEVER use generic names like "Local Restaurant" or "Popular Cafe". Research and use ACTUAL business names and landmarks that exist in the specified location. NEVER suggest places from different countries/cities than requested. MOST IMPORTANT: EVERY location name MUST include the FULL ADDRESS with CITY NAME in format "Place Name, City Name" (e.g., "The Corner House, Manali" or "India Gate, Delhi"). This ensures Google Maps can accurately locate each place in the correct city.'
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

      console.log('🚀 ========== OPENAI API RESPONSE ==========');
      console.log('📊 Response Length:', text.length, 'characters');
      console.log('📋 Response Preview (first 500 chars):', text.substring(0, 500) + (text.length > 500 ? '...' : ''));

      // Check if response starts with JSON or markdown
      const isJsonStart = text.trim().startsWith('{') || text.trim().startsWith('[');
      const isMarkdownStart = text.trim().startsWith('```');
      console.log('📝 Response Format:', isJsonStart ? 'JSON' : isMarkdownStart ? 'Markdown' : 'Other');
      console.log('🔍 Is JSON Format:', isJsonStart ? '✅ YES' : '❌ NO');

      console.log('🤖 FULL AI RESPONSE BELOW:');
      console.log('=====================================');
      console.log(text);
      console.log('=====================================');
      console.log('🚀 ========== END RESPONSE ==========');

      // Log the complete response for debugging
      console.log('🔧 Raw OpenAI Response for debugging:', text);

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
        let itinerary: TripResponse = {
          ...validation.data,
          metadata: {
            generated_at: new Date().toISOString(),
            version: '1.0',
            confidence_score: 95
          }
        };

        // Validate and correct location accuracy
        console.log('🔍 Running location validation and correction...');
        itinerary = await validateAndCorrectLocations(itinerary, tripRequest.trip.location);
        console.log('✅ Location validation completed');

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

  // If everything fails, throw error - no mock data allowed
  console.error('❌ All OpenAI API attempts failed - no mock data will be generated');
  throw new Error(`Failed to generate itinerary after ${maxRetries} attempts. Last error: ${lastError?.message}. Please check your OpenAI API key and try again.`);
}

// OpenAI connection test function
export async function testOpenAIConnection(): Promise<{ success: boolean; error?: string; model?: string }> {
  if (!openai) {
    return {
      success: false,
      error: 'OpenAI not initialized'
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 5,
    });

    return {
      success: true,
      model: model
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
  // gpt-4o-mini pricing: $0.150 / 1M input tokens, $0.600 / 1M output tokens
  const inputCost = (inputTokens / 1000000) * 0.150;
  const outputCost = (outputTokens / 1000000) * 0.600;
  return inputCost + outputCost;
}