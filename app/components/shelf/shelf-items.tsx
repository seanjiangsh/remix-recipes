import { OptimisticItems } from "~/hooks/pantry/pantry.hooks";
import ShelfItem from "./shelf-item";

type ShelfItemsProps = { items: OptimisticItems };

export default function ShelfItems({ items }: ShelfItemsProps) {
  return (
    <ul>
      {items.map((item) => (
        <ShelfItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
