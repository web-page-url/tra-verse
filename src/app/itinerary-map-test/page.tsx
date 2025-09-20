import ItineraryMap from '@/components/ItineraryMap';

// Sample trip data for testing
const sampleTrip = {
  trip_id: "test_trip_001",
  summary: "Test trip itinerary with multiple locations and activities",
  days: [
    {
      day: 1,
      date: "2025-01-15",
      title: "Day 1: City Exploration",
      time_blocks: [
        {
          start: "09:00",
          end: "11:00",
          title: "Visit Taj Mahal",
          type: "activity",
          location: "Taj Mahal, Agra",
          description: "Explore the iconic Taj Mahal and learn about its history",
          cost: 1000,
          currency: "INR",
          notes: "Best visited early morning to avoid crowds",
          rating: 4.8,
          reviews_count: 50000,
          tags: ["historical", "photography", "architecture"]
        },
        {
          start: "12:00",
          end: "13:30",
          title: "Lunch at Local Restaurant",
          type: "meal",
          location: "Karim's Restaurant, Old Delhi",
          description: "Authentic Mughlai cuisine in the heart of Old Delhi",
          cost: 500,
          currency: "INR",
          notes: "Try the famous butter chicken",
          rating: 4.5,
          reviews_count: 12000,
          tags: ["food", "local cuisine", "traditional"]
        },
        {
          start: "14:00",
          end: "17:00",
          title: "Red Fort Exploration",
          type: "activity",
          location: "Red Fort, Delhi",
          description: "Visit the historic Red Fort and explore its museums",
          cost: 300,
          currency: "INR",
          notes: "Audio guide recommended",
          rating: 4.6,
          reviews_count: 25000,
          tags: ["historical", "fort", "museum"]
        }
      ],
      weather_forecast: {
        temperature: 25,
        condition: "Sunny",
        precipitation_chance: 10,
        wind_speed: 5
      }
    },
    {
      day: 2,
      date: "2025-01-16",
      title: "Day 2: Cultural Experience",
      time_blocks: [
        {
          start: "08:00",
          end: "09:00",
          title: "Breakfast at Hotel",
          type: "meal",
          location: "Hotel Connaught Place",
          description: "Traditional Indian breakfast with coffee",
          cost: 200,
          currency: "INR",
          notes: "Freshly brewed coffee available",
          rating: 4.2,
          reviews_count: 800
        },
        {
          start: "10:00",
          end: "12:00",
          title: "Qutub Minar Visit",
          type: "activity",
          location: "Qutub Minar, Delhi",
          description: "Explore the tallest brick minaret in the world",
          cost: 200,
          currency: "INR",
          notes: "Climbing to the top offers great views",
          rating: 4.4,
          reviews_count: 18000,
          tags: ["historical", "minaret", "UNESCO"]
        },
        {
          start: "13:00",
          end: "14:00",
          title: "Lunch at Hauz Khas Village",
          type: "meal",
          location: "Hauz Khas Village, Delhi",
          description: "Modern fusion cuisine in a trendy location",
          cost: 800,
          currency: "INR",
          notes: "Popular with young crowd",
          rating: 4.3,
          reviews_count: 6500,
          tags: ["modern", "trendy", "fusion"]
        },
        {
          start: "15:00",
          end: "18:00",
          title: "Lotus Temple Visit",
          type: "activity",
          location: "Lotus Temple, Delhi",
          description: "Visit the beautiful Bahai House of Worship",
          cost: 0,
          currency: "INR",
          notes: "Free entry, peaceful atmosphere",
          rating: 4.7,
          reviews_count: 22000,
          tags: ["religious", "peaceful", "architecture", "free"]
        }
      ],
      weather_forecast: {
        temperature: 24,
        condition: "Partly Cloudy",
        precipitation_chance: 20,
        wind_speed: 8
      }
    }
  ],
  estimated_cost: {
    currency: "INR",
    min: 15000,
    max: 25000
  },
  bookings: {
    hotels: [],
    activities: [],
    flights: [],
    transportation: []
  },
  metadata: {
    generated_at: new Date().toISOString(),
    version: "1.0",
    confidence_score: 95
  }
};

