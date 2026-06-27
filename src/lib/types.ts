export type Difficulty = "easy" | "moderate" | "difficult" | "extreme";
export type TrekStatus = "draft" | "active" | "archived";

export interface Region {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  hero_image_url: string | null;
  best_season: string | null;
  altitude_range: string | null;
  weather: string | null;
  nearby_attractions: string[] | null;
  safety_tips: string[] | null;
  things_to_know: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  altitude: string;
  accommodation: string;
  distance: string;
  meals: string;
  hours: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export type VerificationStatus = "pending" | "verified" | "rejected";
export type CompanyStatus = "active" | "suspended";

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  cover_image_url: string | null;
  description: string | null;
  
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  emergency_contact: string | null;
  website: string | null;
  
  instagram: string | null;
  facebook: string | null;
  youtube: string | null;
  
  address: string | null;
  city: string | null;
  state: string | null;
  
  gst_number: string | null;
  years_of_experience: number;
  
  gst_document_url: string | null;
  pan_document_url: string | null;
  registration_document_url: string | null;
  
  verification_status: VerificationStatus;
  status: CompanyStatus;
  featured: boolean;
  
  created_at: string;
  updated_at: string;
}

export type DepartureStatus = "Upcoming" | "Full" | "Cancelled" | "Completed";

export interface Departure {
  id: string;
  trek_id: string;
  departure_date: string;
  return_date: string;
  base_price: number;
  offer_price: number | null;
  total_seats: number;
  booked_seats: number;
  pickup_location: string | null;
  notes: string | null;
  status: DepartureStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined fields for UI
  treks?: {
    title: string;
    company_id?: string | null;
    companies?: { name: string };
  };
}

export type Trek = {
  id: string;
  company_id: string | null;
  title: string;
  slug: string;
  short_description: string | null;
  description: string;
  gallery_images: string[];
  region: string;
  difficulty: Difficulty;
  duration_days: number;
  price_per_person: number;
  cover_image_url: string | null;
  
  altitude: string | null;
  distance: string | null;
  base_camp: string | null;
  start_point: string | null;
  end_point: string | null;
  best_season: string | null;
  temperature: string | null;
  age_limit: string | null;
  fitness_level: string | null;
  
  included: string[];
  excluded: string[];
  things_to_carry: string[];
  highlights: string[];
  
  itinerary: ItineraryDay[];
  faqs: FAQ[];
  
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  
  operator_name: string;
  operator_contact: string;
  status: TrekStatus;
  created_at: string;
  updated_at: string;
  
  departures?: Departure[];
};
export type EnquiryStatus = "open" | "responded" | "closed";

export interface Enquiry {
  id: string;
  trek_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: EnquiryStatus;
  created_at: string;
  // If we ever join treks
  treks?: { title: string };
}
