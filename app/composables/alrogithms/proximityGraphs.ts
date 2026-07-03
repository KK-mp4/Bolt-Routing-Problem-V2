import { Delaunay } from 'd3'

// Proximity graphs built on the Delaunay triangulation of the stations.
//
// The Delaunay triangulation is a superset of both the Gabriel graph and the
// relative-neighborhood graph, so those two are derived by filtering Delaunay
// edges. Geometry (triangulation, circles, lunes) is Euclidean, but every kept
// edge is still weighted by its Chebyshev distance for this metric space.

function delaunayEdges(stations: Station[]): [number, number][] {
    const n = stations.length
    if (n < 2) return []

    const points: [number, number][] = stations.map(s => [s.x, s.z])
    const delaunay = Delaunay.from(points)
    const { triangles } = delaunay

    const seen = new Set<string>()
    const edges: [number, number][] = []

    const addEdge = (a: number, b: number) => {
        const key = a < b ? `${a}-${b}` : `${b}-${a}`
        if (seen.has(key)) return
        seen.add(key)
        edges.push([a, b])
    }

    for (let i = 0; i < triangles.length; i += 3) {
        const a = triangles[i]
        const b = triangles[i + 1]
        const c = triangles[i + 2]
        addEdge(a, b)
        addEdge(b, c)
        addEdge(c, a)
    }

    return edges
}

function boltFromEdge(stationA: Station, stationB: Station): Bolt {
    return {
        directed: false,
        station_a: { name: stationA.name, x: stationA.x, z: stationA.z },
        turn: calculateTurn(stationA, stationB),
        station_b: { name: stationB.name, x: stationB.x, z: stationB.z },
        length: chebyshevDistance(stationA, stationB),
        colour: '#8f7f10',
    }
}

function sqDist(a: Station, b: Station): number {
    const dx = a.x - b.x
    const dz = a.z - b.z
    return dx * dx + dz * dz
}

export function generateDelaunayGraph(network: Network): Network {
    const stations = network.stations
    const bolts = delaunayEdges(stations).map(([i, j]) =>
        boltFromEdge(stations[i], stations[j])
    )
    return { stations: stations.slice(), bolts }
}

// Gabriel graph: keep an edge (p, q) only if the closed disk having pq as its
// diameter contains no other station, i.e. no r with angle prq > 90 degrees.
export function generateGabrielGraph(network: Network): Network {
    const stations = network.stations
    const n = stations.length
    const bolts: Bolt[] = []

    for (const [i, j] of delaunayEdges(stations)) {
        const p = stations[i]
        const q = stations[j]
        const diameterSq = sqDist(p, q)

        let blocked = false
        for (let r = 0; r < n; ++r) {
            if (r === i || r === j) continue
            // Inside the diameter circle iff |pr|^2 + |qr|^2 < |pq|^2.
            if (sqDist(p, stations[r]) + sqDist(q, stations[r]) < diameterSq) {
                blocked = true
                break
            }
        }

        if (!blocked) bolts.push(boltFromEdge(p, q))
    }

    return { stations: stations.slice(), bolts }
}

// Relative-neighborhood graph: keep an edge (p, q) only if no station r is
// closer to both p and q than they are to each other (empty lune).
export function generateRNGGraph(network: Network): Network {
    const stations = network.stations
    const n = stations.length
    const bolts: Bolt[] = []

    for (const [i, j] of delaunayEdges(stations)) {
        const p = stations[i]
        const q = stations[j]
        const pqSq = sqDist(p, q)

        let blocked = false
        for (let r = 0; r < n; ++r) {
            if (r === i || r === j) continue
            if (
                sqDist(p, stations[r]) < pqSq &&
                sqDist(q, stations[r]) < pqSq
            ) {
                blocked = true
                break
            }
        }

        if (!blocked) bolts.push(boltFromEdge(p, q))
    }

    return { stations: stations.slice(), bolts }
}
