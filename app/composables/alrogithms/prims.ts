// Starts from station 0
export function runPrimsAlgotithm(network: Network): Network {
    const stations = network.stations
    const numStations = stations.length

    // An array to track whether a station has been included in the minimum spanning tree
    const included = new Array(numStations).fill(false)

    // An array to store the parent station of each station in the minimum spanning tree
    const parent: number[] = new Array(numStations).fill(-1)

    // An array to store the weight of the edge connecting each station to the minimum spanning tree
    const key: number[] = new Array(numStations).fill(Infinity)

    // Choose the first station as the starting point
    key[0] = 0

    for (let count = 0; count < numStations - 1; ++count) {
        // Find the station with the minimum key value that has not been included yet
        const minKeyIndex = findMinKeyIndex(key, included)

        // Include the selected station in the minimum spanning tree
        included[minKeyIndex] = true

        // Update the key values and parent stations of adjacent stations
        for (let i = 0; i < numStations; ++i) {
            const distance = chebyshevDistance(
                stations[minKeyIndex],
                stations[i]
            )
            if (distance !== 0 && !included[i] && distance < key[i]) {
                parent[i] = minKeyIndex
                key[i] = distance
            }
        }
    }

    // Construct the minimum spanning tree (MST) based on the parent stations
    const bolts: Bolt[] = []
    for (let i = 1; i < numStations; ++i) {
        bolts.push(makeBolt(stations[parent[i]], stations[i]))
    }

    return { stations: stations.slice(), bolts: bolts }
}

function findMinKeyIndex(key: number[], included: boolean[]): number {
    let min = Infinity
    let minIndex = -1

    for (let i = 0; i < key.length; i++) {
        if (!included[i] && key[i] < min) {
            min = key[i]
            minIndex = i
        }
    }

    return minIndex
}
