'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GoogleMap from '@/components/GoogleMap';

interface FormData {
  location: string;
  coordinates?: { lat: number; lng: number };
  startDate: string;
  endDate: string;
  numPeople: number;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  travelStyle: string;
  interests: string[];
  accessibilityNeeds: string[];
  dietaryRestrictions: string[];
}

const steps = [
  {
    id: 1,
    title: "Destination",
    description: "Where do you want to go?"
  },
  {
    id: 2,
    title: "Travel Dates",
    description: "When are you planning to travel?"
  },
  {
    id: 3,
    title: "Travel Details",
    description: "Tell us about your group and budget"
  },
  {
    id: 4,
    title: "Preferences",
    description: "What interests you most?"
  },
  {
    id: 5,
    title: "Special Requirements",
    description: "Any accessibility or dietary needs?"
  }
];

export default function PlanPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    location: '',
    coordinates: undefined,
    startDate: '',
    endDate: '',
    numPeople: 2,
    budgetMin: 20000,
    budgetMax: 50000,
    currency: 'INR',
    travelStyle: '',
    interests: [],
    accessibilityNeeds: [],
    dietaryRestrictions: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const calculateDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    return Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Validate date range doesn't exceed 3 days
      if (field === 'startDate' || field === 'endDate') {
        const days = calculateDays(newData.startDate, newData.endDate);
        if (days > 3) {
          // If more than 3 days, adjust the end date to be exactly 3 days from start
          if (field === 'startDate' && newData.endDate) {
            const startDate = new Date(value);
            const maxEndDate = new Date(startDate);
            maxEndDate.setDate(startDate.getDate() + 2); // +2 because we add 1 in calculateDays
            newData.endDate = maxEndDate.toISOString().split('T')[0];
          } else if (field === 'endDate' && newData.startDate) {
            const endDate = new Date(value);
            const minStartDate = new Date(endDate);
            minStartDate.setDate(endDate.getDate() - 2); // -2 because we add 1 in calculateDays
            newData.startDate = minStartDate.toISOString().split('T')[0];
          }
        }
      }

      return newData;
    });
  };

  const handleLocationChange = (location: string, coordinates?: { lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      location,
      coordinates
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Convert form data to API format
      const tripRequest = {
        user: {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          travel_style: formData.travelStyle,
          interests: formData.interests,
          num_people: formData.numPeople,
          budget: {
            currency: formData.currency,
            min: formData.budgetMin,
            max: formData.budgetMax
          },
          dates: {
            start: formData.startDate,
            end: formData.endDate
          }
        },
        trip: {
          location: formData.location,
          days: Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1,
          preferences: {
            pacing: 'moderate'
          },
          constraints: {
            dietary_restrictions: formData.dietaryRestrictions
          }
        },
        context: {
          coordinates: formData.coordinates
        }
      };

      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripRequest),
      });

      const result = await response.json();

      if (result.success) {
        // Use the actual trip ID from the itinerary, not the request ID
        const tripId = result.data.itinerary?.trip_id || result.data.trip_request_id;

        // Store the trip data in localStorage for the trip page to use
        localStorage.setItem(`trip_${tripId}`, JSON.stringify(result.data.itinerary));

        router.push(`/trip/${tripId}`);
      } else {
        throw new Error(result.error || 'Failed to create trip');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to create trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <GoogleMap
            location={formData.location}
            onLocationChange={handleLocationChange}
          />
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-400/70 mb-2 font-mono">
                  START DATE
                  <span className="text-xs text-cyan-400/60 ml-2">(Max 3 days total)</span>
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateFormData('startDate', e.target.value)}
                    className="w-full px-4 py-3 pl-12 pr-14 bg-black/50 border-2 border-orange-400/50 rounded-lg text-green-400 focus:outline-none focus:border-orange-400 focus:shadow-[0_0_20px_rgba(249,115,22,0.3)] font-mono text-lg transition-all duration-300 cursor-pointer hover:border-orange-400/80"
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400">
                    <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.querySelector('input[type="date"]:first-of-type') as HTMLInputElement;
                      if (input) {
                        if (typeof input.showPicker === 'function') {
                          input.showPicker();
                        } else {
                          input.click();
                        }
                      }
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-300 transition-colors duration-200 group-hover:animate-pulse"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-400/70 mb-2 font-mono">
                  END DATE
                  <span className="text-xs text-cyan-400/60 ml-2">(Max 3 days total)</span>
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateFormData('endDate', e.target.value)}
                    className="w-full px-4 py-3 pl-12 pr-14 bg-black/50 border-2 border-orange-400/50 rounded-lg text-green-400 focus:outline-none focus:border-orange-400 focus:shadow-[0_0_20px_rgba(249,115,22,0.3)] font-mono text-lg transition-all duration-300 cursor-pointer hover:border-orange-400/80"
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400">
                    <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const inputs = document.querySelectorAll('input[type="date"]') as NodeListOf<HTMLInputElement>;
                      if (inputs[1]) {
                        if (typeof inputs[1].showPicker === 'function') {
                          inputs[1].showPicker();
                        } else {
                          inputs[1].click();
                        }
                      }
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-300 transition-colors duration-200 group-hover:animate-pulse"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Days Display */}
            {formData.startDate && formData.endDate && (
              <div className="text-center mt-4">
                <div className={`inline-flex items-center px-4 py-2 rounded-lg font-mono text-sm ${
                  calculateDays(formData.startDate, formData.endDate) <= 3
                    ? 'bg-green-900/20 border border-green-400/50 text-green-400'
                    : 'bg-red-900/20 border border-red-400/50 text-red-400'
                }`}>
                  <span className="mr-2">📅</span>
                  <span>
                    {calculateDays(formData.startDate, formData.endDate)} day{calculateDays(formData.startDate, formData.endDate) !== 1 ? 's' : ''} selected
                    {calculateDays(formData.startDate, formData.endDate) > 3 && ' (Maximum 3 days allowed)'}
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Number of People
              </label>
              <select
                value={formData.numPeople}
                onChange={(e) => updateFormData('numPeople', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-black/50 border-2 border-cyan-400/50 rounded-lg text-green-400 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.3)] font-mono text-lg transition-all duration-300"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num} className="bg-slate-800">{num}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Budget Range ({formData.currency})
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Minimum"
                  value={formData.budgetMin}
                  onChange={(e) => updateFormData('budgetMin', parseInt(e.target.value))}
                  className="px-4 py-3 bg-black/50 border-2 border-cyan-400/50 rounded-lg text-green-400 placeholder-green-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.3)] font-mono text-lg transition-all duration-300"
                />
                <input
                  type="number"
                  placeholder="Maximum"
                  value={formData.budgetMax}
                  onChange={(e) => updateFormData('budgetMax', parseInt(e.target.value))}
                  className="px-4 py-3 bg-black/50 border-2 border-cyan-400/50 rounded-lg text-green-400 placeholder-green-400/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.3)] font-mono text-lg transition-all duration-300"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Travel Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['adventure', 'relaxed', 'family', 'romantic', 'cultural', 'luxury'].map(style => (
                  <button
                    key={style}
                    onClick={() => updateFormData('travelStyle', style)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.travelStyle === style
                        ? 'border-teal-500 bg-teal-500/20 text-white'
                        : 'border-white/20 bg-white/10 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    <div className="font-medium capitalize">{style}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Interests
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['hiking', 'food', 'photography', 'museums', 'nature', 'shopping', 'nightlife', 'spa'].map(interest => (
                  <button
                    key={interest}
                    onClick={() => {
                      const newInterests = formData.interests.includes(interest)
                        ? formData.interests.filter(i => i !== interest)
                        : [...formData.interests, interest];
                      updateFormData('interests', newInterests);
                    }}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      formData.interests.includes(interest)
                        ? 'border-teal-500 bg-teal-500/20 text-white'
                        : 'border-white/20 bg-white/10 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Accessibility Needs
              </label>
              <div className="grid grid-cols-1 gap-3">
                {['Wheelchair accessible', 'Hearing impaired', 'Visually impaired', 'Mobility assistance'].map(need => (
                  <button
                    key={need}
                    onClick={() => {
                      const newNeeds = formData.accessibilityNeeds.includes(need)
                        ? formData.accessibilityNeeds.filter(n => n !== need)
                        : [...formData.accessibilityNeeds, need];
                      updateFormData('accessibilityNeeds', newNeeds);
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      formData.accessibilityNeeds.includes(need)
                        ? 'border-teal-500 bg-teal-500/20 text-white'
                        : 'border-white/20 bg-white/10 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    {need}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dietary Restrictions
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher', 'Nut allergy'].map(restriction => (
                  <button
                    key={restriction}
                    onClick={() => {
                      const newRestrictions = formData.dietaryRestrictions.includes(restriction)
                        ? formData.dietaryRestrictions.filter(r => r !== restriction)
                        : [...formData.dietaryRestrictions, restriction];
                      updateFormData('dietaryRestrictions', newRestrictions);
                    }}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      formData.dietaryRestrictions.includes(restriction)
                        ? 'border-teal-500 bg-teal-500/20 text-white'
                        : 'border-white/20 bg-white/10 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    {restriction}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.location.trim().length > 0;
      case 2:
        return formData.startDate && formData.endDate && formData.startDate < formData.endDate;
      case 3:
        return formData.numPeople > 0 && formData.budgetMin < formData.budgetMax;
      case 4:
        return formData.travelStyle && formData.interests.length > 0;
      case 5:
        return true; // Optional step
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 overflow-hidden relative font-mono">
      {/* Cyberpunk Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Matrix Rain Effect */}
        <div className="matrix-rain opacity-30"></div>

        {/* Cyber Grid */}
        <div className="absolute inset-0 cyber-grid opacity-20"></div>

        {/* Neon Orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-radial from-cyan-400/20 via-blue-500/10 to-transparent rounded-full animate-pulse-glow"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-radial from-magenta-400/20 via-purple-500/10 to-transparent rounded-full animate-pulse-glow-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-radial from-green-400/15 via-emerald-500/8 to-transparent rounded-full animate-pulse-glow-slow"></div>

        {/* Data Streams */}
        <div className="absolute top-1/5 left-1/5 w-1 h-24 bg-gradient-to-b from-cyan-400 to-transparent animate-data-stream"></div>
        <div className="absolute top-2/5 right-1/5 w-1 h-20 bg-gradient-to-b from-magenta-400 to-transparent animate-data-stream-delayed"></div>
        <div className="absolute bottom-1/4 left-2/5 w-1 h-28 bg-gradient-to-b from-green-400 to-transparent animate-data-stream-slow"></div>

        {/* Scanlines */}
        <div className="absolute inset-0 scanlines opacity-5"></div>
      </div>

      {/* Header */}
      <header className="relative flex items-center justify-between p-6 border-b border-cyan-400/20">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-green-400 to-magenta-400 bg-clip-text text-transparent animate-pulse-glow">
          TRA VERSE
        </Link>
        <div className="text-sm text-cyan-400 border border-cyan-400/30 px-3 py-1 rounded bg-black/50 backdrop-blur-sm">
          <span className="animate-pulse">●</span> STEP {currentStep} / {steps.length}
        </div>
      </header>

      <div className="relative max-w-2xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono border-2 ${
                    step.id <= currentStep
                      ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] animate-pulse'
                      : 'bg-black/50 text-green-400 border-green-400/50'
                  }`}
                >
                  {step.id <= currentStep ? '●' : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-20 h-1 mx-3 ${
                      step.id < currentStep
                        ? 'bg-gradient-to-r from-cyan-400 to-green-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                        : 'bg-green-400/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-green-400/70 font-mono">
            {steps[currentStep - 1]?.description}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-black/80 backdrop-blur-lg rounded-2xl p-8 border border-cyan-400/30 shadow-[0_0_50px_rgba(34,211,238,0.1)]"
          >
            {/* Corner Accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/50"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/50"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/50"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/50"></div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2 text-cyan-400 font-mono tracking-wider">
                {steps[currentStep - 1].title.toUpperCase()}
              </h2>
              <p className="text-green-400/70 font-mono text-sm">{steps[currentStep - 1].description}</p>
            </div>

            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-3 bg-black/50 border-2 border-green-400/50 rounded-lg text-green-400 disabled:opacity-30 disabled:cursor-not-allowed hover:border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] font-mono text-lg transition-all duration-300 disabled:hover:shadow-none"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            PREVIOUS
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 border-2 border-cyan-400 rounded-lg text-black disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] font-mono text-lg font-bold transition-all duration-300 disabled:hover:shadow-none"
            >
              NEXT
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid() || isLoading}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-cyan-400 via-green-400 to-magenta-400 border-2 border-cyan-400 rounded-lg text-black disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] font-mono text-lg font-bold transition-all duration-300 disabled:hover:shadow-none animate-pulse-glow"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  GENERATING MATRIX...
                </>
              ) : (
                'GENERATE ITINERARY'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
