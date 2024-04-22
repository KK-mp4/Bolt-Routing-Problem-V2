export function calculateTurn(station_a: Station, station_b: Station): {x: number; z: number; } {
  const difference_x = station_a.x - station_b.x;
  const difference_z = station_a.z - station_b.z;

  let x = 0;
  let z = 0;

  if (Math.abs(difference_x) >= Math.abs(difference_z)) {
    if (difference_z >= 0) {
      x = station_a.x + Math.abs(difference_z);
      z = station_a.z - Math.abs(difference_z);
    } else {
      x = station_a.x - Math.abs(difference_z);
      z = station_a.z + Math.abs(difference_z);
    }
  } else {
    if (difference_x >= 0) {
      x = station_a.x - Math.abs(difference_x);
      z = station_a.z + Math.abs(difference_x);
    } else {
      x = station_a.x + Math.abs(difference_x);
      z = station_a.z - Math.abs(difference_x);
    }
  }

  return { x, z };
}

export function chebyshevDistance(station_a: Station, station_b: Station): number {
  const difference_x = Math.abs(station_a.x - station_b.x);
  const difference_z = Math.abs(station_a.z - station_b.z);

  return difference_x >= difference_z ? difference_x : difference_z;
}