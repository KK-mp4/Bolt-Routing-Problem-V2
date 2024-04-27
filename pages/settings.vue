<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
useHead({ title: "Settings" });

const network = useLocalStorage('piston-bolt-network', {} as Network);
// const distanceMatrix = localStorage.getItem("distanceMatrix");
// const plotData: PlotData[] = ref<PlotData[]>([]);
const showLables = useLocalStorage('show-lables', false);
const colourGraph = useLocalStorage('colour-graph', false);
const calcStats = useLocalStorage('calculate-stats', true);
// Also store position of graph somehow

const user_msg = ref('')
let timesSaved = 0;

onMounted(async () => {
  if (!network.value.stations) {
  const response = await fetch('/data/network.json');
  const data: Network = await response.json();
  network.value = data;
  }
});

function onSettingsChange() {
  timesSaved++;
  user_msg.value = "Changes saved.";
  for (let i = 0; i < timesSaved; ++i) {
    user_msg.value += '.';
  }

  if (timesSaved >= 30) user_msg.value += "is this funny to you?";
}

function downloadJson() {
  navigator.clipboard.writeText(JSON.stringify(network.value, null, 4));
}
</script>
<template>
  <div class="flex">
    <div class="w-[40vw] flex flex-col">
      <NuxtLink to="/" title="Go back to main page" class="fixed top-3 left-3 text-xs">← Back</NuxtLink>
      <div class="p-5 my-auto flex flex-col">
        <BaseCheckbox v-model="showLables" @change="onSettingsChange">Show station lables</BaseCheckbox>
        <BaseCheckbox v-model="colourGraph" @change="onSettingsChange">Colour graph automatically</BaseCheckbox>
        <BaseCheckbox v-model="calcStats" @change="onSettingsChange">Calculate average travel time (slow)</BaseCheckbox>
        <BaseButton @click="" class="mb-6">Import network<Icon class="ml-3 my-auto" name="bi:filetype-json" size="16px" /></BaseButton>
        <BaseButton @click="downloadJson">Export network<Icon class="ml-3 my-auto" name="bi:filetype-json" size="16px" /></BaseButton>
        <BaseButton @click="">Export distance matrix<Icon class="ml-3 my-auto" name="bi:filetype-csv" size="16px" /></BaseButton>
        <BaseButton @click="">Export scatter plot<Icon class="ml-3 my-auto" name="bi:filetype-csv" size="16px" /></BaseButton>
      </div>
      <p class="fixed bottom-0 left-0 text-sm select-none">{{ user_msg }}</p>
    </div>
    <div class="w-[60vw] h-screen">
      <TheTable v-if="network.stations" :stations="network.stations" class="" />
    </div>
  </div>
</template>