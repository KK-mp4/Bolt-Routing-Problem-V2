export function generateCompleteGraph(network: Network): Network {
    network.bolts = []

    const stations = network.stations
    const numStations = stations.length

    for (let i = 0; i < numStations; ++i) {
        for (let j = i + 1; j < numStations; ++j) {
            network.bolts.push(makeBolt(stations[i], stations[j]))
        }
    }

    return network
}
