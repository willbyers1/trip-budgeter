export interface CategoryBudget {
  name: string;
  dailyAmount: number;
  percentage: number;
}

export interface BudgetEstimate {
  destination: string;
  days: number;
  currency: string;
  dailyAverage: number;
  totalEstimated: number;
  categories: CategoryBudget[];
  notes: string;
}
