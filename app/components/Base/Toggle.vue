<script setup lang="ts">
const modelValue = defineModel()
</script>
<template>
    <label class="relative mb-3 inline-flex cursor-pointer">
        <input v-model="modelValue" type="checkbox" class="peer sr-only" />
        <div
            class="peer h-6 w-11 rounded-full bg-secondary after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-accent peer-checked:after:translate-x-full" />
        <span class="ml-3 text-sm font-medium">
            <slot />
        </span>
    </label>
</template>