export default function ItineraryMapTestPage() {
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
        <div className="text-2xl font-bold text-cyan-400 font-mono tracking-wider">
          🧪 ITINERARY MAP TEST MATRIX
        </div>
        <div className="text-sm text-cyan-400 border border-cyan-400/30 px-3 py-1 rounded bg-black/50 backdrop-blur-sm">
          <span className="animate-pulse">●</span> TEST ENVIRONMENT
        </div>
      </header>

      <div className="relative max-w-6xl mx-auto px-6 py-8">
        {/* Description */}
        <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-cyan-400/30 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
          <h1 className="text-2xl font-bold text-cyan-400 font-mono tracking-wider mb-4">
            🗺️ DAY-WISE ITINERARY MAP TEST
          </h1>
          <p className="text-green-400/80 mb-4 font-mono">
            This test demonstrates the comprehensive day-wise itinerary map. The map shows ALL locations from ALL days simultaneously with color-coded markers, allowing you to see your complete trip at a glance.
          </p>
          <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-4">
            <h3 className="text-cyan-400 font-mono font-semibold mb-2">🎯 NEW FEATURES:</h3>
            <ul className="text-sm text-green-400/80 font-mono space-y-1">
              <li>• <strong>All locations visible:</strong> Shows all trip locations at once with day-wise markers</li>
              <li>• <strong>Color-coded by day:</strong> Each day has its unique color (Day 1=Green, Day 2=Orange, etc.)</li>
              <li>• <strong>Multiple markers per location:</strong> Same location on different days gets separate markers</li>
              <li>• <strong>Auto-advance:</strong> Cycles through days every 10 seconds (All Days → Day 1 → Day 2 → ... → All Days)</li>
              <li>• <strong>Flexible navigation:</strong> View all days, specific days, or let it auto-play</li>
              <li>• <strong>Interactive markers:</strong> Click for detailed day-specific activities</li>
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono">
            <div className="text-center border border-cyan-400/20 rounded-lg p-3 bg-black/30">
              <div className="text-lg font-bold text-cyan-400">{sampleTrip.days.length}</div>
              <div className="text-green-400/70">DAYS</div>
            </div>
            <div className="text-center border border-green-400/20 rounded-lg p-3 bg-black/30">
              <div className="text-lg font-bold text-green-400">{sampleTrip.days.reduce((total, day) => total + day.time_blocks.length, 0)}</div>
              <div className="text-green-400/70">ACTIVITIES</div>
            </div>
            <div className="text-center border border-magenta-400/20 rounded-lg p-3 bg-black/30">
              <div className="text-lg font-bold text-magenta-400">{new Set(sampleTrip.days.flatMap(day => day.time_blocks.map(block => block.location))).size}</div>
              <div className="text-green-400/70">LOCATIONS</div>
            </div>
          </div>
        </div>

        {/* Itinerary Map */}
        <ItineraryMap trip={sampleTrip} />

        {/* Sample Data */}
        <div className="mt-8 bg-black/80 backdrop-blur-lg rounded-2xl p-6 border border-cyan-400/30 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
          <h2 className="text-xl font-bold text-cyan-400 font-mono tracking-wider mb-4">
            📊 SAMPLE TRIP DATA
          </h2>
          <div className="space-y-4">
            {sampleTrip.days.map((day) => (
              <div key={day.day} className="border border-cyan-400/20 rounded-lg p-4 bg-black/30">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2 font-mono">
                  DAY {day.day}: {day.title}
                </h3>
                <div className="space-y-2">
                  {day.time_blocks.map((block, index) => (
                    <div key={index} className="flex items-center justify-between text-sm font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="text-cyan-400">🕐</span>
                        <span className="text-green-400/70">{block.start}-{block.end}</span>
                        <span className="text-cyan-400">{block.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400/70">{block.location}</span>
                        <span className="text-cyan-400">({block.type})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-green-400/70 font-mono text-sm">
            🧪 TEST ENVIRONMENT - ITINERARY MAP FUNCTIONALITY
          </p>
        </div>
      </div>
    </div>
  );
}
