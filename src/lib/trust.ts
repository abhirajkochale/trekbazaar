import { PublicCompany } from './public/companies';

export interface TrustSignal {
  id: string;
  label: string;
  type: 'verified' | 'experience' | 'scale' | 'location' | 'price' | 'generic';
  icon?: string; // Optional identifier for UI to map to Lucide icons if desired, though we prefer text-first
  highlight?: boolean; // If this signal should be emphasized (e.g. verified badge)
}

/**
 * Trust Engine
 * Generates transparent, data-driven trust signals for a company without faking metrics.
 * Gracefully degrades if data is missing.
 */
export function generateCompanyTrustSignals(company: PublicCompany): TrustSignal[] {
  const signals: TrustSignal[] = [];
  const { metrics } = company;

  // 1. Identity & Verification
  if (company.onboarding_status === 'APPROVED' || metrics.badges.includes('verified')) {
    signals.push({
      id: 'tb-verified',
      label: 'TrekBazaar Verified',
      type: 'verified',
      icon: 'shield-check',
      highlight: true
    });
  }

  // 2. Years in Operation (Scale/Experience)
  // Derive from created_at if years_of_experience is missing
  const currentYear = new Date().getFullYear();
  let startYear = currentYear;
  
  if (company.years_of_experience && company.years_of_experience > 0) {
    startYear = currentYear - company.years_of_experience;
  } else if (company.created_at) {
    startYear = new Date(company.created_at).getFullYear();
  }

  if (startYear < currentYear) {
    signals.push({
      id: 'experience-years',
      label: `Operating since ${startYear}`,
      type: 'experience',
      icon: 'history'
    });
  } else {
     signals.push({
      id: 'experience-new',
      label: `Joined in ${startYear}`,
      type: 'experience',
      icon: 'calendar'
    });
  }

  // 3. Scale (Treks & Departures)
  if (metrics.activeTreksCount > 0) {
    signals.push({
      id: 'scale-treks',
      label: `${metrics.activeTreksCount} Active Treks`,
      type: 'scale',
      icon: 'mountain'
    });
  }

  if (metrics.upcomingDeparturesCount > 0) {
    signals.push({
      id: 'scale-departures',
      label: `${metrics.upcomingDeparturesCount} Upcoming Departures`,
      type: 'scale',
      icon: 'calendar-days'
    });
  }

  // 4. Operating Regions
  if (company.city || company.state) {
    const location = [company.city, company.state].filter(Boolean).join(', ');
    signals.push({
      id: 'location',
      label: `Operating in ${location}`,
      type: 'location',
      icon: 'map-pin'
    });
  }

  return signals;
}
