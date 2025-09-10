// Validation schemas for Tra Verse using Zod

import { z } from 'zod';

// Core validation schemas
export const BudgetRangeSchema = z.object({
  currency: z.string().min(1),
  min: z.number().positive(),
  max: z.number().positive()
}).refine(data => data.max >= data.min, {
  message: "Maximum budget must be greater than minimum"
});

export const TripPreferencesSchema = z.object({
  pacing: z.enum(['relaxed', 'moderate', 'intense']).optional(),
  transport: z.enum(['public', 'private-car', 'walking', 'mixed']).optional(),
  avoid: z.array(z.string()).optional(),
  accommodation_type: z.enum(['budget', 'mid-range', 'luxury', 'boutique']).optional()
});

export const TripConstraintsSchema = z.object({
  max_travel_hours_per_day: z.number().positive().optional(),
  max_walking_distance: z.number().positive().optional(),
  dietary_restrictions: z.array(z.string()).optional(),
  accommodation_requirements: z.array(z.string()).optional()
});

// Input validation schema
export const TripRequestSchema = z.object({
  user: z.object({
    id: z.string().min(1),
    travel_style: z.enum(['adventure', 'relaxed', 'family', 'romantic', 'cultural', 'luxury']),
    interests: z.array(z.string()).min(1),
    num_people: z.number().int().positive(),
    budget: BudgetRangeSchema,
    dates: z.object({
      start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
    })
  }),
  trip: z.object({
    location: z.string().min(1),
    days: z.number().int().positive().max(30),
    preferences: TripPreferencesSchema,
    constraints: TripConstraintsSchema.optional()
  }),
  context: z.object({
    weather_api: z.boolean().optional(),
    local_events_api: z.boolean().optional(),
    time_zone: z.string().optional()
  }).optional()
});

// Output validation schema
export const TimeBlockSchema = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
  title: z.string().min(1),
  type: z.enum(['activity', 'logistics', 'meal', 'transport', 'free-time']),
  location: z.string().min(1),
  description: z.string().optional(),
  cost: z.number().optional(),
  currency: z.string().optional(),
  notes: z.string().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  booking_required: z.boolean().optional(),
  alternatives: z.array(z.object({
    title: z.string().min(1),
    location: z.string().min(1),
    cost: z.number().optional()
  })).optional()
});

export const DayItinerarySchema = z.object({
  day: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().min(1),
  time_blocks: z.array(TimeBlockSchema).min(1),
  weather_forecast: z.object({
    temperature: z.number(),
    condition: z.string(),
    precipitation_chance: z.number().min(0).max(100),
    wind_speed: z.number().optional()
  }).optional(),
  notes: z.string().optional()
});

export const BookingItemSchema = z.object({
  id: z.string().optional(),
  provider: z.string(),
  title: z.string(),
  cost: z.number(),
  currency: z.string(),
  booking_url: z.string().url().optional(),
  confirmation_code: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled'])
});

export const TripResponseSchema = z.object({
  trip_id: z.string().min(1),
  summary: z.string().min(10),
  days: z.array(DayItinerarySchema).min(1),
  estimated_cost: BudgetRangeSchema,
  bookings: z.object({
    hotels: z.array(BookingItemSchema),
    activities: z.array(BookingItemSchema),
    flights: z.array(BookingItemSchema),
    transportation: z.array(BookingItemSchema)
  }),
  metadata: z.object({
    generated_at: z.string(),
    version: z.string(),
    confidence_score: z.number().min(0).max(100).optional()
  }).optional()
});

// Utility validation functions
export function validateTripRequest(data: unknown) {
  return TripRequestSchema.safeParse(data);
}

export function validateTripResponse(data: unknown) {
  return TripResponseSchema.safeParse(data);
}
