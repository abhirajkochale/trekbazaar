export type Difficulty = "easy" | "moderate" | "difficult" | "extreme";
export type TrekStatus = "draft" | "active" | "archived";

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
