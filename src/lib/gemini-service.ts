// Gemini AI Service Integration for Tra Verse
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildGeminiPrompt, buildRetryPrompt, FALLBACK_PROMPT } from './gemini-prompts';
import { validateTripResponse } from './validation';
import { TripRequest, TripResponse } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: 'gemini-pro',
  generationConfig: {
    temperature: 0.2,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  },
});

export async function generateItinerary(
  tripRequest: TripRequest,
  maxRetries: number = 3
): Promise<TripResponse> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const prompt = buildGeminiPrompt(tripRequest);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to parse and validate the JSON response
      const parsedResponse = JSON.parse(text);
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

      // If this is the last attempt, don't retry
      if (attempt === maxRetries - 1) break;

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  // If all retries failed, try fallback prompt
  try {
    console.log('Trying fallback prompt...');
    const fallbackPrompt = `${FALLBACK_PROMPT}\n\nOriginal request: ${JSON.stringify(tripRequest)}`;

    const result = await model.generateContent(fallbackPrompt);
    const response = await result.response;
    const text = response.text();

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

  // If everything fails, throw the last error
  throw new Error(`Failed to generate itinerary after ${maxRetries} attempts. Last error: ${lastError?.message}`);
}

// Utility function to test Gemini connectivity
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const testPrompt = "Respond with a simple JSON: {\"status\": \"ok\"}";
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();

    const parsed = JSON.parse(text);
    return parsed.status === 'ok';
  } catch (error) {
    console.error('Gemini connection test failed:', error);
    return false;
  }
}

// Function to get model information
export async function getModelInfo() {
  try {
    // This would typically call a Gemini API endpoint for model info
    return {
      model: 'gemini-pro',
      version: 'latest',
      maxTokens: 8192,
      supportedFeatures: ['text-generation', 'json-output']
    };
  } catch (error) {
    console.error('Failed to get model info:', error);
    return null;
  }
}

// Cost estimation (rough approximation)
export function estimateGeminiCost(inputTokens: number, outputTokens: number): number {
  // Gemini pricing (approximate as of 2024)
  const inputCostPer1000 = 0.00025; // $0.00025 per 1000 input tokens
  const outputCostPer1000 = 0.0005; // $0.0005 per 1000 output tokens

  const inputCost = (inputTokens / 1000) * inputCostPer1000;
  const outputCost = (outputTokens / 1000) * outputCostPer1000;

  return inputCost + outputCost;
}

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
      return this.waitForSlot(); // Recursively check again
    }

    this.requests.push(now);
  }
}

export const rateLimiter = new RateLimiter();
