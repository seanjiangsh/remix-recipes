export type Recipe = {
  id: string;
  name: string;
  totalTime: string;
  imageUrl?: string;
  isActive?: boolean;
  isLoading?: boolean;
  mealPlanMultiplier: number | null;
};

export type Ingredient = {
  id: string;
  amount: string | null;
  name: string;
};

export type OptimisticIngredient = Ingredient & { isOptimistic?: boolean };
export type OptimisticIngredients = Array<OptimisticIngredient>;

export type GroceryListItem = {
  id: string;
  name: string;
  uses: Array<{
    id: string;
    amount: string | null;
    recipeName: string;
    multiplier: number;
  }>;
};
