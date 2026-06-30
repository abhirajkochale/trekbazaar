export type Difficulty = "easy" | "moderate" | "difficult" | "extreme";
export type MasterTrekDifficulty = "Easy" | "Moderate" | "Difficult" | "Extreme";
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

export interface MasterTrekCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MasterTrek {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  region_id: string | null;
  country: string;
  state: string | null;
  difficulty: MasterTrekDifficulty | null;
  duration_min: number | null;
  duration_max: number | null;
  altitude: string | null;
  best_season: string | null;
  overview: string | null;
  cover_image: string | null;
  gallery: string[];
  highlights: string[];
  seo_title: string | null;
  seo_description: string | null;
  status: TrekStatus;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  category?: MasterTrekCategory;
  region?: Region;
}

export type OnboardingStatus = 
  | "REGISTERED"
  | "PROFILE_COMPLETED"
  | "DUE_DILIGENCE"
  | "TERMS_ACCEPTED"
  | "KYC_COMPLETED"
  | "READY_FOR_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED"
  | "SUSPENDED";

export type CompanyStatus = "active" | "suspended";

export interface Company {
  id: string;
  name: string;
  slug: string;
  owner_id?: string | null;
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
  pan_number: string | null;
  years_of_experience: number;
  
  gst_document_url: string | null;
  pan_document_url: string | null;
  registration_document_url: string | null;
  owner_id_document_url: string | null;

  bank_account_holder_name: string | null;
  bank_account_number: string | null;
  bank_ifsc_code: string | null;
  bank_name: string | null;
  bank_branch_name: string | null;
  
  onboarding_status: OnboardingStatus;
  terms_accepted_at: string | null;
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
  master_trek_id: string | null;
  title: string;
  slug: string;
  short_description: string | null;
  description: string;
  gallery: string[];
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
  
  // DEPRECATED: denormalized for public display only. Source of truth is company_id.
  operator_name: string | null;
  operator_contact: string | null;
  status: TrekStatus;
  created_at: string;
  updated_at: string;
  
  departures?: Departure[];
  master_treks?: { name: string };
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

export type BookingStatus = "Pending" | "Confirmed" | "Rejected" | "Cancelled" | "Completed";

export interface Booking {
  id: string;
  booking_reference: string;
  departure_id: string;
  trek_id: string;
  company_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  travellers_count: number;
  departure_date: string;
  departure_price: number;
  total_amount: number;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined fields for UI
  departures?: Departure;
  treks?: { title: string };
  companies?: { name: string };
}
