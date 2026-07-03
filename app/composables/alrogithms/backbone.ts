// Hub backbone (future-proof network).
//
// A small set of hubs is placed with k-means over the stations. The hubs are
// joined into a trunk (an MST over the hubs) and every station spurs to its
// nearest hub. Because the backbone only depends on the hub positions, adding a
// new station later just attaches one more spur to the nearest existing hub
// without reshaping the rest of the network.
export function generateBackboneGraph(
    network: Network,
    hubCount: number
): Network {
    const terminals = network.stations.slice()
    const n = terminals.length

    if (n === 0) return { stations: terminals, bolts: [] }

    const k = Math.max(1, Math.min(Math.round(hubCount), n))

    const centroids = kMeans(terminals, k)

    // Materialize hubs as prunable junctions.
    const hubs: Station[] = centroids.map((c, i) =>
        makeJunction(`Junction \u2116${i}`, c.x, c.z)
    )

    const bolts: Bolt[] = []

    // Trunk: MST over the hubs.
    for (const [a, b] of mstEdges(hubs)) {
        bolts.push(makeBolt(hubs[a], hubs[b]))
    }

    // Spurs: each station to its nearest hub.
    for (const station of terminals) {
        let nearest = 0
        let nearestDist = Infinity
        for (let h = 0; h < hubs.length; ++h) {
            const d = chebyshevDistance(station, hubs[h])
            if (d < nearestDist) {
                nearestDist = d
                nearest = h
            }
        }
        bolts.push(makeBolt(station, hubs[nearest]))
    }

    return { stations: terminals.concat(hubs), bolts }
}

// Fixed grid backbone.
//
// Unlike the k-means variant, the trunk here is a plain lattice of trunk lines
// derived only from the stations' bounding box divided into `divisions` columns
// and rows. Every grid intersection is a junction, adjacent intersections are
// joined along rows and columns, and each station spurs to its nearest
// intersection. Because the lattice depends only on the bounding box and the
// division count, adding a station inside the covered area never reshapes the
// trunk, it just adds one more spur.
export function generateGridBackboneGraph(
    network: Network,
    divisions: number
): Network {
    const terminals = network.stations.slice()
    const n = terminals.length

    if (n === 0) return { stations: terminals, bolts: [] }

    const d = Math.max(1, Math.round(divisions))

    let minX = Infinity
    let maxX = -Infinity
    let minZ = Infinity
    let maxZ = -Infinity
    for (const s of terminals) {
        if (s.x < minX) minX = s.x
        if (s.x > maxX) maxX = s.x
        if (s.z < minZ) minZ = s.z
        if (s.z > maxZ) maxZ = s.z
    }

    const stepX = (maxX - minX) / d
    const stepZ = (maxZ - minZ) / d

    // Intersection grid: (d + 1) x (d + 1) junctions indexed [i][j].
    const cols = d + 1
    const rows = d + 1
    const hubs: Station[] = []
    const gridIndex: number[][] = []
    let count = 0
    for (let i = 0; i < cols; ++i) {
        gridIndex[i] = []
        for (let j = 0; j < rows; ++j) {
            hubs.push(
                makeJunction(
                    `Junction \u2116${count}`,
                    Math.round(minX + stepX * i),
                    Math.round(minZ + stepZ * j)
                )
            )
            gridIndex[i][j] = count
            count++
        }
    }

    const bolts: Bolt[] = []

    // Trunk: connect adjacent intersections along rows and columns.
    for (let i = 0; i < cols; ++i) {
        for (let j = 0; j < rows; ++j) {
            if (i + 1 < cols) {
                bolts.push(
                    makeBolt(hubs[gridIndex[i][j]], hubs[gridIndex[i + 1][j]])
                )
            }
            if (j + 1 < rows) {
                bolts.push(
                    makeBolt(hubs[gridIndex[i][j]], hubs[gridIndex[i][j + 1]])
                )
            }
        }
    }

    // Spurs: each station to its nearest grid intersection.
    for (const station of terminals) {
        const i = stepX === 0 ? 0 : Math.round((station.x - minX) / stepX)
        const j = stepZ === 0 ? 0 : Math.round((station.z - minZ) / stepZ)
        const ci = Math.max(0, Math.min(cols - 1, i))
        const cj = Math.max(0, Math.min(rows - 1, j))
        bolts.push(makeBolt(station, hubs[gridIndex[ci][cj]]))
    }

    return { stations: terminals.concat(hubs), bolts }
}

