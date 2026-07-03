// Theta-8 graph, aligned to the eight piston-bolt travel directions.
//
// Like the Yao graph, the plane around every station is split into 8 cones of
// 45 degrees, each centred on a bolt direction. The difference is the choice of
// neighbour inside a cone: Yao keeps the metrically nearest point, while Theta
// keeps the point with the smallest projection onto the cone's central axis.
// That projection rule makes Theta a well-behaved spanner and, like Yao, it is
// built per-station from local information, so inserting a new station mostly
// affects only its own cones.
export function generateThetaGraph(network: Network): Network {
    const stations = network.stations
    const n = stations.length

    const CONES = 8
    const CONE_SIZE = (2 * Math.PI) / CONES

    const seen = new Set<string>()
    const bolts: Bolt[] = []

    for (let i = 0; i < n; ++i) {
        // Best (smallest projection) neighbour per cone.
        const best = new Array<number>(CONES).fill(-1)
        const bestProjection = new Array<number>(CONES).fill(Infinity)

        for (let j = 0; j < n; ++j) {
            if (i === j) continue

            const dx = stations[j].x - stations[i].x
            const dz = stations[j].z - stations[i].z

            let angle = Math.atan2(dz, dx)
            if (angle < 0) angle += 2 * Math.PI
            const cone = Math.round(angle / CONE_SIZE) % CONES

            // Signed projection of the offset onto the cone's central direction.
            const axis = cone * CONE_SIZE
            const projection = dx * Math.cos(axis) + dz * Math.sin(axis)

            if (projection < bestProjection[cone]) {
                bestProjection[cone] = projection
                best[cone] = j
            }
        }

        for (let c = 0; c < CONES; ++c) {
            const j = best[c]
            if (j === -1) continue

            const key = i < j ? `${i}-${j}` : `${j}-${i}`
            if (seen.has(key)) continue
            seen.add(key)

            bolts.push(makeBolt(stations[i], stations[j]))
        }
    }

    return { stations: stations.slice(), bolts }
}
