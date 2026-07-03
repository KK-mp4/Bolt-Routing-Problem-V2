// Yao-8 graph, aligned to the eight piston-bolt travel directions.
//
// Around every station the plane is split into 8 cones of 45 degrees, each one
// centred on a bolt direction (N, NE, E, SE, S, SW, W, NW). The station is
// connected to its nearest neighbour (by Chebyshev distance) inside each cone.
// The result is a sparse, octilinear-friendly spanner that keeps short local
// hops in every direction.
export function generateYaoGraph(network: Network): Network {
    const stations = network.stations
    const n = stations.length

    const CONES = 8
    const CONE_SIZE = (2 * Math.PI) / CONES

    // Deduplicate undirected edges as "min-max" keys.
    const seen = new Set<string>()
    const bolts: Bolt[] = []

    for (let i = 0; i < n; ++i) {
        // Nearest neighbour index per cone, with its distance.
        const nearest = new Array<number>(CONES).fill(-1)
        const nearestDist = new Array<number>(CONES).fill(Infinity)

        for (let j = 0; j < n; ++j) {
            if (i === j) continue

            const dx = stations[j].x - stations[i].x
            const dz = stations[j].z - stations[i].z

            // Cone centred on the closest of the 8 bolt directions.
            let angle = Math.atan2(dz, dx)
            if (angle < 0) angle += 2 * Math.PI
            const cone = Math.round(angle / CONE_SIZE) % CONES

            const distance = chebyshevDistance(stations[i], stations[j])
            if (distance < nearestDist[cone]) {
                nearestDist[cone] = distance
                nearest[cone] = j
            }
        }

        for (let c = 0; c < CONES; ++c) {
            const j = nearest[c]
            if (j === -1) continue

            const key = i < j ? `${i}-${j}` : `${j}-${i}`
            if (seen.has(key)) continue
            seen.add(key)

            const stationA = stations[i]
            const stationB = stations[j]
            bolts.push({
                directed: false,
                station_a: {
                    name: stationA.name,
                    x: stationA.x,
                    z: stationA.z,
                },
                turn: calculateTurn(stationA, stationB),
                station_b: {
                    name: stationB.name,
                    x: stationB.x,
                    z: stationB.z,
                },
                length: nearestDist[c],
                colour: '#8f7f10',
            })
        }
    }

    return { stations: stations.slice(), bolts }
}
