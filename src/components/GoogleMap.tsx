'use client';

import { useEffect, useRef, useState } from 'react';

interface GoogleMapProps {
  location: string;
  onLocationChange: (location: string, coordinates?: { lat: number; lng: number }) => void;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function GoogleMap({ location, onLocationChange, className = '' }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [geocodedLocation, setGeocodedLocation] = useState<string | null>(null);

  useEffect(() => {
    // Load Google Maps API with error handling
    if (!window.google && !document.querySelector('script[src*="maps.googleapis.com"]')) {
      console.log('🔄 Loading Google Maps API...');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC4TQVz0zicFzb_HOg4v_5TgAHRXJ-dLBU&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('✅ Google Maps API loaded successfully');
        setIsLoaded(true);
        initializeMap();
      };
      script.onerror = (error) => {
        console.error('❌ Failed to load Google Maps API:', error);
        setIsLoaded(false);
        setGeocodingError('Failed to load Google Maps. Please check your internet connection.');
      };
      document.head.appendChild(script);
    } else if (window.google) {
      console.log('✅ Google Maps API already loaded');
      setIsLoaded(true);
      initializeMap();
    }
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Initialize map with Street View enabled
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: 20.0, lng: 0.0 }, // Global center (Prime Meridian)
      zoom: 2,
      streetViewControl: true, // Enable Street View control (pegman)
      streetViewControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_BOTTOM // Position pegman at bottom right
      },
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

    // Add Street View event listeners
    window.google.maps.event.addListener(mapInstance, 'click', (event: any) => {
      // Close any open Street View when clicking on map
      if (mapInstance.getStreetView().getVisible()) {
        mapInstance.getStreetView().setVisible(false);
      }
    });

    // Listen for Street View visibility changes
    window.google.maps.event.addListener(mapInstance.getStreetView(), 'visible_changed', () => {
      const streetViewVisible = mapInstance.getStreetView().getVisible();
      console.log('🏙️ Street View visibility changed:', streetViewVisible);

      if (streetViewVisible) {
        console.log('🏙️ Street View opened at:', mapInstance.getStreetView().getPosition()?.toJSON());
      } else {
        console.log('🏙️ Street View closed');
      }
    });

