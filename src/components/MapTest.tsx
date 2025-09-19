'use client';

import { useState } from 'react';
import GoogleMap from './GoogleMap';

export default function MapTest() {
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | undefined>();

  const handleLocationChange = (loc: string, coords?: { lat: number; lng: number }) => {
    setLocation(loc);
    setCoordinates(coords);
    console.log('Location:', loc);
    console.log('Coordinates:', coords);
  };

  return (
    <div className="p-6 bg-black text-green-400 min-h-screen">
      <h1 className="text-2xl font-mono mb-6">🗺️ Google Maps Test</h1>

      <GoogleMap
        location={location}
        onLocationChange={handleLocationChange}
      />

      <div className="mt-6 p-4 bg-slate-800 rounded-lg font-mono">
        <h2 className="text-lg mb-2">📍 Location Data:</h2>
        <p><strong>Location:</strong> {location || 'Not selected'}</p>
        {coordinates && (
          <p><strong>Coordinates:</strong> {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}</p>
        )}
      </div>
    </div>
  );
}
