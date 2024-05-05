<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';

useSeoMeta({
  title: 'Settings - Piston Bolt Network Builder',
  description: 'Tool for generating and editing piston bolt networks for Minecraft',
  ogTitle: 'Piston Bolt Network Builder',
  ogDescription: 'Tool for generating and editing piston bolt networks for Minecraft',
  ogImage: '/ogImage.webp',
  ogUrl: 'https://bolt-routing-problem-v2.vercel.app/settings',
  twitterTitle: 'Piston Bolt Network Builder',
  twitterDescription: 'Tool for generating and editing piston bolt networks for Minecraft',
  twitterImage: '/ogImage.webp',
  twitterCard: 'summary'
});

const network = useLocalStorage('piston-bolt-network', {} as Network);
const distanceMatrix = useLocalStorage('distance-matrix', {} as DistanceMatrix[]);
const plotData = useLocalStorage('scatter-plot', {} as PlotData[]);
const showLabels = useLocalStorage('show-labels', false);
const colourGraph = useLocalStorage('colour-graph', false);
const calcStats = useLocalStorage('calculate-stats', true);

const userMsg = ref('');
let timesSaved = 0;

const fileInput: Ref<HTMLInputElement | null> = ref(null);

onMounted(async () => {
  if (!network.value.stations) {
    const response = await fetch('/data/network.json');
    const data: Network = await response.json();
    network.value = data;
  }
});

function onSettingsChange() {
  userMsg.value = "Changes saved.";
  for (let i = 0; i < timesSaved; ++i) {
    userMsg.value += '.';
  }

  timesSaved++;
  if (timesSaved >= 30) userMsg.value += "is this funny to you?";
}

const triggerFileInput = () => {
  fileInput.value?.click();
}

function importNetwork(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = (target.files as FileList)[0]; // Get the selected file
  if (file) {
    const reader = new FileReader();

    // Define a promise for reading file
    const readFile = (file: File) => {
      return new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          if (reader.result) {
            resolve(reader.result.toString());
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    };

    // Read the file and parse JSON
    readFile(file)
      .then((data: string) => {
        try {
          network.value = JSON.parse(data) as Network;
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      })
      .catch((error) => {
        console.error('Error reading file:', error);
      });
  }
}

function exportNetwork() {
  // navigator.clipboard.writeText(JSON.stringify(network.value, null, 4));
  const data = JSON.stringify(network.value, null, 4);
  const blob = new Blob([data], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'network.json';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

function exportDistanceMatrix() {
  const csvContent = convertDistanceMatrixToCSV(distanceMatrix.value);
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "distance_matrix.csv";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

function convertDistanceMatrixToCSV(matrix: DistanceMatrix[]) {
  // Get station names
  const stationNames = matrix.map(entry => entry.station_name);

  // Construct CSV header with one empty cell at the beginning
  let csvContent = ';"' + stationNames.join('";"') + '"\n';

  // Construct CSV body
  for (let i = 0; i < matrix.length; i++) {
    csvContent += `"${stationNames[i]}";"${matrix[i].values.join('";"')}"\n`;
  }

  return csvContent;
}

function exportScatter() {
  const csvContent = convertPlotDataToCSV(plotData.value);
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "scatter-plot.csv";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

function convertPlotDataToCSV(data: PlotData[]) {
  // Construct CSV header
  const csvHeader = '"Graph";"Total tunnel length, blocks";"Average travel time, s"\n';

  // Construct CSV body
  let csvContent = '';
  for (const entry of data) {
    csvContent += `"${entry.graph_name}";${entry.length};${entry.time}\n`;
  }

  return csvHeader + csvContent;
}
</script>
<template>
  <div class="flex flex-col xl:flex-row">
    <div class="min-w-[520px] w-[520px] flex flex-col mt-3 mx-auto">
      <NuxtLink to="/" title="Go back to main page" class="fixed top-3 left-3 text-xs">← Back</NuxtLink>
      <div class="p-5 my-auto flex flex-col">
        <a
class="underline cursor-pointer text-xl text-primary mb-7 font-extrabold" href="https://github.com/KK-mp4/Bolt-Routing-Problem-V2?tab=readme-ov-file#piston-bolt-network-builder-for-minecraft-v2-wip"
          target="_blank" rel="noopener noreferrer" title="GitHub">
          User guide available on GitHub:
        </a>

        <BaseToggle v-model="showLabels" @change="onSettingsChange">Show station labels<p class="text-xs text-primary">Displays station labels next to graph vertices</p></BaseToggle>
        <BaseToggle v-model="colourGraph" @change="onSettingsChange">Colour graph automatically<p class="text-xs text-primary">Colours graph randomly after generation</p></BaseToggle>
        <BaseToggle v-model="calcStats" @change="onSettingsChange">Calculate average travel time<p class="text-xs text-primary">Slows processing time, but unlocks distance matrix heatmap</p></BaseToggle>
        <div class="w-full h-0 border border-primary mb-7"/>

        <BaseButton @click="triggerFileInput">Import network<Icon class="ml-3 my-auto" name="bi:filetype-json" size="16px" /></BaseButton>
        <input ref="fileInput" type="file" style="display: none" @change="importNetwork">
        <BaseButton @click="network = { stations: [], bolts: [] }">Clear network</BaseButton>
        <div class="w-full h-0 border border-primary mb-7"/>

        <BaseButton @click="exportNetwork">Export network<Icon class="ml-3 my-auto" name="bi:filetype-json" size="16px" /></BaseButton>
        <BaseButton @click="exportDistanceMatrix">Export distance matrix<Icon class="ml-3 my-auto" name="bi:filetype-csv" size="16px" /></BaseButton>
        <BaseButton @click="exportScatter">Export scatter plot<Icon class="ml-3 my-auto" name="bi:filetype-csv" size="16px" /></BaseButton>
      </div>
      <p class="fixed bottom-0 left-0 text-sm select-none">{{ userMsg }}</p>
    </div>
    <div class="flex-1 h-screen">
      <TheTable v-if="network.stations" :stations="network.stations" />
    </div>
  </div>
</template>