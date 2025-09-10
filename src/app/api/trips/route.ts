// POST /api/trips - Create new trip request
import { NextRequest, NextResponse } from 'next/server';
import { validateTripRequest } from '@/lib/validation';
import { TripRequest } from '@/types';
import { queueTripGeneration } from '@/lib/job-queue';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 API /trips: Received new trip request');
    const body = await request.json();
    console.log('📋 API /trips: Request body received:', JSON.stringify(body, null, 2));

    // Validate request
    console.log('🔍 API /trips: Validating request...');
    const validation = validateTripRequest(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.errors
        },
        { status: 400 }
      );
    }

    const tripRequest: TripRequest = validation.data;

    // Generate unique ID for this trip request
    const tripRequestId = `trip_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('🆔 API /trips: Generated trip request ID:', tripRequestId);

    // Queue the job for processing
    console.log('⚙️ API /trips: Queueing trip generation job...');
    const queueResult = await queueTripGeneration(tripRequestId, tripRequest);
    console.log('✅ API /trips: Trip generation job queued/processed');

    // Check if we got a synchronous result (when Redis is not available)
    if (queueResult && queueResult.success) {
      console.log('📤 API /trips: Returning synchronous result');
      return NextResponse.json({
        success: true,
        data: {
          trip_request_id: tripRequestId,
          status: 'completed',
          itinerary: queueResult.itinerary,
          message: 'Trip generated successfully!'
        }
      });
    }

    // Default response for async processing (Redis available) or fallback
    console.log('📤 API /trips: Sending async response');
    return NextResponse.json({
      success: true,
      data: {
        trip_request_id: tripRequestId,
        status: 'queued',
        message: 'Trip generation started. Check status endpoint for updates.'
      }
    });

  } catch (error) {
    console.error('❌ API /trips: Error creating trip request:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to create trip request'
      },
      { status: 500 }
    );
  }
}

// GET /api/trips - Get user's trip history (placeholder)
export async function GET() {
  // TODO: Implement with authentication
  return NextResponse.json({
    success: true,
    data: [],
    message: 'Trip history endpoint - authentication required'
  });
}
