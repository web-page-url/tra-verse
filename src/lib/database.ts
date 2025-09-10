// Database operations for Tra Verse
// Using Prisma for type-safe database operations

import { PrismaClient } from '@prisma/client';
import { TripRequest, TripResponse, JobStatus, DBTripRequest, DBTrip } from '@/types';

const prisma = new PrismaClient();

// Trip Request Operations
export async function createTripRequest(
  id: string,
  input: TripRequest,
  userId?: string
): Promise<DBTripRequest> {
  return await prisma.tripRequest.create({
    data: {
      id,
      user_id: userId,
      input_json: input,
      status: 'queued'
    }
  });
}

export async function updateTripRequestStatus(
  id: string,
  status: JobStatus,
  errorMessage?: string
): Promise<void> {
  await prisma.tripRequest.update({
    where: { id },
    data: {
      status,
      error_message: errorMessage,
      updated_at: new Date()
    }
  });
}

export async function getTripRequestStatus(id: string): Promise<DBTripRequest | null> {
  return await prisma.tripRequest.findUnique({
    where: { id }
  });
}

// Trip Operations
export async function createTrip(
  tripRequestId: string,
  result: TripResponse,
  userId?: string
): Promise<DBTrip> {
  return await prisma.trip.create({
    data: {
      trip_request_id: tripRequestId,
      result_json: result,
      estimated_cost: result.estimated_cost,
      user_id: userId
    }
  });
}

export async function getTripById(id: string): Promise<DBTrip | null> {
  return await prisma.trip.findUnique({
    where: { id }
  });
}

export async function getTripsByUserId(userId: string): Promise<DBTrip[]> {
  return await prisma.trip.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' }
  });
}

// User Operations
export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id }
  });
}

export async function createUser(data: { id: string; email?: string; name?: string }) {
  return await prisma.user.create({
    data
  });
}

// Utility functions
export async function cleanupOldTripRequests(daysOld: number = 30): Promise<void> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  await prisma.tripRequest.deleteMany({
    where: {
      created_at: { lt: cutoffDate },
      status: { in: ['completed', 'failed'] }
    }
  });
}

export async function getTripStats(): Promise<{
  totalRequests: number;
  completedTrips: number;
  failedRequests: number;
}> {
  const [totalRequests, completedTrips, failedRequests] = await Promise.all([
    prisma.tripRequest.count(),
    prisma.trip.count(),
    prisma.tripRequest.count({ where: { status: 'failed' } })
  ]);

  return {
    totalRequests,
    completedTrips,
    failedRequests
  };
}