// k-nearest-neighbors backbone (future-proof network).
//
// Every station links directly to its k nearest stations (Chebyshev distance),
// with no hubs or junctions. The result is unioned with an MST over the
// stations so the network is always connected even where the local kNN edges
// leave gaps. Because each station's edges depend only on its neighborhood,
// inserting a new station later touches just that local area instead of forcing
// a global rebuild.
export function generateKnnBackboneGraph(network: Network, k: number): Network {
    const terminals = network.stations.slice()
    const n = terminals.length

    if (n === 0) return { stations: terminals, bolts: [] }

    const neighbors = Math.max(1, Math.min(Math.round(k), n - 1))

    // Undirected edge set, keyed by the sorted index pair, to dedupe the
    // (possibly asymmetric) kNN links and the MST edges we merge in below.
    const seen = new Set<string>()
    const bolts: Bolt[] = []

    const addEdge = (a: number, b: number) => {
        if (a === b) return
        const key = a < b ? `${a}:${b}` : `${b}:${a}`
        if (seen.has(key)) return
        seen.add(key)
        bolts.push(makeBolt(terminals[a], terminals[b]))
    }

    // kNN: for each station, connect to its k nearest stations.
    for (let i = 0; i < n; ++i) {
        const distances: { index: number; dist: number }[] = []
        for (let j = 0; j < n; ++j) {
            if (i === j) continue
            distances.push({
                index: j,
                dist: chebyshevDistance(terminals[i], terminals[j]),
            })
        }
        distances.sort((a, b) => a.dist - b.dist)
        for (let m = 0; m < neighbors; ++m) {
            addEdge(i, distances[m].index)
        }
    }

    // Connectivity backstop: union with an MST over the stations.
    for (const [a, b] of mstEdges(terminals)) {
        addEdge(a, b)
    }

    return { stations: terminals, bolts }
}

// Lloyd's k-means using Chebyshev assignment, seeded farthest-first for a
// deterministic, well-spread starting configuration.
function kMeans(stations: Station[], k: number): { x: number; z: number }[] {
    const centroids = farthestFirstSeeds(stations, k)
    const assignment = new Array<number>(stations.length).fill(0)

    for (let iter = 0; iter < 30; ++iter) {
        let changed = false

        // Assign each station to the nearest centroid.
        for (let i = 0; i < stations.length; ++i) {
            let best = 0
            let bestDist = Infinity
            for (let c = 0; c < k; ++c) {
                const d = chebyshevDistance(
                    stations[i],
                    centroids[c] as Station
                )
                if (d < bestDist) {
                    bestDist = d
                    best = c
                }
            }
            if (assignment[i] !== best) {
                assignment[i] = best
                changed = true
            }
        }

        // Recompute centroids as the mean of their members.
        const sumX = new Array<number>(k).fill(0)
        const sumZ = new Array<number>(k).fill(0)
        const count = new Array<number>(k).fill(0)
        for (let i = 0; i < stations.length; ++i) {
            const c = assignment[i]
            sumX[c] += stations[i].x
            sumZ[c] += stations[i].z
            count[c]++
        }
        for (let c = 0; c < k; ++c) {
            if (count[c] > 0) {
                centroids[c] = {
                    x: Math.round(sumX[c] / count[c]),
                    z: Math.round(sumZ[c] / count[c]),
                }
            }
        }

        if (!changed) break
    }

    return centroids
}

function farthestFirstSeeds(
    stations: Station[],
    k: number
): { x: number; z: number }[] {
    const seeds: { x: number; z: number }[] = [
        { x: stations[0].x, z: stations[0].z },
    ]

    while (seeds.length < k) {
        let farthest = 0
        let farthestDist = -1
        for (let i = 0; i < stations.length; ++i) {
            let nearest = Infinity
            for (const s of seeds) {
                nearest = Math.min(
                    nearest,
                    chebyshevDistance(stations[i], s as Station)
                )
            }
            if (nearest > farthestDist) {
                farthestDist = nearest
                farthest = i
            }
        }
        seeds.push({ x: stations[farthest].x, z: stations[farthest].z })
    }

    return seeds
}

// Prim's MST over an arbitrary point set using Chebyshev distance.
function mstEdges(points: Station[]): [number, number][] {
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
