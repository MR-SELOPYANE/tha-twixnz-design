// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
// Netlify supplies its server build through its adapter; a second Nitro build duplicates it.
export default defineConfig(async ({ command }) => {
  const isNetlifyBuild = command === "build" && process.env.NETLIFY === "true";
  const plugins = isNetlifyBuild
    ? (await import("@netlify/vite-plugin-tanstack-start")).default()
    : [];

  return {
    plugins,
    nitro: isNetlifyBuild ? false : undefined,
    tanstackStart: {
      server: { entry: "server" },
    },
  };
});
