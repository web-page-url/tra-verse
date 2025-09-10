// POST /api/trips - Create new trip request
import { NextRequest, NextResponse } from 'next/server';
import { validateTripRequest } from '@/lib/validation';
import { TripRequest } from '@/types';
import { queueTripGeneration } from '@/lib/job-queue';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
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

    // Queue the job for processing
    await queueTripGeneration(tripRequestId, tripRequest);

    return NextResponse.json({
      success: true,
      data: {
        trip_request_id: tripRequestId,
        status: 'queued',
        message: 'Trip generation started. Check status endpoint for updates.'
      }
    });

  } catch (error) {
    console.error('Error creating trip request:', error);
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
