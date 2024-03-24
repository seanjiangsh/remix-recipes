import { useRouteError } from "@remix-run/react";

type ErrorBoundaryProps = { title: string };
export default function ErrorBoundary(props: ErrorBoundaryProps) {
  const { title } = props;
  const err = useRouteError();
  const errMsg =
    err instanceof Error ? err.message : "An unexpected error occurred.";
  return (
    <div className="bg-red-300 border-2 border-red-600 rounded-md p-4">
      <h1>{title}</h1>
      <p>{errMsg}</p>
    </div>
  );
}
