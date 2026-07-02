<script setup>
const modelValue = defineModel()
</script>
<template>
    <select
        v-model="modelValue"
        class="mt-3 w-full select-none rounded-sm bg-primary font-bold text-background outline-none">
        <slot @change="$emit('update:modelValue')" />
    </select>
</template>
