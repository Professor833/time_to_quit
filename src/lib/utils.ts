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

// Financial Freedom Calculator Functions
export function calculateFutureExpenses(
  annualExpenses: number,
  inflationRate: number,
  years: number
): number {
  return annualExpenses * Math.pow(1 + inflationRate / 100, years);
}

export function calculateTargetCorpus(
  futureAnnualExpenses: number,
  withdrawalRate: number
): number {
  return futureAnnualExpenses / (withdrawalRate / 100);
}

export interface YearlyProjection {
  year: number;
  netWorth: number;
  targetCorpus: number;
  income: number;
  expenses: number;
  savings: number;
}

export function calculateFinancialFreedomYears(
  currentNetWorth: number,
  annualIncome: number,
  annualExpenses: number,
  incomeGrowthRate: number,
  inflationRate: number,
  investmentReturn: number,
  withdrawalRate: number = 4
): {
  yearsToFreedom: number;
  finalCorpusNeeded: number;
  yearlyProjections: YearlyProjection[];
  freedomYear: number;
} {
  let netWorth = currentNetWorth;
  let income = annualIncome;
  let expenses = annualExpenses;
  const currentYear = new Date().getFullYear();
  let freedomYear = currentYear;
  let targetCorpus = 0;
  let yearsToFreedom = 0;
  let monthsRemaining = 0;
  let finalCorpusNeeded = 0;
  const yearlyProjections: YearlyProjection[] = [];
  
  // Maximum 100 years to prevent infinite loops
  for (let i = 0; i < 100; i++) {
    // Calculate target corpus for this year
    const futureExpenses = calculateFutureExpenses(annualExpenses, inflationRate, i);
    targetCorpus = calculateTargetCorpus(futureExpenses, withdrawalRate);
    
    // Calculate this year's financials
    income = i === 0 ? annualIncome : income * (1 + incomeGrowthRate / 100);
    expenses = i === 0 ? annualExpenses : expenses * (1 + inflationRate / 100);
    const savings = income - expenses;
    
    // Investment returns on existing net worth
    const investmentGrowth = netWorth * (investmentReturn / 100);
    
    // Add this year to projections
    yearlyProjections.push({
      year: currentYear + i,
      netWorth,
      targetCorpus,
      income,
      expenses,
      savings
    });
    
    // Update net worth with investment returns and new savings
    netWorth = netWorth + investmentGrowth + savings;
    
    // Check if we've reached financial freedom
    if (netWorth >= targetCorpus && yearsToFreedom === 0) {
      yearsToFreedom = i;
      freedomYear = currentYear + i;
      finalCorpusNeeded = targetCorpus;
      
      // Calculate remaining months if we reached freedom mid-year
      if (i > 0) {
        const prevYearNetWorth = yearlyProjections[i - 1].netWorth;
        const netWorthGrowthForYear = netWorth - prevYearNetWorth;
        const netWorthGrowthPerMonth = netWorthGrowthForYear / 12;
        
        // How many months did it take to reach the target from the previous year?
        const netWorthGapFromPrevYear = targetCorpus - prevYearNetWorth;
        monthsRemaining = Math.ceil(netWorthGapFromPrevYear / netWorthGrowthPerMonth);
        
        // Adjust if we calculated more than 12 months
        if (monthsRemaining > 12) monthsRemaining = 0;
      }
    }
    
    // Continue for a few more years after reaching freedom to show projection
    if (yearsToFreedom > 0 && i >= yearsToFreedom + 5) {
      break;
    }
  }
  
  // If we never reached freedom in our simulation
  if (yearsToFreedom === 0) {
    yearsToFreedom = 100;
    finalCorpusNeeded = targetCorpus;
  }
  
  return {
    yearsToFreedom: yearsToFreedom + (monthsRemaining / 12),
    finalCorpusNeeded,
    yearlyProjections,
    freedomYear
  };
}

export function formatYearsAndMonths(years: number): string {
  const fullYears = Math.floor(years);
  const months = Math.round((years - fullYears) * 12);
  
  if (years === Infinity || years > 100) {
    return "Never";
  }
  
  if (fullYears === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  
  if (months === 0) {
    return `${fullYears} year${fullYears !== 1 ? 's' : ''}`;
  }
  
  return `${fullYears} year${fullYears !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
}

export function formatCrores(amount: number): string {
  if (amount >= 10000000) {
    return `${(amount / 10000000).toFixed(2)} crore`;
  } else if (amount >= 100000) {
    return `${(amount / 100000).toFixed(2)} lakh`;
  } else {
    return formatCurrency(amount);
  }
}
