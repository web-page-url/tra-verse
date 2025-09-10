// Simple test endpoint to verify API functionality
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Simple test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Simple test failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}