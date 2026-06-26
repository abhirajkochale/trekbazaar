import React from 'react';
import { TrekCard } from '@/components/TrekCard';
import type { Trek } from '@/lib/types';

const MOCK_TREK: Trek = {
  id: '1',
  slug: 'roopkund-trek',
  title: 'Roopkund Trek',
  description: 'The famous mystery lake trek.',
  region: 'Uttarakhand',
  difficulty: 'difficult',
  duration_days: 8,
  price_per_person: 12500,
  cover_image_url: 'https://images.unsplash.com/photo-1626083515456-e913a52eec89?auto=format&fit=crop&q=80&w=800',
  operator_name: 'Himalayan Explorers',
  operator_contact: 'contact@example.com',
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function ResultsGrid() {
  const mockTreks = Array(6).fill(MOCK_TREK).map((t, i) => ({ ...t, id: String(i) }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockTreks.map((trek) => (
        <TrekCard key={trek.id} trek={trek} />
      ))}
    </div>
  );
}
