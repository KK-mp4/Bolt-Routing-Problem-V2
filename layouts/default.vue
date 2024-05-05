<script setup lang="ts">
useHead({
  htmlAttrs: {
      lang: 'en'
    },
  meta: [
    { charset: 'utf-8' },
    { name: 'Piston Bolt Network Builder for Minecraft', content: 'Author:  KK' }
  ],
  link: [
    {
      rel: 'prefetch',
      href: '/FiraCode-VariableFont_wght.ttf',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous'
    },
    {
      rel: 'icon',
      href: '/favicon.ico',
      crossorigin: 'anonymous'
    }
  ]
});
</script>
<template>
  <div class="h-screen bg-background text-text">
    <slot />
  </div>
</template>
<style>
body {
  margin: 0;
  font-size: 14px;
  font-family: Fara Code;
  background-color: #1f0903;
}

@font-face {
  font-family: 'Fara Code';
  src: url('/FiraCode-VariableFont_wght.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: #F2A788;
  outline: 1px solid #49291E;
  border-radius: 4px;
}

::-webkit-scrollbar-corner {
  background: transparent;
}
</style>