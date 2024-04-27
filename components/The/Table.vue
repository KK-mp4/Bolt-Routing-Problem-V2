<script setup lang="ts">
const props = defineProps<{
  stations: Station[];
}>();
</script>
<template>
    <div class="w-full h-screen overflow-y-auto">
    <table class="w-full text-sm text-left rtl:text-right">
      <thead class="text-xs bg-[#49291E]">
        <tr>
          <th scope="col" class="px-6 py-3">
            STATION NAME
          </th>
          <th scope="col" class="px-6 py-3">
            DESCRIPTION
          </th>
          <th scope="col" class="px-6 py-3">
            ASSIGNED COLOUR
          </th>
          <th scope="col" class="px-6 py-3">
            X
          </th>
          <th scope="col" class="px-6 py-3">
            Z
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="station in props.stations" class="even:bg-[#49291E] odd:bg-background text-accent">
          <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
            {{ station.name }}
          </th>
          <td class="px-6 py-4">
            {{ station.description }}
          </td>
          <td class="px-6 py-4" :style="{ color: station.colour }">
            {{ station.colour }}
          </td>
          <td class="px-6 py-4">
            {{ station.x }}
          </td>
          <td class="px-6 py-4">
            {{ station.z }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>