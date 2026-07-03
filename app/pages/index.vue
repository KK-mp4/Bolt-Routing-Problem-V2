<script setup lang="ts">
import * as d3 from 'd3'

useSeoMeta({
    title: 'Piston Bolt Network Builder',
    description:
        'Tool for generating and editing piston bolt networks for Minecraft',
    ogTitle: 'Piston Bolt Network Builder',
    ogDescription:
        'Tool for generating and editing piston bolt networks for Minecraft',
    ogImage: '/ogImage.webp',
    ogUrl: 'https://bolt-routing-problem-v2.vercel.app/',
    twitterTitle: 'Piston Bolt Network Builder',
    twitterDescription:
        'Tool for generating and editing piston bolt networks for Minecraft',
    twitterImage: '/ogImage.webp',
    twitterCard: 'summary',
})

const { workingGraph, settings, ensureWorkingGraph } = useAppState()
const network = workingGraph // shared, id-based working graph

const userMsg = ref('') // Message that is displayed at the bottom left corner of the screen
let startStation: Station | null = null // Starting station for manual connection
const startStationUnscaled = { x: 0, z: 0 }
let endPoint: number[] = [] // Ending station x, z
let middleButtonPressed = false // Toggle to detect if user is dragging mouse3
const totalBoltLength = ref(0)
const totalTunnelLength = ref(0)
const averageTravelTime = ref(0)

let savedTransform = d3.zoomIdentity

// Solver dropdown options come straight from the registry.
const solverOptions = SOLVERS

onMounted(async () => {
    window.addEventListener('resize', updateMap)

    await ensureWorkingGraph()

    onGraphChange()
})

function markerId(colour: string): string {
    return 'arrow-' + colour.replace(/[^a-zA-Z0-9]/g, '')
}

