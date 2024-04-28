<script setup lang="ts">
const modelValue = defineModel();
</script>
<template>
  <label class="relative inline-flex cursor-pointer mb-3">
    <input v-model="modelValue" type="checkbox" class="sr-only peer">
    <div
      class="w-11 h-6 rounded-full peer bg-secondary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent">
    </div>
    <span class="ml-3 text-sm font-medium">
      <slot />
    </span>
  </label>
</template>