'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

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

interface TripResponse {
  trip_id: string;
  summary: string;
  days: DayItinerary[];
  estimated_cost: {
    currency: string;
    min: number;
    max: number;
  };
  bookings: any;
  metadata: any;
}

interface LocationData {
  location: string;
  coordinates: { lat: number; lng: number } | null;
  activities: Array<{
    day: number;
    title: string;
    type: string;
    time: string;
    description: string;
    rating?: number;
  }>;
}

interface ItineraryMapProps {
  trip: TripResponse;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initItineraryMap: () => void;
  }
}

export default function ItineraryMap({ trip, className = '' }: ItineraryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null); // Start with all days view
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Extract unique locations from the trip
  const uniqueLocations = useMemo(() => {
    const locationMap = new Map<string, LocationData>();

    trip.days.forEach((day) => {
      day.time_blocks.forEach((block) => {
        if (block.location && block.location.trim() !== '') {
          const locationKey = block.location.toLowerCase().trim();

          if (!locationMap.has(locationKey)) {
            locationMap.set(locationKey, {
              location: block.location,
              coordinates: null,
              activities: []
            });
          }

          locationMap.get(locationKey)!.activities.push({
            day: day.day,
            title: block.title,
            type: block.type,
            time: `${block.start} - ${block.end}`,
            description: block.description,
            rating: block.rating
          });
        }
      });
    });

    return Array.from(locationMap.values());
  }, [trip]);

  // Load Google Maps API
  useEffect(() => {
    if (!window.google && !document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
        initializeMap();
      };
      document.head.appendChild(script);
    } else if (window.google) {
      setIsLoaded(true);
      initializeMap();
    }
  }, []);

  // Geocode locations
  useEffect(() => {
    if (isLoaded && uniqueLocations.length > 0) {
      geocodeLocations();
    }
  }, [isLoaded, uniqueLocations]);

  // Update map markers when locations change
  useEffect(() => {
    if (map && locations.length > 0) {
      updateMapMarkers();
    }
  }, [map, locations, selectedDay]);

  // Auto-advance to next day every 10 seconds (if auto-play is enabled and not in all-days view)
  useEffect(() => {
    if (isLoaded && !isLoadingLocations && locations.length > 0 && isAutoPlaying && selectedDay !== null) {
      const interval = setInterval(() => {
        setSelectedDay(prevDay => {
          if (prevDay === null) return 1; // Start with day 1 if currently showing all days
          const nextDay = prevDay + 1;
          return nextDay > trip.days.length ? null : nextDay; // Go back to all days after last day
        });
      }, 10000); // 10 seconds

      return () => clearInterval(interval);
    }
  }, [isLoaded, isLoadingLocations, locations.length, trip.days.length, isAutoPlaying, selectedDay]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Calculate center point from all locations (or use default)
    let centerLat = 20.5937; // Default: Center of India
    let centerLng = 78.9629;

    if (locations.length > 0) {
      const validLocations = locations.filter(loc => loc.coordinates);
      if (validLocations.length > 0) {
        const avgLat = validLocations.reduce((sum, loc) => sum + loc.coordinates!.lat, 0) / validLocations.length;
        const avgLng = validLocations.reduce((sum, loc) => sum + loc.coordinates!.lng, 0) / validLocations.length;
        centerLat = avgLat;
        centerLng = avgLng;
      }
    }

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: centerLat, lng: centerLng },
      zoom: 10,
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry.fill',
          stylers: [{ color: '#1a1a1a' }]
        },
        {
          featureType: 'all',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#00ff88' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [{ color: '#0a0a0a' }]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry.fill',
          stylers: [{ color: '#2a2a2a' }]
        },
        {
          featureType: 'poi',
          elementType: 'geometry.fill',
          stylers: [{ color: '#3a3a3a' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry.fill',
          stylers: [{ color: '#333333' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#00ff88' }]
        }
      ]
    });

    setMap(mapInstance);
  };

  const geocodeLocations = async () => {
    if (!window.google) return;

    setIsLoadingLocations(true);
    const geocoder = new window.google.maps.Geocoder();
    const geocodedLocations: LocationData[] = [];

    for (const location of uniqueLocations) {
      try {
        const result = await new Promise<any>((resolve, reject) => {
          geocoder.geocode({ address: location.location }, (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
              resolve({
                ...location,
                coordinates: {
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng()
                }
              });
            } else {
              console.warn(`Geocoding failed for ${location.location}:`, status);
              resolve({
                ...location,
                coordinates: null
              });
            }
          });
        });

        geocodedLocations.push(result);
      } catch (error) {
        console.error(`Error geocoding ${location.location}:`, error);
        geocodedLocations.push({
          ...location,
          coordinates: null
        });
      }
    }

    setLocations(geocodedLocations);
    setIsLoadingLocations(false);
  };

  const updateMapMarkers = () => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: any[] = [];

    // Day colors - cycle through different colors for each day
    const dayColors = [
      '#00ff88', // Day 1: Green
      '#ff6b35', // Day 2: Orange
      '#ff4757', // Day 3: Red
      '#3742fa', // Day 4: Blue
      '#9c88ff', // Day 5: Purple
      '#ffa726', // Day 6: Amber
      '#26a69a', // Day 7: Teal
      '#ec407a', // Day 8: Pink
      '#8d6e63', // Day 9: Brown
      '#78909c'  // Day 10: Grey
    ];

    // Get locations to show (all locations if selectedDay is null, otherwise filter by day)
    const locationsToShow = selectedDay === null
      ? locations
      : locations.filter(loc => loc.activities.some(activity => activity.day === selectedDay));

    locationsToShow.forEach((location) => {
      if (!location.coordinates) return;

      // Get all activities for this location (for all days if showing all, or specific day)
      const relevantActivities = selectedDay === null
        ? location.activities // Show all activities for this location
        : location.activities.filter(activity => activity.day === selectedDay);

      // Group activities by day for display
      const activitiesByDay = relevantActivities.reduce((acc, activity) => {
        if (!acc[activity.day]) acc[activity.day] = [];
        acc[activity.day].push(activity);
        return acc;
      }, {} as Record<number, typeof relevantActivities>);

      // Create markers for each day this location appears in
      Object.entries(activitiesByDay).forEach(([dayStr, dayActivities]) => {
        const day = parseInt(dayStr);
        const dayColor = dayColors[(day - 1) % dayColors.length];

        // Create custom marker for this day
        const activityTypes = dayActivities.map(a => a.type);
        const hasMeals = activityTypes.includes('meal');
        const hasActivities = activityTypes.includes('activity');
        const hasTransport = activityTypes.includes('transport');

        let markerSymbol = '📍';
        if (hasActivities && hasMeals) {
          markerSymbol = '🏛️'; // Mixed activities
        } else if (hasActivities) {
          markerSymbol = '🎯'; // Activities
        } else if (hasMeals) {
          markerSymbol = '🍽️'; // Meals
        } else if (hasTransport) {
          markerSymbol = '🚗'; // Transport
        }

        const marker = new window.google.maps.Marker({
          position: location.coordinates,
          map: map,
          title: `${location.location} - Day ${day}`,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="22" fill="${dayColor}" stroke="#ffffff" stroke-width="3"/>
                <circle cx="25" cy="25" r="12" fill="${dayColor}" opacity="0.8"/>
                <circle cx="25" cy="25" r="6" fill="#ffffff"/>
                <text x="25" y="31" text-anchor="middle" fill="#1a1a1a" font-size="18" font-weight="bold">${day}</text>
                ${selectedDay === day ? `
                  <circle cx="25" cy="25" r="24" fill="none" stroke="${dayColor}" stroke-width="2" opacity="0.6">
                    <animate attributeName="r" values="24;30;24" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/>
                  </circle>
                ` : ''}
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(50, 50),
            anchor: new window.google.maps.Point(25, 25)
          },
          animation: selectedDay === day ? window.google.maps.Animation.DROP : null
        });

        // Create detailed info window for this day's activities
        const infoWindow = new window.google.maps.InfoWindow({
          content: createDayInfoWindowContent(location, dayActivities, day, dayColor)
        });

        marker.addListener('click', () => {
          // Close other info windows
          newMarkers.forEach(m => m.infoWindow?.close());
          infoWindow.open(map, marker);
        });

        marker.infoWindow = infoWindow;
        newMarkers.push(marker);
      });
    });

    setMarkers(newMarkers);

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);

      // Set appropriate zoom level
      if (newMarkers.length === 1) {
        map.setZoom(15); // Closer zoom for single location
      } else if (newMarkers.length > 3) {
        map.setZoom(Math.min(map.getZoom(), 12)); // Wider view for multiple locations
      }
    } else {
      console.log(selectedDay === null ? 'No locations found for any day' : `No locations found for Day ${selectedDay}`);
    }
  };

  const createDayInfoWindowContent = (location: LocationData, dayActivities: any[], day: number, dayColor: string) => {
    return `
      <div style="color: #1a1a1a; font-family: 'Courier New', monospace; max-width: 320px;">
        <div style="background: ${dayColor}; color: white; padding: 8px; border-radius: 8px 8px 0 0; text-align: center;">
          <h3 style="margin: 0; font-size: 18px; font-weight: bold;">
            📍 ${location.location}
          </h3>
          <div style="font-size: 14px; opacity: 0.9;">Day ${day} Activities</div>
        </div>
        <div style="padding: 12px; background: #f9f9f9;">
          ${dayActivities.map(activity => `
            <div style="margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border-left: 4px solid ${dayColor};">
              <div style="font-weight: bold; color: #333; font-size: 14px;">${activity.title}</div>
              <div style="font-size: 12px; color: #666; margin-top: 2px;">
                🕐 ${activity.time} • ${activity.type.toUpperCase()}
                ${activity.rating ? ` • ⭐ ${activity.rating}` : ''}
              </div>
              <div style="font-size: 11px; color: #888; margin-top: 4px; line-height: 1.3;">
                ${activity.description.substring(0, 120)}${activity.description.length > 120 ? '...' : ''}
              </div>
            </div>
          `).join('')}
        </div>
        <div style="background: #e0e0e0; padding: 8px; border-radius: 0 0 8px 8px; text-align: center;">
          <div style="font-size: 12px; color: #666;">
            Click marker for details • Auto-advances every 10s
          </div>
        </div>
      </div>
    `;
  };


  const validLocationsCount = locations.filter(loc => loc.coordinates).length;

  return (
    <div className={`bg-black/80 backdrop-blur-lg rounded-2xl p-6 border border-cyan-400/30 shadow-[0_0_50px_rgba(34,211,238,0.1)] ${className}`}>
      {/* Corner Accents */}
      <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400/50"></div>
      <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400/50"></div>
      <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-400/50"></div>
      <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-400/50"></div>

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-cyan-400 font-mono tracking-wider">
            🗺️ VISUAL TRIP MAP
          </h2>
          <div className="text-sm text-cyan-400 border border-cyan-400/30 px-3 py-1 rounded bg-black/50 backdrop-blur-sm">
            <span className="animate-pulse">●</span> {validLocationsCount}/{locations.length} LOCATIONS
          </div>
        </div>

        {/* Day Navigation with Auto-Play Controls */}
        <div className="flex flex-col gap-4 mb-4">
          {/* Current Day Display */}
          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-black/50 border border-cyan-400/30 rounded-xl px-6 py-3">
              {selectedDay !== null && (
                <button
                  onClick={() => setSelectedDay(prev => prev && prev > 1 ? prev - 1 : trip.days.length)}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  disabled={!isLoaded}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 font-mono">
                  {selectedDay === null ? 'ALL DAYS' : `DAY ${selectedDay}`}
                </div>
                <div className="text-sm text-green-400/70 font-mono">
                  {selectedDay === null
                    ? 'Complete trip overview'
                    : (trip.days[selectedDay - 1]?.title.replace('Day ' + selectedDay + ': ', '') || 'Loading...')
                  }
                </div>
              </div>

              {selectedDay !== null && (
                <button
                  onClick={() => setSelectedDay(prev => prev && prev < trip.days.length ? prev + 1 : 1)}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  disabled={!isLoaded}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {/* All Days Button */}
            <button
              onClick={() => {
                setSelectedDay(null);
                setIsAutoPlaying(false);
              }}
              className={`px-4 py-2 rounded-lg font-mono transition-all duration-300 ${
                selectedDay === null
                  ? 'bg-cyan-400 text-black border-2 border-cyan-400'
                  : 'bg-black/50 text-cyan-400 border border-cyan-400/30 hover:border-cyan-400/60'
              }`}
              disabled={!isLoaded}
            >
              🌍 ALL DAYS
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono transition-all duration-300 ${
                isAutoPlaying
                  ? 'bg-red-500/20 text-red-400 border border-red-400/50 hover:bg-red-500/30'
                  : 'bg-green-500/20 text-green-400 border border-green-400/50 hover:bg-green-500/30'
              }`}
              disabled={!isLoaded}
            >
              {isAutoPlaying ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zM14 4h4v16h-4V4z"/>
                  </svg>
                  PAUSE
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  PLAY
                </>
              )}
            </button>

            {/* Day Buttons */}
            <div className="flex flex-wrap gap-1">
              {trip.days.map((day) => {
                const dayColors = [
                  '#00ff88', '#ff6b35', '#ff4757', '#3742fa', '#9c88ff',
                  '#ffa726', '#26a69a', '#ec407a', '#8d6e63', '#78909c'
                ];
                const dayColor = dayColors[(day.day - 1) % dayColors.length];

                return (
                  <button
                    key={day.day}
                    onClick={() => {
                      setSelectedDay(day.day);
                      setIsAutoPlaying(false); // Stop auto-play when manually selecting
                    }}
                    className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all duration-300 ${
                      selectedDay === day.day
                        ? 'text-black border-2 border-white'
                        : 'text-white border border-cyan-400/30 hover:border-cyan-400/60'
                    }`}
                    style={{
                      backgroundColor: selectedDay === day.day ? dayColor : `${dayColor}40`,
                      borderColor: selectedDay === day.day ? '#ffffff' : undefined
                    }}
                    disabled={!isLoaded}
                  >
                    {day.day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div
            ref={mapRef}
            className="w-full h-96 bg-black/50 border-2 border-cyan-400/30 rounded-lg overflow-hidden"
          />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-cyan-400 font-mono">Loading Map Matrix...</p>
              </div>
            </div>
          )}
          {isLoaded && isLoadingLocations && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
              <div className="text-center">
                <MapPinIcon className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-pulse" />
                <p className="text-cyan-400 font-mono">Geocoding Locations...</p>
              </div>
            </div>
          )}
          {isLoaded && !isLoadingLocations && (
            <div className="absolute top-2 left-2 bg-black/80 text-green-400 px-3 py-1 rounded-lg font-mono text-sm border border-cyan-400/30">
              🗺️ Interactive Map
            </div>
          )}
        </div>

        {/* Day Color Legend */}
        <div className="mt-4">
          <div className="text-sm text-cyan-400/70 font-mono mb-2">📅 DAY COLORS:</div>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {trip.days.slice(0, Math.min(trip.days.length, 10)).map((day) => {
              const dayColors = [
                '#00ff88', '#ff6b35', '#ff4757', '#3742fa', '#9c88ff',
                '#ffa726', '#26a69a', '#ec407a', '#8d6e63', '#78909c'
              ];
              const dayColor = dayColors[(day.day - 1) % dayColors.length];

              return (
                <div key={day.day} className="flex items-center space-x-1">
                  <div
                    className="w-3 h-3 rounded-full border border-white/30"
                    style={{ backgroundColor: dayColor }}
                  ></div>
                  <span className="text-green-400">D{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 text-sm text-cyan-400/70 font-mono">
          💡 <strong>Map Tip:</strong> This visual map shows your trip locations with colored markers.
          Click markers for quick activity previews.
          {selectedDay === null
            ? ' Currently showing all locations from your trip.'
            : ` Currently showing Day ${selectedDay} locations.`
          }
          {isAutoPlaying ? ' Auto-advancing every 10 seconds.' : ' Auto-play paused - use controls to navigate.'}
          <br />
          📋 <strong>Detailed itinerary with full descriptions appears below this map.</strong>
        </div>
      </div>
    </div>
  );
}
