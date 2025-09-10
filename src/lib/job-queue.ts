// Simplified synchronous job processing without Redis
import { generateItinerary } from './gemini-service';
import { createTrip, updateTripRequestStatus } from './database';
import { TripRequest } from '@/types';

// Queue management functions
export async function queueTripGeneration(
  tripRequestId: string,
  tripRequest: TripRequest
): Promise<{ success: boolean; tripRequestId: string; itinerary: any }> {
  console.log('🔄 Processing trip synchronously for:', tripRequestId);
  try {
    console.log('🔄 Step 1: Updating status to processing...');
    await updateTripRequestStatus(tripRequestId, 'processing');
    console.log('✅ Step 1 completed - Status updated to processing');

    console.log('🔄 Step 2: Starting itinerary generation...');
    console.log('📝 Trip request details:', JSON.stringify(tripRequest, null, 2));

    const itinerary = await generateItinerary(tripRequest);
    console.log('✅ Step 2 completed - Itinerary generated successfully');
    console.log('📋 Generated itinerary summary:', {
      trip_id: itinerary.trip_id,
      summary: itinerary.summary?.substring(0, 100) + '...',
      days: itinerary.days?.length || 0
    });

    console.log('🔄 Step 3: Saving trip to database...');
    const tripResult = await createTrip(tripRequestId, itinerary);
    console.log('✅ Step 3 completed - Trip saved to database');
    console.log('🗃️ Trip saved with ID:', tripResult.id);

    console.log('🔄 Step 4: Updating status to completed...');
    await updateTripRequestStatus(tripRequestId, 'completed');
    console.log('✅ Step 4 completed - Status updated to completed');

    console.log('🎉 SUCCESS: Trip generation completed successfully');
    console.log('📊 Final result:', { tripRequestId, tripId: itinerary.trip_id });

    return {
      success: true,
      tripRequestId,
      itinerary
    };
  } catch (error) {
    console.error('❌ CRITICAL ERROR: Trip generation failed');
    console.error('❌ Error type:', typeof error);
    console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('❌ Full error object:', error);

    try {
      await updateTripRequestStatus(
        tripRequestId,
        'failed',
        error instanceof Error ? error.message : 'Unknown error'
      );
      console.log('✅ Error status updated in database');
    } catch (dbError) {
      console.error('❌ Failed to update error status in database:', dbError);
    }

    throw error;
  }
}

// Simplified status checking for synchronous processing
export async function getJobStatus(jobId: string) {
  console.log('ℹ️ Job status check - all jobs processed synchronously');
  return 'completed'; // Since we process synchronously, jobs are always completed or failed
}

export async function getQueueStats() {
  console.log('ℹ️ Queue stats - synchronous processing, no queue');
  return {
    waiting: 0,
    active: 0,
    completed: 0,
    failed: 0
  };
}

// Cleanup function - not needed for synchronous processing
export async function cleanupCompletedJobs(): Promise<void> {
  console.log('ℹ️ Cleanup not needed - synchronous processing');
}

// Graceful shutdown - not needed for synchronous processing
export async function closeQueue(): Promise<void> {
  console.log('ℹ️ No queue to close - synchronous processing');
}
