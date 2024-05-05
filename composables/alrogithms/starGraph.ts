export function generateStarGraph(network: Network, rayCount: number, mergeAt: string, x0?: number, z0?: number): Network {
  network.bolts = [];

  const stations = network.stations;
  const numStations = stations.length;

  let x: number = 0;
  let z: number = 0;

  if (mergeAt === "track" && x0 !== undefined && z0 !== undefined) {
    x = x0;
    z = z0;
  } else if (mergeAt === "median") {
    // Calculating median x and z values
    const xValues = stations.map(station => station.x);
    const zValues = stations.map(station => station.z);
    x = Math.round(calcMedian(xValues));
    z = Math.round(calcMedian(zValues));
  } else if (mergeAt === "average") {
    // Calculating average x and z values
    const totalX = stations.reduce((sum, station) => sum + station.x, 0);
    const totalZ = stations.reduce((sum, station) => sum + station.z, 0);
    x = Math.round(totalX / numStations);
    z = Math.round(totalZ / numStations);
  } else if (mergeAt === "spawn") {
    x = -80;
    z = -176;
  }

  const stationB = {
    name: "Mergeing point",
    description: '',
    colour: '',
    x: x,
    z: z,
  };

  for (let i = 0; i < numStations; ++i) {
    const stationA = stations[i];

    let turn: { x: number; z: number;};

    const abs_tg = Math.abs(stationA.x - stationB.x) / Math.abs(stationA.z - stationB.z);
    if (rayCount == 8 && abs_tg > 0.57735 && abs_tg < 1.7321) {
      turn = calculateTurn(stationB, stationA);
    } else {
      turn = calculateTurn(stationA, stationB);
    }

    network.bolts.push({
      directed: false,
      station_a: stationA,
      turn: turn,
      station_b: stationB,
      length: chebyshevDistance(stationA, stationB),
      colour: '#8f7f10',
    });
  }

  return network;
}

function calcMedian(values: number[]): number {
  if (values.length === 0) {
    throw new Error('Input array is empty');
  }

  // Sorting values, preventing original array from being mutated
  values = [...values].sort((a, b) => a - b);

  const half = Math.floor(values.length / 2);

  return (values.length % 2 ? values[half] : (values[half - 1] + values[half]) / 2);
}