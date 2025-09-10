// Job queue implementation using BullMQ and Redis
import { Queue, Worker, Job } from 'bullmq';
import { generateItinerary } from './gemini-service';
import { createTrip, updateTripRequestStatus } from './database';
import { TripRequest } from '@/types';

// Redis connection configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD
};

// Create queue for trip generation
const tripQueue = new Queue('trip-generation', {
  connection: redisConfig,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  }
});

// Worker to process trip generation jobs
const tripWorker = new Worker('trip-generation',
  async (job: Job) => {
    const { tripRequestId, tripRequest }: { tripRequestId: string; tripRequest: TripRequest } = job.data;

    try {
      // Update status to processing
      await updateTripRequestStatus(tripRequestId, 'processing');

      // Generate itinerary using Gemini
      const itinerary = await generateItinerary(tripRequest);

      // Store the result
      await createTrip(tripRequestId, itinerary);

      // Update status to completed
      await updateTripRequestStatus(tripRequestId, 'completed');

      return itinerary;

    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);

      // Update status to failed
      await updateTripRequestStatus(
        tripRequestId,
        'failed',
        error instanceof Error ? error.message : 'Unknown error'
      );

      throw error;
    }
  },
  {
    connection: redisConfig,
    concurrency: 5, // Process up to 5 jobs simultaneously
    limiter: {
      max: 10,
      duration: 1000 // Max 10 jobs per second
    }
  }
);

// Event handlers for monitoring
tripWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

tripWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});

tripWorker.on('stalled', (jobId) => {
  console.warn(`Job ${jobId} stalled`);
});

// Queue management functions
export async function queueTripGeneration(
  tripRequestId: string,
  tripRequest: TripRequest
): Promise<void> {
  await tripQueue.add('generate-itinerary', {
    tripRequestId,
    tripRequest
  });
}

export async function getJobStatus(jobId: string) {
  const job = await tripQueue.getJob(jobId);
  return job ? await job.getState() : null;
}

export async function getQueueStats() {
  const [waiting, active, completed, failed] = await Promise.all([
    tripQueue.getWaiting(),
    tripQueue.getActive(),
    tripQueue.getCompleted(),
    tripQueue.getFailed()
  ]);

  return {
    waiting: waiting.length,
    active: active.length,
    completed: completed.length,
    failed: failed.length
  };
}

// Cleanup function
export async function cleanupCompletedJobs(): Promise<void> {
  await tripQueue.clean(24 * 60 * 60 * 1000, 100); // Clean jobs older than 24 hours
}

// Graceful shutdown
export async function closeQueue(): Promise<void> {
  await tripQueue.close();
  await tripWorker.close();
}

// Export queue instance for monitoring
export { tripQueue, tripWorker };
