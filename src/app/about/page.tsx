'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon, AcademicCapIcon, CodeBracketIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 border-b border-white/10 backdrop-blur-md bg-black/20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 group cursor-target"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            <span className="text-gray-400 group-hover:text-white transition-colors">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🌟</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Tra Verse
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Meet Our Team
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The brilliant minds behind Tra Verse, crafting the future of AI-powered travel planning from the foothills of the Himalayas.
          </p>
        </div>
      </section>

      {/* Creators Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Anubhav Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-500">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden shadow-lg border-2 border-purple-400/50">
                    <Image
                      src="/anubhav.png"
                      alt="Anubhav - B.Tech CSE, IIT Mandi"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    Anubhav
                  </h3>
                  <p className="text-gray-400 text-lg">B.Tech Computer Science & Engineering</p>
                  <p className="text-cyan-400 font-semibold">IIT Mandi</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <CodeBracketIcon className="w-6 h-6 text-purple-400" />
                    <span>Full-Stack Developer & AI Specialist</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <AcademicCapIcon className="w-6 h-6 text-pink-400" />
                    <span>Passionate about AI-driven solutions</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    "Building the future of travel technology, one intelligent itinerary at a time. When I'm not coding, you'll find me exploring new hiking trails or debugging my latest project with a cup of coffee."
                  </p>
                </div>
              </div>
            </div>

            {/* Akriti Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-500">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden shadow-lg border-2 border-cyan-400/50">
                    <Image
                      src="/akriti.jpg"
                      alt="Akriti - B.Tech DSE, IIT Mandi"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    Akriti
                  </h3>
                  <p className="text-gray-400 text-lg">B.Tech Data Science & Engineering</p>
                  <p className="text-cyan-400 font-semibold">IIT Mandi</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <ChartBarIcon className="w-6 h-6 text-cyan-400" />
                    <span>Data Scientist & ML Engineer</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <AcademicCapIcon className="w-6 h-6 text-blue-400" />
                    <span>Expert in predictive analytics</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    "Turning data into meaningful travel insights. From machine learning models to user experience design, I love creating solutions that make travel planning smarter and more personalized."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-purple-900/10 to-pink-900/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Our Story
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-2xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-3 text-white">The Beginning</h3>
              <p className="text-gray-400">
                Two IIT Mandi students with a shared vision for revolutionizing travel planning through AI and data science.
              </p>
            </div>
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-2xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-3 text-white">The Vision</h3>
              <p className="text-gray-400">
                Combining cutting-edge AI with intuitive design to create personalized travel experiences that understand each traveler's unique needs.
              </p>
            </div>
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-2xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-3 text-white">The Future</h3>
              <p className="text-gray-400">
                Building the next generation of travel technology that makes planning adventures as exciting as the journeys themselves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of travelers who've discovered their perfect adventures with Tra Verse.
          </p>
          <Link
            href="/plan"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold text-lg group cursor-target shadow-lg hover:shadow-xl"
          >
            Start Planning Your Journey
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 backdrop-blur-md bg-black/20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Tra Verse.
          </p>
        </div>
      </footer>
    </div>
  );
}
