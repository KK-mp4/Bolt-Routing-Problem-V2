<script setup lang="ts">
// @ts-ignore: D3.js is missing declaration file
import * as d3 from 'd3';
useHead({ title: "Distance matrix heatmap" })

const user_msg = ref('');

onMounted(() => {
  // Retrieve distance matrix from localStorage
  const distanceMatrixString = localStorage.getItem('distanceMatrix');
  const distanceMatrix = JSON.parse(distanceMatrixString);

  drawHeatmap(distanceMatrix);
});

const drawHeatmap = (data) => {
  const margin = { top: 30, right: 30, bottom: 150, left: 200 };
  const width = window.innerWidth - margin.left - margin.right;
  const height = window.innerHeight - margin.top - margin.bottom;

  const svg = d3.select("#distance-matrix")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const lables = data.map(row => row[0]);

  // Build X scales and axis:
  const x = d3.scaleBand()
    .range([0, width])
    .domain(lables)
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
    .domain(lables)
    .padding(0.01);
  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .attr("x", -8)
    .attr("y", -8)
    .style("font-family", "Fira Code")
    .style("fill", "#fbdfd8")
    .attr("dy", "10px");

  const myColor = d3.scaleLinear()
    .range(["#F4EDE1", "#84BBA7"])
    .domain([0, d3.max(data, d => d3.max(d.slice(1)))]);

  const mouseover = function(event: MouseEvent, d) {
    if (d.value === null) {
      user_msg.value = "Path from " + lables[d.rowIndex] + " to " + lables[d.colIndex] + " does not exist"
    } else {
      user_msg.value = "Shortest path from " + lables[d.rowIndex] + " to " + lables[d.colIndex] + " - " + d.value + " blocks";
    }
  }

  const mousemove = function(event: MouseEvent, d) {
    if (d.value === null) {
      user_msg.value = "Path from " + lables[d.rowIndex] + " to " + lables[d.colIndex] + " does not exist"
    } else {
      user_msg.value = "Shortest path from " + lables[d.rowIndex] + " to " + lables[d.colIndex] + " - " + d.value + " blocks";
    }
  }

  const mouseleave = function(event: MouseEvent) {
    user_msg.value = '';
  }

  svg.selectAll()
    .data(data)
    .enter()
    .append("g")
    .selectAll("rect")
    .data((d, rowIndex) => {
      return d.slice(1).map((value, colIndex) => ({
        value: value,
        rowIndex: rowIndex,
        colIndex: colIndex
      }));
    })
    .enter()
    .append("rect")
    .attr("x", d => x(lables[d.colIndex]))
    .attr("y", d => y(lables[d.rowIndex]))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", d => myColor(d.value))
    .on("mouseover", (event: MouseEvent, d) => mouseover(event, d))
    .on("mousemove", (event: MouseEvent, d) => mousemove(event, d))
    .on("mouseleave", (event: MouseEvent) => mouseleave(event));
};
</script>
<template>
  <NuxtLink to="/" title="Go back to main page" class="fixed top-3 left-3 text-xs">← Back</NuxtLink>
  <p class="fixed bottom-0 left-0 text-sm select-none">{{ user_msg }}</p>
  <div id="distance-matrix" class="p-0 h-full w-full" />
</template>