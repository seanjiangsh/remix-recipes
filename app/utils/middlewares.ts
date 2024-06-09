import { Middleware } from "@remix-run/server-runtime";

let logger: Middleware = async (request, next) => {
  console.log(`Received a request for ${request.url}`);

  let response = await next(request);

  console.log(`Responded with a ${response.status} for ${request.url}`);

  return response;
};

export default logger;
