<script setup lang="ts">
// @ts-ignore: D3.js does not have declaration file
import * as d3 from 'd3';
import type { Network, Station, Bolt } from '~~/composables/types';

useHead({ title: "Bolt Routing Problem V2" })

const user_msg = ref(''); // Message that is displayed at the bottom left corner of the screen
const network = ref<Network>(<Network>{});  // Object containing stations and bolts
let startStation: Station = <Station>{};  // Starting station for manual connection
let endPoint: number[] = [];  // Ending station x, z
let middleButtonPressed = false;
let totalDistance = ref(0);

onMounted(async () => {
  const response = await fetch('/data/network.json');
  const data: Network = await response.json();

  // console.log(data);
  // console.log(JSON.stringify(data, null, 4));
  network.value = data;

  updateMap();

  totalDistance.value = calculateTotalDist(data);
});

function updateMap() {
  // Clear old SVG when 'network_map' is clicked
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
                  .domain(d3.extent(network.value.stations, (d: Station) => d.z))
                  .range([margin.top, chart_dy]);
  
  // X position
  const xScale = d3.scaleLinear()
                  .domain(d3.extent(network.value.stations, (d: Station) => d.x))
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

  // Add y-axis
  svg.append("g")
    .attr("id", "y_axis")
    .attr("transform", "translate(75, 0)")
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

  // Plot bolts
  const edges_a = svg.append("g")
                    .attr("id", "edges_a")
                    .attr("transform", "translate(75, 0)")
                    .selectAll("line")
                    .data(network.value.bolts)
                    .enter()
                    .append("line")
                    .attr("x1", (d: Bolt) => xScale(d.station_a.x))
                    .attr("y1", (d: Bolt) => yScale(d.station_a.z))
                    .attr("x2", (d: Bolt) => xScale(d.turn.x))
                    .attr("y2", (d: Bolt) => yScale(d.turn.z))
                    .style("stroke", (d: Bolt) => d.colour)
                    .style("stroke-width", 1);

  const edges_b = svg.append("g")
                    .attr("id", "edges_b")
                    .attr("transform", "translate(75, 0)")
                    .selectAll("line")
                    .data(network.value.bolts)
                    .enter()
                    .append("line")
                    .attr("x1", (d: Bolt) => xScale(d.turn.x))
                    .attr("y1", (d: Bolt) => yScale(d.turn.z))
                    .attr("x2", (d: Bolt) => xScale(d.station_b.x))
                    .attr("y2", (d: Bolt) => yScale(d.station_b.z))
                    .style("stroke", (d: Bolt) => d.colour)
                    .style("stroke-width", 1);

  // Plot stations
  const vertices = svg.append("g")
                      .attr("id", "vertices")
                      .attr("transform", "translate(75, 0)")
                      .selectAll("circle")
                      .data(network.value.stations)
                      .enter()
                      .append("circle")
                      .attr("r", 4)
                      .attr("cx", (d: Station) => xScale(d.x))
                      .attr("cy", (d: Station) => yScale(d.z))
                      .style("fill", (d: Station) => d.colour)
                      .on("click", (event: PointerEvent, d: Station) => handleLClick(d))
                      .on("mousedown", (event: MouseEvent, d: Station) => {
                        if (event.button === 1) { // Check if the middle mouse button is clicked
                            handleMiddleClick(event, d);
                        }
                      })
                      .on("mouseup", (event: MouseEvent, d: Station) => {
                          if (event.button === 1) { // Check if the middle mouse button is clicked
                              handleMiddleRelease(event, d);
                          }
                      });

  svg.on("mousemove", (event: MouseEvent) => {
      if (!middleButtonPressed) return;

      if (startStation.name !== undefined) {
          endPoint = [event.offsetX, event.offsetY];
          drawTempLine(svg, startStation, endPoint);
      }
  });

  svg.on("mousedown", (event: MouseEvent) => {
      if (event.button === 1) {
          middleButtonPressed = true;
      }
  });

  svg.on("mouseup", (event: MouseEvent) => {
      if (event.button === 1) {
          middleButtonPressed = false;
          svg.select("#temp-line").remove();
      }
  });

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

    // Re-draw vertices using new scales
    const new_xScale = transform.rescaleX(xScale);
    const new_yScale = transform.rescaleY(yScale);

    // Re-scale axes and gridlines
    svg.select("#x_axis").call(xAxis.scale(new_xScale).ticks(numTicks).tickSize(-chart_dy));
    svg.select("#y_axis").call(yAxis.scale(new_yScale).ticks(numTicks).tickSize(-chart_dx));

    svg.selectAll(".tick line")
    .style("stroke", "#422B25");

    vertices.data(network.value.stations)
      .attr('cx', (d: Station) => new_xScale(d.x))
      .attr('cy', (d: Station) => new_yScale(d.z));
      
    // Re-draw edges using new scales
    edges_a.data(network.value.bolts)
        .attr("x1", (d: Bolt) => new_xScale(d.station_a.x))
        .attr("y1", (d: Bolt) => new_yScale(d.station_a.z))
        .attr("x2", (d: Bolt) => new_xScale(d.turn.x))
        .attr("y2", (d: Bolt) => new_yScale(d.turn.z));

    edges_b.data(network.value.bolts)
        .attr("x1", (d: Bolt) => new_xScale(d.turn.x))
        .attr("y1", (d: Bolt) => new_yScale(d.turn.z))
        .attr("x2", (d: Bolt) => new_xScale(d.station_b.x))
        .attr("y2", (d: Bolt) => new_yScale(d.station_b.z));
  }

  function handleLClick(station: Station) {
    // Output the name of the clicked point
    user_msg.value = station.name + " { X: " + station.x + " , Z: " + station.z + " }";
  }

  function handleMiddleClick(e: MouseEvent, station: Station) {
    startStation = station;
    user_msg.value = "Draw bolt from " + startStation.name;
  }

  function handleMiddleRelease(e: MouseEvent, station: Station) {
    if (!startStation.name || station.name === startStation.name) return;

    network.value.bolts.push({
      directed: false,
      station_a: startStation,
      turn: calculateTurn(startStation, station),
      station_b: station,
      length: chebyshevDistance(startStation, station),
      colour: "#8f7f10"
    });

    updateMap();
    totalDistance.value = calculateTotalDist(network.value);
    user_msg.value += " to " + station.name;
  }

  // @ts-ignore: I don't know it's type c:
  function drawTempLine(svg, startStation: Station, end: number[]) {
    svg.select("#temp-line").remove();

    // Get the SVG element
    const svgElement = svg.node();

    // Get the SVG coordinates of the mouse cursor relative to the SVG element
    const svgPoint = svgElement.createSVGPoint();
    svgPoint.x = end[0];
    svgPoint.y = end[1];
    const screenCTM = svgElement.getScreenCTM();
    const svgCursorPoint = svgPoint.matrixTransform(screenCTM.inverse());

    // Convert SVG coordinates to data space using scales
    const svgEndX = svgCursorPoint.x - margin.left;
    const svgEndY = svgCursorPoint.y - margin.top;

    const endStation = {
      name: '',
      colour: '',
      description: '',
      x: xScale.invert(svgEndX),
      z: yScale.invert(svgEndY)
    }

    const turn = calculateTurn(startStation, endStation);
    const lineGroup = [
      { start: startStation, end: turn },
      { start: turn, end: endStation }
    ]

    svg.append("g")
      .attr("id", "temp-line")
      .attr("transform", "translate(75, 0)")
      .selectAll("line")
      .data(lineGroup)
      .enter()
      .append("line")
      .attr("x1", (d: {start: Station; end: Station}) => xScale(d.start.x))
      .attr("y1", (d: {start: Station; end: Station}) => yScale(d.start.z))
      .attr("x2", (d: {start: Station; end: Station}) => xScale(d.end.x))
      .attr("y2", (d: {start: Station; end: Station}) => yScale(d.end.z))
      .style("stroke", "gray")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "5 5");
  }
}
</script>
<template>
  <div class="fixed top-0 right-0 w-48 backdrop-blur p-5">
    <p class="text-center mb-3">Piston Bolt Network Builder</p>
    <p class="text-xs">pan: drag mouse1</p>
    <p class="text-xs">zoom: scroll mouse3</p>
    <p class="text-xs">connect: drag mouse3</p>
  </div>

  <p class="fixed bottom-0 left-0 text-s,">{{ user_msg }}</p>

  <div class="fixed top-0 left-0 backdrop-blur p-5">
    <p class="text-xs">Stations:<br />
      <span v-if="network.stations" class="text-accent">{{ network.stations.length }}</span>
      <span v-else class="text-accent">0</span>
    </p>
    <p class="text-xs mt-1">Total length:<br /><span class="text-accent">{{ totalDistance }} blocks</span></p>
  </div>

  <div id="network_map" class="p-0 h-full w-full"></div>
</template>