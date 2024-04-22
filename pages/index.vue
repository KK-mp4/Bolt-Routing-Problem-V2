<script setup lang="ts">
// @ts-ignore: D3.js does not have declaration file
import * as d3 from 'd3';
import type { Network, Station, Bolt } from '~~/composables/types';

useHead({ title: "Bolt Routing Problem V2" })

const user_msg = ref('');
const network = ref<Network>(<Network>{});  // Object containing stations and bolts
let startStation: Station = <Station>{};
let endPoint = null;
let line = null;

onMounted(async () => {
  const response = await fetch('/data/network.json');
  const data: Network = await response.json();

  data.bolts[0] = {
    directed: false,
    station_a: data.stations[17],
    station_b: data.stations[18],
    length: 0,
    colour: "#8f7f10"
  };

  data.bolts[1] = {
    directed: false,
    station_a: data.stations[17],
    station_b: data.stations[19],
    length: 0,
    colour: "#8f7f10"
  };

  data.bolts[2] = {
    directed: false,
    station_a: data.stations[13],
    station_b: data.stations[17],
    length: 0,
    colour: "#8f7f10"
  };

  // console.log(data);
  network.value = data;

  updateMap();
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
                  .attr("clip-path", "url(#clip)")
                  .selectAll("line")
                  .data(network.value.bolts)
                  .enter()
                  .append("line")
                  .attr("x1", (d: Bolt) => xScale(d.station_a.x))
                  .attr("y1", (d: Bolt) => yScale(d.station_a.z))
                  .attr("x2", (d: Bolt) => xScale(calculateTurn(d.station_a, d.station_b).x))
                  .attr("y2", (d: Bolt) => yScale(calculateTurn(d.station_a, d.station_b).z))
                  .style("stroke", (d: Bolt) => d.colour)
                  .style("stroke-width", 1);

  const edges_b = svg.append("g")
                  .attr("id", "edges_b")
                  .attr("transform", "translate(75, 0)")
                  .attr("clip-path", "url(#clip)")
                  .selectAll("line")
                  .data(network.value.bolts)
                  .enter()
                  .append("line")
                  .attr("x1", (d: Bolt) => xScale(calculateTurn(d.station_a, d.station_b).x))
                  .attr("y1", (d: Bolt) => yScale(calculateTurn(d.station_a, d.station_b).z))
                  .attr("x2", (d: Bolt) => xScale(d.station_b.x))
                  .attr("y2", (d: Bolt) => yScale(d.station_b.z))
                  .style("stroke", (d: Bolt) => d.colour)
                  .style("stroke-width", 1);

  // Plot stations
  const vertices = svg.append("g")
                    .attr("id", "vertices")
                    .attr("transform", "translate(75, 0)")
                    .attr("clip-path", "url(#clip)")
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



  //   // Event listener for middle mouse button press
  //   svg.on("mousedown", (event) => {
  //   if (event.button === 1) { // Middle mouse button
  //     startPoint = [event.offsetX, event.offsetY];
  //   }
  // });

  // Event listener for mouse movement
  // svg.on("mousemove", (event: MouseEvent) => {
  //   if (startStation.name !== undefined) {
  //     endPoint = [event.offsetX, event.offsetY];
  //     drawTempLine(svg, startStation, endPoint);
  //     console.log(startStation.x)
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
        .attr("x2", (d: Bolt) => new_xScale(calculateTurn(d.station_a, d.station_b).x))
        .attr("y2", (d: Bolt) => new_yScale(calculateTurn(d.station_a, d.station_b).z));

    edges_b.data(network.value.bolts)
        .attr("x1", (d: Bolt) => new_xScale(calculateTurn(d.station_a, d.station_b).x))
        .attr("y1", (d: Bolt) => new_yScale(calculateTurn(d.station_a, d.station_b).z))
        .attr("x2", (d: Bolt) => new_xScale(d.station_b.x))
        .attr("y2", (d: Bolt) => new_yScale(d.station_b.z));
  }

  function handleLClick(station: Station) {
    // Output the name of the clicked point
    user_msg.value = station.name + " { X: " + station.x + " , Z: " + station.z + " }";
  }

  function handleMiddleClick(e: MouseEvent, station: Station) {
    startStation = station;
    user_msg.value = "Start station";
  }

  function handleMiddleRelease(e: MouseEvent, station: Station) {
    if (station.name === startStation.name) return;
    network.value.bolts.push({
      directed: false,
      station_a: startStation,
      station_b: station,
      length: chebyshevDistance(startStation, station),
      colour: "#8f7f10"
    });

    updateMap();
    user_msg.value = "End station";
  }

  // function drawTempLine(svg, startStation: Station, end) {
  //   svg.select(".temp-line").remove();
  //   svg.append("line")
  //     .attr("class", "temp-line")
  //     .attr("x1", startStation.x)
  //     .attr("y1", startStation.z)
  //     .attr("x2", end[0])
  //     .attr("y2", end[1])
  //     .style("stroke", "gray")
  //     .style("stroke-width", 2)
  //     .style("stroke-dasharray", "5 5");
  // }
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
  <div id="network_map" class="p-0 h-full w-full"></div>
</template>