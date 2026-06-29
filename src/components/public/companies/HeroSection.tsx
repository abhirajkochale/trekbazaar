import React from 'react';

export function HeroSection() {
  return (
    <div className="bg-tb-primary py-16 sm:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute left-[10%] top-[20%] w-96 h-96" viewBox="0 0 100 100" preserveAspectRatio="none">
           <polygon fill="currentColor" points="0,100 50,0 100,100"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 drop-shadow-sm">
          Explore Trekking Companies
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium mb-10 leading-relaxed">
          India's largest marketplace of verified trekking operators. Compare destinations, reviews, departures, and prices to find your perfect adventure partner.
        </p>
      </div>
    </div>
  );
}
