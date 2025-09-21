// 🌟 Creative Google Places API Test Endpoint
import { NextRequest, NextResponse } from 'next/server';
import {
  searchPlacesByMood,
  getTimeOptimizedPlaces,
  getLocationIntelligence,
  predictTravelMagic
} from '@/lib/places-service';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Creative Google Places API integration...');

    const { searchParams } = new URL(request.url);
    const testType = searchParams.get('test') || 'mood';
    const location = searchParams.get('location') || 'Mumbai, India';
    const mood = searchParams.get('mood') || 'romantic';
    const timeOfDay = searchParams.get('timeOfDay') || 'evening';
    const activity = searchParams.get('activity') || 'food';

    console.log(`🎭 Test Type: ${testType}`);
    console.log(`📍 Location: ${location}`);
    console.log(`🎨 Mood: ${mood}`);
    console.log(`⏰ Time of Day: ${timeOfDay}`);
    console.log(`🎯 Activity: ${activity}`);

    let result;

    switch (testType) {
      case 'mood':
        console.log('🎨 Testing Mood-Based Place Search...');
        result = await searchPlacesByMood(location, mood as any, {
          timeOfDay: timeOfDay as any,
          groupSize: 'couple'
        });
        break;

      case 'time':
        console.log('⏰ Testing Time-Optimized Places...');
        result = await getTimeOptimizedPlaces(location, timeOfDay as any, activity as any);
        break;

      case 'intelligence':
        console.log('🧠 Testing Location Intelligence...');
        // First get a place to test intelligence on
        const placesResult = await searchPlacesByMood(location, 'cultural');
        if (placesResult.places.length > 0) {
          result = await getLocationIntelligence(placesResult.places[0].place_id, {
            personality: 'cultural enthusiast',
            interests: ['art', 'history', 'museums'],
            travelStyle: 'educational'
          });
        } else {
          throw new Error('No places found for intelligence test');
        }
        break;

      case 'magic':
        console.log('🔮 Testing Travel Magic Prediction...');
        result = await predictTravelMagic('Mumbai, India', 'Delhi, India', {
          explorerType: 'culture_enthusiast',
          energyLevel: 'medium',
          socialPreference: 'group',
          timeAvailable: 8
        });
        break;

      default:
        console.log('🎭 Running comprehensive test...');
        result = await searchPlacesByMood(location, 'adventurous', {
          timeOfDay: 'afternoon',
          groupSize: 'family'
        });
    }

    console.log('✅ Test completed successfully!');
    console.log('📊 Result type:', typeof result);
    console.log('🎯 Has API response:', 'api_response' in result);

    // Extract key metrics for response
    const metrics = {
      testType,
      location,
      hasPlaces: 'places' in result ? result.places?.length || 0 : 0,
      hasAnalysis: 'mood_analysis' in result || 'atmosphericJourney' in result,
      hasApiResponse: 'api_response' in result,
      responseKeys: Object.keys(result)
    };

    console.log('📈 Test Metrics:', metrics);

    return NextResponse.json({
      success: true,
      data: {
        testType,
        location,
        parameters: { mood, timeOfDay, activity },
        metrics,
        result: {
          // Include key result data without overwhelming response
          placesCount: 'places' in result ? result.places?.length || 0 : 0,
          hasMoodAnalysis: 'mood_analysis' in result,
          hasTimeOptimization: 'time_optimization' in result,
          hasCreativeRecommendations: 'creative_recommendations' in result,
          hasLLMInsights: 'llm_insights' in result,
          hasCreativeContext: 'creative_context' in result,
          hasMagicalRoute: 'magicalRoute' in result,
          // Include API response status (not the full response to avoid bloat)
          apiResponseStatus: result.api_response ? 'received' : 'not_received'
        },
        // Full API response is logged to console above, not sent in response
        note: "Check server console for complete API response and LLM outputs"
      },
    });

  } catch (error) {
    console.error('❌ Creative Places API test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Creative Places API test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        note: "Check server console for detailed error information and API responses"
      },
      { status: 500 }
    );
  }
}
