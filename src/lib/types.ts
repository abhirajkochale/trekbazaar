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

export type Trek = {
  id: string;
  title: string;
  slug: string;
  description: string;
  region: string;
  difficulty: Difficulty;
  duration_days: number;
  price_per_person: number;
  cover_image_url: string | null;
  operator_name: string;
  operator_contact: string;
  status: TrekStatus;
  created_at: string;
  updated_at: string;
};
