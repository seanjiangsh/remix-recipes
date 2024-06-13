import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import classNames from "classnames";
import { z } from "zod";

import { FieldErrors, validateForm } from "~/utils/validation";
import { settingsCookie } from "~/utils/auth/cookies";
import { getSettingsFromCookie } from "~/utils/misc";

import { PrimaryButton } from "~/components/buttons/buttons";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await getSettingsFromCookie(request);
};

const settingsSchema = z.object({ theme: z.string() });

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const successFn = async (args: z.infer<typeof settingsSchema>) => {
    const { theme } = args;
    const data = JSON.stringify({ theme });
    const headers = { "Set-Cookie": await settingsCookie.serialize(data) };
    return redirect("/settings/app", { headers });
  };
  const errorFn = (errors: FieldErrors) => json({ errors }, { status: 400 });
  return validateForm(formData, settingsSchema, successFn, errorFn);
};

export default function App() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<{ color?: string; theme?: string }>();
  // const currentColor = actionData?.color || loaderData.color;
  const currentTheme = actionData?.theme || loaderData.theme;

  return (
    <Form reloadDocument method="post">
      {/* <div className="mb-4 flex-col">
        <label htmlFor="color">Main Color: </label>
        <select
          id="color"
          name="color"
          className={classNames(
            "p-2 mt-2 ml-1 rounded-md w-full md:w-64",
            "border-2 border-gray-200 bg-white dark:bg-teal-800"
          )}
          defaultValue={currentColor}
        >
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="yellow">Yellow</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
        </select>
      </div> */}
      <div className="mb-8 flex-col">
        <label htmlFor="theme">Theme: </label>
        <select
          id="theme"
          name="theme"
          className={classNames(
            "p-2 rounded-md w-full md:w-64 md:mt-2 md:ml-1",
            "border-2 border-gray-200 bg-white dark:bg-teal-800"
          )}
          defaultValue={currentTheme}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <PrimaryButton className="w-full md:w-auto">Save</PrimaryButton>
    </Form>
  );
}
