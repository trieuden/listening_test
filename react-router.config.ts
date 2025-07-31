import type { Config } from "@react-router/dev/config";

export default {
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  // Ensure static assets are served correctly
  basename: "/",
  // Configure build output
  buildDirectory: "build",
} satisfies Config;
