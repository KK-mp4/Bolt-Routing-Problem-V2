<script setup lang="ts">
import * as d3 from 'd3'
import { useLocalStorage } from '@vueuse/core'

useSeoMeta({
    title: 'Scatter plot - Piston Bolt Network Builder',
    description:
        'Tool for generating and editing piston bolt networks for Minecraft',
    ogTitle: 'Piston Bolt Network Builder',
    ogDescription:
        'Tool for generating and editing piston bolt networks for Minecraft',
    ogImage: '/ogImage.webp',
    ogUrl: 'https://bolt-routing-problem-v2.vercel.app/scatterplot',
    twitterTitle: 'Piston Bolt Network Builder',
    twitterDescription:
        'Tool for generating and editing piston bolt networks for Minecraft',
    twitterImage: '/ogImage.webp',
    twitterCard: 'summary',
})

const plotData = useLocalStorage('scatter-plot', {} as PlotData[])
const userMsg = ref('I update this manually for Dugged network for now.')

onMounted(() => {
    window.addEventListener('resize', drawPlot)

    plotData.value = [
        { graph_name: 'Star graph*', length: 23628, time: 50.27 },
        { graph_name: 'Complete graph', length: 860901, time: 41.59 },
        { graph_name: 'MST nearest neighbour', length: 13716, time: 156.64 },
        { graph_name: 'Hamiltonian cycle', length: 15125, time: 126.18 },
        { graph_name: "Prim's algorithm", length: 9619, time: 62.15 },
        { graph_name: "Kruskal's algorithm", length: 9619, time: 62.15 },
        { graph_name: 'Stainer tree', length: 8905, time: 51.13 },
        { graph_name: 'Greedy t-spanner (1.5)', length: 16531, time: 47.27 },
        { graph_name: 'Yao-8 graph', length: 107008, time: 42.16 },
        { graph_name: 'Delaunay', length: 52342, time: 44.75 },
        { graph_name: 'Gabriel graph', length: 16844, time: 48.01 },
        { graph_name: 'Relative neighborhood', length: 11017, time: 54.57 },
        { graph_name: 'Hub backbone (4)', length: 19310, time: 60.45 },
    ]

    drawPlot()
})

function drawPlot() {
    const scatterPlot = document.getElementById('scatter-plot')
    if (scatterPlot !== null) {
        scatterPlot.innerHTML = ''
    }

    // Dimensions
    const margin = { top: 30, right: 30, bottom: 50, left: 75 }
    const chart_dx = window.innerWidth - margin.right - margin.left
    const chart_dy = window.innerHeight - margin.top - margin.bottom

    // Append the svg object to the body of the page
    const svg = d3
        .select('#scatter-plot')
        .append('svg')
        .attr('width', chart_dx + margin.left + margin.right)
        .attr('height', chart_dy + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // X axis
    const x = d3
        .scaleLog()
        .domain([1, d3.max(plotData.value, (d: PlotData) => d.length) || 1])
        .range([0, chart_dx])
    svg.append('g')
        .attr('transform', 'translate(0,' + chart_dy + ')')
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('font-family', 'Fira Code')
        .style('fill', '#fbdfd8')

    // X axis label:
    svg.append('text')
        .attr('text-anchor', 'end')
        .attr('x', chart_dx)
        .attr('y', chart_dy + margin.top + 10)
        .text('Total tunnel length, blocks')
        .style('font-family', 'Fira Code')
        .style('fill', '#fbdfd8')
        .style('font-size', '12px')

    // Y axis
    const y = d3
        .scaleLinear()
        .domain([0, d3.max(plotData.value, (d: PlotData) => d.time) || 1])
        .range([chart_dy, 0])
    svg.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('font-family', 'Fira Code')
        .style('fill', '#fbdfd8')

    // Y axis label:
    svg.append('text')
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 30)
        .attr('x', -margin.top)
        .text('Average travel time, s')
        .style('font-family', 'Fira Code')
        .style('fill', '#fbdfd8')
        .style('font-size', '12px')

    // Grid.
    svg.append('g')
        .attr('stroke', 'currentColor')
        .attr('stroke-opacity', 0.1)
        .call(g =>
            g
                .append('g')
                .selectAll('line')
                .data(x.ticks())
                .join('line')
                .attr('x1', (d: number) => 0.5 + x(d))
                .attr('x2', (d: number) => 0.5 + x(d))
                .attr('y1', 0)
                .attr('y2', chart_dy)
        )
        .call(g =>
            g
                .append('g')
                .selectAll('line')
                .data(y.ticks())
                .join('line')
                .attr('y1', (d: number) => 0.5 + y(d))
                .attr('y2', (d: number) => 0.5 + y(d))
                .attr('x1', 0)
                .attr('x2', chart_dx)
        )

    const mouseover = function (event: MouseEvent, d: PlotData) {
        userMsg.value =
            d.graph_name +
            ' { ' +
            d.length +
            ' blocks, ' +
            d.time +
            ' seconds }'
    }

    const mousemove = function (event: MouseEvent, d: PlotData) {
        userMsg.value =
            d.graph_name +
            ' { ' +
            d.length +
            ' blocks, ' +
            d.time +
            ' seconds }'
    }

    const mouseleave = function () {
        userMsg.value = ''
    }

    // Pareto frontier
    const paretoFrontier = findParetoFrontier(plotData.value)

    svg.append('path')
        .datum(paretoFrontier)
        .attr('fill', 'none')
        .attr('stroke', '#8f7f10')
        .attr('stroke-width', 1)
        .attr(
            'd',
            d3
                .line<PlotData>()
                .x((d: PlotData) => x(d.length))
                .y((d: PlotData) => y(d.time))
        )

    // Points
    svg.append('g')
        .selectAll('dot')
        .data(plotData.value)
        .enter()
        .append('circle')
        .attr('cx', function (d: PlotData) {
            return x(d.length)
        })
        .attr('cy', function (d: PlotData) {
            return y(d.time)
        })
        .attr('r', 4)
        .style('fill', '#f2a788')
        .on('mouseover', (event: MouseEvent, d: PlotData) =>
            mouseover(event, d)
        )
        .on('mousemove', (event: MouseEvent, d: PlotData) =>
            mousemove(event, d)
        )
        .on('mouseleave', () => mouseleave())

    // Point lables
    svg.append('g')
        .style('font-family', 'Fira Code')
        .style('fill', '#fbdfd8')
        .style('font-size', '10px')
        .selectAll('text')
        .data(plotData.value)
        .join('text')
        .attr('dy', '0.35em')
        .attr('x', (d: PlotData) => x(d.length) + 7)
        .attr('y', (d: PlotData) => y(d.time))
        .text((d: PlotData) => d.graph_name)
}

