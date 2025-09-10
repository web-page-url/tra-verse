'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormData {
  location: string;
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

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Destination
              </label>
              <input
                type="text"
                placeholder="e.g., Manali, India or Paris, France"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateFormData('startDate', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => updateFormData('endDate', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
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
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Maximum"
                  value={formData.budgetMax}
                  onChange={(e) => updateFormData('budgetMax', parseInt(e.target.value))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
          Tra Verse
        </Link>
        <div className="text-sm text-gray-400">
          Step {currentStep} of {steps.length}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id <= currentStep
                      ? 'bg-teal-500 text-white'
                      : 'bg-white/20 text-gray-400'
                  }`}
                >
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step.id < currentStep ? 'bg-teal-500' : 'bg-white/20'
                    }`}
                  />
                )}
              </div>
            ))}
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
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">{steps[currentStep - 1].title}</h2>
              <p className="text-gray-300">{steps[currentStep - 1].description}</p>
            </div>

            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-3 bg-white/10 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              Next
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid() || isLoading}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-teal-500 to-purple-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Your Trip...
                </>
              ) : (
                'Create My Itinerary'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
