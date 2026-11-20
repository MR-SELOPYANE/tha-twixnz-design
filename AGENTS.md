# Project architecture

- Use `@netlify/vite-plugin-tanstack-start` only for Netlify builds and disable the duplicate Nitro build there; keep the Lovable Vite wrapper for preview support.