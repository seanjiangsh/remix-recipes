import { Form, useFetcher } from "@remix-run/react";

import { PrimaryButton } from "~/components/buttons/buttons";
import { PlusIcon } from "../icons/icons";

export default function CreateRecipe() {
  const createRecipeFetcher = useFetcher();
  const { formData } = createRecipeFetcher;
  const isCreatingRecipe = formData?.get("_action") === "createRecipe";

  return (
    <Form method="post" className="mt-4" reloadDocument>
      <PrimaryButton
        name="_action"
        value="createRecipe"
        isLoading={isCreatingRecipe}
        className={"w-full"}
      >
        <PlusIcon />
        <span className="ml-2">
          {isCreatingRecipe ? "Creating Recipe" : "Create Recipe"}
        </span>
      </PrimaryButton>
    </Form>
  );
}
