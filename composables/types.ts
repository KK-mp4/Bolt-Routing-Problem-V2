export interface Network {
  stations: Station[];
  bolts: Bolt[];
}

export interface Station {
  name: string;
  description: string;
  colour: string;
  x: number;
  z: number;
}

export interface Bolt {
  directed: boolean;
  station_a: Station;
  station_b: Station;
  length: number;
  colour: string;
}