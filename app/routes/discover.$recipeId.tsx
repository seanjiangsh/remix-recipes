import { HeadersArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getRecipeWithIngredients } from "~/utils/ddb/recipe/models";
import { badRequest, notFound } from "~/utils/route";
import { getCurrentUser } from "~/utils/auth/auth.server";
import { hash } from "~/utils/cryptography.server";

import {
  DiscoverRecipeDetails,
  DiscoverRecipeHeader,
} from "~/components/discover/discover";

export const headers = ({ loaderHeaders }: HeadersArgs) => {
  return {
    etag: loaderHeaders.get("x-page-etag"),
    "cache-control": "max-age=60, stale-while-revalidate=86400",
  };
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { recipeId } = params;
  if (!recipeId) throw badRequest("recipeId");
  const recipe = await getRecipeWithIngredients(recipeId);
  if (!recipe) throw notFound("Recipe");

  // * ETag caching
  const etag = hash(JSON.stringify(recipe));
  if (etag === request.headers.get("if-none-match"))
    return new Response(null, { status: 304 });

  const user = await getCurrentUser(request);
  const pageEtag = `${hash(user?.id ?? "anonymous")}.${etag}`;

  const headers = {
    etag,
    "x-page-etag": pageEtag,
    "cache-control": "max-age=60, stale-while-revalidate=86400",
  };
  return json({ recipe }, { headers });
};

export default function DiscoverRecipe() {
  const { recipe } = useLoaderData<typeof loader>();
  // TODO: add recipe to personal recipes
  return (
    <div className="md:h-[calc(100vh-1rem] m-[-1rem] overflow-auto">
      <DiscoverRecipeHeader recipe={recipe} />
      <DiscoverRecipeDetails recipe={recipe} />
    </div>
  );
}
