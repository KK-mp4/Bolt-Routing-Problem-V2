export function generateLoopGraph(network: Network): Network {
    const stations = network.stations
    const numStations = stations.length

    // Initializing the shortest path and its length
    let shortestPath: Network = { stations: [], bolts: [] }
    let shortestPathLength = Infinity

    // Looping through each station as the starting point
    for (let startIdx = 0; startIdx < numStations; ++startIdx) {
        // Reseting visited array for each starting point
        const visited = new Array(numStations).fill(false)
        let currentStation = stations[startIdx]
        visited[startIdx] = true

        // Initializing the bolts array for the current path
        const bolts: Bolt[] = []

        // Helper function to find the nearest neighbor
        function findNearestNeighbor(station: Station): Station | null {
            let minDistance = Infinity
            let nearestNeighbor: Station | null = null

            for (let i = 0; i < numStations; ++i) {
                if (!visited[i]) {
                    const neighborStation = stations[i]
                    const distance = chebyshevDistance(station, neighborStation)

                    if (distance < minDistance) {
                        minDistance = distance
                        nearestNeighbor = neighborStation
                    }
                }
            }

            return nearestNeighbor
        }

        // Looping until all stations are visited
        let nextStation: Station | null
        while ((nextStation = findNearestNeighbor(currentStation)) !== null) {
            bolts.push(
                makeBolt(currentStation, nextStation, { directed: true })
            )

            visited[stations.indexOf(nextStation)] = true
            currentStation = nextStation
        }

        // Connecting the last station with the start station to complete the loop
        bolts.push(
            makeBolt(currentStation, stations[startIdx], { directed: true })
        )

        // Calculating the total length of the path
        const pathLength = bolts.reduce((acc, bolt) => acc + bolt.length, 0)

        // Updating shortest path if the current path is shorter
        if (pathLength < shortestPathLength) {
            shortestPath = { stations: stations.slice(), bolts: bolts.slice() }
            shortestPathLength = pathLength
        }
    }

    return shortestPath
}
