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
  name: string;
  amount: string | null;
};
