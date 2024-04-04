import { LoaderFunction, json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import classNames from "classnames";
import { z } from "zod";

import { getUser } from "~/models/user/user.server";
import { validateForm } from "~/utils/prisma/validation";

import { PrimaryButton } from "~/components/buttons/buttons";
import ErrorMessage from "~/components/shelf/error-message";
import { userIdCookie } from "~/utils/cookies/cookies";

type LoginData = { email: string; errors: { email: string } };

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export const loader: LoaderFunction = async ({ request }) => {
  const cookies = request.headers.get("cookie");
  const cookieUserValue = await userIdCookie.parse(cookies);
  console.log(cookies, cookieUserValue);
  return null;
};

export const action: LoaderFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const successFn = async ({ email }: { email: string }) => {
    const user = await getUser(email);
    if (user) {
      const headers = new Headers();
      headers.append("Set-Cookie", await userIdCookie.serialize(user.id));
      return json({ user }, { headers });
    } else {
      return json(
        { errors: { email: "User does not exist" }, email },
        { status: 401 }
      );
    }
  };
  return validateForm(formData, loginSchema, successFn, (errors) =>
    json({ errors, email }, { status: 400 })
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
