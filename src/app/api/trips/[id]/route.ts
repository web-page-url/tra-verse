// GET /api/trips/[id] - Get completed trip itinerary
// PUT /api/trips/[id] - Update trip (regenerate)
import { NextRequest, NextResponse } from 'next/server';
import { getTripById, updateTrip } from '@/lib/database';
import { TripResponse } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tripId = params.id;

    const trip = await getTripById(tripId);

    if (!trip) {
      return NextResponse.json(
        {
          success: false,
          error: 'Trip not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: trip.result_json
    });

  } catch (error) {
    console.error('Error fetching trip:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tripId = params.id;
    const body = await request.json();

    // TODO: Validate regeneration request
    // TODO: Queue regeneration job

    return NextResponse.json({
      success: true,
      data: {
        trip_request_id: tripId,
        status: 'regenerating',
        message: 'Trip regeneration started'
      }
    });

  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
