'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon, CloudIcon, SunIcon } from '@heroicons/react/24/outline';

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
        // First, try to get trip data from localStorage
        const storedTrip = localStorage.getItem(`trip_${params.id}`);
        if (storedTrip) {
          const tripData = JSON.parse(storedTrip);
          setTrip(tripData);
          setLoading(false);
          return;
        }

        // If not in localStorage, try to fetch from API
        const response = await fetch(`/api/trips/${params.id}`);
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

    if (params.id) {
      fetchTrip();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your trip itinerary...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">❌ {error || 'Trip not found'}</div>
          <Link
            href="/plan"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl text-white hover:shadow-lg transition-all"
          >
            Create New Trip
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-white/10">
        <Link
          href="/plan"
          className="flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Plan
        </Link>
        <div className="text-sm text-gray-400">
          Trip ID: {trip.trip_id}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Trip Summary */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
            Your Trip Itinerary
          </h1>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            {trip.summary}
          </p>

          {/* Trip Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-400">{trip.days.length}</div>
              <div className="text-sm text-gray-400">Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-400">
                {trip.estimated_cost.currency} {trip.estimated_cost.min.toLocaleString()} - {trip.estimated_cost.max.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Estimated Cost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-400">{trip.metadata.confidence_score}%</div>
              <div className="text-sm text-gray-400">Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-400">
                {new Date(trip.metadata.generated_at).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-400">Generated</div>
            </div>
          </div>
        </div>

        {/* Days */}
        <div className="space-y-6">
          {trip.days.map((day, index) => (
            <div key={day.day} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{day.title}</h2>
                  <p className="text-gray-400">{new Date(day.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>

                {/* Weather */}
                <div className="flex items-center space-x-4">
                  {day.weather_forecast.condition.toLowerCase().includes('sun') ||
                   day.weather_forecast.condition.toLowerCase().includes('clear') ? (
                    <SunIcon className="w-8 h-8 text-yellow-400" />
                  ) : (
                    <CloudIcon className="w-8 h-8 text-gray-400" />
                  )}
                  <div className="text-right">
                    <div className="text-lg font-semibold">{day.weather_forecast.temperature}°C</div>
                    <div className="text-sm text-gray-400">{day.weather_forecast.condition}</div>
                    <div className="text-xs text-gray-500">{day.weather_forecast.precipitation_chance}% rain</div>
                  </div>
                </div>
              </div>

              {/* Time Blocks */}
              <div className="space-y-4">
                {day.time_blocks.map((block, blockIndex) => (
                  <div key={blockIndex} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <ClockIcon className="w-4 h-4" />
                            <span>{block.start} - {block.end}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{block.location}</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-2">{block.title}</h3>
                        <p className="text-gray-300 mb-3">{block.description}</p>

                        {block.notes && (
                          <p className="text-sm text-teal-400 italic">💡 {block.notes}</p>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-teal-400 font-semibold">
                          <CurrencyDollarIcon className="w-4 h-4" />
                          <span>{block.currency} {block.cost}</span>
                        </div>
                        <div className="text-xs text-gray-400 capitalize mt-1">{block.type}</div>
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
          <p className="text-gray-400 mb-4">
            Enjoy your trip! Safe travels from Tra Verse
          </p>
          <Link
            href="/plan"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl text-white hover:shadow-lg transition-all"
          >
            Plan Another Trip
          </Link>
        </div>
      </div>
    </div>
  );
}
