import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { z } from "zod";
import { v4 as uuid } from "uuid";

import { FieldErrors, validateForm } from "~/utils/prisma/validation";
import { commitSession, getSession } from "~/utils/auth/sessions";
import { generateMagicLink } from "~/utils/auth/magin-links.server";

import { PrimaryInput } from "~/components/form/Inputs";
import { PrimaryButton } from "~/components/buttons/buttons";
import ErrorMessage from "~/components/shelf/error-message";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export const loader: LoaderFunction = async ({ request }) => {
  const cookies = request.headers.get("cookie");
  const session = await getSession(cookies);
  console.log({ sessionData: session.data });
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const cookies = request.headers.get("cookie");
  const session = await getSession(cookies);
  const formData = await request.formData();
  const email = formData.get("email");
  const successFn = async ({ email }: { email: string }) => {
    const nonce = uuid();
    session.set("nonce", nonce);
    const repInit = { headers: { "Set-Cookie": await commitSession(session) } };
    const link = generateMagicLink(email, nonce);
    console.log(nonce, link);
    return json("ok", repInit);
  };
  const errorFn = (errors: FieldErrors) =>
    json({ errors, email }, { status: 400 });
  return validateForm(formData, loginSchema, successFn, errorFn);
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const { email, errors } = actionData || {};

  return (
    <div className="text-center mt-36">
      <h1 className="text-3xl mb-8">Remix Recipes</h1>
      <form method="post" className="mx-auto md:w-1/3" action="/login">
        <div className="text-left pb-4">
          <PrimaryInput
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="off"
            defaultValue={email}
          />
          <ErrorMessage>{errors?.email}</ErrorMessage>
        </div>
        <PrimaryButton className="w-1/3 mx-auto">Log In</PrimaryButton>
      </form>
    </div>
  );
}
