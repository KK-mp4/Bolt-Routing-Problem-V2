// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-icon"
  ],
  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.css", { injectPosition: 0 }],
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    config: {},
    viewer: true
  },
  app: {
    baseURL: "/Bolt-Routing-Problem-V2/"
  }
})