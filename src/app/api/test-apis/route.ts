// Test endpoint to verify both OpenAI and Google Maps API keys
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET(request: NextRequest) {
  const results: any = {
    openai: { status: 'unknown', error: null },
    googleMaps: { status: 'unknown', error: null },
    environment: process.env.NODE_ENV
  };

  // Test OpenAI API
  try {
    if (!process.env.OPENAI_API_KEY) {
      results.openai = { status: 'failed', error: 'OPENAI_API_KEY not found in environment' };
    } else {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say "API working" in 5 words or less.' }],
        max_tokens: 10,
        temperature: 0.1,
      });

      results.openai = {
        status: 'success',
        response: completion.choices[0]?.message?.content?.trim()
      };
    }
  } catch (error: any) {
    results.openai = {
      status: 'failed',
      error: error.message || 'Unknown OpenAI error'
    };
  }

  // Test Foursquare Places API
  try {
    if (!process.env.FSQ_API_KEY) {
      results.googleMaps = { status: 'failed', error: 'FSQ_API_KEY not found in environment' };
    } else {
      // Test Foursquare search
      const apiKey = process.env.FSQ_API_KEY;
      const url = `https://api.foursquare.com/v3/places/search?query=restaurant&near=Delhi&limit=1`;

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': apiKey
        }
      });

      if (response.ok) {
        const data = await response.json();
        results.googleMaps = {
          status: 'success',
          location: data.results?.[0]?.name || 'Foursquare API working'
        };
      } else {
        results.googleMaps = {
          status: 'failed',
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    }
  } catch (error: any) {
    results.googleMaps = {
      status: 'failed',
      error: error.message || 'Unknown Foursquare error'
    };
  }

  const allWorking = results.openai.status === 'success' && results.googleMaps.status === 'success';

  return NextResponse.json({
    success: allWorking,
    message: allWorking ? 'All APIs working!' : 'Some APIs failed - check results',
    results,
    timestamp: new Date().toISOString()
  });
}
