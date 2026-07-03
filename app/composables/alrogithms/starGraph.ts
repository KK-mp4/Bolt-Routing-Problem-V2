export function generateStarGraph(
    network: Network,
    rayCount: number,
    mergeAt: string,
    x0?: number,
    z0?: number
): Network {
    network.bolts = []

    const stations = network.stations
    const numStations = stations.length

    let x: number = 0
    let z: number = 0

    if (mergeAt === 'track' && x0 !== undefined && z0 !== undefined) {
        x = x0
        z = z0
    } else if (mergeAt === 'optimal') {
        // Chebyshev geometric median: the point minimizing the total ray length.
        // Chebyshev distance equals Manhattan distance under the 45 rotation
        // u = x + z, v = x - z, and the Manhattan 1-median is separable, so the
        // optimum is the coordinatewise median of u and v.
        ;[x, z] = chebyshevGeometricMedian(stations)
    } else if (mergeAt === 'median') {
        // Calculating median x and z values
        const xValues = stations.map(station => station.x)
        const zValues = stations.map(station => station.z)
        x = Math.round(calcMedian(xValues))
        z = Math.round(calcMedian(zValues))
    } else if (mergeAt === 'average') {
        // Calculating average x and z values
        const totalX = stations.reduce((sum, station) => sum + station.x, 0)
        const totalZ = stations.reduce((sum, station) => sum + station.z, 0)
        x = Math.round(totalX / numStations)
        z = Math.round(totalZ / numStations)
    } else if (mergeAt === 'spawn') {
        x = -80
        z = -176
    }

    const stationB = {
        name: 'Junction №0',
        description: '',
        colour: '#f2a788',
        x: x,
        z: z,
    }

    network.stations.push(stationB)

    for (let i = 0; i < numStations; ++i) {
        const stationA = stations[i]

        let turn: { x: number; z: number }

        const abs_tg =
            Math.abs(stationA.x - stationB.x) /
            Math.abs(stationA.z - stationB.z)
        if (rayCount == 8 && abs_tg > 0.57735 && abs_tg < 1.7321) {
            turn = calculateTurn(stationB, stationA)
        } else {
            turn = calculateTurn(stationA, stationB)
        }

        network.bolts.push({
            directed: false,
            station_a: stationB,
            turn: turn,
            station_b: stationA,
            length: chebyshevDistance(stationA, stationB),
            colour: '#8f7f10',
        })
    }

    return network
}

// Returns the integer point that minimizes the sum of Chebyshev distances to
// every station (the exact optimal star centre for total ray length, which also
// minimizes the star's average travel time).
function chebyshevGeometricMedian(stations: Station[]): [number, number] {
    const uValues = stations.map(station => station.x + station.z)
    const vValues = stations.map(station => station.z - station.x)

    const uStar = calcMedian(uValues)
    const vStar = calcMedian(vValues)

    // Back-transform: x = (u - v) / 2, z = (u + v) / 2. The result may be
    // fractional (even n) or violate the u + v parity constraint, so evaluate a
    // small integer neighbourhood and keep the point with the lowest total cost.
    const xGuess = (uStar - vStar) / 2
    const zGuess = (uStar + vStar) / 2

    let bestX = Math.round(xGuess)
    let bestZ = Math.round(zGuess)
    let bestCost = Infinity

    for (let dx = -1; dx <= 1; ++dx) {
        for (let dz = -1; dz <= 1; ++dz) {
            const cx = Math.round(xGuess) + dx
            const cz = Math.round(zGuess) + dz
            const candidate = { x: cx, z: cz } as Station
            let cost = 0
            for (const station of stations) {
                cost += chebyshevDistance(candidate, station)
            }
            if (cost < bestCost) {
                bestCost = cost
                bestX = cx
                bestZ = cz
            }
        }
    }

    return [bestX, bestZ]
}

function calcMedian(values: number[]): number {
    if (values.length === 0) {
        throw new Error('Input array is empty')
    }

    // Sorting values, preventing original array from being mutated
    values = [...values].sort((a, b) => a - b)

    const half = Math.floor(values.length / 2)

    return values.length % 2
        ? values[half]
        : (values[half - 1] + values[half]) / 2
}
