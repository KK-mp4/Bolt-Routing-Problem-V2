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
  for (let i = 0; i < n; ++i) {
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
  for (let k = 0; k < n; ++k) {
      for (let i = 0; i < n; ++i) {
          for (let j = 0; j < n; ++j) {
              if (dist[i][k] !== inf && dist[k][j] !== inf) {
                  dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
              }
          }
      }
  }

  let totalDistance = 0;
  let validDistances = 0;

  // Suming up distances and count valid distances
  for (let i = 0; i < n; ++i) {
      for (let j = 0; j < n; ++j) {
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
  for (let i = 0; i < stations.length; ++i) {
    const station = stations[i];
    const stationData: DistanceMatrix = {
      station_name: station.name,
      values: []
    };

    // Adding distances to other stations
    for (let j = 0; j < stations.length; ++j) {
      stationData.values.push(distMatrix[i][j]);
    }

    dataToStore.push(stationData);
  }

  const dataToStoreString = JSON.stringify(dataToStore);
  localStorage.setItem('distance-matrix', dataToStoreString);
}

export function autoColourGraph(network: Network): Network {
  network.stations.forEach(station => {
    station.colour = getRandomHexColor(station.name);
  });

  network.bolts.forEach(bolt => {
    const stationB = network.stations.find(station => station.name === bolt.station_b.name);
        if (stationB) {
            bolt.colour = stationB.colour;
        } else {
            console.error(`Station ${bolt.station_b.name} not found in network.`);
        }
  });

  return network;
}

function getRandomHexColor(seed: string): string {
    // Generate a random hue value (H) between 0 and 360
    // const h = Math.floor(Math.random() * 361);
    const h = stringToDegrees(seed);

    // Set constant saturation (S) and lightness (L) values
    const s = 80; // 80%
    const l = 74; // 74%

    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * (l / 100) - 1)) * (s / 100);
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = (l / 100) - c / 2;

    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) {
        r = c;
        g = x;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
    } else if (h >= 120 && h < 180) {
        g = c;
        b = x;
    } else if (h >= 180 && h < 240) {
        g = x;
        b = c;
    } else if (h >= 240 && h < 300) {
        r = x;
        b = c;
    } else if (h >= 300 && h < 360) {
        r = c;
        b = x;
    }

    // Convert RGB to hexadecimal
    const rgbToHex = (rgb: number): string => {
        const hex = Math.round(rgb * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    const hexColor = `#${rgbToHex(r + m)}${rgbToHex(g + m)}${rgbToHex(b + m)}`;
    return hexColor.toUpperCase();
}

function stringToDegrees(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; ++i) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
  }

  return Math.abs(hash % 360);
}

export function clearJunctions(network: Network): Network {
  network.stations = network.stations.filter(station => !station.name.includes("Junction №"));
  return network;
}