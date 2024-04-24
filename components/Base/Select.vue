<script setup>
const modelValue = defineModel();
</script>
<template>
  <select v-model="modelValue" class="mt-3 rounded-sm bg-primary text-background w-full font-bold outline-none select-none">
    <slot @change="$emit('update:modelValue')" />
  </select>
</template>