import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { getRecipe } from "~/models/recipes/recipes.server";

import RecipeName from "~/components/recipes/recipe-detail/recipe-name";
import RecipeTime from "~/components/recipes/recipe-detail/recipe-time";
import IngredientsDetail from "~/components/recipes/recipe-detail/ingredients-detail";
import Instructions from "~/components/recipes/recipe-detail/instructions";
import RecipeFooter from "~/components/recipes/recipe-detail/recipe-footer";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const recipeId = params.recipeId || "";
  const recipe = await getRecipe(recipeId);
  const headers = { "Cache-Control": "max-age=10" };
  return json({ recipe }, { headers });
};

export default function RecipeDetail() {
  const { recipe } = useLoaderData<typeof loader>();
  if (!recipe) return null;

  const { id, name, totalTime, ingredients, instructions } = recipe;

  return (
    <Form method="post" reloadDocument>
      <RecipeName id={id} name={name} />
      <RecipeTime totalTime={totalTime} id={id} />
      <IngredientsDetail ingredients={ingredients} />
      <Instructions id={id} instructions={instructions} />
      <RecipeFooter />
    </Form>
  );
  // return (
  //   <Form method="post" reloadDocument>
  //     <div className="mb-2">
  //       <Input
  //         key={id} // * key is required to override the default behavior of React Form status persistence
  //         type="text"
  //         placeholder="Recipe Name"
  //         autoComplete="off"
  //         className="text-2xl font-extrabold"
  //         name="recipeName"
  //         defaultValue={name}
  //       />
  //       <ErrorMessage></ErrorMessage>
  //     </div>
  //     <div className="flex">
  //       <TimeIcon />
  //       <div className="ml-2 flex-grow">
  //         <Input
  //           key={id}
  //           type="text"
  //           placeholder="Time"
  //           autoComplete="off"
  //           name="totalTime"
  //           defaultValue={totalTime}
  //         />
  //         <ErrorMessage></ErrorMessage>
  //       </div>
  //     </div>
  //     <div className="grid grid-cols-[30%_auto_min-content] my-4 gap-2">
  //       <h2 className="font-bold text-sm pb-1">Amount</h2>
  //       <h2 className="font-bold text-sm pb-1">Name</h2>
  //       <div></div>
  //       {ingredients?.map(({ id, name, amount }) => (
  //         <Fragment key={id}>
  //           <div>
  //             <Input
  //               key={id}
  //               type="text"
  //               autoComplete="off"
  //               name="ingredientAmount"
  //               defaultValue={amount || ""}
  //             />
  //             <ErrorMessage></ErrorMessage>
  //           </div>
  //           <div>
  //             <Input
  //               key={id}
  //               type="text"
  //               autoComplete="off"
  //               name="ingredientName"
  //               defaultValue={name || ""}
  //             />
  //             <ErrorMessage></ErrorMessage>
  //           </div>
  //           <button>
  //             <TrashIcon />
  //           </button>
  //         </Fragment>
  //       ))}
  //     </div>
  //     <label
  //       key={id}
  //       htmlFor="instructions"
  //       className="block font-bold text-sm pb-2 w-fit"
  //     >
  //       Instructions
  //     </label>
  //     <textarea
  //       id="instructions"
  //       name="instructions"
  //       placeholder="Instructions go here"
  //       className={classNames(
  //         "w-full h-56 rounded-md outline-none",
  //         "focus:border-2 focus:p-3 focus:border-primary duration-300"
  //       )}
  //       defaultValue={instructions}
  //     />
  //     <ErrorMessage></ErrorMessage>
  //     <hr className="my-4" />
  //     <div className="flex justify-between">
  //       <DeleteButton>Delete this Recipe</DeleteButton>
  //       <PrimaryButton>
  //         <div className="flex flex-col justify-center h-full">Save</div>
  //       </PrimaryButton>
  //     </div>
  //   </Form>
  // );
}
