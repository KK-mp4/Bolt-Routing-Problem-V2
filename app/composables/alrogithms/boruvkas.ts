export function runBoruvkasAlgorithm(
    network: Network,
    adjacencyList: number[][]
): Network {
    const stations = network.stations
    const numStations = stations.length

    // Initialize an array to store the representatives of each component
    const representatives: number[] = Array.from(
        { length: numStations },
        (_, i) => i
    )

    // Initialize an array to store the minimum edge connecting each component
    type MinEdge = { station_a: number; station_b: number; length: number }
    const minEdge: (MinEdge | null)[] = Array(numStations).fill(null)

    // Keep track of the total number of components
    let numComponents = numStations

    // Initialize an array to store the resulting bolts (edges of the minimum spanning tree)
    const bolts: Bolt[] = []

    // Repeat until there is only one component left
    while (numComponents > 1) {
        // Find the minimum edge connecting each component
        for (let i = 0; i < numStations; i++) {
            minEdge[i] = null // Reset minEdge for each component

            for (const neighbor of adjacencyList[i]) {
                const rep1 = findRepresentative(i, representatives)
                const rep2 = findRepresentative(neighbor, representatives)

                const weight = getWeight(i, neighbor, stations, adjacencyList)
                const currentMin = minEdge[rep1]
                if (
                    rep1 !== rep2 &&
                    (currentMin === null || weight < currentMin.length)
                ) {
                    minEdge[rep1] = {
                        station_a: i,
                        station_b: neighbor,
                        length: weight,
                    }
                }
            }
        }

        // Add the minimum edge of each component to the resulting bolts
        for (let i = 0; i < numStations; i++) {
            const edge = minEdge[i]
            if (edge !== null) {
                bolts.push(
                    makeBolt(
                        stations[edge.station_a],
                        stations[edge.station_b],
                        {
                            length: edge.length,
                        }
                    )
                )

                // Union the two components
                union(edge.station_a, edge.station_b, representatives)
                numComponents--
            }
        }
    }

    // Return the minimum spanning tree
    return { stations: stations.slice(), bolts: bolts }
}

function findRepresentative(vertex: number, representatives: number[]): number {
    if (representatives[vertex] === vertex) {
        return vertex
    }
    return findRepresentative(representatives[vertex], representatives)
}

function union(
    vertex1: number,
    vertex2: number,
    representatives: number[]
): void {
    const rep1 = findRepresentative(vertex1, representatives)
    const rep2 = findRepresentative(vertex2, representatives)
    representatives[rep2] = rep1
}

function getWeight(
    stationIndex1: number,
    stationIndex2: number,
    stations: Station[],
    adjacencyList: number[][]
): number {
    const neighborIndex = adjacencyList[stationIndex1].indexOf(stationIndex2)
    if (neighborIndex !== -1) {
        return chebyshevDistance(
            stations[stationIndex1],
            stations[stationIndex2]
        )
    }
    return Infinity // Weight not found (should not happen)
}
