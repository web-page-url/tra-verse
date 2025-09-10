// Test script for full trip generation workflow
// Run with: node test-trip.js

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

// Read .env.local file manually
function loadEnv() {
  try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const envVars = {};

    envFile.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });

    return envVars;
  } catch (error) {
    return {};
  }
}

const env = loadEnv();

// Sample trip request for testing
const sampleTripRequest = {
  user: {
    id: "test-user-123",
    travel_style: "adventure",
    interests: ["hiking", "photography", "local-culture"],
    num_people: 2,
    budget: {
      currency: "INR",
      min: 20000,
      max: 50000
    },
    dates: {
      start: "2025-10-15",
      end: "2025-10-20"
    }
  },
  trip: {
    location: "Manali, India",
    days: 5,
    preferences: {
      pacing: "moderate",
      transport: "private-car",
      accommodation: "boutique-hotel"
    }
  },
  context: {
    weather_api: true,
    local_events_api: true,
    time_zone: "Asia/Kolkata"
  }
};

async function testTripGeneration() {
  try {
    console.log('🚀 Testing Full Trip Generation Workflow...\n');

    // Check API key
    const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found');
    }

    console.log('🔧 Initializing Gemini...');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });
    console.log('✅ Gemini initialized successfully\n');

    // Build the prompt
    console.log('📝 Building trip generation prompt...');
    const prompt = buildTripPrompt(sampleTripRequest);
    console.log('✅ Prompt built successfully\n');

    // Generate the itinerary
    console.log('🎯 Generating itinerary...');
    console.log('This may take a few seconds...\n');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response
    console.log('🧹 Cleaning response...');
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    console.log('📨 Raw Response Length:', text.length);
    console.log('📨 Response Preview:', text.substring(0, 200) + '...');
    console.log();

    // Parse and validate
    console.log('🔍 Parsing JSON response...');
    const parsedResponse = JSON.parse(text);
    console.log('✅ JSON parsed successfully');

    // Basic validation
    const isValid = validateBasicStructure(parsedResponse);
    console.log('✅ Basic validation:', isValid ? 'PASSED' : 'FAILED');

    if (isValid) {
      console.log('\n📊 Trip Generation Results:');
      console.log('Trip ID:', parsedResponse.trip_id);
      console.log('Summary:', parsedResponse.summary);
      console.log('Number of days:', parsedResponse.days?.length || 0);
      console.log('Estimated cost:', parsedResponse.estimated_cost);
      console.log('Bookings available:', !!parsedResponse.bookings);
    }

    console.log('\n🎉 Trip generation test COMPLETED successfully!');
    console.log('The Gemini API integration is working perfectly for Tra Verse!');

  } catch (error) {
    console.error('❌ Trip generation test FAILED:');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Check your API key is valid');
    console.error('2. Ensure you have sufficient API quota');
    console.error('3. Verify the prompt format is correct');
    process.exit(1);
  }
}

function buildTripPrompt(tripRequest) {
  const { user, trip, context } = tripRequest;

  return `You are an expert travel itinerary generator for Tra Verse. Your task is to create detailed, personalized travel itineraries based on user preferences.

CRITICAL REQUIREMENTS:
1. Always respond with VALID JSON only - no markdown, no explanations, no additional text
2. Follow the exact JSON schema provided
3. Create realistic, practical itineraries with accurate time blocks
4. Include specific locations, costs, and booking information where applicable
5. Consider weather, local events, and user constraints
6. Ensure time blocks don't overlap and allow buffer time between activities
7. Provide cost estimates in the user's currency
8. Include alternative options for key activities

REQUIRED JSON SCHEMA:
{
  "trip_id": "unique-string",
  "summary": "brief trip description",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Day title",
      "time_blocks": [
        {
          "start": "HH:MM",
          "end": "HH:MM",
          "title": "Activity title",
          "type": "activity|logistics|meal|transport",
          "location": "Specific location name",
          "cost": 0,
          "notes": "Optional notes"
        }
      ]
    }
  ],
  "estimated_cost": {
    "currency": "USD|INR|EUR",
    "total": 10000
  },
  "bookings": {
    "hotels": [],
    "activities": [],
    "flights": []
  }
}

USER REQUEST DETAILS:
${JSON.stringify(tripRequest, null, 2)}

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

function validateBasicStructure(response) {
  try {
    // Check required top-level fields
    if (!response.trip_id || !response.summary || !response.days || !response.estimated_cost || !response.bookings) {
      return false;
    }

    // Check days array
    if (!Array.isArray(response.days) || response.days.length === 0) {
      return false;
    }

    // Check first day structure
    const firstDay = response.days[0];
    if (!firstDay.day || !firstDay.date || !firstDay.title || !firstDay.time_blocks) {
      return false;
    }

    // Check time blocks
    if (!Array.isArray(firstDay.time_blocks) || firstDay.time_blocks.length === 0) {
      return false;
    }

    // Check first time block
    const firstBlock = firstDay.time_blocks[0];
    if (!firstBlock.start || !firstBlock.end || !firstBlock.title || !firstBlock.type || !firstBlock.location) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

// Run the test
testTripGeneration();
