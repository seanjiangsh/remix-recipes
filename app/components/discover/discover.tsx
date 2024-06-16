import { Link } from "@remix-run/react";
import classNames from "classnames";

import { TimeIcon } from "~/components/icons/icons";
import { Recipe, RecipeWithIngredients } from "~/utils/ddb/recipe/schema";
import { User } from "~/utils/ddb/user/schema";

export function DiscoverGrid({ children }: { children: React.ReactNode }) {
  return (
    <ul
      className={classNames(
        "grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        "pb-8"
      )}
    >
      {children}
    </ul>
  );
}

type DiscoverListItemProps = { recipe: Recipe & { user: User } };
export function DiscoverListItem({ recipe }: DiscoverListItemProps) {
  const { id, name, imageUrl, user } = recipe;
  const { firstName, lastName } = user;
  return (
    <li
      key={id}
      className={classNames(
        "shadow-md rounded-md border-2 group",
        "hover:text-primary-light hover:border-primary-light"
      )}
    >
      <Link to={id} className="flex flex-col h-full">
        <div className="h-48 overflow-hidden">
          <img
            src={`/images/${imageUrl}`}
            alt={`recipe named ${name}`}
            className="h-full w-full object-cover rounded-t-md"
          />
        </div>
        <div className="p-4 rounded-b-md flex-grow text-shadow-md">
          <h1 className="font-bold text-xl pb-2">{name}</h1>
          <h2>{`${firstName} ${lastName}`}</h2>
        </div>
      </Link>
    </li>
  );
}

type DiscoverRecipeHeaderProps = { recipe: Recipe };
export function DiscoverRecipeHeader({ recipe }: DiscoverRecipeHeaderProps) {
  const { name, imageUrl, totalTime } = recipe;
  return (
    <div className="relative text-teal-950">
      <img
        src={`/images/${imageUrl}`}
        alt={`recipe named ${name}`}
        className="h-44 w-full object-cover"
      />
      <div
        className={classNames(
          "absolute top-0 left-0 w-full h-full bg-[rgba(255,255,255,0.8)]",
          "flex flex-col justify-center p-4 text-shadow-md"
        )}
      >
        <h1 className="text-4xl font-bold mb-4">{name}</h1>
        <div className="flex font-light text-gray-900">
          <TimeIcon />
          <p className="pl-2">{totalTime}</p>
        </div>
      </div>
    </div>
  );
}

type DiscoverRecipeDetailsProps = { recipe: RecipeWithIngredients };
export function DiscoverRecipeDetails({ recipe }: DiscoverRecipeDetailsProps) {
  const { ingredients, instructions } = recipe;
  return (
    <div className="p-4 text-teal-950 dark:text-white">
      <h2 className="text-xl font-bold">Ingredients</h2>
      <ul className="py-4">
        {ingredients.map((ingredient) => (
          <li
            key={ingredient.id}
            className="py-1"
          >{`${ingredient.amount?.trim()} ${ingredient.name.trim()}`}</li>
        ))}
      </ul>
      <h2 className="text-xl font-bold pb-2">Instructions</h2>
      {instructions.split("\n").map((paragraph, idx) =>
        paragraph === "" ? null : (
          <p key={idx} className="pb-4">
            {paragraph}
          </p>
        )
      )}
    </div>
  );
}
