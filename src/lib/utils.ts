import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function calculateMonthsOfFreedom(
  savings: number,
  monthlyExpenses: number,
  sideIncome: number = 0
): number {
  const netMonthlyBurn = monthlyExpenses - sideIncome;
  if (netMonthlyBurn <= 0) return Infinity; // If side income covers expenses
  return savings / netMonthlyBurn;
}

export function calculateFreedomScore(
  months: number,
  targetMonths: number = 12
): number {
  if (months >= targetMonths) return 100;
  return Math.round((months / targetMonths) * 100);
}

export function calculateQuitDate(
  months: number,
  currentDate: Date = new Date()
): Date {
  const result = new Date(currentDate);
  result.setMonth(result.getMonth() + Math.floor(months));
  // Add remaining days
  const remainingDays = Math.floor((months % 1) * 30);
  result.setDate(result.getDate() + remainingDays);
  return result;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function calculateBurndownData(
  savings: number,
  monthlyExpenses: number,
  sideIncome: number = 0,
  months: number
): { month: number; savings: number }[] {
  const data = [];
  const netMonthlyBurn = monthlyExpenses - sideIncome;
  
  let remainingSavings = savings;
  for (let i = 0; i <= Math.ceil(months); i++) {
    data.push({
      month: i,
      savings: Math.max(0, remainingSavings)
    });
    remainingSavings -= netMonthlyBurn;
  }
  
  return data;
}

export function calculateRequiredSavings(
  monthlyExpenses: number,
  targetMonths: number,
  sideIncome: number = 0
): number {
  const netMonthlyBurn = monthlyExpenses - sideIncome;
  if (netMonthlyBurn <= 0) return 0; // If side income covers expenses
  return netMonthlyBurn * targetMonths;
}
