'use client';

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <div className="min-h-screen bg-black text-green-400 overflow-hidden relative font-mono">
      {/* Enhanced Cyberpunk Background with Matrix-style Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Enhanced Matrix Rain Effect */}
        <div className="matrix-rain"></div>
        <div className="matrix-rain matrix-rain-delayed"></div>

        {/* Advanced Neon Circuit Grid */}
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        <div className="absolute inset-0 cyber-grid cyber-grid-secondary opacity-20"></div>

        {/* Enhanced Glowing Neon Orbs */}
        <div className="absolute -top-10 -right-10 sm:-top-20 sm:-right-20 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-radial from-cyan-400/30 via-blue-500/15 to-transparent rounded-full animate-pulse-glow shadow-[0_0_100px_rgba(34,211,238,0.3)]"></div>
        <div className="absolute -bottom-10 -left-10 sm:-bottom-20 sm:-left-20 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-radial from-magenta-400/30 via-purple-500/15 to-transparent rounded-full animate-pulse-glow-delayed shadow-[0_0_100px_rgba(236,72,153,0.3)]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-radial from-green-400/25 via-emerald-500/12 to-transparent rounded-full animate-pulse-glow-slow shadow-[0_0_80px_rgba(34,197,94,0.3)]"></div>

        {/* Cyberpunk Data Streams */}
        <div className="absolute top-1/4 left-1/4 w-1 h-32 bg-gradient-to-b from-cyan-400 via-cyan-300/50 to-transparent animate-data-stream shadow-[0_0_20px_rgba(34,211,238,0.5)]"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-24 bg-gradient-to-b from-magenta-400 via-magenta-300/50 to-transparent animate-data-stream-delayed shadow-[0_0_20px_rgba(236,72,153,0.5)]"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-40 bg-gradient-to-b from-green-400 via-green-300/50 to-transparent animate-data-stream-slow shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>

        {/* Advanced Floating Circuit Elements */}
        <div className="absolute top-12 left-6 sm:top-20 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 border-2 border-cyan-400/80 rounded animate-circuit-float shadow-[0_0_30px_rgba(34,211,238,0.6)]">
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
        </div>
        <div className="absolute top-20 right-8 sm:top-32 sm:right-16 w-10 h-10 sm:w-12 sm:h-12 border-2 border-magenta-400/80 rotate-45 animate-circuit-float-delayed shadow-[0_0_30px_rgba(236,72,153,0.6)]">
          <div className="absolute top-1/2 left-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-magenta-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
        </div>
        <div className="absolute bottom-16 left-8 sm:bottom-24 sm:left-20 w-11 h-11 sm:w-14 sm:h-14 border-2 border-green-400/80 rounded-lg animate-circuit-float-slow shadow-[0_0_30px_rgba(34,197,94,0.6)]">
          <div className="absolute top-1/2 left-1/2 w-1 h-1 sm:w-1 sm:h-1 bg-green-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
        </div>

        {/* Enhanced Scanlines Effect */}
        <div className="absolute inset-0 scanlines opacity-10 sm:opacity-15"></div>

        {/* Advanced Glitch Lines */}
        <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent animate-glitch-line shadow-[0_0_20px_rgba(34,211,238,0.4)]"></div>
        <div className="absolute top-2/3 right-0 w-full h-0.5 bg-gradient-to-l from-transparent via-magenta-400/70 to-transparent animate-glitch-line-delayed shadow-[0_0_20px_rgba(236,72,153,0.4)]"></div>
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400/70 to-transparent animate-glitch-line-slow shadow-[0_0_20px_rgba(34,197,94,0.4)]"></div>

        {/* Neon Border Frame - Mobile Optimized */}
        <div className="absolute inset-0 border border-cyan-400/20 sm:border-cyan-400/30 pointer-events-none">
          <div className="absolute top-0 left-0 w-12 h-0.5 sm:w-16 bg-gradient-to-r from-cyan-400 to-transparent animate-neon-border"></div>
          <div className="absolute top-0 right-0 w-12 h-0.5 sm:w-16 bg-gradient-to-l from-cyan-400 to-transparent animate-neon-border-delayed"></div>
          <div className="absolute bottom-0 left-0 w-12 h-0.5 sm:w-16 bg-gradient-to-r from-cyan-400 to-transparent animate-neon-border-slow"></div>
          <div className="absolute bottom-0 right-0 w-12 h-0.5 sm:w-16 bg-gradient-to-l from-cyan-400 to-transparent animate-neon-border-reverse"></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Cyberpunk Header - Mobile Responsive */}
        <header className="flex justify-between items-center p-4 sm:p-6 backdrop-blur-md bg-black/80 border-b border-cyan-400/30 relative overflow-hidden">
          {/* Animated background scanline */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent animate-scanline"></div>

          <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-cyan-400 bg-black flex items-center justify-center relative">
              <span className="text-cyan-400 font-bold text-sm sm:text-lg animate-pulse">⚡</span>
              <div className="absolute inset-0 border border-cyan-400/50 animate-ping"></div>
            </div>
            <div className="relative">
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-green-400 to-magenta-400 bg-clip-text text-transparent animate-text-glitch">
                TRA VERSE
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-magenta-400 animate-pulse-glow"></div>
            </div>
          </div>

          <nav className="hidden md:flex space-x-6 lg:space-x-8 relative z-10">
            <a href="#features" className="text-green-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110 font-mono text-xs sm:text-sm tracking-wider relative group cursor-pointer">
              [FEATURES]
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300 animate-pulse-glow"></span>
            </a>
            <a href="#how-it-works" className="text-green-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110 font-mono text-xs sm:text-sm tracking-wider relative group cursor-pointer">
              [HOW_IT_WORKS]
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-magenta-400 group-hover:w-full transition-all duration-300 animate-pulse-glow-delayed"></span>
            </a>
            <a href="#pricing" className="text-green-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110 font-mono text-xs sm:text-sm tracking-wider relative group cursor-pointer">
              [PRICING]
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300 animate-pulse-glow-slow"></span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-green-400 border border-green-400/50 px-2 py-1 sm:px-3 sm:py-1 font-mono text-xs hover:bg-green-400/10 transition-all duration-300 relative"
          >
            <span className="animate-pulse">{isMobileMenuOpen ? '[CLOSE]' : '[MENU]'}</span>
            <div className="absolute inset-0 border border-green-400/20 animate-ping"></div>
          </button>

          {/* Mobile Menu Overlay */}
          <div className={`menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}></div>

          {/* Mobile Menu */}
          <div className={`md:hidden fixed top-0 left-0 w-64 h-full bg-black/95 border-r border-cyan-400/30 backdrop-blur-lg z-50 mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-cyan-400 font-mono">[NAVIGATION]</span>
                <button onClick={toggleMobileMenu} className="text-green-400 hover:text-cyan-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="space-y-6">
                <a
                  href="#features"
                  onClick={toggleMobileMenu}
                  className="block text-green-400 hover:text-cyan-400 transition-all duration-300 hover:scale-105 font-mono text-sm tracking-wider relative group cursor-pointer"
                >
                  [FEATURES]
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300 animate-pulse-glow"></span>
                </a>
                <a
                  href="#how-it-works"
                  onClick={toggleMobileMenu}
                  className="block text-green-400 hover:text-cyan-400 transition-all duration-300 hover:scale-105 font-mono text-sm tracking-wider relative group cursor-pointer"
                >
                  [HOW_IT_WORKS]
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-magenta-400 group-hover:w-full transition-all duration-300 animate-pulse-glow-delayed"></span>
                </a>
                <a
                  href="#pricing"
                  onClick={toggleMobileMenu}
                  className="block text-green-400 hover:text-cyan-400 transition-all duration-300 hover:scale-105 font-mono text-sm tracking-wider relative group cursor-pointer"
                >
                  [PRICING]
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300 animate-pulse-glow-slow"></span>
                </a>

                <div className="pt-6 border-t border-green-400/30">
                  <Link
                    href="/plan"
                    onClick={toggleMobileMenu}
                    className="block w-full px-4 py-3 bg-black border-2 border-cyan-400 rounded-lg text-center text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 font-mono text-sm"
                  >
                    [PLAN_MISSION]
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </header>

        {/* Cyberpunk Hero Section - Mobile Responsive */}
        <main className="flex flex-col items-center justify-center min-h-[90vh] sm:min-h-[95vh] px-4 sm:px-6 text-center relative">
          {/* Cyberpunk floating elements - Mobile Optimized */}
          <div className="absolute top-12 left-6 sm:top-16 sm:left-12 w-16 h-16 sm:w-24 sm:h-24 border-2 border-cyan-400/60 rotate-45 animate-circuit-float">
            <div className="absolute top-1/2 left-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          </div>
          <div className="absolute top-16 right-8 sm:top-24 sm:right-20 w-14 h-14 sm:w-20 sm:h-20 border-2 border-magenta-400/60 animate-circuit-float-delayed">
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-magenta-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          </div>
          <div className="absolute bottom-20 left-8 sm:bottom-24 sm:left-16 w-12 h-12 sm:w-18 sm:h-18 border-2 border-green-400/60 rounded-lg animate-circuit-float-slow">
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          </div>

          {/* Data stream effects - Mobile Hidden */}
          <div className="hidden sm:block absolute left-8 top-1/4 w-0.5 h-32 bg-gradient-to-b from-cyan-400/80 to-transparent animate-data-stream"></div>
          <div className="hidden sm:block absolute right-8 top-1/3 w-0.5 h-24 bg-gradient-to-b from-magenta-400/80 to-transparent animate-data-stream-delayed"></div>

          {/* Central energy core - Mobile Optimized */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-80 sm:h-80 border border-cyan-400/30 rounded-full animate-spin-reverse">
            <div className="absolute inset-2 sm:inset-4 border border-magenta-400/40 rounded-full animate-spin-slow">
              <div className="absolute inset-4 sm:inset-8 border border-green-400/50 rounded-full animate-spin">
                <div className="absolute top-1/2 left-1/2 w-2 h-2 sm:w-4 sm:h-4 bg-gradient-to-r from-cyan-400 to-magenta-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse-glow"></div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl relative z-10 px-2 sm:px-0">
            {/* Cyberpunk animated badge - Mobile Responsive */}
            <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-black/80 border border-cyan-400/60 rounded-lg text-xs sm:text-sm font-mono text-cyan-400 mb-8 sm:mb-12 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-magenta-400/10 animate-pulse"></div>
              <span className="animate-pulse mr-1 sm:mr-2 text-sm">⚡</span>
              <span className="tracking-wider relative z-10 text-xs sm:text-sm">[AI_POWERED_TRAVEL_SYSTEM]</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-scanline opacity-0 group-hover:opacity-100"></div>
            </div>

            {/* Cyberpunk main headline - Mobile Responsive */}
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 sm:mb-12 leading-tight font-mono relative px-2">
              <span className="block text-green-400 animate-text-glitch relative text-3xl sm:text-6xl md:text-8xl">
                EXPLORE_YOUR
                <div className="absolute inset-0 bg-green-400/20 animate-flicker"></div>
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 via-magenta-400 to-green-400 bg-clip-text text-transparent animate-text-glitch relative text-3xl sm:text-6xl md:text-8xl">
                TRAVEL_UNIVERSE
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-magenta-400/20 to-green-400/20 blur-lg animate-pulse-glow"></div>
              </span>
              {/* Cyberpunk underline - Mobile Responsive */}
              <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-full h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse-glow"></div>
              <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 h-0.5 bg-cyan-400 animate-pulse-glow-delayed"></div>
            </h1>

            {/* Cyberpunk subheading - Mobile Responsive */}
            <div className="text-base sm:text-lg md:text-xl text-green-300 mb-12 sm:mb-16 max-w-4xl mx-auto leading-relaxed font-mono relative px-2">
              <span className="animate-typing block mb-2 sm:mb-4">INITIALIZING_TRAVEL_MATRIX...</span>
              <span className="text-cyan-400 animate-pulse block mb-2">
                Transform your travel dreams into reality with our
              </span>
              <span className="text-magenta-400 font-bold animate-text-glitch block mb-2">
                QUANTUM_AI_PLATFORM
                <span className="inline-block w-1 h-3 sm:w-2 sm:h-5 bg-green-400 ml-1 animate-pulse"></span>
              </span>
              <span className="text-green-400/80 animate-fade-in-delayed block">
                Discover personalized itineraries that adapt to your preferences, budget, and schedule.
              </span>
            </div>

            {/* Cyberpunk CTA Buttons - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center mb-16 sm:mb-20 px-4">
              <Link
                href="/plan"
                className="group relative px-8 py-4 sm:px-12 sm:py-6 bg-black border-2 border-cyan-400 rounded-lg text-lg sm:text-xl font-mono text-cyan-400 hover:bg-cyan-400/10 transition-all duration-500 transform hover:scale-105 shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 overflow-hidden w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-magenta-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl mr-2 sm:mr-3 animate-pulse">⚡</span>
                  <span className="tracking-wider text-sm sm:text-base">[PLAN_MISSION]</span>
                  <span className="ml-2 sm:ml-3 text-cyan-400 animate-pulse text-lg">▶</span>
                </span>
                <div className="absolute inset-0 border border-cyan-400/50 animate-ping opacity-0 group-hover:opacity-100"></div>
              </Link>

              <button className="group relative px-8 py-4 sm:px-12 sm:py-6 bg-black border-2 border-green-400 rounded-lg text-lg sm:text-xl font-mono text-green-400 hover:bg-green-400/10 transition-all duration-500 transform hover:scale-105 shadow-lg shadow-green-400/20 hover:shadow-green-400/40 w-full sm:w-auto">
                <span className="relative z-10 flex items-center justify-center">
                  <span className="mr-2 sm:mr-3 animate-pulse text-lg">▶</span>
                  <span className="tracking-wider text-sm sm:text-base">[WATCH_DEMO]</span>
                  <div className="ml-2 sm:ml-3 w-1.5 h-3 sm:w-2 sm:h-4 border border-green-400 relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-green-400 animate-pulse"></div>
                  </div>
                </span>
                <div className="absolute inset-0 border border-green-400/50 animate-ping opacity-0 group-hover:opacity-100"></div>
              </button>
            </div>

            {/* Cyberpunk Stats - Mobile Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
              <div className="text-center bg-black/50 border border-cyan-400/30 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-mono text-cyan-400 mb-2 animate-pulse-glow">10K+</div>
                <div className="text-green-400/80 text-xs sm:text-sm font-mono">[DIGITAL_TRAVELERS]</div>
                <div className="mt-2 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
              </div>
              <div className="text-center bg-black/50 border border-magenta-400/30 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-mono text-magenta-400 mb-2 animate-pulse-glow-delayed">50+</div>
                <div className="text-green-400/80 text-xs sm:text-sm font-mono">[VIRTUAL_DESTINATIONS]</div>
                <div className="mt-2 w-full h-0.5 bg-gradient-to-r from-transparent via-magenta-400/50 to-transparent"></div>
              </div>
              <div className="text-center bg-black/50 border border-green-400/30 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-mono text-green-400 mb-2 animate-pulse-glow-slow">[AI]</div>
                <div className="text-green-400/80 text-xs sm:text-sm font-mono">[NEURAL_NETWORK]</div>
                <div className="mt-2 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
              </div>
            </div>

        </div>
      </main>

        {/* Enhanced Features Section */}
        <section id="features" className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Revolutionary Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Experience travel planning like never before with our cutting-edge AI technology
                and intuitive design that puts you in control.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI Itineraries",
                  description: "Our advanced AI creates personalized travel plans that adapt to your preferences, weather, and local events in real-time.",
                  icon: "🤖",
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  title: "Smart Maps",
                  description: "Interactive 3D maps with route optimization, location insights, and seamless navigation integration.",
                  icon: "🗺️",
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  title: "Instant Booking",
                  description: "One-click booking integration with top travel providers. Save time and money with our smart recommendations.",
                  icon: "⚡",
                  gradient: "from-emerald-500 to-teal-500"
                },
                {
                  title: "Weather Adaptive",
                  description: "Plans that automatically adjust based on weather forecasts, ensuring you always have the best experience.",
                  icon: "🌤️",
                  gradient: "from-orange-500 to-red-500"
                },
                {
                  title: "Local Insights",
                  description: "Get insider knowledge about hidden gems, local customs, and authentic experiences from AI-curated data.",
                  icon: "🎯",
                  gradient: "from-indigo-500 to-purple-500"
                },
                {
                  title: "24/7 Support",
                  description: "Round-the-clock AI assistance and human support to help you plan and execute your perfect trip.",
                  icon: "🎧",
                  gradient: "from-pink-500 to-rose-500"
                }
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-blue-900/20"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Plan your dream trip in just three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Tell Us Your Preferences",
                  description: "Share your destination, dates, budget, and interests. Our AI learns what makes your perfect trip.",
                  icon: "🎯"
                },
                {
                  step: "02",
                  title: "AI Creates Your Itinerary",
                  description: "Our advanced AI generates personalized itineraries with weather-adaptive activities and local insights.",
                  icon: "⚡"
                },
                {
                  step: "03",
                  title: "Book & Explore",
                  description: "Review, customize, and book your perfect trip. Travel with confidence knowing every detail is optimized.",
                  icon: "🎉"
                }
              ].map((step, index) => (
                <div
                  key={step.step}
                  className="text-center group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-500"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.step}
                  </div>
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-blue-900/30"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="mb-8">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Ready to Explore?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of travelers who have discovered their perfect adventures with Tra Verse.
                Your dream trip is just one click away.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/plan"
                className="group relative px-12 py-6 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl text-xl font-bold text-white shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  🌟 Start Planning Now
                  <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Trusted by travelers worldwide</div>
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-300 text-sm">4.9/5 (2,847 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="py-16 px-6 border-t border-white/10 backdrop-blur-md bg-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🌟</span>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Tra Verse
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Revolutionizing travel planning with AI-powered itineraries and seamless booking experiences.
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <a href="#" className="block hover:text-white transition-colors">Features</a>
                  <a href="#" className="block hover:text-white transition-colors">Pricing</a>
                  <a href="#" className="block hover:text-white transition-colors">API</a>
                  <a href="#" className="block hover:text-white transition-colors">Integrations</a>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <a href="#" className="block hover:text-white transition-colors">About</a>
                  <a href="#" className="block hover:text-white transition-colors">Blog</a>
                  <a href="#" className="block hover:text-white transition-colors">Careers</a>
                  <a href="#" className="block hover:text-white transition-colors">Press</a>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Support</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <a href="#" className="block hover:text-white transition-colors">Help Center</a>
                  <a href="#" className="block hover:text-white transition-colors">Contact</a>
                  <a href="#" className="block hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="block hover:text-white transition-colors">Terms</a>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 Tra Verse. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
      </footer>
      </div>
    </div>
  );
}
