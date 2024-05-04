import * as recipeTypes from "~/types/recipe/recipes";

const GroceryListItem = ({ item }: { item: recipeTypes.GroceryListItem }) => {
  return (
    <div>
      <h3>{item.name}</h3>
      <ul>
        {item.uses.map((use) => (
          <li key={use.id}>
            {use.amount} {use.recipeName} x{use.multiplier}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function GroceryList() {
  return <div>Grocery List</div>;
}
