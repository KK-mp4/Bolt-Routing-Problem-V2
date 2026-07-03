// Dynamic (incremental) geometric t-spanner.
//
// This gives the same guarantee as the greedy t-spanner (every pair routes
// within `t` times its direct Chebyshev distance) but builds the network by
// inserting stations one at a time. When a station p is added, the existing
// stations are scanned nearest-first and an edge p-q is created only when the
// current graph cannot already route p to q within the allowed stretch.
//
// The key difference from the global greedy spanner is that only edges touching
// the freshly inserted station are ever considered; earlier pairs are never
// revisited. That makes each insertion a local operation and leaves the rest of
// the network intact, which is exactly the future-proofing property we are after
// (a real dynamic spanner keeps this cost polylogarithmic; here it is kept
// simple since networks are small).
export function generateDynamicSpannerGraph(
    network: Network,
    t: number
): Network {
    const stations = network.stations
    const n = stations.length

    const adjacency: [number, number][][] = Array.from({ length: n }, () => [])
    const bolts: Bolt[] = []

    for (let i = 0; i < n; ++i) {
        // Already-inserted stations, nearest first.
        const candidates: { j: number; d: number }[] = []
        for (let j = 0; j < i; ++j) {
            candidates.push({
                j,
                d: chebyshevDistance(stations[i], stations[j]),
            })
        }
        candidates.sort((a, b) => a.d - b.d)

        for (const { j, d } of candidates) {
            const current = shortestPath(adjacency, n, i, j)
            if (current > t * d) {
                adjacency[i].push([j, d])
                adjacency[j].push([i, d])
                bolts.push(makeBolt(stations[i], stations[j], { length: d }))
            }
        }
    }

    return { stations: stations.slice(), bolts }
}

// Dijkstra shortest path between two nodes on the partial spanner graph.
function shortestPath(
    adjacency: [number, number][][],
    n: number,
    source: number,
    target: number
): number {
    const dist = new Array<number>(n).fill(Infinity)
    const visited = new Array<boolean>(n).fill(false)
    dist[source] = 0

    for (let iter = 0; iter < n; ++iter) {
        let u = -1
        let best = Infinity
        for (let v = 0; v < n; ++v) {
            if (!visited[v] && dist[v] < best) {
                best = dist[v]
                u = v
            }
        }

        if (u === -1) break
        if (u === target) return dist[u]

        visited[u] = true
        for (const [v, w] of adjacency[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w
            }
        }
    }

    return dist[target]
}
