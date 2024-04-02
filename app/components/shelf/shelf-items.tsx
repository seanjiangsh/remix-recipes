import * as pantryTypes from "~/types/pantry/pantry";
import ShelfItem from "./shelf-item";

type ShelfItemsProps = { items: pantryTypes.OptimisticItems };

export default function ShelfItems({ items }: ShelfItemsProps) {
  return (
    <ul>
      {items.map((item) => (
        <ShelfItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
