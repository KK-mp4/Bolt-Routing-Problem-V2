<script setup lang="ts">
import * as d3 from 'd3'

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

const { workingGraph, settings, ensureWorkingGraph } = useAppState()

// Computed live by running every solver with its saved settings on the working
// graph, so the Pareto front always reflects the current network and options.
const plotData = ref<PlotData[]>([])
const loading = ref(false)
const userMsg = ref('')

async function recompute() {
    if (loading.value) return
    loading.value = true
    userMsg.value = 'Running all solvers...'

    // Yield once so the loading state paints before the heavy synchronous work.
    await new Promise(resolve => setTimeout(resolve, 0))

    try {
        plotData.value = runAllSolvers(workingGraph.value, settings.value)
        userMsg.value = `Computed ${plotData.value.length} solver results.`
    } catch (error) {
        console.error('Failed to compute scatter plot:', error)
        userMsg.value = 'Failed to compute (see console).'
    } finally {
        loading.value = false
        drawPlot()
    }
}

onMounted(async () => {
    window.addEventListener('resize', drawPlot)
    await ensureWorkingGraph()
    await recompute()
})

// Keep the current zoom transform so redraws (resize / recompute) preserve it.
let savedTransform = d3.zoomIdentity

function drawPlot() {
    const scatterPlot = document.getElementById('scatter-plot')
    if (scatterPlot !== null) {
        scatterPlot.innerHTML = ''
    }

    // Dimensions
    const margin = { top: 30, right: 30, bottom: 50, left: 75 }
    const chart_dx = window.innerWidth - margin.right - margin.left
    const chart_dy = window.innerHeight - margin.top - margin.bottom

    // Root svg + inner group translated by the margins.
    const svgRoot = d3
        .select('#scatter-plot')
        .append('svg')
        .attr('width', chart_dx + margin.left + margin.right)
        .attr('height', chart_dy + margin.top + margin.bottom)

    const svg = svgRoot
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // Clip everything inside the plotting rectangle so panned content never
    // spills over the axes and labels.
    const clipId = 'scatter-clip'
    svgRoot
        .append('defs')
        .append('clipPath')
        .attr('id', clipId)
        .append('rect')
        .attr('width', chart_dx)
        .attr('height', chart_dy)

    // Base scales (log X for the huge length range, linear Y for time).
    const x = d3
        .scaleLog()
        .domain([
            1,
            (d3.max(plotData.value, (d: PlotData) => d.length) || 1) * 1.1,
        ])
        .range([0, chart_dx])

    const y = d3
        .scaleLinear()
        .domain([
            0,
            (d3.max(plotData.value, (d: PlotData) => d.time) || 1) * 1.05,
        ])
        .range([chart_dy, 0])

    // Axis groups (redrawn on every zoom with rescaled copies).
    const gx = svg
        .append('g')
        .attr('transform', 'translate(0,' + chart_dy + ')')
    const gy = svg.append('g')

    // X axis label:
    svg.append('text')
        .attr('text-anchor', 'end')
        .attr('x', chart_dx)
        .attr('y', chart_dy + margin.top + 10)
        .text('Total tunnel length, blocks')
        .style('font-family', 'Fira Code')
        .style('fill', '#fbdfd8')
        .style('font-size', '12px')

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

    // Clipped layers: grid, then the plotted content.
    const gGrid = svg
        .append('g')
        .attr('clip-path', `url(#${clipId})`)
        .attr('stroke', 'currentColor')
        .attr('stroke-opacity', 0.1)

    const gPlot = svg.append('g').attr('clip-path', `url(#${clipId})`)

    // Red dominated (sub-optimal) region behind the front.
    const regionPath = gPlot
        .append('path')
        .attr('fill', '#e05a4d')
        .attr('fill-opacity', 0.12)
        .attr('stroke', 'none')
        .style('pointer-events', 'none')

    // Pareto front staircase line.
    const linePath = gPlot
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', '#8f7f10')
        .attr('stroke-width', 1.5)
        .style('pointer-events', 'none')

    // Frontier points (highlighted green); everything else stays orange.
    const front = frontierPoints(plotData.value)
    const frontSet = new Set(front)

    const mouseover = function (event: MouseEvent, d: PlotData) {
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

    const circles = gPlot
        .append('g')
        .selectAll('circle')
        .data(plotData.value)
        .enter()
        .append('circle')
        .attr('r', (d: PlotData) => (frontSet.has(d) ? 5 : 4))
        .style('fill', (d: PlotData) =>
            frontSet.has(d) ? '#84BBA7' : '#f2a788'
        )
        .style('stroke', (d: PlotData) =>
            frontSet.has(d) ? '#2f5d4f' : 'none'
        )
        .on('mouseover', mouseover)
        .on('mousemove', mouseover)
        .on('mouseleave', () => mouseleave())

    const labels = gPlot
        .append('g')
        .style('font-family', 'Fira Code')
        .style('font-size', '10px')
        .selectAll('text')
        .data(plotData.value)
        .join('text')
        .attr('dy', '0.35em')
        .text((d: PlotData) => d.graph_name)
        .style('fill', (d: PlotData) =>
            d.locally_stable ? '#d3e935' : '#fbdfd8'
        )
        .style('font-weight', (d: PlotData) =>
            d.locally_stable ? '600' : 'normal'
        )

    // Redraws every position from the (possibly rescaled) scales.
    function render(
        cx: d3.ScaleLogarithmic<number, number>,
        cy: d3.ScaleLinear<number, number>
    ) {
        gx.call(d3.axisBottom(cx))
            .selectAll('text')
            .style('font-family', 'Fira Code')
            .style('fill', '#fbdfd8')

        gy.call(d3.axisLeft(cy))
            .selectAll('text')
            .style('font-family', 'Fira Code')
            .style('fill', '#fbdfd8')

        // Grid lines rebuilt for the current tick set.
        gGrid.selectAll('*').remove()
        gGrid
            .append('g')
            .selectAll('line')
            .data(cx.ticks())
            .join('line')
            .attr('x1', (d: number) => 0.5 + cx(d))
            .attr('x2', (d: number) => 0.5 + cx(d))
            .attr('y1', 0)
            .attr('y2', chart_dy)
        gGrid
            .append('g')
            .selectAll('line')
            .data(cy.ticks())
            .join('line')
            .attr('y1', (d: number) => 0.5 + cy(d))
            .attr('y2', (d: number) => 0.5 + cy(d))
            .attr('x1', 0)
            .attr('x2', chart_dx)

        const geometry = buildFrontierGeometry(front, cx, cy, 0, chart_dx)
        regionPath.attr('d', geometry.region)
        linePath.attr('d', geometry.line)

        circles
            .attr('cx', (d: PlotData) => cx(d.length))
            .attr('cy', (d: PlotData) => cy(d.time))

        labels
            .attr('x', (d: PlotData) => cx(d.length) + 7)
            .attr('y', (d: PlotData) => cy(d.time))
    }

    render(x, y)

    // Pan (drag) + zoom (scroll), mirroring the main graph controls.
    const zoomBehavior = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.4, 50])
        .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
            savedTransform = event.transform
            render(event.transform.rescaleX(x), event.transform.rescaleY(y))
        })

    svgRoot.call(zoomBehavior)
    svgRoot.call(zoomBehavior.transform, savedTransform)
}

