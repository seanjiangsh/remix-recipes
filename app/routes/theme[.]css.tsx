import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const data = `
    :root {
      --color-primary: #00743e;
      --color-primary-light: #4c9d77;
    }
  `;
  const headers = { "Content-Type": "text/css" };
  const response = new Response(data, { headers });
  return response;
};
