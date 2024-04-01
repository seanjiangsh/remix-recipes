import { useState } from "react";

import { Item, OptimisticItems } from "~/types/pantry/pantry";
import { useServerLayoutEffect } from "~/utils/misc";

// * note about optimistic updates:
// * When a user performs an action, such as deleting a shelf,
// * the UI can update immediately to reflect the action.
// * This makes the UI feel more responsive.
// * If the action fails, the UI can be updated to reflect the failure.
// * This is called an optimistic update.

export const useOptimisticItems = (savedItems: Array<Item>) => {
  const [optimisticItems, setOptimisticItems] = useState<OptimisticItems>([]);
  const renderedItems = [...optimisticItems, ...savedItems].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  useServerLayoutEffect(() => {
    setOptimisticItems([]);
  }, [savedItems]);

  const addItem = (name: string) => {
    const newItem = { id: createItemId(), name, isOptimistic: true };
    setOptimisticItems((items) => [...items, newItem]);
  };

  return { renderedItems, addItem };
};

function createItemId() {
  return `${Math.round(Math.random() * 1_000_000)}`;
}