// Non-dominated data points (minimising both length and time), sorted by
// length ascending (time then strictly decreasing along the frontier).
function frontierPoints(data: PlotData[]): PlotData[] {
    const sorted = [...data].sort(
        (a, b) => a.length - b.length || a.time - b.time
    )

    const front: PlotData[] = []
    let minTime = Infinity
    for (const point of sorted) {
        if (point.time < minTime) {
            front.push(point)
            minTime = point.time
        }
    }
    return front
}

// Builds the extended staircase line and the dominated-region polygon in pixel
// space, so both always reach the chart edges regardless of zoom / pan.
function buildFrontierGeometry(
    front: PlotData[],
    cx: d3.ScaleLogarithmic<number, number>,
    cy: d3.ScaleLinear<number, number>,
    topPx: number,
    rightPx: number
): { line: string | null; region: string | null } {
    if (front.length === 0) return { line: null, region: null }

    const points: [number, number][] = []

    // Extend upward from the left-most (lowest length) frontier point.
    points.push([cx(front[0].length), topPx])

    for (let i = 0; i < front.length; ++i) {
        const px = cx(front[i].length)
        if (i > 0) {
            // Horizontal step at the previous point's height.
            points.push([px, cy(front[i - 1].time)])
        }
        points.push([px, cy(front[i].time)])
    }

    // Extend rightward from the last (highest length) frontier point.
    const lastY = cy(front[front.length - 1].time)
    points.push([rightPx, lastY])

    const lineGen = d3.line()
    const line = lineGen(points)
    const region = lineGen([...points, [rightPx, topPx]])

    return { line, region: region ? region + 'Z' : null }
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
        <BaseButton
            class="fixed left-3 top-10 !w-[90px]"
            :disabled="loading"
            @click="recompute"
            >{{ loading ? '...' : 'Recompute' }}</BaseButton
        >
        <p class="fixed bottom-0 left-0 select-none text-sm">{{ userMsg }}</p>
        <div
            class="invisible fixed bottom-0 right-0 select-none text-[10px] md:visible">
            <p>pan: drag mouse1 / zoom: scroll mouse3</p>
        </div>
        <div id="scatter-plot" class="h-full w-full p-0" />
    </div>
</template>
