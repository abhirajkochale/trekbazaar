import type { Difficulty } from "./types";

/** Format a price in Indian Rupees, e.g. 8500 -> "₹8,500". */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** "5 days" / "1 day" */
export function formatDuration(days: number): string {
  return `${days} ${days === 1 ? "day" : "days"}`;
}

/** Capitalized label for a difficulty value. */
export function difficultyLabel(difficulty: Difficulty): string {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

/** Tailwind classes for a difficulty badge. */
export function difficultyBadgeClasses(difficulty: Difficulty): string {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800";
    case "moderate":
      return "bg-amber-100 text-amber-800";
    case "difficult":
      return "bg-orange-100 text-orange-800";
    case "extreme":
      return "bg-red-100 text-red-800";
  }
}
