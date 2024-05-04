export function calculateTurn(station_a: Station, station_b: Station): {x: number; z: number; } {
  // Very nice and clean way to do it, I know
  const difference_x = station_a.x - station_b.x;
  const difference_z = station_a.z - station_b.z;

  const abs_difference_x = Math.abs(difference_x);
  const abs_difference_z = Math.abs(difference_z);

  let x: number;
  let z: number;

  const sign_z = difference_z >= 0 ? -1 : 1;
  const sign_x = difference_x >= 0 ? -1 : 1;

  if (abs_difference_x >= abs_difference_z) {
      x = station_a.x + sign_x * abs_difference_z;
      z = station_a.z + sign_z * abs_difference_z;
  } else {
      x = station_a.x + sign_x * abs_difference_x;
      z = station_a.z + sign_z * abs_difference_x;
  }

  return { x, z };
}

export const chebyshevDistance = (station_a: Station, station_b: Station): number => {
  return Math.max(Math.abs(station_a.x - station_b.x), Math.abs(station_a.z - station_b.z));
}

// Should run some tests to confirm that this is slower
function chebyshevDistanceSlow(station_a: Station, station_b: Station): number {
  const difference_x = Math.abs(station_a.x - station_b.x);
  const difference_z = Math.abs(station_a.z - station_b.z);

  return difference_x >= difference_z ? difference_x : difference_z;
}

export function calculateTotalDist(network: Network): number[] {
  let totalBolt = 0;
  let totalTunnel = 0;
  network.bolts.forEach( bolt => {
    totalTunnel += bolt.length;
    if (bolt.directed === false) totalBolt += bolt.length;
  })

  totalBolt += totalTunnel;
  return [totalBolt, totalTunnel];
}

// Floyd-Warshall algorithm
export function calculateAverageTravelTime(network: Network): number {
  const stations = network.stations;
  const bolts = network.bolts;

  const n = stations.length;
  const inf = Number.POSITIVE_INFINITY;

  // Initializing distance matrix with infinity
  const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(inf));

  // Initializing diagonal elements to 0
  for (let i = 0; i < n; i++) {
      dist[i][i] = 0;
  }

  // Filling in edge weights in the distance matrix
  for (const bolt of bolts) {
    const stationA = stations.find(station => station.name === bolt.station_a.name);
    const stationB = stations.find(station => station.name === bolt.station_b.name);

    // Check if both stations exist
    if (stationA && stationB) {
        const stationAIndex = stations.indexOf(stationA);
        const stationBIndex = stations.indexOf(stationB);
        dist[stationAIndex][stationBIndex] = bolt.length;
        dist[stationBIndex][stationAIndex] = bolt.length;
    }
  }

  // Floyd-Warshall algorithm
  for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
              if (dist[i][k] !== inf && dist[k][j] !== inf) {
                  dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
              }
          }
      }
  }

  let totalDistance = 0;
  let validDistances = 0;

  // Suming up distances and count valid distances
  for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
          if (i !== j && dist[i][j] !== inf) {
              totalDistance += dist[i][j];
              validDistances++;
          }
      }
  }

  storeDistanceMatrix(dist, stations);

  // Calculating average distance and then time (speed is 20 m/s)
  return totalDistance / validDistances / 20;
}

function storeDistanceMatrix(distMatrix: number[][], stations: Station[]): void {
  const dataToStore: DistanceMatrix[] = [];

  // Iterating over each station
  for (let i = 0; i < stations.length; i++) {
    const station = stations[i];
    const stationData: DistanceMatrix = {
      station_name: station.name,
      values: []
    };

    // Adding distances to other stations
    for (let j = 0; j < stations.length; j++) {
      stationData.values.push(distMatrix[i][j]);
    }

    dataToStore.push(stationData);
  }

  const dataToStoreString = JSON.stringify(dataToStore);
  localStorage.setItem('distance-matrix', dataToStoreString);
}