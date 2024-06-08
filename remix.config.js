/** @type {import('@remix-run/dev').AppConfig} */
export default {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.test.{js,jsx,ts,tsx}"],
  publicPath: "/_static/build/",
  server: "arc/server.ts",
  serverBuildPath: "server/index.mjs",
  serverModuleFormat: "esm",

  routes: (defineRoutes) =>
    defineRoutes((route) => {
      const { NODE_ENV, INCLUDE_TEST_ROUTES } = process.env;
      console.log({ NODE_ENV, INCLUDE_TEST_ROUTES });
      if (process.env.INCLUDE_TEST_ROUTES) {
        if (process.env.NODE_ENV === "production") {
          console.warn("Cannot include test routes in production.");
          return;
        }
        route("__tests__/login", "__test-routes__/login.tsx");
      }
    }),
};
