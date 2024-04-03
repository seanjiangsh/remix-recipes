import { LoaderFunction, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import classNames from "classnames";
import { z } from "zod";
import { PrimaryButton } from "~/components/buttons/buttons";
import ErrorMessage from "~/components/shelf/error-message";
import { validateForm } from "~/utils/validation";

type LoginData = { email: string; errors: { email: string } };

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export const action: LoaderFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  return validateForm(
    formData,
    loginSchema,
    ({ email }) => {},
    (errors) => json({ errors, email }, { status: 400 })
  );
};

export default function Login() {
  const actionData = useActionData<LoginData>();

  return (
    <div className="text-center mt-36">
      <h1 className="text-3xl mb-8">Remix Recipes</h1>
      <form method="post" className="mx-auto md:w-1/3" action="/login">
        <div className="text-left pb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="off"
            defaultValue={actionData?.email}
            className={classNames(
              "w-full outline-none border-2 border-gray-200",
              "focus:border-primary rounded-md p-2"
            )}
          />
          <ErrorMessage>{actionData?.errors?.email}</ErrorMessage>
        </div>
        <PrimaryButton className="w-1/3 mx-auto">Log In</PrimaryButton>
      </form>
    </div>
  );
}
