// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2026-07-02',
    devtools: { enabled: false },
    ssr: false,
    app: {
        head: {
            meta: [
                {
                    name: 'google-site-verification',
                    content: 'e9_rTXWGwQUW6hQNlKSo1ZmfDu-VcaYfNpif_MyeS9w',
                },
            ],
        },
    },
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
