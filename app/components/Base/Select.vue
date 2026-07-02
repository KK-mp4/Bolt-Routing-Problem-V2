<script setup lang="ts">
const modelValue = defineModel<string | number>()
</script>
<template>
    <select
        v-model="modelValue"
        class="mt-3 w-full select-none rounded-sm bg-primary font-bold text-background outline-none">
        <slot />
    </select>
</template>
