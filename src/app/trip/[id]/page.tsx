'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon, CloudIcon, SunIcon } from '@heroicons/react/24/outline';
import ItineraryMap from '@/components/ItineraryMap';

interface TripResponse {
  trip_id: string;
  summary: string;
  days: DayItinerary[];
  estimated_cost: {
    currency: string;
    min: number;
    max: number;
  };
  bookings: {
    hotels: BookingItem[];
    activities: BookingItem[];
    flights: BookingItem[];
    transportation: BookingItem[];
  };
  metadata: {
    generated_at: string;
    version: string;
    confidence_score: number;
  };
}

interface DayItinerary {
  day: number;
  date: string;
  title: string;
  time_blocks: TimeBlock[];
  weather_forecast: {
    temperature: number;
    condition: string;
    precipitation_chance: number;
    wind_speed: number;
  };
}

interface TimeBlock {
  start: string;
  end: string;
  title: string;
  type: string;
  location: string;
  description: string;
  cost: number;
  currency: string;
  notes: string;
  place_id?: string;
  rating?: number;
  reviews_count?: number;
  tags?: string[];
}

interface BookingItem {
  provider: string;
  title: string;
  cost: number;
  currency: string;
  status: string;
  booking_url?: string;
}

export default function TripPage() {
  const params = useParams();
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        // Await params in Next.js 15
        const resolvedParams = await params;
        if (!resolvedParams?.id) {
          setError('Invalid trip ID');
          setLoading(false);
          return;
        }

        const tripId = resolvedParams.id;

        // First, try to get trip data from localStorage
        const storedTrip = localStorage.getItem(`trip_${tripId}`);
        if (storedTrip) {
          const tripData = JSON.parse(storedTrip);
          setTrip(tripData);
          setLoading(false);
          return;
        }

        // If not in localStorage, try to fetch from API
        const response = await fetch(`/api/trips/${tripId}`);
        const result = await response.json();

        if (result.success) {
          setTrip(result.data.itinerary || result.data);
        } else {
          setError(result.error || 'Failed to load trip');
        }
      } catch (err) {
        setError('Failed to load trip data');
        console.error('Error fetching trip:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 overflow-hidden relative font-mono flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="matrix-rain opacity-30"></div>
          <div className="absolute inset-0 cyber-grid opacity-20"></div>
        </div>
        <div className="relative text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-400 border-t-transparent mx-auto mb-4 shadow-[0_0_30px_rgba(34,211,238,0.5)]"></div>
          <p className="text-cyan-400 text-lg font-mono animate-pulse">LOADING MATRIX DATA...</p>
          <div className="text-green-400/50 text-sm font-mono mt-2">Decrypting itinerary protocols</div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-black text-green-400 overflow-hidden relative font-mono flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="matrix-rain opacity-30"></div>
          <div className="absolute inset-0 cyber-grid opacity-20"></div>
          <div className="absolute inset-0 scanlines opacity-10"></div>
        </div>
        <div className="relative text-center">
          <div className="text-red-400 text-xl mb-4 font-mono animate-pulse">⚠️ MATRIX ERROR ⚠️</div>
          <div className="text-green-400/70 font-mono mb-6">{error || 'Trip data corrupted'}</div>
          <Link
            href="/plan"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-400 to-green-400 border-2 border-cyan-400 rounded-lg text-black font-mono font-bold hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300"
          >
            INITIALIZE NEW MATRIX
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 overflow-hidden relative font-mono">
      {/* Cyberpunk Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="matrix-rain opacity-20"></div>
        <div className="absolute inset-0 cyber-grid opacity-15"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-radial from-cyan-400/20 via-blue-500/10 to-transparent rounded-full animate-pulse-glow"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-radial from-magenta-400/20 via-purple-500/10 to-transparent rounded-full animate-pulse-glow-delayed"></div>
        <div className="absolute inset-0 scanlines opacity-10"></div>
      </div>

      {/* Header */}
      <header className="relative flex items-center justify-between p-6 border-b border-cyan-400/20">
        <Link
          href="/plan"
          className="flex items-center text-green-400 hover:text-cyan-400 transition-colors font-mono"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          BACK TO MATRIX
        </Link>
        <div className="text-sm text-cyan-400 border border-cyan-400/30 px-3 py-1 rounded bg-black/50 backdrop-blur-sm">
          <span className="animate-pulse">●</span> MATRIX ID: {trip.trip_id.slice(-8).toUpperCase()}
        </div>
      </header>

      <div className="relative max-w-4xl mx-auto px-6 py-8">
        {/* Trip Summary */}
        <div className="relative bg-black/80 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-cyan-400/30 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
          {/* Corner Accents */}
          <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400/50"></div>
          <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400/50"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-400/50"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-400/50"></div>

          <h1 className="text-3xl font-bold mb-4 text-cyan-400 font-mono tracking-wider text-center">
            ITINERARY MATRIX
          </h1>
          <p className="text-lg text-green-400/80 mb-6 leading-relaxed font-mono text-center">
            {trip.summary}
          </p>

          {/* Trip Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center border border-cyan-400/20 rounded-lg p-3 bg-black/30">
              <div className="text-2xl font-bold text-cyan-400 font-mono">{trip.days.length}</div>
              <div className="text-sm text-green-400/70 font-mono">DAYS</div>
            </div>
            <div className="text-center border border-magenta-400/20 rounded-lg p-3 bg-black/30">
              <div className="text-xl font-bold text-magenta-400 font-mono">
                {trip.estimated_cost.currency} {trip.estimated_cost.min.toLocaleString()}
              </div>
              <div className="text-sm text-green-400/70 font-mono">COST MATRIX</div>
            </div>
            <div className="text-center border border-green-400/20 rounded-lg p-3 bg-black/30">
              <div className="text-2xl font-bold text-green-400 font-mono">{trip.metadata.confidence_score}%</div>
              <div className="text-sm text-green-400/70 font-mono">ACCURACY</div>
            </div>
            <div className="text-center border border-cyan-400/20 rounded-lg p-3 bg-black/30">
              <div className="text-lg font-bold text-cyan-400 font-mono">
                {new Date(trip.metadata.generated_at).toLocaleDateString()}
              </div>
              <div className="text-sm text-green-400/70 font-mono">MATRIX DATE</div>
            </div>
          </div>
        </div>

        {/* Itinerary Map */}
        <div className="mb-8">
          <ItineraryMap trip={trip} />
        </div>

        {/* Days */}
        <div className="space-y-6">
          {trip.days.map((day, index) => (
            <div key={day.day} className="relative bg-black/80 backdrop-blur-lg rounded-2xl p-6 border border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.05)]">
              {/* Corner Accents */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/50"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/50"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/50"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/50"></div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400 font-mono tracking-wider">{day.title.toUpperCase()}</h2>
                  <p className="text-green-400/70 font-mono">{new Date(day.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }).toUpperCase()}</p>
                </div>

                {/* Weather */}
                <div className="flex items-center space-x-4 border border-green-400/20 rounded-lg p-3 bg-black/30">
                  {day.weather_forecast.condition.toLowerCase().includes('sun') ||
                   day.weather_forecast.condition.toLowerCase().includes('clear') ? (
                    <SunIcon className="w-8 h-8 text-yellow-400 animate-pulse" />
                  ) : (
                    <CloudIcon className="w-8 h-8 text-gray-400 animate-pulse" />
                  )}
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-400 font-mono">{day.weather_forecast.temperature}°C</div>
                    <div className="text-sm text-green-400/70 font-mono">{day.weather_forecast.condition.toUpperCase()}</div>
                    <div className="text-xs text-cyan-400/70 font-mono">{day.weather_forecast.precipitation_chance}% RAIN</div>
                  </div>
                </div>
              </div>

              {/* Time Blocks */}
              <div className="space-y-4">
                {day.time_blocks.map((block, blockIndex) => (
                  <div key={blockIndex} className="relative bg-black/40 rounded-xl p-4 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2 text-sm text-cyan-400/70 font-mono">
                            <ClockIcon className="w-4 h-4 text-cyan-400" />
                            <span>{block.start} - {block.end}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-green-400/70 font-mono">
                            <MapPinIcon className="w-4 h-4 text-green-400" />
                            <span>{block.location.toUpperCase()}</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-cyan-400 mb-2 font-mono tracking-wide">{block.title.toUpperCase()}</h3>
                        <p className="text-green-400/80 mb-3 font-mono text-sm leading-relaxed">{block.description}</p>

                        {/* Enhanced place information */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {block.rating && (
                            <div className="flex items-center space-x-1 bg-black/50 border border-yellow-400/30 px-3 py-1 rounded-lg">
                              <span className="text-yellow-400 text-sm animate-pulse">★</span>
                              <span className="text-yellow-400 text-sm font-mono font-semibold">{block.rating}</span>
                              {block.reviews_count && (
                                <span className="text-green-400/70 text-xs font-mono">({block.reviews_count})</span>
                              )}
                            </div>
                          )}

                          {block.tags && block.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-black/50 border border-cyan-400/30 text-cyan-400 text-xs px-3 py-1 rounded-lg font-mono hover:bg-cyan-400/10 transition-all duration-300"
                            >
                              {tag.toUpperCase()}
                            </span>
                          ))}
                        </div>

                        {block.notes && (
                          <p className="text-sm text-cyan-400/80 font-mono italic border-l-2 border-cyan-400/50 pl-3">⚡ {block.notes}</p>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-green-400 font-mono font-semibold border border-green-400/30 rounded-lg px-3 py-2 bg-black/30">
                          <CurrencyDollarIcon className="w-4 h-4 text-green-400" />
                          <span>{block.currency} {block.cost}</span>
                        </div>
                        <div className="text-xs text-cyan-400/70 font-mono uppercase mt-2 tracking-wider">{block.type}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bookings Summary */}
        {(trip.bookings.hotels.length > 0 || trip.bookings.activities.length > 0) && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mt-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
              Booking Recommendations
            </h2>

            {/* Hotels */}
            {trip.bookings.hotels.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">🏨 Accommodations</h3>
                <div className="space-y-3">
                  {trip.bookings.hotels.map((hotel, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">{hotel.title}</h4>
                          <p className="text-sm text-gray-400">{hotel.provider}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-teal-400">
                            {hotel.currency} {hotel.cost}
                          </div>
                          {hotel.booking_url && (
                            <a
                              href={hotel.booking_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-400 hover:text-blue-300 underline mt-1 inline-block"
                            >
                              Book Now
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activities */}
            {trip.bookings.activities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">🎯 Activities & Experiences</h3>
                <div className="space-y-3">
                  {trip.bookings.activities.map((activity, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">{activity.title}</h4>
                          <p className="text-sm text-gray-400">{activity.provider}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-teal-400">
                            {activity.currency} {activity.cost}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-green-400/70 mb-6 font-mono text-sm">
            ENJOY YOUR TRIP! SAFE TRAVELS FROM TRA VERSE MATRIX
          </p>
          <Link
            href="/plan"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-400 via-green-400 to-magenta-400 border-2 border-cyan-400 rounded-lg text-black font-mono font-bold hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all duration-300 animate-pulse-glow"
          >
            INITIALIZE NEW MATRIX
          </Link>
        </div>
      </div>
    </div>
  );
}
