export function generateStarGraph(network: Network, param: string): Network {
  network.bolts = [];

  const stations = network.stations;
  const numStations = stations.length;

  let x: number = 0;
  let z: number = 0;

  if (param === "median") {
    // Calculating median x and z values
    const xValues = stations.map(station => station.x);
    const zValues = stations.map(station => station.z);
    x = Math.round(median(xValues));
    z = Math.round(median(zValues));
  } else if (param === "average") {
    // Calculating average x and z values
    const totalX = stations.reduce((sum, station) => sum + station.x, 0);
    const totalZ = stations.reduce((sum, station) => sum + station.z, 0);
    x = Math.round(totalX / numStations);
    z = Math.round(totalZ / numStations);
  } else if (param === "spawn") {
    x = -80;
    z = -176;
  }

  for (let i = 0; i < numStations; ++i) {
    const stationA = stations[i];
    const stationB = {
      name: "Mergeing point",
      description: '',
      colour: '',
      x: x,
      z: z,
    };

    network.bolts.push({
      directed: false,
      station_a: stationA,
      turn: calculateTurn(stationA, stationB),
      station_b: stationB,
      length: chebyshevDistance(stationA, stationB),
      colour: '#8f7f10',
    });
  }

  return network;
}

function median(values: number[]): number {

  if (values.length === 0) {
    throw new Error('Input array is empty');
  }

  // Sorting values, preventing original array
  // from being mutated.
  values = [...values].sort((a, b) => a - b);

  const half = Math.floor(values.length / 2);

  return (values.length % 2
    ? values[half]
    : (values[half - 1] + values[half]) / 2
  );

}