// Function to find Pareto frontier
function findParetoFrontier(data: PlotData[]): PlotData[] {
    if (data.length <= 1) return []

    const paretoFrontier1: PlotData[] = []

    data.sort((a, b) => a.length - b.length)

    let currentMaxTime = Infinity
    for (let i = 0; i < data.length; ++i) {
        if (data[i].time <= currentMaxTime) {
            paretoFrontier1.push(data[i])
            currentMaxTime = data[i].time
        }
    }

    const paretoFrontier2: PlotData[] = []
    paretoFrontier2.push(
        {
            graph_name: '',
            length: paretoFrontier1[0].length,
            time: Math.max(...data.map(d => d.time)),
        },
        paretoFrontier1[0],
        {
            graph_name: '',
            length: paretoFrontier1[1].length,
            time: paretoFrontier1[0].time,
        }
    )

    for (let i = 1; i < paretoFrontier1.length - 1; ++i) {
        paretoFrontier2.push(
            {
                graph_name: '',
                length: paretoFrontier1[i].length,
                time: paretoFrontier1[i - 1].time,
            },
            paretoFrontier1[i],
            {
                graph_name: '',
                length: paretoFrontier1[i + 1].length,
                time: paretoFrontier1[i].time,
            }
        )
    }

    paretoFrontier2.push(
        {
            graph_name: '',
            length: paretoFrontier1[paretoFrontier1.length - 1].length,
            time: paretoFrontier1[paretoFrontier1.length - 2].time,
        },
        paretoFrontier1[paretoFrontier1.length - 1],
        {
            graph_name: '',
            length: data[data.length - 1].length,
            time: paretoFrontier1[paretoFrontier1.length - 1].time,
        }
    )

    return paretoFrontier2
}

onBeforeUnmount(() => {
    window.removeEventListener('resize', drawPlot)
})
</script>
<template>
    <div>
        <NuxtLink
            to="/"
            title="Go back to main page"
            class="fixed left-3 top-3 text-xs"
            >← Back</NuxtLink
        >
        <p class="fixed bottom-0 left-0 select-none text-sm">{{ userMsg }}</p>
        <div id="scatter-plot" class="h-full w-full p-0" />
    </div>
</template>
