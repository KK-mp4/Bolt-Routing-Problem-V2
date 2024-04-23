export function calculateTurn(station_a: Station, station_b: Station): {x: number; z: number; } {
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
export function chebyshevDistanceSlow(station_a: Station, station_b: Station): number {
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