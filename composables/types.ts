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

export interface StationShort {
  name: string;
  x: number;
  z: number;
}

export interface Bolt {
  directed: boolean;
  station_a: StationShort;
  turn: {
    x: number;
    z: number;
  };
  station_b: StationShort;
  length: number;
  colour: string;
}

export interface PlotData {
  graph_name: string;
  length: number;
  time: number;
}