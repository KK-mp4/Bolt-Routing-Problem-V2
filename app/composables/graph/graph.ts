export function calculateTotalDist(network: Network): number[] {
    let totalBolt = 0
    let totalTunnel = 0
    network.bolts.forEach(bolt => {
        totalTunnel += bolt.length
        if (bolt.directed === false) totalBolt += bolt.length
    })

    totalBolt += totalTunnel
    return [totalBolt, totalTunnel]
}

// Floyd-Warshall all-pairs shortest paths. Undirected bolts contribute both
// directions; directed bolts only source -> target.
export function floydWarshall(network: Network): number[][] {
    const stations = network.stations
    const bolts = network.bolts

    const n = stations.length
    const inf = Number.POSITIVE_INFINITY

    const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(inf))
    for (let i = 0; i < n; ++i) {
        dist[i][i] = 0
    }

    // Map station id -> index once for O(1) endpoint resolution.
    const indexById = new Map<string, number>()
    for (let i = 0; i < n; ++i) {
        indexById.set(stations[i].id, i)
    }

    for (const bolt of bolts) {
        const a = indexById.get(bolt.source)
        const b = indexById.get(bolt.target)

        if (a === undefined || b === undefined) continue

        // Keep the smallest weight in case of parallel edges.
        dist[a][b] = Math.min(dist[a][b], bolt.length)
        if (!bolt.directed) {
            dist[b][a] = Math.min(dist[b][a], bolt.length)
        }
    }

    for (let k = 0; k < n; ++k) {
        for (let i = 0; i < n; ++i) {
            for (let j = 0; j < n; ++j) {
                if (dist[i][k] !== inf && dist[k][j] !== inf) {
                    dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j])
                }
            }
        }
    }

    return dist
}

export function calculateAverageTravelTime(network: Network): number {
    const dist = floydWarshall(network)
    const n = network.stations.length
    const inf = Number.POSITIVE_INFINITY

    let totalDistance = 0
    let validDistances = 0

    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
            if (i !== j && dist[i][j] !== inf) {
                totalDistance += dist[i][j]
                validDistances++
            }
        }
    }

    if (validDistances === 0) return 0

    // Average distance -> time (assumed speed is 20 m/s).
    return totalDistance / validDistances / 20
}

// Builds the serialisable distance matrix used by the heatmap and CSV export
// directly from a network, so there is no stale persisted copy to keep in sync.
export function buildDistanceMatrix(network: Network): DistanceMatrix[] {
    const dist = floydWarshall(network)
    const stations = network.stations

    return stations.map((station, i) => ({
        station_name: station.name,
        values: stations.map((_, j) => dist[i][j]),
    }))
}

export function autoColourGraph(network: Network): Network {
    network.stations.forEach(station => {
        station.colour = getRandomHexColor(station.name)
    })

    const colourById = new Map<string, string>()
    network.stations.forEach(station =>
        colourById.set(station.id, station.colour)
    )

    network.bolts.forEach(bolt => {
        const colour = colourById.get(bolt.target)
        if (colour) {
            bolt.colour = colour
        }
    })

    return network
}

function getRandomHexColor(seed: string): string {
    // Generate a random hue value (H) between 0 and 360
    // const h = Math.floor(Math.random() * 361);
    const h = stringToDegrees(seed)

    // Set constant saturation (S) and lightness (L) values
    const s = 80 // 80%
    const l = 74 // 74%

    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * (l / 100) - 1)) * (s / 100)
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l / 100 - c / 2

    let r = 0,
        g = 0,
        b = 0
    if (h >= 0 && h < 60) {
        r = c
        g = x
    } else if (h >= 60 && h < 120) {
        r = x
        g = c
    } else if (h >= 120 && h < 180) {
        g = c
        b = x
    } else if (h >= 180 && h < 240) {
        g = x
        b = c
    } else if (h >= 240 && h < 300) {
        r = x
        b = c
    } else if (h >= 300 && h < 360) {
        r = c
        b = x
    }

    // Convert RGB to hexadecimal
    const rgbToHex = (rgb: number): string => {
        const hex = Math.round(rgb * 255).toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }

    const hexColor = `#${rgbToHex(r + m)}${rgbToHex(g + m)}${rgbToHex(b + m)}`
    return hexColor.toUpperCase()
}

function stringToDegrees(seed: string): number {
    let hash = 0
    for (let i = 0; i < seed.length; ++i) {
        hash = (hash << 5) - hash + seed.charCodeAt(i)
        hash |= 0 // Convert to 32bit integer
    }

    return Math.abs(hash % 360)
}

export function clearJunctions(network: Network): Network {
    const junctionIds = new Set(
        network.stations
            .filter(station => station.name.includes('Junction \u2116'))
            .map(station => station.id)
    )

    network.stations = network.stations.filter(
        station => !junctionIds.has(station.id)
    )
    // Drop any bolts that referenced a removed junction.
    network.bolts = network.bolts.filter(
        bolt => !junctionIds.has(bolt.source) && !junctionIds.has(bolt.target)
    )
    return network
}

// Deep clone that also strips synthetic junctions, giving solvers a clean
// terminal-only network to run on (avoids junction accumulation across runs).
export function cloneNetwork(network: Network): Network {
    return {
        stations: network.stations.map(station => ({ ...station })),
        bolts: network.bolts.map(bolt => ({ ...bolt, turn: { ...bolt.turn } })),
    }
}

export function cleanClone(network: Network): Network {
    return clearJunctions(cloneNetwork(network))
}
