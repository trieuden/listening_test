import { createRequestHandler } from "@react-router/node";

let handler;

export default async function (req, res) {
  if (!handler) {
    const build = await import("../build/server/index.js");
    handler = createRequestHandler({
      build,
      mode: process.env.NODE_ENV,
    });
  }
  
  return handler(req, res);
}