    // Simple marker for default location
    const defaultMarker = new window.google.maps.Marker({
      position: { lat: 20.0, lng: 0.0 },
      map: mapInstance,
        title: 'Global Center',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#00ff88" stroke="#00ff88" stroke-width="2"/>
              <circle cx="20" cy="20" r="8" fill="#00ff88" opacity="0.3"/>
              <circle cx="20" cy="16" r="3" fill="#1a1a1a"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40)
        }
      });

      setMarker(defaultMarker);
  };

  const handleLocationInputChange = (value: string) => {
    onLocationChange(value);
  };

  const geocodeLocation = async (locationName: string) => {
    if (!window.google || !map) {
      console.warn('🗺️ Geocoding skipped: Google Maps not loaded or map not ready');
      return;
    }

    if (!locationName || locationName.trim().length < 2) {
      console.warn('🗺️ Geocoding skipped: Location name too short');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

      console.log('🗺️ STARTING GEOCODING PROCESS');
      console.log('📍 Input location:', locationName);
      console.log('🌍 Map current center:', map.getCenter()?.toJSON());
      setGeocodingError(null); // Clear any previous error
      setGeocodedLocation(null); // Clear previous geocoded location

    try {
      console.log('🔍 Calling Google Maps Geocoding API...');

      const response = await new Promise<any>((resolve, reject) => {
        geocoder.geocode({
          address: locationName,
          // No country restrictions - truly global
        }, (results: any, status: any) => {
          console.log('📊 GOOGLE MAPS API RESPONSE:');
          console.log('   Status:', status);
          console.log('   Results count:', results ? results.length : 0);

          if (status === 'OK' && results && results.length > 0) {
            console.log('✅ GEOCODING SUCCESSFUL');
            console.log('📍 Best match:', results[0].formatted_address);

            // Log all results for debugging
            results.slice(0, 3).forEach((result: any, index: number) => {
              console.log(`   Option ${index + 1}: ${result.formatted_address}`);
            });

            resolve(results[0]); // Always use the first (best) result
          } else {
            console.error('❌ GEOCODING FAILED');
            let errorMessage = `No location found for "${locationName}"`;

            switch (status) {
              case 'ZERO_RESULTS':
                errorMessage = `No results found for "${locationName}". Try a more specific location name.`;
                break;
              case 'OVER_QUERY_LIMIT':
                errorMessage = 'Too many location searches. Please wait and try again.';
                break;
              case 'REQUEST_DENIED':
                errorMessage = 'Location search blocked. Please check your connection.';
                break;
              case 'INVALID_REQUEST':
                errorMessage = `Invalid location format: "${locationName}". Try "City, Country".`;
                break;
              default:
                errorMessage = `Location search failed: ${status}`;
            }

            console.error('❌ Error details:', errorMessage);
            reject(new Error(errorMessage));
          }
        });
      });

      // Extract coordinates from the geocoding result
      const lat = response.geometry.location.lat();
      const lng = response.geometry.location.lng();
      const formattedAddress = response.formatted_address;

      console.log('📌 EXACT COORDINATES FOUND:');
      console.log('   Latitude:', lat);
      console.log('   Longitude:', lng);
      console.log('   Full Address:', formattedAddress);

      // CRITICAL: Always center map on the geocoded result - no fallbacks
      console.log('🗺️ CENTERING MAP on geocoded location...');
      try {
        map.panTo({ lat, lng });
        map.setZoom(12);
        console.log('✅ Map centered successfully');
      } catch (mapError) {
        console.error('❌ Failed to center map:', mapError);
        // Continue with marker creation even if centering fails
      }

      // Remove existing marker
      if (marker) {
        console.log('🗑️ Removing previous marker');
        marker.setMap(null);
      }

      // Add new marker at the EXACT geocoded location
      console.log('📍 Adding marker at geocoded location');

      try {
        // Create marker with a simple, reliable custom icon
        const newMarker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: formattedAddress,
          animation: window.google.maps.Animation.DROP,
          draggable: true, // Make marker draggable
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#00ff88',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        // Add click listener to show info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="font-family: monospace; color: #00ff88;">
                     <strong>${formattedAddress}</strong><br>
                     <small>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</small>
                   </div>`
        });

        newMarker.addListener('click', () => {
          infoWindow.open(map, newMarker);
        });

        // Add drag listener for live location updates
        newMarker.addListener('dragend', (event: any) => {
          console.log('📍 Marker dragged to new position');
          const newLat = event.latLng.lat();
          const newLng = event.latLng.lng();

          // Reverse geocode to get address for new position
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results: any, status: any) => {
            if (status === 'OK' && results && results.length > 0) {
              const newAddress = results[0].formatted_address;
              console.log('📍 Reverse geocoded address:', newAddress);

              // Update info window content
              infoWindow.setContent(`<div style="font-family: monospace; color: #00ff88;">
                                       <strong>${newAddress}</strong><br>
                                       <small>Lat: ${newLat.toFixed(4)}, Lng: ${newLng.toFixed(4)}</small>
                                     </div>`);

              // Update UI display
              setGeocodedLocation(newAddress);

              // Update parent component with new location
              onLocationChange(newAddress, { lat: newLat, lng: newLng });

              console.log('✅ Live location updated via drag');
            }
          });
        });

        // Add dragstart listener for visual feedback
        newMarker.addListener('dragstart', () => {
          console.log('🎯 Starting to drag marker');
          // Close info window during drag
          infoWindow.close();
        });

        setMarker(newMarker);
        console.log('✅ Draggable marker successfully added to map');
      } catch (markerError) {
        console.error('❌ Failed to create marker:', markerError);
        // Create marker with default icon as fallback (also draggable)
        const fallbackMarker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: formattedAddress,
          animation: window.google.maps.Animation.DROP,
          draggable: true
        });

        // Add basic drag functionality to fallback marker too
        fallbackMarker.addListener('dragend', (event: any) => {
          console.log('📍 Fallback marker dragged to new position');
          const newLat = event.latLng.lat();
          const newLng = event.latLng.lng();

          // Basic update without reverse geocoding for fallback
          onLocationChange(`${newLat.toFixed(4)}, ${newLng.toFixed(4)}`, { lat: newLat, lng: newLng });
          console.log('✅ Fallback marker location updated');
        });

        setMarker(fallbackMarker);
        console.log('⚠️ Created draggable fallback marker with default icon');
      }

      // Set the geocoded location for UI display
      setGeocodedLocation(formattedAddress);

      // Update parent component with the EXACT geocoded result
      console.log('📤 Updating parent component with geocoded data');
      onLocationChange(formattedAddress, { lat, lng });

      console.log('✅ GEOCODING PROCESS COMPLETE');
      console.log('🎯 Final result:', { address: formattedAddress, coordinates: { lat, lng } });

    } catch (error) {
      console.error('💥 GEOCODING PROCESS FAILED');
      console.error('Error:', error);

      // Set error state for UI display
      const errorMessage = error instanceof Error ? error.message : 'Location search failed';
      setGeocodingError(errorMessage);

      console.warn('⚠️ Map remains at current position due to geocoding failure');
      // DO NOT change map position on error - let user see current state
    }
  };

  useEffect(() => {
    if (isLoaded && location && location.trim().length > 2) {
      // Debounce geocoding to avoid too many API calls
      const timeoutId = setTimeout(() => {
        geocodeLocation(location.trim());
      }, 1500); // Increased debounce time

      return () => clearTimeout(timeoutId);
    }
  }, [location, isLoaded, map]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Destination
        </label>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for any city worldwide (e.g., Paris, France or Sydney, Australia)"
          value={location}
          onChange={(e) => handleLocationInputChange(e.target.value)}
          className="w-full px-4 py-3 bg-black/50 border-2 border-cyan-400/50 rounded-lg text-green-400 placeholder-green-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.3)] font-mono text-lg transition-all duration-300"
          required
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400">
          <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-80 bg-black/50 border-2 border-cyan-400/30 rounded-lg overflow-hidden"
          style={{ minHeight: '320px' }}
        />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-cyan-400 font-mono">Loading Map...</p>
            </div>
          </div>
        )}
        {isLoaded && (
          <div className="absolute top-2 left-2 bg-black/80 text-green-400 px-3 py-1 rounded-lg font-mono text-sm border border-cyan-400/30">
            🗺️ Interactive Map
          </div>
        )}

        {isLoaded && !geocodingError && (
          <div className="absolute top-14 left-2 bg-black/80 text-cyan-400 px-3 py-1 rounded-lg font-mono text-xs border border-cyan-400/30 max-w-xs">
            <div className="text-cyan-300 font-semibold">🎯 Drag Marker</div>
            <div className="text-cyan-400/80">Click and drag the green marker to set location</div>
          </div>
        )}

        {isLoaded && (
          <div className="absolute bottom-20 right-2 bg-black/80 text-yellow-400 px-3 py-1 rounded-lg font-mono text-xs border border-yellow-400/30 max-w-xs">
            <div className="text-yellow-300 font-semibold">🏙️ Street View</div>
            <div className="text-yellow-400/80">Drag the yellow pegman onto the map</div>
          </div>
        )}

        {geocodedLocation && (
          <div className="absolute top-2 right-2 bg-black/80 text-cyan-400 px-3 py-1 rounded-lg font-mono text-xs border border-cyan-400/30 max-w-xs">
            <div className="font-semibold text-cyan-300">📍 Located:</div>
            <div className="text-cyan-400/90 truncate" title={geocodedLocation}>
              {geocodedLocation}
            </div>
          </div>
        )}
      </div>

      {geocodingError && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-red-400 font-mono text-sm font-semibold">Geocoding Error</p>
              <p className="text-red-300/80 font-mono text-xs">{geocodingError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-400 font-mono">
        💡 <strong>Tip:</strong> Type any city name from anywhere in the world (e.g., "Paris, France" or "Tokyo, Japan"), and the map will center on that exact location.
        {geocodingError && ' Map showing global view due to geocoding error.'}
      </div>
    </div>
  );
}
