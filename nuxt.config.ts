// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2026-07-02',
    devtools: { enabled: false },
    ssr: false,
    modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', '@nuxt/eslint'],
    imports: {
        dirs: ['composables/**'],
    },
    typescript: {
        tsConfig: {
            compilerOptions: {
                // Preserve the pre-Nuxt 4 strictness level (Nuxt 4 enables this by default)
                noUncheckedIndexedAccess: false,
            },
        },
    },
    tailwindcss: {
        cssPath: ['~/assets/css/tailwind.css', { injectPosition: 0 }],
        configPath: 'tailwind.config.js',
        exposeConfig: false,
        config: {},
        viewer: true,
    },
})
