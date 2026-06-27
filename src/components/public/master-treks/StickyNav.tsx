"use client";

import React, { useState, useEffect } from 'react';

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'operators', label: 'Operators' },
  { id: 'departures', label: 'Departures' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'inclusions', label: 'Inclusions' },
];

export function StickyNav() {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for sticky nav height

      for (const item of [...navItems].reverse()) {
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Account for sticky nav
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sticky top-12 md:top-14 z-40 w-full bg-white/90 backdrop-blur-md border-y border-zinc-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center overflow-x-auto hide-scrollbar whitespace-nowrap gap-6 py-4">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                  activeSection === item.id 
                    ? 'text-tb-primary border-b-2 border-tb-primary pb-1' 
                    : 'text-zinc-500 hover:text-zinc-900 pb-1 border-b-2 border-transparent'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
