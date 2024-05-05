<script setup lang="ts">
import * as d3 from 'd3';
import { useLocalStorage } from '@vueuse/core';

useSeoMeta({
  title: 'Distance matrix heatmap - Piston Bolt Network Builder',
  description: 'Tool for generating and editing piston bolt networks for Minecraft',
  ogTitle: 'Piston Bolt Network Builder',
  ogDescription: 'Tool for generating and editing piston bolt networks for Minecraft',
  ogImage: '/ogImage.webp',
  ogUrl: 'https://bolt-routing-problem-v2.vercel.app/heatmap',
  twitterTitle: 'Piston Bolt Network Builder',
  twitterDescription: 'Tool for generating and editing piston bolt networks for Minecraft',
  twitterImage: '/ogImage.webp',
  twitterCard: 'summary'
});

const distanceMatrix = useLocalStorage('distance-matrix', {} as DistanceMatrix[]);
const userMsg = ref('');

onMounted(() => {
  window.addEventListener('resize', drawHeatmap);
  drawHeatmap();
});

function drawHeatmap() {
  const distMatrix = document.getElementById('distance-matrix');
  if (distMatrix !== null) {
    distMatrix.innerHTML = '';
  }

  const margin = { top: 30, right: 30, bottom: 150, left: 200 };
  const width = window.innerWidth - margin.left - margin.right;
  const height = window.innerHeight - margin.top - margin.bottom;

  const svg = d3.select("#distance-matrix")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const labels: string[] = distanceMatrix.value.map(station => station.station_name);

  // Build X scales and axis:
  const x = d3.scaleBand()
    .range([0, width])
    .domain(labels)
    .padding(0.01);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .attr("x", -5)
    .attr("y", 5)
    .style("font-family", "Fira Code")
    .style("font-size", "10px")
    .style('fill', '#fbdfd8')
    .style("text-anchor", "end");

  // Build Y scales and axis:
  const y = d3.scaleBand()
    .range([height, 0])
    .domain(labels)
    .padding(0.01);
  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .attr("x", -8)
    .attr("y", -8)
    .style("font-family", "Fira Code")
    .style("fill", "#fbdfd8")
    .attr("dy", "10px");

  const myColor = d3.scaleLinear<string, number>()
    .range(["#F4EDE1", "#84BBA7"])
    .domain([0, d3.max(distanceMatrix.value, (d: DistanceMatrix) => d3.max(d.values)) || 1]);

  const mouseover = function(event: MouseEvent, d: any) {
    const value = d.value !== null ? d.value + " blocks" : "does not exist";
    userMsg.value = `Shortest path from ${labels[d.rowIndex]} to ${labels[d.colIndex]} - ${value}`;
  };

  const mousemove = function(event: MouseEvent, d: any) {
    const value = d.value !== null ? d.value + " blocks" : "does not exist";
    userMsg.value = `Shortest path from ${labels[d.rowIndex]} to ${labels[d.colIndex]} - ${value}`;
  };

  const mouseleave = function(event: MouseEvent) {
    userMsg.value = '';
  };

  svg.selectAll()
    .data(distanceMatrix.value)
    .enter()
    .append("g")
    .selectAll("rect")
    .data((d: DistanceMatrix, rowIndex: number) => {
      return d.values.map((value: number, colIndex: number) => ({
        value: value,
        rowIndex: rowIndex,
        colIndex: colIndex
      }));
    })
    .enter()
    .append("rect")
    .attr("x", (d: any) => String(x(labels[d.colIndex])))
    .attr("y", (d: any) => String(y(labels[d.rowIndex])))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", (d: any) => myColor(d.value))
    .on("mouseover", (event: MouseEvent, d: any) => mouseover(event, d))
    .on("mousemove", (event: MouseEvent, d: any) => mousemove(event, d))
    .on("mouseleave", (event: MouseEvent) => mouseleave(event));
};

function copyHeatmap() {
  const stationNames = distanceMatrix.value.map(row => row.station_name);
  let clipboardContent = '\t' + stationNames.join('\t') + '\n';
  clipboardContent += distanceMatrix.value.map(row => `${row.station_name}\t${row.values.join("\t")}`).join("\n");
  navigator.clipboard.writeText(clipboardContent);
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', drawHeatmap);
});
</script>
<template>
  <NuxtLink to="/" title="Go back to main page" class="fixed top-3 left-3 text-xs">← Back</NuxtLink>
  <BaseButton class="fixed top-10 left-3 !w-[70px]" @click="copyHeatmap">Copy</BaseButton>
  <p class="fixed bottom-0 left-0 text-sm select-none">{{ userMsg }}</p>
  <div id="distance-matrix" class="p-0 h-full w-full" />
</template>