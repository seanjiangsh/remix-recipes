import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";

import ErrorBoundaryElement from "~/components/error-boundary/error-boundary";

export const loader = () =>
  json({ message: "message from profile" }, { status: 202 });

// * note: the error will be caught in parent route
// * if ErrorBoundary is not defined here
export const ErrorBoundary: ErrorBoundaryComponent = () => (
  <ErrorBoundaryElement title="Profile Error" />
);

export default function Profile() {
  const data = useLoaderData<typeof loader>();

  throw new Error("Profile Testing Error");

  return (
    <div>
      <h1>Profile</h1>
      <p>{data.message}</p>
      <p>Profile Settings page</p>
    </div>
  );
}
