// Core data types for Tra Verse Travel Planning App

export interface User {
  id: string;
  name?: string;
  email?: string;
  preferences?: UserPreferences;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserPreferences {
  travel_style: TravelStyle;
  interests: string[];
  accessibility_needs?: string[];
  budget_preference?: BudgetRange;
  default_num_people?: number;
  default_trip_duration?: number;
}

export type TravelStyle = 'adventure' | 'relaxed' | 'family' | 'romantic' | 'cultural' | 'luxury';

export interface BudgetRange {
  currency: string;
  min: number;
  max: number;
}

// Trip Request - Input sent to Gemini
export interface TripRequest {
  user: {
    id: string;
    travel_style: TravelStyle;
    interests: string[];
    num_people: number;
    budget: BudgetRange;
    dates: {
      start: string;
      end: string;
    };
  };
  trip: {
    location: string;
    days: number;
    preferences: TripPreferences;
    constraints?: TripConstraints;
  };
  context?: {
    weather_api?: boolean;
    local_events_api?: boolean;
    time_zone?: string;
  };
}

export interface TripPreferences {
  pacing?: 'relaxed' | 'moderate' | 'intense';
  transport?: 'public' | 'private-car' | 'walking' | 'mixed';
  avoid?: string[];
  accommodation_type?: 'budget' | 'mid-range' | 'luxury' | 'boutique';
}

export interface TripConstraints {
  max_travel_hours_per_day?: number;
  max_walking_distance?: number;
  dietary_restrictions?: string[];
  accommodation_requirements?: string[];
}

// Trip Response - Output from Gemini
export interface TripResponse {
  trip_id: string;
  summary: string;
  days: DayItinerary[];
  estimated_cost: BudgetRange;
  bookings: BookingData;
  metadata?: {
    generated_at: string;
    version: string;
    confidence_score?: number;
  };
}

export interface DayItinerary {
  day: number;
  date: string;
  title: string;
  time_blocks: TimeBlock[];
  weather_forecast?: WeatherData;
  notes?: string;
}

export interface TimeBlock {
  start: string;
  end: string;
  title: string;
  type: 'activity' | 'logistics' | 'meal' | 'transport' | 'free-time';
  location: string;
  description?: string;
  cost?: number;
  currency?: string;
  notes?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  booking_required?: boolean;
  alternatives?: TimeBlock[];
}

export interface WeatherData {
  temperature: number;
  condition: string;
  precipitation_chance: number;
  wind_speed?: number;
}

export interface BookingData {
  hotels: BookingItem[];
  activities: BookingItem[];
  flights: BookingItem[];
  transportation: BookingItem[];
}

export interface BookingItem {
  id?: string;
  provider: string;
  title: string;
  cost: number;
  currency: string;
  booking_url?: string;
  confirmation_code?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// Database Models
export interface DBTripRequest {
  id: string;
  user_id?: string;
  input_json: TripRequest;
  status: JobStatus;
  created_at: Date;
  updated_at: Date;
  error_message?: string;
}

export interface DBTrip {
  id: string;
  trip_request_id: string;
  result_json: TripResponse;
  estimated_cost: BudgetRange;
  created_at: Date;
  user_id?: string;
}

export interface DBBooking {
  id: string;
  trip_id: string;
  provider: string;
  provider_payload: any;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: Date;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TripStatusResponse {
  trip_request_id: string;
  status: JobStatus;
  progress?: number;
  estimated_completion?: Date;
  error_message?: string;
}

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'retrying';

// Form Types
export interface OnboardingFormData {
  location: string;
  startDate: Date;
  endDate: Date;
  numPeople: number;
  budget: BudgetRange;
  travelStyle: TravelStyle;
  interests: string[];
  preferences: TripPreferences;
  accessibility_needs?: string[];
  dietary_restrictions?: string[];
}

export interface TripRegenerationData {
  trip_id: string;
  updates: Partial<TripRequest>;
  regenerate_reason?: string;
}

// Component Props Types
export interface TripCardProps {
  trip: TripResponse;
  onEdit?: (tripId: string) => void;
  onRegenerate?: (tripId: string) => void;
  onBook?: (tripId: string) => void;
}

export interface DayCardProps {
  day: DayItinerary;
  isExpanded?: boolean;
  onToggle?: () => void;
  onEdit?: (timeBlockId: string) => void;
}

export interface TimeBlockProps {
  block: TimeBlock;
  onEdit?: (block: TimeBlock) => void;
  onSwap?: (block: TimeBlock) => void;
}

export interface MapProps {
  trip: TripResponse;
  selectedDay?: number;
  onMarkerClick?: (location: string) => void;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  retryable?: boolean;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// Configuration Types
export interface AppConfig {
  gemini: {
    apiKey: string;
    model: string;
    temperature: number;
    maxRetries: number;
  };
  mapbox: {
    accessToken: string;
  };
  database: {
    url: string;
  };
  redis: {
    url: string;
  };
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
