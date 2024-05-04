// Union-Find data structure
class UnionFind {
  parent: number[];

  constructor(size: number) {
    this.parent = Array(size).fill(-1);
  }

  find(x: number): number {
    let root = x;
    while (this.parent[root] !== -1) {
      root = this.parent[root];
    }
    // Path compression: Update parent of each node on the path to the root
    let curr = x;
    while (curr !== root) {
      const next = this.parent[curr];
      if (next === curr) break; // Avoid infinite loop
      this.parent[curr] = root;
      curr = next;
    }
    return root;
  }

  union(x: number, y: number): void {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX !== rootY) {
      this.parent[rootX] = rootY;
    }
  }
}

export function runKruskalsAlgotithm(network: Network): Network {
  const stations = network.stations;
  const bolts = network.bolts;

  // Sort bolts by length
  bolts.sort((a, b) => a.length - b.length);

  // Initializing Union-Find data structure
  const uf = new UnionFind(stations.length);

  const mst: Bolt[] = [];

  bolts.forEach(bolt => {
    const stationAIndex = stations.findIndex(station => station.name === bolt.station_a.name);
    const stationBIndex = stations.findIndex(station => station.name === bolt.station_b.name);

    const rootA = uf.find(stationAIndex);
    const rootB = uf.find(stationBIndex);

    // If adding this bolt doesn't form a cycle, add it to MST
    if (rootA !== rootB) {
      mst.push(bolt);
      uf.union(rootA, rootB);
    }
  });

  // Update the network with the MST bolts
  network.bolts = mst;
  
  return network;
}