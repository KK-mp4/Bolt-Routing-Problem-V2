<script setup lang="ts">
// @ts-ignore: D3.js does not have declaration file
import * as d3 from 'd3';
import type { Robis } from '~~/composables/types';

useHead({ title: "Bolt Routing Problem V2" })

const user_msg = ref('');
const stations = ref<Robis[]>([]);  // Array of all the stations
// let startPoint = null;
// let endPoint = null;
// let line = null;

onMounted(async () => {
  const response = await fetch('/data/stations.json');
  const data: Robis[] = await response.json();
  data.forEach(station => {
    if (station.Dimension === "OW") {
      station.X = Math.round(station.X / 8);
      station.Z = Math.round(station.Z / 8);
    }
  });

  stations.value = data;
  updateMap();
});

function updateMap() {
  // Clear old chart when 'plot' is clicked
  let network_map = document.getElementById('network_map');
  if (network_map !== null) {
    network_map.innerHTML = '';
  }

  // Dimensions
  const margin = { top: -1, right: 0, bottom: 50, left: 75 };
  const svg_dx = window.innerWidth;
  const svg_dy = window.innerHeight;
  const chart_dx = svg_dx - margin.right - margin.left;
  const chart_dy = svg_dy - margin.top - margin.bottom;
  const numTicks = Math.round(Math.min(chart_dx, chart_dy) / 64);

  // Y position
  const yScale = d3.scaleLinear()
                  .domain(d3.extent(stations.value, (d: Robis) => d.Z))
                  .range([chart_dy, margin.top]);
  
  // X position
  const xScale = d3.scaleLinear()
                  .domain(d3.extent(stations.value, (d: Robis) => d.X))
                  .range([margin.right, chart_dx]);

  // Y-axis
  const yAxis = d3.axisLeft(yScale);

  // X-axis
  const xAxis = d3.axisBottom(xScale);

  // Append SVG to div element 'network_map' and set zoom to function named 'zoom'
  const svg = d3.select("#network_map")
                .append("svg")
                .attr("width", svg_dx)
                .attr("height", svg_dy);
  svg.call(d3.zoom().on("zoom", zoom));

  // Plot stations
  const circles = svg.append("g")
                    .attr("id", "circles")
                    .attr("transform", "translate(75, 0)")
                    .attr("clip-path", "url(#clip)")
                    .selectAll("circle")
                    .data(stations.value)
                    .enter()
                    .append("circle")
                    .attr("r", 4)
                    .attr("cx", (d: Robis) => xScale(d.X))
                    .attr("cy", (d: Robis) => yScale(-d.Z))
                    .style("fill", "#f2a788")
                    .on("click", (event: PointerEvent, d: Robis) => handleLClick(d));

  // Add y-axis
  svg.append("g")
      .attr("id", "y_axis")
      .attr("transform", "translate(75,0)")
      .call(yAxis)
      .style("font-family", "Fira Code")
      .style("font-size", "10px");
  
  // Add x-axis
  svg.append("g")
      .attr("id", "x_axis")
      .attr("transform", `translate(${margin.left}, ${svg_dy - margin.bottom - margin.top})`)
      .call(xAxis)
      .style("font-family", "Fira Code")
      .style("font-size", "10px");
  
  // Add x and y grid lines
  svg.select("#x_axis").call(xAxis.scale(xScale).ticks(numTicks).tickSize(-chart_dy));
  svg.select("#y_axis").call(yAxis.scale(yScale).ticks(numTicks).tickSize(-chart_dx));

  svg.selectAll(".tick line").style("stroke", "#422B25");

  //   // Event listener for middle mouse button press
  //   svg.on("mousedown", (event) => {
  //   if (event.button === 1) { // Middle mouse button
  //     startPoint = [event.offsetX, event.offsetY];
  //   }
  // });

  // // Event listener for mouse movement
  // svg.on("mousemove", (event) => {
  //   if (startPoint) {
  //     endPoint = [event.offsetX, event.offsetY];
  //     drawTempLine(svg, startPoint, endPoint);
  //   }
  // });

  // // Event listener for middle mouse button release
  // svg.on("mouseup", (event) => {
  //   if (event.button === 1 && startPoint && endPoint) { // Middle mouse button
  //     drawLine(svg, startPoint, endPoint);
  //     startPoint = null;
  //     endPoint = null;
  //   }
  // });

  // @ts-ignore: I don't know it's type c:
  function zoom({ transform }) {
    // Re-scale y axis during zoom
    d3.select("#y_axis")
      .transition()
      .duration(50)
      .call(yAxis.scale(transform.rescaleY(yScale)));

    // Re-scale x axis during zoom
    d3.select("#x_axis")
      .transition()
      .duration(50)
      .call(xAxis.scale(transform.rescaleX(xScale)));

    // Re-draw circles using new scales
    const new_xScale = transform.rescaleX(xScale);
    const new_yScale = transform.rescaleY(yScale);

    // Re-scale axes and gridlines
    svg.select("#x_axis").call(xAxis.scale(new_xScale).ticks(numTicks).tickSize(-chart_dy));
    svg.select("#y_axis").call(yAxis.scale(new_yScale).ticks(numTicks).tickSize(-chart_dx));

    svg.selectAll(".tick line")
    .style("stroke", "#422B25");

    circles.data(stations.value)
      .attr('cx', (d: Robis) => new_xScale(d.X))
      .attr('cy', (d: Robis) => new_yScale(-d.Z));               
  }

  function handleLClick(station: Robis) {
    // Output the name of the clicked point
    user_msg.value = station.Name + " { X: " + station.X + " , Z: " + station.Z + " }";
  }

  // function drawTempLine(svg, start, end) {
  //   svg.select(".temp-line").remove();
  //   svg.append("line")
  //     .attr("class", "temp-line")
  //     .attr("x1", start[0])
  //     .attr("y1", start[1])
  //     .attr("x2", end[0])
  //     .attr("y2", end[1])
  //     .style("stroke", "gray")
  //     .style("stroke-width", 2)
  //     .style("stroke-dasharray", "5 5");
  // }

  // function drawLine(svg, start, end) {
  //   svg.select(".temp-line").remove();
  //   svg.append("line")
  //     .attr("x1", start[0])
  //     .attr("y1", start[1])
  //     .attr("x2", end[0])
  //     .attr("y2", end[1])
  //     .style("stroke", "#8f7f10")
  //     .style("stroke-width", 2);
  // }
}
</script>
<template>
  <div class="fixed top-0 right-0 w-48 backdrop-blur p-5 text-center">
    <p>Piston Bolt Network Builder</p>
  </div>
  <p class="fixed bottom-0 left-0 text-s,">{{ user_msg }}</p>
  <div id="network_map" class="p-0 h-full w-full"></div>
</template>