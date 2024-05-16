// import { createRoutesFromFolders } from "@remix-run/v1-route-convention";

// /** @type {import('@remix-run/dev').AppConfig} */
// export default {
//   // Tell Remix to ignore everything in the routes directory.
//   // We'll let `createRoutesFromFolders` take care of that.
//   ignoredRouteFiles: ["**/*"],
//   routes: (defineRoutes) => {
//     // `createRoutesFromFolders` will create routes for all files in the
//     // routes directory using the same default conventions as Remix v1.
//     return createRoutesFromFolders(defineRoutes, {
//       // If you're already using `ignoredRouteFiles` in your Remix config,
//       // you can move them to `ignoredFilePatterns` in the plugin's options.
//       ignoredFilePatterns: ["**/.*", "**/*.css"],
//     });
//   },
// };

// /** @type {import('@remix-run/dev').AppConfig} */
// export default {
//   ignoredRouteFiles: ["**/*.css"],
//   // appDirectory: "app",
//   // assetsBuildDirectory: "public/build",
//   // publicPath: "/build/",
//   // serverBuildPath: "build/index.js",
// };

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.test.{js,jsx,ts,tsx}"],
  publicPath: "/_static/build/",
  server: "arc/server.ts",
  serverBuildPath: "server/index.mjs",
  serverModuleFormat: "esm",
};
