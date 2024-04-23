export function generateLoopGraph(network: Network): Network {
  network.bolts = [];
  const stations = network.stations;
  const numStations = stations.length;

  // Initializing the shortest path and its length
  let shortestPath: Network = { stations: [], bolts: [] };
  let shortestPathLength = Infinity;

  // Looping through each station as the starting point
  for (let startIdx = 0; startIdx < numStations; ++startIdx) {
    // Reseting visited array for each starting point
    const visited = new Array(numStations).fill(false);
    let currentStation = stations[startIdx];
    visited[startIdx] = true;

    // Initializing the bolts array for the current path
    const bolts: Bolt[] = [];

    // Helper function to find the nearest neighbor
    function findNearestNeighbor(station: Station): Station | null {
      let minDistance = Infinity;
      let nearestNeighbor: Station | null = null;

      for (let i = 0; i < numStations; ++i) {
        if (!visited[i]) {
          const neighborStation = stations[i];
          const distance = chebyshevDistance(station, neighborStation);

          if (distance < minDistance) {
            minDistance = distance;
            nearestNeighbor = neighborStation;
          }
        }
      }

      return nearestNeighbor;
    }

    // Looping until all stations are visited
    let nextStation: Station | null;
    while ((nextStation = findNearestNeighbor(currentStation)) !== null) {
      bolts.push({
        directed: false,
        station_a: currentStation,
        turn: calculateTurn(currentStation, nextStation),
        station_b: nextStation,
        length: chebyshevDistance(currentStation, nextStation),
        colour: '#8f7f10',
      });

      visited[stations.indexOf(nextStation)] = true;
      currentStation = nextStation;
    }

    // Connecting the last station with the start station to complete the loop
    bolts.push({
      directed: false,
      station_a: currentStation,
      turn: calculateTurn(currentStation, stations[startIdx]),
      station_b: stations[startIdx],
      length: chebyshevDistance(currentStation, stations[startIdx]),
      colour: '#8f7f10',
    });

    // Calculating the total length of the path
    const pathLength = bolts.reduce((acc, bolt) => acc + bolt.length, 0);

    // Updating shortest path if the current path is shorter
    if (pathLength < shortestPathLength) {
      shortestPath = { stations: stations.slice(), bolts: bolts.slice() };
      shortestPathLength = pathLength;
    }
  }

  return shortestPath;
}

export function generateNNGraph(network: Network): Network {
  network.bolts = [];
  const stations = network.stations;
  const numStations = stations.length;

  // Initializing the shortest path and its length
  let shortestPath: Network = { stations: [], bolts: [] };
  let shortestPathLength = Infinity;

  // Looping through each station as the starting point
  for (let startIdx = 0; startIdx < numStations; ++startIdx) {
    // Reset visited array for each starting point
    const visited = new Array(numStations).fill(false);
    let currentStation = stations[startIdx];
    visited[startIdx] = true;

    // Initializing the bolts array for the current path
    const bolts: Bolt[] = [];

    // Helper function to find the nearest neighbor
    function findNearestNeighbor(station: Station): Station | null {
      let minDistance = Infinity;
      let nearestNeighbor: Station | null = null;

      for (let i = 0; i < numStations; ++i) {
        if (!visited[i]) {
          const neighborStation = stations[i];
          const distance = chebyshevDistance(station, neighborStation);

          if (distance < minDistance) {
            minDistance = distance;
            nearestNeighbor = neighborStation;
          }
        }
      }

      return nearestNeighbor;
    }

    // Looping until all stations are visited
    let nextStation: Station | null;
    while ((nextStation = findNearestNeighbor(currentStation)) !== null) {
      bolts.push({
        directed: false,
        station_a: currentStation,
        turn: calculateTurn(currentStation, nextStation),
        station_b: nextStation,
        length: chebyshevDistance(currentStation, nextStation),
        colour: '#8f7f10',
      });

      visited[stations.indexOf(nextStation)] = true;
      currentStation = nextStation;
    }

    // Apply optimization to switch intersecting edges
    // optimizeIntersectingEdges(bolts);

    // Calculating the total length of the path
    const pathLength = bolts.reduce((acc, bolt) => acc + bolt.length, 0);

    // Updating shortest path if the current path is shorter
    if (pathLength < shortestPathLength) {
      shortestPath = { stations: stations.slice(), bolts: bolts.slice() };
      shortestPathLength = pathLength;
    }
  }

  // // Apply optimization to switch intersecting edges
  // optimizeIntersectingEdges(shortestPath.bolts);

  return shortestPath;
}

function optimizeIntersectingEdges(bolts: Bolt[]): void {
  const numBolts = bolts.length;

  for (let i = 0; i < numBolts; ++i) {
    for (let j = i + 1; j < numBolts; ++j) {
      const boltA = bolts[i];
      const boltB = bolts[j];

      // Check for intersection between boltA and boltB
      if (intersects(boltA, boltB)) {
        // If edges intersect, switch their destination points
        // const temp = boltA.station_b;
        // boltA.station_b = boltB.station_b;
        // boltB.station_b = temp;
        console.log(boltA.station_a.name + " => " + boltA.station_b.name + " intersects with " + boltB.station_a.name + " => " + boltB.station_b.name);

        const tmp = boltA.station_b;
        boltA.station_b = boltB.station_a;
        boltB.station_a = tmp;

        boltA.turn = calculateTurn(boltA.station_a, boltA.station_b);
        boltB.turn = calculateTurn(boltB.station_a, boltB.station_b);
      }
    }
  }
}

function doEdgesIntersect(bolt1: Bolt, bolt2: Bolt): boolean {
  const point1 = bolt1.station_a;
  const point2 = bolt1.station_b;
  const point3 = bolt2.station_a;
  const point4 = bolt2.station_b;

    // Check if any endpoint of one segment coincides with any endpoint of the other segment
    const endpointsCoincide = (p1: StationShort, p2: StationShort, p3: StationShort, p4: StationShort) => {
      return (
          (p1.x === p3.x && p1.z === p3.z) ||
          (p1.x === p4.x && p1.z === p4.z) ||
          (p2.x === p3.x && p2.z === p3.z) ||
          (p2.x === p4.x && p2.z === p4.z)
      );
  };

  if (endpointsCoincide(point1, point2, point3, point4)) {
      return false; // If endpoints coincide, lines do not intersect
  }

  const ccw = (p1: StationShort, p2: StationShort, p3: StationShort) => {
      return (p3.z - p1.z) * (p2.x - p1.x) > (p2.z - p1.z) * (p3.x - p1.x);
  };

  const intersect = (p1: StationShort, p2: StationShort, p3: StationShort, p4: StationShort) => {
      return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
  };

  return intersect(point1, point2, point3, point4);
}

function intersects(bolt1: Bolt, bolt2: Bolt): boolean {
  const a = bolt1.station_a.x;
  const b = bolt1.station_a.z;
  const c = bolt1.station_b.x;
  const d = bolt1.station_b.z;
  const p = bolt2.station_a.x;
  const q = bolt2.station_a.z;
  const r = bolt2.station_b.x;
  const s = bolt2.station_b.z;

  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};