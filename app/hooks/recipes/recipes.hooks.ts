import { useState, useEffect, useRef } from "react";
import { Fetcher } from "@remix-run/react";

import { OptimisticIngredients } from "~/types/recipe/recipes";
import { createItemId, useServerLayoutEffect } from "~/utils/misc";

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
    const newIngredient = { id, name, isOptimistic, amount };
    setOptimisticIngredients((ingredients) => [...ingredients, newIngredient]);
  };

  return { renderedIngredients, addIngredient };
};
