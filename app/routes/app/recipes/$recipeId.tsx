import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { getRecipe } from "~/models/recipes/recipes.server";

import { Input } from "~/components/form/Inputs";
import { TimeIcon } from "~/components/icons/icons";
import ErrorMessage from "~/components/shelf/error-message";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const recipeId = params.recipeId || "";
  const recipe = await getRecipe(recipeId);
  const headers = { "Cache-Control": "max-age=10" };
  return json({ recipe }, { headers });
};

export default function RecipeDetail() {
  const { recipe } = useLoaderData<typeof loader>();
  const { id, name, totalTime, instructions } = recipe || {};

  return (
    <Form method="post" reloadDocument>
      <div className="mb-2">
        <Input
          key={id} // * key is required to override the default behavior of React Form status persistence
          type="text"
          placeholder="Recipe Name"
          autoComplete="off"
          className="text-2xl font-extrabold"
          name="recipeName"
          defaultValue={name}
        />
        <ErrorMessage></ErrorMessage>
      </div>
      <div className="flex">
        <TimeIcon />
        <div className="ml-2 flex-grow">
          <Input
            key={id}
            type="text"
            placeholder="Time"
            autoComplete="off"
            name="totalTime"
            defaultValue={totalTime}
          />
          <ErrorMessage></ErrorMessage>
        </div>
      </div>
    </Form>
  );
}
