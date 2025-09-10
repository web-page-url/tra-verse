// Gemini AI Prompt Templates for Tra Verse Travel Planning

export const SYSTEM_PROMPT = `You are an expert travel itinerary generator for Tra Verse. Your task is to create detailed, personalized travel itineraries based on user preferences.

CRITICAL REQUIREMENTS:
1. Always respond with VALID JSON only - no markdown, no explanations, no additional text
2. Follow the exact JSON schema provided
3. Create realistic, practical itineraries with accurate time blocks
4. Include specific locations, costs, and booking information where applicable
5. Consider weather, local events, and user constraints
6. Ensure time blocks don't overlap and allow buffer time between activities
7. Provide cost estimates in the user's currency
8. Include alternative options for key activities

OUTPUT FORMAT: JSON object with keys: trip_id, summary, days, estimated_cost, bookings
Each day must have: day, date, title, time_blocks array
Each time_block must have: start, end, title, type, location, cost (optional), notes (optional)`;

export const EXAMPLE_OUTPUT = {
  trip_id: "trip-9876",
  summary: "4-day relaxed adventure in Manali focusing on hikes, local cuisine and photography",
  days: [
    {
      day: 1,
      date: "2025-10-12",
      title: "Arrival & Local Exploration",
      time_blocks: [
        {
          start: "14:00",
          end: "16:00",
          title: "Check-in at boutique hotel",
          type: "logistics",
          location: "The Mountain Hideout, Manali",
          cost: 0,
          notes: "Light lunch provided, mountain views available"
        },
        {
          start: "16:30",
          end: "19:00",
          title: "Mall Road photography walk",
          type: "activity",
          location: "Mall Road, Manali",
          cost: 0,
          notes: "Golden hour photography opportunity"
        }
      ]
    }
  ],
  estimated_cost: {
    currency: "INR",
    total: 42000
  },
  bookings: {
    hotels: [],
    activities: [],
    flights: []
  }
};

export function buildGeminiPrompt(tripRequest: any): string {
  const { user, trip, context } = tripRequest;

  return `
${SYSTEM_PROMPT}

USER REQUEST DETAILS:
${JSON.stringify(tripRequest, null, 2)}

EXAMPLE OUTPUT FORMAT:
${JSON.stringify(EXAMPLE_OUTPUT, null, 2)}

Generate a comprehensive ${trip.days}-day itinerary for ${user.num_people} people traveling to ${trip.location} from ${user.dates.start} to ${user.dates.end}.

Requirements:
- Travel style: ${user.travel_style}
- Interests: ${user.interests.join(', ')}
- Budget: ${user.budget.currency} ${user.budget.min} - ${user.budget.max}
- Preferences: ${JSON.stringify(trip.preferences)}
- Consider ${context?.time_zone || 'local'} timezone
- Include realistic costs and practical time blocks
- Add buffer time between activities
- Suggest booking-ready activities where applicable

Respond with JSON only.`;
}

export const FALLBACK_PROMPT = `If the previous generation failed, please create a simpler itinerary with the same structure but fewer activities. Focus on essential logistics and 2-3 key activities per day. Respond with JSON only.`;

export function buildRetryPrompt(originalRequest: any, previousOutput: string, error: string): string {
  return `
${SYSTEM_PROMPT}

Original Request:
${JSON.stringify(originalRequest, null, 2)}

Previous Output (which had errors):
${previousOutput}

Error: ${error}

Please fix the JSON structure and provide a valid itinerary. Ensure all required fields are present and properly formatted. Respond with JSON only.`;
}
