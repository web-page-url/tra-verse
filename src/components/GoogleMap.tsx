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

  useEffect(() => {
    // Load Google Maps API
    if (!window.google && !document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC4TQVz0zicFzb_HOg4v_5TgAHRXJ-dLBU&libraries=places`;
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

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Initialize map
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: 20.5937, lng: 78.9629 }, // Center of India
      zoom: 5,
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

      // Simple marker for default location
      const defaultMarker = new window.google.maps.Marker({
        position: { lat: 20.5937, lng: 78.9629 },
        map: mapInstance,
        title: 'Center of India',
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
    if (!window.google || !map) return;

    const geocoder = new window.google.maps.Geocoder();

    try {
      const response = await new Promise<any>((resolve, reject) => {
        geocoder.geocode({ address: locationName }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0]);
          } else {
            reject(new Error('Geocoding failed'));
          }
        });
      });

      const lat = response.geometry.location.lat();
      const lng = response.geometry.location.lng();

      map.setCenter({ lat, lng });
      map.setZoom(12);

      // Remove existing marker
      if (marker) {
        marker.setMap(null);
      }

      // Add new marker
      const newMarker = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: locationName,
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

      setMarker(newMarker);
      onLocationChange(locationName, { lat, lng });
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  useEffect(() => {
    if (isLoaded && location && location.length > 2 && !location.includes(',')) {
      // Debounce geocoding
      const timeoutId = setTimeout(() => {
        geocodeLocation(location);
      }, 1000);

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
          placeholder="Search for a city (e.g., Mumbai, India or Tokyo, Japan)"
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
      </div>

      <div className="text-sm text-gray-400 font-mono">
        💡 <strong>Tip:</strong> Type a city name and select from the dropdown, or the map will automatically center on your typed location.
      </div>
    </div>
  );
}
