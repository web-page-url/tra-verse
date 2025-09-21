'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  tripType: string;
  avatar: string;
  verified: boolean;
}

const reviews: Review[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    location: 'San Francisco, CA',
    rating: 5,
    review: 'Tra Verse completely transformed how I plan my trips! The AI itinerary for my Japan adventure was spot-on - from the perfect ryokan recommendations to hidden gems I never would have found. Saved me hours of research!',
    tripType: 'Japan Adventure',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    verified: true
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    location: 'Barcelona, Spain',
    rating: 5,
    review: 'As a frequent traveler, I\'ve tried every planning app out there. Tra Verse\'s AI understanding of my preferences blew me away. The 3-day Paris itinerary was perfect - not too packed, but full of authentic experiences.',
    tripType: 'Paris Getaway',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    verified: true
  },
  {
    id: '3',
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    rating: 5,
    review: 'Finally, an AI travel planner that understands Indian travelers! The recommendations for local cuisine, transportation hacks, and cultural experiences in Rajasthan were incredible. Made my family trip unforgettable.',
    tripType: 'Rajasthan Family Tour',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    verified: true
  },
  {
    id: '4',
    name: 'David Kim',
    location: 'Seoul, South Korea',
    rating: 5,
    review: 'The interactive maps and real-time adjustments are game-changers. When weather changed our plans in Switzerland, Tra Verse instantly suggested perfect indoor alternatives. Seamless experience!',
    tripType: 'Swiss Alps Adventure',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    verified: true
  },
  {
    id: '5',
    name: 'Emma Thompson',
    location: 'London, UK',
    rating: 5,
    review: 'Tra Verse made planning my solo trip to Iceland stress-free. The AI chat support helped me customize every detail, and the local insights were invaluable. Will definitely use again!',
    tripType: 'Iceland Solo Journey',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    verified: true
  },
  {
    id: '6',
    name: 'Raj Patel',
    location: 'Ahmedabad, India',
    rating: 5,
    review: 'Outstanding platform! The AI understood my budget constraints and created a perfect 3-day Delhi itinerary with authentic street food experiences and hidden monuments. Much better than traditional travel agents.',
    tripType: 'Delhi Heritage Tour',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    verified: true
  }
];

export default function UserReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  const goToReview = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent"></div>

      {/* Animated Circuit Lines */}
      <div className="absolute top-20 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-data-stream"></div>
      <div className="absolute bottom-20 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-data-stream-delayed"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What Travelers Say
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of satisfied travelers who've discovered their perfect adventures with Tra Verse AI
          </motion.p>
        </div>

        {/* Reviews Display */}
        <div className="relative">
          {/* Main Review Card */}
          <motion.div
            key={currentIndex}
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-black/40 backdrop-blur-lg border border-cyan-400/20 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-cyan-500/5 to-pink-500/5 rounded-2xl"></div>

              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <ChatBubbleLeftRightIcon className="w-16 h-16 text-cyan-400" />
              </div>

              <div className="relative z-10">
                {/* User Info */}
                <div className="flex items-center mb-6">
                  <div className="relative mr-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400/50 shadow-lg">
                      <Image
                        src={reviews[currentIndex].avatar}
                        alt={reviews[currentIndex].name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to a default avatar if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${reviews[currentIndex].name}&background=06b6d4&color=fff&size=64`;
                        }}
                      />
                    </div>
                    {reviews[currentIndex].verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center border-2 border-black">
                        <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xl font-bold text-white">{reviews[currentIndex].name}</h4>
                      <span className="text-sm text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-full border border-cyan-400/20">
                        {reviews[currentIndex].tripType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-sm">{reviews[currentIndex].location}</p>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < reviews[currentIndex].rating ? 'text-yellow-400' : 'text-gray-600'
                            }`}
                          />
                        ))}
                        <span className="text-yellow-400 text-sm ml-1 font-mono">
                          {reviews[currentIndex].rating}.0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <blockquote className="text-gray-300 text-lg leading-relaxed mb-6 italic">
                  "{reviews[currentIndex].review}"
                </blockquote>

                {/* Trust Indicators */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 text-green-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified Review
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 text-cyan-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      Recent Trip
                    </span>
                  </div>
                  <span className="text-cyan-400 font-mono">Tra Verse AI</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            {/* Previous Button */}
            <motion.button
              onClick={prevReview}
              className="w-12 h-12 bg-black/50 border border-cyan-400/30 rounded-full flex items-center justify-center hover:bg-cyan-400/10 hover:border-cyan-400/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToReview(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <motion.button
              onClick={nextReview}
              className="w-12 h-12 bg-black/50 border border-cyan-400/30 rounded-full flex items-center justify-center hover:bg-cyan-400/10 hover:border-cyan-400/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          {/* Auto-play Toggle */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-4 py-2 rounded-full text-sm font-mono transition-all duration-300 ${
                isAutoPlaying
                  ? 'bg-cyan-400/10 border border-cyan-400/30 text-cyan-400'
                  : 'bg-gray-700/50 border border-gray-600 text-gray-400'
              }`}
            >
              {isAutoPlaying ? '⏸️ Auto-play ON' : '▶️ Auto-play OFF'}
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-black/20 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              50K+
            </div>
            <div className="text-gray-400 text-sm">Happy Travelers</div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              4.9★
            </div>
            <div className="text-gray-400 text-sm">Average Rating</div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-green-400/20 rounded-xl p-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              25K+
            </div>
            <div className="text-gray-400 text-sm">Trips Planned</div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-pink-400/20 rounded-xl p-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
              150+
            </div>
            <div className="text-gray-400 text-sm">Countries Covered</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
