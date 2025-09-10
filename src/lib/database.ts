// Database operations for Tra Verse
// Simplified mock implementation without Prisma

import { TripRequest, TripResponse, JobStatus, DBTripRequest, DBTrip } from '@/types';

// In-memory storage for development (when database is not available)
let mockTripRequests: DBTripRequest[] = [];
let mockTrips: DBTrip[] = [];

// Trip Request Operations
export async function createTripRequest(
  id: string,
  input: TripRequest,
  userId?: string
): Promise<DBTripRequest> {
  // Mock implementation
  const mockRequest: DBTripRequest = {
    id,
    user_id: userId,
    input_json: input,
    status: 'queued',
    created_at: new Date(),
    updated_at: new Date()
  };

  mockTripRequests.push(mockRequest);
  return mockRequest;
}

export async function updateTripRequestStatus(
  id: string,
  status: JobStatus,
  errorMessage?: string
): Promise<void> {
  // Mock implementation
  const index = mockTripRequests.findIndex(req => req.id === id);
  if (index !== -1) {
    mockTripRequests[index].status = status;
    mockTripRequests[index].error_message = errorMessage;
    mockTripRequests[index].updated_at = new Date();
  }
}

export async function getTripRequestStatus(id: string): Promise<DBTripRequest | null> {
  // Mock implementation
  return mockTripRequests.find(req => req.id === id) || null;
}

// Trip Operations
export async function createTrip(
  tripRequestId: string,
  result: TripResponse,
  userId?: string
): Promise<DBTrip> {
  // Mock implementation
  const mockTrip: DBTrip = {
    id: `trip-${Date.now()}`,
    trip_request_id: tripRequestId,
    result_json: result,
    estimated_cost: result.estimated_cost,
    created_at: new Date(),
    user_id: userId
  };

  mockTrips.push(mockTrip);
  return mockTrip;
}

export async function getTripById(id: string): Promise<DBTrip | null> {
  // Mock implementation
  return mockTrips.find(trip => trip.id === id) || null;
}

export async function getTripsByUserId(userId: string): Promise<DBTrip[]> {
  // Mock implementation
  return mockTrips.filter(trip => trip.user_id === userId).sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function updateTrip(
  id: string,
  updates: Partial<TripResponse>
): Promise<DBTrip> {
  // Mock implementation
  const index = mockTrips.findIndex(trip => trip.id === id);
  if (index !== -1) {
    mockTrips[index].result_json = { ...mockTrips[index].result_json, ...updates };
    return mockTrips[index];
  }

  throw new Error('Trip not found');
}

// User Operations
export async function getUserById(id: string) {
  // Mock implementation - return null for simplicity
  return null;
}

export async function createUser(data: { id: string; email?: string; name?: string }) {
  // Mock implementation
  return { id: data.id, email: data.email, name: data.name, created_at: new Date(), updated_at: new Date() };
}

// Utility functions
export async function cleanupOldTripRequests(daysOld: number = 30): Promise<void> {
  // Mock implementation - clear old mock data
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  mockTripRequests = mockTripRequests.filter(req =>
    new Date(req.created_at) >= cutoffDate ||
    !['completed', 'failed'].includes(req.status)
  );
}

export async function getTripStats(): Promise<{
  totalRequests: number;
  completedTrips: number;
  failedRequests: number;
}> {
  // Mock implementation
  return {
    totalRequests: mockTripRequests.length,
    completedTrips: mockTrips.length,
    failedRequests: mockTripRequests.filter(req => req.status === 'failed').length
  };
}
