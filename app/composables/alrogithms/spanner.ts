// Greedy geometric t-spanner.
//
// A t-spanner guarantees that for every pair of stations the shortest path
// through the graph is at most `t` times their direct Chebyshev distance, while
// using far fewer edges than a complete graph. Sweeping the stretch factor `t`
// moves the result along the Pareto front: as `t` approaches 1 it converges to
// the complete graph (minimal travel time), and as `t` grows it thins out
// towards an MST (minimal length).
export function generateSpannerGraph(network: Network, t: number): Network {
    const stations = network.stations
    const n = stations.length

    // Adjacency list of [neighbour index, edge weight].
    const adjacency: [number, number][][] = Array.from({ length: n }, () => [])

    // All unordered pairs, considered shortest-first (classic greedy spanner).
    type Pair = { i: number; j: number; d: number }
    const pairs: Pair[] = []
    for (let i = 0; i < n; ++i) {
        for (let j = i + 1; j < n; ++j) {
            pairs.push({ i, j, d: chebyshevDistance(stations[i], stations[j]) })
        }
    }
    pairs.sort((a, b) => a.d - b.d)

    const bolts: Bolt[] = []

    for (const { i, j, d } of pairs) {
        // If the current graph already routes i to j within the allowed stretch
        // the edge is redundant, otherwise add it.
        const currentDist = shortestPath(adjacency, n, i, j)
        if (currentDist > t * d) {
            adjacency[i].push([j, d])
            adjacency[j].push([i, d])

            bolts.push(makeBolt(stations[i], stations[j], { length: d }))
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
        // Pick the closest unvisited node (linear scan; n is small).
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
