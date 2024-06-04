import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import classNames from "classnames";
import { z } from "zod";

import { FieldErrors, validateForm } from "~/utils/validation";
import { themeCookie } from "~/utils/auth/cookies";
import { PrimaryButton } from "~/components/buttons/buttons";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookies = request.headers.get("cookie");
  const themeValue = await themeCookie.parse(cookies);
  const theme = typeof themeValue === "string" ? themeValue : "green";
  return { theme };
};

const themeSchema = z.object({ theme: z.string() });

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const successFn = async (args: z.infer<typeof themeSchema>) => {
    const { theme } = args;
    const headers = { "Set-Cookie": await themeCookie.serialize(theme) };
    return json({ theme }, { headers });
  };
  const errorFn = (errors: FieldErrors) => json({ errors }, { status: 400 });
  return validateForm(formData, themeSchema, successFn, errorFn);
};

export default function App() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const actionTheme = (actionData as { theme?: string })?.theme;
  const currentTheme = actionTheme || loaderData.theme;

  return (
    <Form reloadDocument method="post">
      <div className="mb-4 flex-col">
        <label htmlFor="theme">Theme</label>
        <select
          id="theme"
          name="theme"
          className={classNames(
            "p-2 mt-2 rounded-md w-full md:w-64",
            "border-2 border-gray-200"
          )}
          defaultValue={currentTheme}
        >
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="yellow">Yellow</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
        </select>
      </div>
      <PrimaryButton>Save</PrimaryButton>
    </Form>
  );
}
