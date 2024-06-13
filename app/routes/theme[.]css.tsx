import { LoaderFunctionArgs } from "@remix-run/node";

import { getSettingsFromCookie } from "~/utils/misc";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const settings = await getSettingsFromCookie(request);
  const color = getColor(settings.color);
  const { theme } = settings;
  const data = `
    :root {
      --color-primary: ${color.colorPrimary};
      --color-primary-light: ${color.colorPrimaryLight};
      --color-text: ${theme === "light" ? "#333" : "#f9f9f9"};
      --color-background: ${theme === "light" ? "#f9f9f9" : "#121212"};   
    }`;
  const headers = { "content-type": "text/css" };
  const response = new Response(data, { headers });
  return response;
};

function getColor(color: string) {
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
