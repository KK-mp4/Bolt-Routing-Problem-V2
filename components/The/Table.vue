<script setup lang="ts">
const props = defineProps<{
  stations: Station[];
}>();

const addNewStation = () => {
  props.stations.push({
    name: "New Station",
    description: '',
    colour: "#f2a788",
    x: 0,
    z: 0
  });
};

const deleteStation = (index: number) => {
  props.stations.splice(index, 1);
};
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
          <th scope="col" class=""/>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(station, index) in props.stations" :key="index" class="even:bg-[#49291E] odd:bg-background text-accent">
          <td class="px-6 py-4 font-medium whitespace-nowrap">
            <input v-model="station.name" class="w-full" style="background-color: transparent;" >
          </td>
          <td class="px-6 py-4">
            <input v-model="station.description" class="w-full" style="background-color: transparent;" >
          </td>
          <td class="px-6 py-4" :style="{ color: station.colour }">
            <input v-model="station.colour" class="w-full" style="background-color: transparent;" >
          </td>
          <td class="px-6 py-4">
            <input v-model.number="station.x" class="w-full" style="background-color: transparent;" >
          </td>
          <td class="px-6 py-4">
            <input v-model.number="station.z" class="w-full" style="background-color: transparent;" >
          </td>
          <td class="px-6 py-4">
            <button @click="deleteStation(index)">
              <Icon class="my-auto" name="octicon:trashcan" size="14px" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="px-5 py-2">
      <BaseButton class="w-full" @click="addNewStation">Add</BaseButton>
    </div>
  </div>
</template>