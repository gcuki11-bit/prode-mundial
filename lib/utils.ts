import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es });
}

export function formatDateShort(date: Date | string) {
  return format(new Date(date), "dd MMM", { locale: es });
}

export function formatDateRelative(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
}

export function isMatchLocked(scheduledAt: Date | string, isLocked: boolean): boolean {
  return isLocked || isPast(new Date(scheduledAt));
}

export function calculatePoints(
  prediction: { homeScore: number; awayScore: number },
  result: { homeScore: number; awayScore: number },
  rules = { exactScore: 3, correctResult: 1, goalDifference: 2 }
): { points: number; isExact: boolean; isCorrectResult: boolean } {
  const { homeScore: predHome, awayScore: predAway } = prediction;
  const { homeScore: realHome, awayScore: realAway } = result;

  // Exact score
  if (predHome === realHome && predAway === realAway) {
    return { points: rules.exactScore, isExact: true, isCorrectResult: true };
  }

  const predResult = Math.sign(predHome - predAway);
  const realResult = Math.sign(realHome - realAway);
  const isCorrectResult = predResult === realResult;

  if (!isCorrectResult) {
    return { points: 0, isExact: false, isCorrectResult: false };
  }

  // Correct result
  let points = rules.correctResult;

  // Goal difference bonus
  if (predHome - predAway === realHome - realAway) {
    points += rules.goalDifference;
  }

  return { points, isExact: false, isCorrectResult: true };
}

export function getPositionSuffix(position: number): string {
  if (position === 1) return "🥇";
  if (position === 2) return "🥈";
  if (position === 3) return "🥉";
  return `${position}°`;
}

export function formatScore(home: number | null, away: number | null): string {
  if (home === null || away === null) return "- : -";
  return `${home} : ${away}`;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
