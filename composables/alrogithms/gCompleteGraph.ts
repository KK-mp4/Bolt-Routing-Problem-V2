export function generateCompleteGraph(network: Network): Network {
  network.bolts = [];

  const stations = network.stations;
  const numStations = stations.length;

  for (let i = 0; i < numStations; ++i) {
    for (let j = i + 1; j < numStations; ++j) {
      const stationA = stations[i];
      const stationB = stations[j];

      network.bolts.push({
        directed: false,
        station_a: stationA,
        turn: calculateTurn(stationA, stationB),
        station_b: stationB,
        length: chebyshevDistance(stationA, stationB),
        colour: '#8f7f10',
      });
    }
  }

  return network;
}