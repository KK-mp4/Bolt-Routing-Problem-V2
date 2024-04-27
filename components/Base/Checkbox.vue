<script setup lang="ts">
const modelValue = defineModel();
</script>
<template>
  <div class="flex items-center mb-4">
    <input v-model="modelValue" id="default-checkbox" type="checkbox" class="w-4 h-4 rounded accent-accent">
    <label for="default-checkbox" class="ms-2 text-sm font-medium select-none">
      <slot />
    </label>
  </div>
</template>