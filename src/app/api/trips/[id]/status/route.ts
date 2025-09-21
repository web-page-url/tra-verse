// GET /api/trips/[id]/status - Check trip generation status
import { NextRequest, NextResponse } from 'next/server';
import { getTripRequestStatus } from '@/lib/database';
import { JobStatus } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripRequestId } = await params;

    const status = await getTripRequestStatus(tripRequestId);

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Trip request not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {  
        trip_request_id: tripRequestId,
        status: status.status,
        progress: 0, // Mock progress for now
        estimated_completion: null, // Mock estimated completion
        error_message: status.error_message,
        created_at: status.created_at
      }
    });

  } catch (error) {
    console.error('Error fetching trip status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
