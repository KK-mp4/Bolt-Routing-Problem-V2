export interface Network {
    stations: Station[]
    bolts: Bolt[]
}

export interface Station {
    id: string
    name: string
    description: string
    colour: string
    x: number
    z: number
}

export interface Bolt {
    id: string
    directed: boolean
    // References Station.id. For directed bolts travel goes source -> target.
    source: string
    target: string
    turn: {
        x: number
        z: number
    }
    length: number
    colour: string
}

export interface PlotData {
    graph_name: string
    length: number
    time: number
    locally_stable: boolean
}

export interface DistanceMatrix {
    station_name: string
    values: number[]
}

// --- Solver + application settings (single source of truth) ---

export interface StarSettings {
    rayCount: number
    mergeAt: string
}

export interface SpannerSettings {
    stretch: number
}

export interface BackboneSettings {
    style: 'hubs' | 'grid' | 'knn'
    hubs: number
    grid: number
    knn: number
}

export interface UnitSquareSettings {
    // Connection radius as a multiple of the median nearest-neighbour distance.
    radius: number
}

export interface HnswSettings {
    // Target number of neighbours per node (M).
    m: number
}

export interface DynamicSpannerSettings {
    stretch: number
}

// One nested object per solver that has tunable options. Solvers without
// options simply have no entry here.
export interface SolverSettings {
    star: StarSettings
    spanner: SpannerSettings
    backbone: BackboneSettings
    unitSquare: UnitSquareSettings
    hnsw: HnswSettings
    dynamicSpanner: DynamicSpannerSettings
}

export interface DisplaySettings {
    showLabels: boolean
    colourGraph: boolean
    calcStats: boolean
}

export interface AppSettings {
    version: number
    display: DisplaySettings
    activeSolver: string
    solvers: SolverSettings
}

export interface Preset {
    id: string
    name: string
    savedAt: number
    network: Network
}

export interface PresetManifestEntry {
    file: string
    name: string
}
