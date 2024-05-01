import { useLocalStorage } from '@vueuse/core';
const plotData = useLocalStorage('scatter-plot', {} as PlotData[]);

// Starts from each station and returns shortest path
export function runPrimsAlgotithm2(network: Network): Network {
  plotData.value = []
  const stations = network.stations;
  const numStations = stations.length;

  let minDistance = Infinity;
  let minNetwork: Network | undefined;

  // Iterate through all possible starting points
  for (let startIdx = 0; startIdx < numStations; startIdx++) {
    // An array to track whether a station has been included in the minimum spanning tree
    const included = new Array(numStations).fill(false);

    // An array to store the parent station of each station in the minimum spanning tree
    const parent: number[] = new Array(numStations).fill(-1);

    // An array to store the weight of the edge connecting each station to the minimum spanning tree
    const key: number[] = new Array(numStations).fill(Infinity);

    // Choose the current station as the starting point
    key[startIdx] = 0;

    for (let count = 0; count < numStations - 1; ++count) {
      // Find the station with the minimum key value that has not been included yet
      const minKeyIndex = findMinKeyIndex(key, included);

      // Include the selected station in the minimum spanning tree
      included[minKeyIndex] = true;

      // Update the key values and parent stations of adjacent stations
      for (let i = 0; i < numStations; ++i) {
        if (stations[minKeyIndex] && stations[i]) { // Check if both stations are defined
          const distance = chebyshevDistance(stations[minKeyIndex], stations[i]);
          if (distance !== 0 && !included[i] && distance < key[i]) {
            parent[i] = minKeyIndex;
            key[i] = distance;
          }
        }
      }
    }

    // Construct the minimum spanning tree (MST) based on the parent stations
    const bolts: Bolt[] = [];
    let totalDistance = 0;
    for (let i = 1; i < numStations; ++i) {
      if (stations[parent[i]] && stations[i]) { // Check if both stations are defined
        const distance = chebyshevDistance(stations[parent[i]], stations[i]);
        totalDistance += distance;
        bolts.push({
          directed: false,
          station_a: { name: stations[parent[i]].name, x: stations[parent[i]].x, z: stations[parent[i]].z },
          turn: calculateTurn(stations[parent[i]], stations[i]),
          station_b: { name: stations[i].name, x: stations[i].x, z: stations[i].z },
          length: distance,
          colour: '#8f7f10',
        });
      }
    }

    // Check if this iteration resulted in a smaller total distance
    if (totalDistance < minDistance) {
      minDistance = totalDistance;
      minNetwork = { stations: stations.slice(), bolts: bolts };
    }

    // Experimental feature to add everythign to Pareto front
    plotData.value.push({ graph_name: "Prim's from " + network.stations[startIdx].name, length: totalDistance, time: calculateAverageTravelTime({ stations: stations.slice(), bolts: bolts }) });
  }

  if (minNetwork) {
    return minNetwork;
  } else {
    // Return original network if no minimum network is found
    return network;
  }
}

// Starts from station 0
export function runPrimsAlgotithm(network: Network): Network {
  const stations = network.stations;
  const numStations = stations.length;

  // An array to track whether a station has been included in the minimum spanning tree
  const included = new Array(numStations).fill(false);

  // An array to store the parent station of each station in the minimum spanning tree
  const parent: number[] = new Array(numStations).fill(-1);

  // An array to store the weight of the edge connecting each station to the minimum spanning tree
  const key: number[] = new Array(numStations).fill(Infinity);

  // Choose the first station as the starting point
  key[0] = 0;

  for (let count = 0; count < numStations - 1; ++count) {
    // Find the station with the minimum key value that has not been included yet
    const minKeyIndex = findMinKeyIndex(key, included);

    // Include the selected station in the minimum spanning tree
    included[minKeyIndex] = true;

    // Update the key values and parent stations of adjacent stations
    for (let i = 0; i < numStations; ++i) {
      const distance = chebyshevDistance(stations[minKeyIndex], stations[i]);
      if (distance !== 0 && !included[i] && distance < key[i]) {
        parent[i] = minKeyIndex;
        key[i] = distance;
      }
    }
  }

  // Construct the minimum spanning tree (MST) based on the parent stations
  const bolts: Bolt[] = [];
  for (let i = 1; i < numStations; ++i) {
    bolts.push({
      directed: false,
      station_a: { name: stations[parent[i]].name, x: stations[parent[i]].x, z: stations[parent[i]].z },
      turn: calculateTurn(stations[parent[i]], stations[i]),
      station_b: { name: stations[i].name, x: stations[i].x, z: stations[i].z },
      length: chebyshevDistance(stations[parent[i]], stations[i]),
      colour: '#8f7f10',
    });
  }

  return { stations: stations.slice(), bolts: bolts };
}

function findMinKeyIndex(key: number[], included: boolean[]): number {
  let min = Infinity;
  let minIndex = -1;

  for (let i = 0; i < key.length; i++) {
    if (!included[i] && key[i] < min) {
      min = key[i];
      minIndex = i;
    }
  }

  return minIndex;
}