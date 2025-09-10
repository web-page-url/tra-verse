// Simple test script for Gemini API integration
// Run with: node test-gemini.js

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

async function testGemini() {
  try {
    console.log('🚀 Testing Gemini API Integration...\n');

    // Check API key
    const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    console.log('📋 Environment Check:');
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey?.length || 0);
    console.log('API Key prefix:', apiKey?.substring(0, 10) || 'N/A');
    console.log();

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in .env.local or environment variables');
    }

    // Initialize Gemini
    console.log('🔧 Initializing Gemini...');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✅ Gemini initialized successfully\n');

    // Test basic connectivity
    console.log('📡 Testing basic connectivity...');
    const testPrompt = 'Respond with a simple JSON: {"status": "ok", "message": "Gemini API is working", "timestamp": "' + new Date().toISOString() + '"}';
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();

    console.log('📨 Raw Response:', text);

    // Clean up the response by removing markdown formatting
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    console.log('🧹 Cleaned Response:', cleanText);

    const parsed = JSON.parse(cleanText);
    console.log('✅ Parsed Response:', parsed);
    console.log();

    if (parsed.status === 'ok') {
      console.log('🎉 Gemini API test PASSED!');
      console.log('Message:', parsed.message);
    } else {
      console.log('⚠️  Gemini API test completed with unexpected response');
    }

    console.log('\n🎯 Test completed successfully!');

  } catch (error) {
    console.error('❌ Gemini API test FAILED:');
    console.error('Error:', error.message);

    if (error.message.includes('API_KEY')) {
      console.log('\n💡 Suggestion: Check your GEMINI_API_KEY in .env.local');
    } else if (error.message.includes('fetch')) {
      console.log('\n💡 Suggestion: Check your internet connection or API quota');
    } else if (error.message.includes('PERMISSION')) {
      console.log('\n💡 Suggestion: Verify your API key has the correct permissions');
    }

    process.exit(1);
  }
}

// Run the test
testGemini();