function updateMap() {
    // Clear old SVG when 'network_map' is clicked
    const network_map = document.getElementById('network_map')
    if (network_map !== null) {
        network_map.innerHTML = ''
    }

    // Dimensions
    const margin = { top: -1, right: 0, bottom: 50, left: 75 }
    const svg_dx = window.innerWidth
    const svg_dy = window.innerHeight
    const chart_dx = svg_dx - margin.right - margin.left
    const chart_dy = svg_dy - margin.top - margin.bottom

    // Resolve bolt endpoints by id, dropping any dangling bolts defensively.
    const byId = stationsById(network.value)
    const validBolts = network.value.bolts.filter(
        bolt => byId.has(bolt.source) && byId.has(bolt.target)
    )
    const sourceOf = (bolt: Bolt) => byId.get(bolt.source) as Station
    const targetOf = (bolt: Bolt) => byId.get(bolt.target) as Station

    // Finding the maximum absolute range of both x and z dimensions
    const maxX =
        d3.max(network.value.stations, (d: Station) => Math.abs(d.x)) || 1000
    const maxY =
        d3.max(network.value.stations, (d: Station) => Math.abs(d.z)) || 1000
    const maxRange = Math.max(maxX, maxY) * 1.01 // 1% extra so that stations are not overlapping with axis

    // Calculating the aspect ratio
    const aspectRatio = chart_dx / chart_dy

    // Adjusting the ranges of both x-axis and y-axis based on the aspect ratio
    let xRange, yRange
    if (aspectRatio > 1) {
        // Landscape orientation
        xRange = maxRange * aspectRatio
        yRange = maxRange
    } else {
        // Portrait orientation or square
        xRange = maxRange
        yRange = maxRange / aspectRatio
    }

    // Y position
    const yScale = d3
        .scaleLinear()
        .domain([-yRange, yRange])
        .range([margin.top, chart_dy])

    // X position
    const xScale = d3
        .scaleLinear()
        .domain([-xRange, xRange])
        .range([margin.right, chart_dx])

    // Y-axis
    const yAxis = d3.axisLeft(yScale)

    // X-axis
    const xAxis = d3.axisBottom(xScale)

    // Append SVG to div element 'network_map' and set zoom to function named 'zoom'
    const svg = d3
        .select('#network_map')
        .append('svg')
        .attr('width', svg_dx)
        .attr('height', svg_dy)

    // Add y-axis
    svg.append('g')
        .attr('id', 'y_axis')
        .attr('transform', 'translate(75, 0)')
        .call(yAxis)
        .style('font-family', 'Fira Code')
        .style('font-size', '10px')

    // Add x-axis
    svg.append('g')
        .attr('id', 'x_axis')
        .attr(
            'transform',
            `translate(${margin.left}, ${svg_dy - margin.bottom - margin.top})`
        )
        .call(xAxis)
        .style('font-family', 'Fira Code')
        .style('font-size', '10px')

    // Calculating the number of ticks for both x-axis and y-axis
    const numTicksX = Math.round(Math.min(chart_dx, chart_dy) / 64)
    const numTicksY = Math.round(
        (Math.min(chart_dx, chart_dy) / 64) * (chart_dy / chart_dx)
    )

    // Add x and y grid lines
    svg.select<SVGGElement>('#x_axis').call(
        xAxis.scale(xScale).ticks(numTicksX).tickSize(-chart_dy)
    )
    svg.select<SVGGElement>('#y_axis').call(
        yAxis.scale(yScale).ticks(numTicksY).tickSize(-chart_dx)
    )

    svg.selectAll('.tick line').style('stroke', '#422B25')

    // Arrowhead markers (one per colour) for directed bolts.
    const directedColours = Array.from(
        new Set(
            validBolts.filter(bolt => bolt.directed).map(bolt => bolt.colour)
        )
    )
    svg.append('defs')
        .selectAll('marker')
        .data(directedColours)
        .enter()
        .append('marker')
        .attr('id', (colour: string) => markerId(colour))
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 14)
        .attr('refY', 0)
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .attr('orient', 'auto')
        .append('path')
        .attr('fill', (colour: string) => colour)
        .attr('d', 'M0,-5L10,0L0,5')

    // Plot bolts (first leg: source -> turn)
    const edges_a = svg
        .append('g')
        .attr('id', 'edges_a')
        .attr('transform', 'translate(75, 0)')
        .selectAll('line')
        .data(validBolts)
        .enter()
        .append('line')
        .attr('x1', (d: Bolt) => xScale(sourceOf(d).x))
        .attr('y1', (d: Bolt) => yScale(sourceOf(d).z))
        .attr('x2', (d: Bolt) => xScale(d.turn.x))
        .attr('y2', (d: Bolt) => yScale(d.turn.z))
        .style('stroke', (d: Bolt) => d.colour)
        .style('stroke-width', 1)

    // Plot bolts (second leg: turn -> target)
    const edges_b = svg
        .append('g')
        .attr('id', 'edges_b')
        .attr('transform', 'translate(75, 0)')
        .selectAll('line')
        .data(validBolts)
        .enter()
        .append('line')
        .attr('x1', (d: Bolt) => xScale(d.turn.x))
        .attr('y1', (d: Bolt) => yScale(d.turn.z))
        .attr('x2', (d: Bolt) => xScale(targetOf(d).x))
        .attr('y2', (d: Bolt) => yScale(targetOf(d).z))
        .style('stroke', (d: Bolt) => d.colour)
        .style('stroke-width', 1)
        .attr('marker-end', (d: Bolt) =>
            d.directed ? `url(#${markerId(d.colour)})` : null
        )

    // Plot stations
    const vertices = svg
        .append('g')
        .attr('id', 'vertices')
        .attr('transform', 'translate(75, 0)')
        .selectAll('circle')
        .data(network.value.stations)
        .enter()
        .append('circle')
        .attr('r', 4)
        .attr('cx', (d: Station) => xScale(d.x))
        .attr('cy', (d: Station) => yScale(d.z))
        .style('fill', (d: Station) => d.colour)
        .on('click', (event: PointerEvent, d: Station) => handleLClick(d))
        .on('mousedown', (event: MouseEvent, d: Station) => {
            if (event.button === 1) {
                // Check if the middle mouse button is clicked
                handleMiddleClick(event, d)
            }
        })
        .on('mouseup', (event: MouseEvent, d: Station) => {
            if (event.button === 1) {
                // Check if the middle mouse button is clicked
                handleMiddleRelease(event, d)
            }
        })

    // Station lables
    const lables = svg
        .append('g')
        .attr('id', 'lables')
        .style('font-family', 'Fira Code')
        .style('fill', '#fbdfd8')
        .style('font-size', '10px')
        .selectAll('text')
        .data(network.value.stations)
        .join('text')
        .attr('dy', '0.35em')
        .attr('x', (d: Station) => xScale(d.x))
        .attr('y', (d: Station) => yScale(d.z) - 14)
        .text((d: Station) => d.name)
        .style(
            'visibility',
            settings.value.display.showLabels ? 'visible' : 'hidden'
        )

    // Create a zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>().on('zoom', zoom)

    // Call the zoom behavior on the SVG element
    svg.call(zoomBehavior)

    // Apply saved transform here if it exists
    if (savedTransform !== undefined) {
        svg.call(zoomBehavior.transform, savedTransform)
    }

    svg.on('mousemove', (event: MouseEvent) => {
        if (
            settings.value.activeSolver === 'star' &&
            settings.value.solvers.star.mergeAt === 'track'
        ) {
            // Get the SVG element
            const svgElement = svg.node()

            if (!svgElement) return

            // Get the SVG coordinates of the mouse cursor relative to the SVG element
            const svgPoint = svgElement.createSVGPoint()
            svgPoint.x = event.offsetX
            svgPoint.y = event.offsetY
            const screenCTM = svgElement.getScreenCTM()
            if (!screenCTM) return
            const svgCursorPoint = svgPoint.matrixTransform(screenCTM.inverse())

            // Convert SVG coordinates to data space using scales
            const svgEndX = svgCursorPoint.x - margin.left
            const svgEndY = svgCursorPoint.y - margin.top

            network.value = generateStarGraph(
                cleanClone(network.value),
                Number(settings.value.solvers.star.rayCount),
                'track',
                Math.round(xScale.invert(svgEndX)),
                Math.round(yScale.invert(svgEndY))
            )
            updateMap()
            updateData()
        }

        if (!middleButtonPressed) return

        if (startStation !== null) {
            endPoint = [event.offsetX, event.offsetY]
            drawTempLine(svg, endPoint)
        }
    })

    svg.on('mousedown', (event: MouseEvent) => {
        if (event.button === 1) {
            middleButtonPressed = true
        }
    })

    svg.on('mouseup', (event: MouseEvent) => {
        if (event.button === 1) {
            middleButtonPressed = false
            svg.select('#temp-line').remove()
        }
    })

    function zoom(event: d3.D3ZoomEvent<SVGSVGElement, unknown>) {
        const transform = event.transform
        savedTransform = transform // Save the current transform

        // Re-scale y axis during zoom
        d3.select('#y_axis')
            .transition()
            .duration(50)
            .call(() => yAxis.scale(transform.rescaleY(yScale)))

        // Re-scale x axis during zoom
        d3.select('#x_axis')
            .transition()
            .duration(50)
            .call(() => xAxis.scale(transform.rescaleY(xScale)))

        // Re-draw vertices using new scales
        const new_xScale = transform.rescaleX(xScale)
        const new_yScale = transform.rescaleY(yScale)

        // Re-scale axes and gridlines
        svg.select<SVGGElement>('#x_axis').call(
            xAxis.scale(new_xScale).ticks(numTicksX).tickSize(-chart_dy)
        )
        svg.select<SVGGElement>('#y_axis').call(
            yAxis.scale(new_yScale).ticks(numTicksY).tickSize(-chart_dx)
        )

        svg.selectAll('.tick line').style('stroke', '#422B25')

        vertices
            .attr('cx', (d: Station) => new_xScale(d.x))
            .attr('cy', (d: Station) => new_yScale(d.z))

        lables
            .attr('x', (d: Station) => new_xScale(d.x))
            .attr('y', (d: Station) => new_yScale(d.z) - 14)

        // Re-draw edges using new scales
        edges_a
            .attr('x1', (d: Bolt) => new_xScale(sourceOf(d).x))
            .attr('y1', (d: Bolt) => new_yScale(sourceOf(d).z))
            .attr('x2', (d: Bolt) => new_xScale(d.turn.x))
            .attr('y2', (d: Bolt) => new_yScale(d.turn.z))

        edges_b
            .attr('x1', (d: Bolt) => new_xScale(d.turn.x))
            .attr('y1', (d: Bolt) => new_yScale(d.turn.z))
            .attr('x2', (d: Bolt) => new_xScale(targetOf(d).x))
            .attr('y2', (d: Bolt) => new_yScale(targetOf(d).z))
    }

    function handleLClick(station: Station) {
        // Output the name of the clicked point
        userMsg.value =
            station.name + ' { X: ' + station.x + ' , Z: ' + station.z + ' }'
    }

    function handleMiddleClick(e: MouseEvent, station: Station) {
        startStation = station
        startStationUnscaled.x = station.x
        startStationUnscaled.z = station.z

        userMsg.value = 'Draw bolt from ' + station.name
    }

    function handleMiddleRelease(e: MouseEvent, station: Station) {
        if (!startStation || station.id === startStation.id) return

        network.value.bolts.push(makeBolt(startStation, station))

        updateMap()
        updateData()
        userMsg.value += ' to ' + station.name
        startStation = null
    }

    function drawTempLine(
        svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
        end: number[]
    ) {
        svg.select('#temp-line').remove()

        // Get the SVG element
        const svgElement = svg.node()
        if (!svgElement) return

        // Get the SVG coordinates of the mouse cursor relative to the SVG element
        const svgPoint = svgElement.createSVGPoint()
        svgPoint.x = end[0] + 2
        svgPoint.y = end[1]
        const screenCTM = svgElement.getScreenCTM()
        if (!screenCTM) return
        const svgCursorPoint = svgPoint.matrixTransform(screenCTM.inverse())

        // Convert SVG coordinates to data space using scales
        const svgEndX = svgCursorPoint.x - margin.left
        const svgEndY = svgCursorPoint.y - margin.top

        const endStation = {
            x: xScale.invert(svgEndX),
            z: yScale.invert(svgEndY),
        }

        const new_xScale = savedTransform.rescaleX(xScale)
        const new_yScale = savedTransform.rescaleY(yScale)

        const startPoint = {
            x: new_xScale(startStationUnscaled.x),
            z: new_yScale(startStationUnscaled.z),
        }

        endStation.x = xScale(endStation.x)
        endStation.z = yScale(endStation.z)

        const turn = calculateTurn(startPoint, endStation)
        type LinePoint = { x: number; z: number }
        const lineGroup: { start: LinePoint; end: LinePoint }[] = [
            { start: startPoint, end: turn },
            { start: turn, end: endStation },
        ]

        svg.append('g')
            .attr('id', 'temp-line')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .selectAll('line')
            .data(lineGroup)
            .enter()
            .append('line')
            .attr('x1', d => d.start.x)
            .attr('y1', d => d.start.z)
            .attr('x2', d => d.end.x)
            .attr('y2', d => d.end.z)
            .style('stroke', 'gray')
            .style('stroke-width', 2)
            .style('stroke-dasharray', '5 5')
    }
}

