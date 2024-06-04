import { LoaderFunctionArgs } from "@remix-run/node";

import { themeCookie } from "~/utils/auth/cookies";

// TODO: make light/dark theme
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookies = request.headers.get("cookie");
  const cookieValue = await themeCookie.parse(cookies);
  const themeValue = typeof cookieValue === "string" ? cookieValue : "green";
  const theme = getTheme(themeValue);
  const data = `
    :root {
      --color-primary: ${theme.colorPrimary};
      --color-primary-light: ${theme.colorPrimaryLight};
    }`;
  const headers = { "Content-Type": "text/css" };
  const response = new Response(data, { headers });
  return response;
};

function getTheme(color: string) {
  switch (color) {
    case "red": {
      return {
        colorPrimary: "#f22524",
        colorPrimaryLight: "#f56665",
      };
    }
    case "orange": {
      return {
        colorPrimary: "#ff4b00",
        colorPrimaryLight: "#ff814d",
      };
    }
    case "yellow": {
      return {
        colorPrimary: "#cc9800",
        colorPrimaryLight: "#ffbf00",
      };
    }
    case "blue": {
      return {
        colorPrimary: "#01a3e1",
        colorPrimaryLight: "#30c5fe",
      };
    }
    case "purple": {
      return {
        colorPrimary: "#5325c0",
        colorPrimaryLight: "#8666d2",
      };
    }
    default: {
      return {
        colorPrimary: "#00743e",
        colorPrimaryLight: "#4c9d77",
      };
    }
  }
}
