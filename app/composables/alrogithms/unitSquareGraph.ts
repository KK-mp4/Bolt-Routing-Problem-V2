// Unit-square (fixed-radius) graph.
//
// This is the Chebyshev analogue of a unit disk graph: two stations are joined
// whenever their Chebyshev distance is within a radius r. Because an L-infinity
// ball is an axis-aligned square, every station is effectively linked to
// everyone inside its square footprint. The radius is expressed relative to the
// network's own spacing (a multiple of the median nearest-neighbour distance)
// so it adapts to any scale. A pure fixed-radius graph can leave isolated
// stations in sparse areas, so the edges are unioned with an MST to keep the
// whole network reachable. Inserting a new station only wires it to the stations
// already inside its square, leaving the rest of the network untouched.
export function generateUnitSquareGraph(
    network: Network,
    radiusFactor: number
): Network {
    const stations = network.stations
    const n = stations.length
    if (n <= 1) return { stations: stations.slice(), bolts: [] }

    const spacing = medianNearestNeighbourDistance(stations)
    const radius = Math.max(1, spacing * Math.max(0.1, radiusFactor))

    const seen = new Set<string>()
    const bolts: Bolt[] = []

    const addEdge = (a: number, b: number, d: number) => {
        if (a === b) return
        const key = a < b ? `${a}-${b}` : `${b}-${a}`
        if (seen.has(key)) return
        seen.add(key)
        bolts.push(makeBolt(stations[a], stations[b], { length: d }))
    }

    for (let i = 0; i < n; ++i) {
        for (let j = i + 1; j < n; ++j) {
            const d = chebyshevDistance(stations[i], stations[j])
            if (d <= radius) addEdge(i, j, d)
        }
    }

    // Connectivity backstop.
    for (const [a, b] of unitSquareMstEdges(stations)) {
        addEdge(a, b, chebyshevDistance(stations[a], stations[b]))
    }

    return { stations: stations.slice(), bolts }
}

// Median of every station's distance to its single nearest neighbour, used as a
// scale-independent unit for the connection radius.
function medianNearestNeighbourDistance(stations: Station[]): number {
    const n = stations.length
    const nearest: number[] = []

    for (let i = 0; i < n; ++i) {
        let best = Infinity
        for (let j = 0; j < n; ++j) {
            if (i === j) continue
            const d = chebyshevDistance(stations[i], stations[j])
            if (d < best) best = d
        }
        if (Number.isFinite(best)) nearest.push(best)
    }

    if (nearest.length === 0) return 1
    nearest.sort((a, b) => a - b)
    const mid = Math.floor(nearest.length / 2)
    return nearest.length % 2 === 1
        ? nearest[mid]
        : (nearest[mid - 1] + nearest[mid]) / 2
}

// Prim's MST over the stations using Chebyshev distance.
function unitSquareMstEdges(points: Station[]): [number, number][] {
    const n = points.length
    const edges: [number, number][] = []
    if (n <= 1) return edges

    const included = new Array<boolean>(n).fill(false)
    const key = new Array<number>(n).fill(Infinity)
    const parent = new Array<number>(n).fill(-1)
    key[0] = 0

    for (let count = 0; count < n; ++count) {
        let u = -1
        let minKey = Infinity
        for (let i = 0; i < n; ++i) {
            if (!included[i] && key[i] < minKey) {
                minKey = key[i]
                u = i
            }
        }
        if (u === -1) break

        included[u] = true
        if (parent[u] !== -1) edges.push([parent[u], u])

        for (let v = 0; v < n; ++v) {
            if (!included[v]) {
                const d = chebyshevDistance(points[u], points[v])
                if (d < key[v]) {
                    key[v] = d
                    parent[v] = u
                }
            }
        }
    }

    return edges
}
