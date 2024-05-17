import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { z } from "zod";
import { v4 as uuid } from "uuid";

import { FieldErrors, validateForm } from "~/utils/validation";
import { commitSession, getSession } from "~/utils/auth/sessions";
import { redirectLoggedInUser } from "~/utils/auth/auth.server";
import {
  generateMagicLink,
  sendMagicLinkEmail,
} from "~/utils/auth/magin-links.server";

import { PrimaryInput } from "~/components/form/Inputs";
import { PrimaryButton } from "~/components/buttons/buttons";
import ErrorMessage from "~/components/form/error-message";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export const loader: LoaderFunction = async ({ request }) => {
  await redirectLoggedInUser(request); // * redirect to /app if user is already logged in
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  await redirectLoggedInUser(request); // * redirect to /app if user is already logged in

  const cookies = request.headers.get("cookie");
  const session = await getSession(cookies);
  const formData = await request.formData();
  const email = formData.get("email");
  const successFn = async ({ email }: { email: string }) => {
    const nonce = uuid();
    session.set("nonce", nonce);
    const repInit = { headers: { "Set-Cookie": await commitSession(session) } };
    const link = generateMagicLink(email, nonce);
    try {
      await sendMagicLinkEmail(email, link);
      return json("ok", repInit);
    } catch (error) {
      console.error("send email failed", error);
      const msg =
        "Sorry, we failed to send the verification email, please try again later.";
      const errors = { email: msg };
      return json({ errors }, { status: 500 });
    }
  };
  const errorFn = (errors: FieldErrors) =>
    json({ errors, email }, { status: 400 });
  return validateForm(formData, loginSchema, successFn, errorFn);
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const { email, errors } = actionData || {};

  const loginContent =
    actionData === "ok" ? (
      <div>
        <h1 className="text-2xl py-8">Yum!</h1>
        <p>Check your email and follow the instructions to finish log in.</p>
      </div>
    ) : (
      <div>
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

  return <div className="text-center mt-36">{loginContent}</div>;
}
