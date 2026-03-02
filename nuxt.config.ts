import glsl from "vite-plugin-glsl"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  app: {
    head: {
      title: "Mistral Model Use Case",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { name: "description", content: "A Nuxt 3 project" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },

  css: ["~/assets/styles/main.scss"],

  modules: ["lenis/nuxt"],

  alias: {
    "raf-manager": "./assets/webgl/utils/RafManager.js",
    "resize-manager": "./assets/webgl/utils/ResizeManager.js",
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/assets/styles/variables/mixins.scss" as *;\n`,
        },
      },
    },
    plugins: [
      glsl({
        include: [
          // Glob pattern, or array of glob patterns to import
          "**/*.glsl",
          "**/*.wgsl",
          "**/*.vert",
          "**/*.frag",
          "**/*.vs",
          "**/*.fs",
        ],
      }) as any,
    ],
  },
})
