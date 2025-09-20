// Simple test script for Foursquare Places API integration
// Run with: node test-foursquare.js

require('dotenv').config({ path: '.env.local' });

async function testFoursquare() {
  console.log('🚀 Testing Foursquare Places API Integration...\n');

  // Check environment variables
  const fsqApiKey = process.env.FSQ_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  console.log('📋 Environment Variables:');
  console.log(`FSQ_API_KEY: ${fsqApiKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`OPENAI_API_KEY: ${openaiApiKey ? '✅ Set' : '❌ Missing'}\n`);

  if (!fsqApiKey) {
    console.log('❌ FSQ_API_KEY not found. Please add it to .env.local');
    console.log('Get your key from: https://developer.foursquare.com/\n');
    return;
  }

  // Test Foursquare API
  try {
    console.log('🔍 Testing Foursquare Places API...');

    const url = `https://api.foursquare.com/v3/places/search?query=restaurant&near=Delhi&limit=2`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': fsqApiKey
      }
    });

    console.log(`📊 Response Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Foursquare API working!');
      console.log(`📍 Found ${data.results?.length || 0} places`);
      if (data.results && data.results.length > 0) {
        console.log(`🏪 First result: ${data.results[0].name}`);
        console.log(`📍 Location: ${data.results[0].location?.formatted_address || 'Address not available'}`);
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Foursquare API error:', errorText);
    }
  } catch (error) {
    console.error('❌ Foursquare API test failed:', error.message);
  }

  console.log('\n📚 Next Steps:');
  console.log('1. Make sure FSQ_API_KEY is set in .env.local');
  console.log('2. Make sure OPENAI_API_KEY is set in .env.local');
  console.log('3. Restart your Next.js server: npm run dev');
  console.log('4. Test trip generation at http://localhost:3000/plan');
  console.log('5. Check API test endpoint: http://localhost:3000/api/test-apis\n');
}

testFoursquare().catch(console.error);
