import * as pantryTypes from "~/types/pantry";
import ShelfItem from "./shelf-item";

type ShelfItemsProps = { items: Array<pantryTypes.Item> };

export default function ShelfItems({ items }: ShelfItemsProps) {
  return (
    <ul>
      {items.map((item) => (
        <ShelfItem key={item.id} shelfItem={item} />
      ))}
    </ul>
  );
}
