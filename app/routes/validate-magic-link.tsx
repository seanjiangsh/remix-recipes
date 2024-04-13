import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import classNames from "classnames";
import { z } from "zod";

import { FieldErrors, validateForm } from "~/utils/prisma/validation";
import { createUser, getUserByEmail } from "~/models/user/user.server";
import {
  getMagicLinkPayload,
  invalidMagicLink,
} from "~/utils/auth/magin-links.server";
import { commitSession, getSession } from "~/utils/auth/sessions";

import { PrimaryInput } from "~/components/form/Inputs";
import { PrimaryButton } from "~/components/buttons/buttons";
import ErrorMessage from "~/components/form/error-message";

const magicLinkMaxAge = 1000 * 60 * 10; // 10 minutes

export const loader: LoaderFunction = async ({ request }) => {
  const magicLinkPayload = getMagicLinkPayload(request);
  const { email, nonce, createdAt } = magicLinkPayload;

  // * validate expiration time
  const expiredAt = new Date(createdAt).getTime() + magicLinkMaxAge;
  if (Date.now() > expiredAt) throw invalidMagicLink("Magic link has expired");

  // * validate thie nonce
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);
  const sessionNonce = session.get("nonce");
  if (sessionNonce !== nonce)
    throw invalidMagicLink("Invalid magic link nonce");

  // * all good, redirect to the app if the user exists
  const headers = new Headers();

  const user = await getUserByEmail(email);
  if (user) {
    session.unset("nonce");
    session.set("userId", user.id);
    headers.append("Set-Cookie", await commitSession(session));
    return redirect("/app", { headers });
  }

  headers.append("Set-Cookie", await commitSession(session));
  return json("ok", { headers });
};

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const successFn = async (args: z.infer<typeof signUpSchema>) => {
    const { firstName, lastName } = args;
    const magicLinkPayload = getMagicLinkPayload(request);
    const { email } = magicLinkPayload;
    const user = await createUser(email, firstName, lastName);
    const cookies = request.headers.get("cookie");
    const session = await getSession(cookies);
    session.unset("nonce");
    session.set("userId", user.id);
    const repInit = { headers: { "Set-Cookie": await commitSession(session) } };
    return redirect("/app", repInit);
  };
  const errorFn = (errors: FieldErrors) =>
    json({ errors, firstName, lastName }, { status: 400 });
  return validateForm(formData, signUpSchema, successFn, errorFn);
};

// * render this component if user is not logged in
export default function ValidateMagicLink() {
  const actionData = useActionData<typeof action>();
  const { firstName, lastName, errors } = actionData || {};

  return (
    <div className="text-center">
      <div className="mt-24">
        <h1 className="text-2xl mb-8">{"You're almost done"}</h1>
        <h2>Type in your name below to complete the signup process.</h2>
        <form
          method="post"
          className={classNames(
            "flex flex-col px-8 mx-16 md:mx-auto",
            "border-2 border-gray-200 rounded-md p-8 mt-8 md:w-80"
          )}
        >
          <fieldset className="flex flex-col mb-8">
            <div className="text-left mb-4">
              <label htmlFor="name">First Name</label>
              <PrimaryInput
                id="firstName"
                name="firstName"
                autoComplete="off"
                defaultValue={firstName}
              />
              <ErrorMessage>{errors?.firstName}</ErrorMessage>
            </div>
            <div className="text-left">
              <label htmlFor="name">Last Name</label>
              <PrimaryInput
                id="lastName"
                name="lastName"
                autoComplete="off"
                defaultValue={lastName}
              />
              <ErrorMessage>{errors?.lastName}</ErrorMessage>
            </div>
          </fieldset>
          <PrimaryButton className="w-36 mx-auto">Sign Up</PrimaryButton>
        </form>
      </div>
    </div>
  );
}
