export type Recipe = {
  id: string;
  name: string;
  totalTime: string;
  imageUrl?: string;
  isActive?: boolean;
  isLoading?: boolean;
};

export type Ingredient = {
  id: string;
  amount: string | null;
  name: string;
};

export type OptimisticIngredient = Ingredient & { isOptimistic?: boolean };
export type OptimisticIngredients = Array<OptimisticIngredient>;
