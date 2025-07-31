import { createRequestHandler } from "@react-router/node";

let handler;

export default async function (req, res) {
  try {
    if (!handler) {
      const build = await import("../build/server/index.js");
      handler = createRequestHandler({
        build,
        mode: process.env.NODE_ENV || "production",
      });
    }
    
    return handler(req, res);
  } catch (error) {
    console.error("Error in serverless function:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