async function onGraphChange() {
    const solverId = settings.value.activeSolver
    const colour = settings.value.display.colourGraph

    // Empty selection: render the current graph as-is.
    if (!solverId) {
        if (colour) network.value = autoColourGraph(network.value)
        updateMap()
        updateData()
        return
    }

    const start = Date.now()
    const solver = getSolver(solverId)

    if (solver?.runAsync) {
        await solver.runAsync(
            cleanClone(network.value),
            settings.value,
            (result: Network) => {
                network.value = colour ? autoColourGraph(result) : result
                updateMap()
                updateData()
            }
        )
    } else {
        const result = runSolver(network.value, solverId, settings.value)
        network.value = colour ? autoColourGraph(result) : result
    }

    userMsg.value = 'Processing time: ' + (Date.now() - start) + 'ms'

    updateMap()
    updateData()
}

function updateData() {
    ;[totalBoltLength.value, totalTunnelLength.value] = calculateTotalDist(
        network.value
    )
    if (settings.value.display.calcStats) {
        averageTravelTime.value = calculateAverageTravelTime(network.value)
    }
}

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateMap)
})
</script>
<template>
    <div>
        <div class="fixed right-0 top-0 w-48 p-5 backdrop-blur">
            <p class="text-center text-accent">
                <a
                    href="https://github.com/KK-mp4/Bolt-Routing-Problem-V2"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub">
                    Piston Bolt Network Builder
                </a>
                <span class="text-[10px] text-text"
                    >*early alpha build by kk</span
                >
            </p>

            <BaseSelect
                v-model="settings.activeSolver"
                aria-label="Graph type"
                @change="onGraphChange">
                <option
                    v-for="solver in solverOptions"
                    :key="solver.id"
                    :value="solver.id">
                    {{ solver.label }}
                </option>
            </BaseSelect>

            <div v-if="settings.activeSolver === 'star'">
                <BaseSelect
                    v-model="settings.solvers.star.rayCount"
                    @change="onGraphChange">
                    <option :value="4">S₄</option>
                    <option :value="8">S₈</option>
                </BaseSelect>
                <BaseSelect
                    v-model="settings.solvers.star.mergeAt"
                    @change="onGraphChange">
                    <option value="optimal">Optimal (Chebyshev median)</option>
                    <option value="median">Median</option>
                    <option value="average">Average</option>
                    <option value="">0, 0</option>
                    <option value="spawn">Spawn</option>
                    <option value="track">Track mouse</option>
                </BaseSelect>
            </div>

            <div v-if="settings.activeSolver === 'spanner'">
                <BaseSelect
                    v-model="settings.solvers.spanner.stretch"
                    @change="onGraphChange">
                    <option :value="1.1">t = 1.1</option>
                    <option :value="1.25">t = 1.25</option>
                    <option :value="1.5">t = 1.5</option>
                    <option :value="2">t = 2</option>
                    <option :value="3">t = 3</option>
                </BaseSelect>
            </div>

            <div v-if="settings.activeSolver === 'backbone'">
                <BaseSelect
                    v-model="settings.solvers.backbone.style"
                    @change="onGraphChange">
                    <option value="hubs">Hubs (k-means)</option>
                    <option value="grid">Fixed grid</option>
                </BaseSelect>
                <BaseSelect
                    v-if="settings.solvers.backbone.style === 'hubs'"
                    v-model="settings.solvers.backbone.hubs"
                    @change="onGraphChange">
                    <option :value="2">2 hubs</option>
                    <option :value="3">3 hubs</option>
                    <option :value="4">4 hubs</option>
                    <option :value="6">6 hubs</option>
                    <option :value="8">8 hubs</option>
                </BaseSelect>
                <BaseSelect
                    v-if="settings.solvers.backbone.style === 'grid'"
                    v-model="settings.solvers.backbone.grid"
                    @change="onGraphChange">
                    <option :value="2">2 × 2 grid</option>
                    <option :value="3">3 × 3 grid</option>
                    <option :value="4">4 × 4 grid</option>
                    <option :value="6">6 × 6 grid</option>
                    <option :value="8">8 × 8 grid</option>
                </BaseSelect>
            </div>
        </div>

        <div class="fixed left-0 top-0 p-5 pb-1 backdrop-blur">
            <p class="text-xs">
                Stations:<br />
                <span v-if="network.stations" class="text-accent">{{
                    network.stations.length
                }}</span>
                <span v-else class="text-accent">0</span>
            </p>
            <p class="mt-1 text-xs">
                Bolt length:<br /><span class="text-accent"
                    >{{ totalBoltLength }} blocks</span
                >
            </p>
            <p class="mt-1 text-xs">
                Tunnel length:<br /><span class="text-accent"
                    >{{ totalTunnelLength }} blocks</span
                >
            </p>
            <p v-if="settings.display.calcStats" class="mb-2 mt-1 text-xs">
                Average travel time:<br /><span class="text-accent"
                    >{{ Math.round(averageTravelTime * 100) / 100 }} s</span
                >
            </p>

            <NuxtLink to="/settings" title="Setting page" class="text-xs"
                >Settings -><br
            /></NuxtLink>
            <NuxtLink
                v-if="settings.display.calcStats"
                to="/heatmap"
                title="Distance matrix heatmap"
                class="text-xs"
                >Heatmap -><br
            /></NuxtLink>
            <NuxtLink to="/scatterplot" title="Scatter plot" class="text-xs"
                >Scatter plot -></NuxtLink
            >
        </div>

        <p class="fixed bottom-0 left-0 select-none text-sm">{{ userMsg }}</p>

        <div
            class="invisible fixed bottom-0 right-0 select-none text-[10px] md:visible">
            <p>pan: drag mouse1 / zoom: scroll mouse3 / connect: drag mouse3</p>
        </div>

        <div id="network_map" class="h-full w-full p-0" />
    </div>
</template>
