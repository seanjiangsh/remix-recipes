import { Fetcher } from "@remix-run/react";
import { useState } from "react";

import { Items, OptimisticItems } from "~/types/pantry/pantry";
import { createItemId, useServerLayoutEffect } from "~/utils/misc";

// * note about optimistic updates:
// * When a user performs an action, such as deleting a shelf,
// * the UI can update immediately to reflect the action.
// * This makes the UI feel more responsive.
// * If the action fails, the UI can be updated to reflect the failure.
// * This is called an optimistic update.

export const useOptimisticItems = (
  savedItems: Items,
  createShelfItemState: Fetcher["state"]
) => {
  const [optimisticItems, setOptimisticItems] = useState<OptimisticItems>([]);
  const items = [...optimisticItems, ...savedItems];
  const renderedItems = items.sort((a, b) => a.name.localeCompare(b.name));

  useServerLayoutEffect(() => {
    if (createShelfItemState !== "idle") return;
    setOptimisticItems([]);
  }, [createShelfItemState]);

  const addItem = (name: string) => {
    const newItem = { id: createItemId(), name, isOptimistic: true };
    setOptimisticItems((items) => [...items, newItem]);
  };

  return { renderedItems, addItem };
};
