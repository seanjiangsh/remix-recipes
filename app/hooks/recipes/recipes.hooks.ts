import { useState, useEffect, useRef } from "react";
import { Fetcher, useOutletContext } from "@remix-run/react";

import { createItemId, useServerLayoutEffect } from "~/utils/misc";
import { Ingredient } from "~/utils/ddb/recipe/schema";

export const useDelayedBool = (value: boolean | undefined, delay: number) => {
  const [delayed, setDelayed] = useState(false);
  const timeoutId = useRef<number>();
  useEffect(() => {
    if (value) {
      timeoutId.current = window.setTimeout(() => {
        setDelayed(true);
      }, delay);
    } else {
      window.clearTimeout(timeoutId.current);
      setDelayed(false);
    }
    return () => window.clearTimeout(timeoutId.current);
  }, [value, delay]);

  return delayed;
};

export type OptimisticIngredient = Ingredient & { isOptimistic?: boolean };
type OptimisticIngredients = Array<OptimisticIngredient>;

export const useOptimisticIngredients = (
  savedIngredients: OptimisticIngredients,
  createIngredientState: Fetcher["state"]
) => {
  const [optimisticIngredients, setOptimisticIngredients] =
    useState<OptimisticIngredients>([]);
  const renderedIngredients = [...savedIngredients, ...optimisticIngredients];

  useServerLayoutEffect(() => {
    if (createIngredientState !== "idle") return;
    setOptimisticIngredients([]);
  }, [createIngredientState]);

  const addIngredient = (amount: string | null, name: string) => {
    const id = createItemId();
    const isOptimistic = true;
    const otherData = { userId: "", recipeId: "", amount: amount || "" };
    const newIngredient = { id, name, isOptimistic, ...otherData };
    setOptimisticIngredients((ingredients) => [...ingredients, newIngredient]);
  };

  return { renderedIngredients, addIngredient };
};

export const useRecipeContext = () => {
  type OutletContext = {
    recipeName: string;
    mealPlanMultiplier: number | null;
  };
  return useOutletContext<OutletContext>();
};
