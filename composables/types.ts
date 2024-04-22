export interface Robis {
  Name: string;
  X: number;
  Z: number;
  Dimension: string;
}

export interface Network {
  stations: Station[];
  bolts: Bolt[];
}

interface Station {
  name: string;
  description: string;
  x: number;
  z: number;
  dimension: string;
  color: string;
}

interface Bolt {
  station_a: Station;
  station_b: Station;
  distance: number;
  color: string;
}