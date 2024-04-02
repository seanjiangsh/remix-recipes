import { Form, useFetcher } from "@remix-run/react";

import { CreateShelfButton } from "~/components/buttons/Form-button";
import { PlusIcon } from "../icons/icons";

export default function CreateShelf() {
  const createShelfFetcher = useFetcher();
  const { formData } = createShelfFetcher;
  const isCreatingShelf = formData?.get("_action") === "createShelf";

  return (
    <Form method="post">
      <CreateShelfButton
        name="_action"
        value="createShelf"
        isLoading={isCreatingShelf}
        className={"mt-4 w-full md:w-fit"}
      >
        <PlusIcon />
        <span className="pl-2">
          {isCreatingShelf ? "Creating Shelf" : "Create Shelf"}
        </span>
      </CreateShelfButton>
    </Form>
  );
}
