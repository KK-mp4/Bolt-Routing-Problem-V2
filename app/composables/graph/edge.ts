interface Point {
    x: number
    z: number
}

export function calculateTurn(station_a: Point, station_b: Point): Point {
    // Very nice and clean way to do it, I know
    const difference_x = station_a.x - station_b.x
    const difference_z = station_a.z - station_b.z

    const abs_difference_x = Math.abs(difference_x)
    const abs_difference_z = Math.abs(difference_z)

    let x: number
    let z: number

    const sign_z = difference_z >= 0 ? -1 : 1
    const sign_x = difference_x >= 0 ? -1 : 1

    if (abs_difference_x >= abs_difference_z) {
        x = station_a.x + sign_x * abs_difference_z
        z = station_a.z + sign_z * abs_difference_z
    } else {
        x = station_a.x + sign_x * abs_difference_x
        z = station_a.z + sign_z * abs_difference_x
    }

    return { x, z }
}

export function chebyshevDistance(station_a: Point, station_b: Point): number {
    return Math.max(
        Math.abs(station_a.x - station_b.x),
        Math.abs(station_a.z - station_b.z)
    )
}

const DEFAULT_BOLT_COLOUR = '#8f7f10'

// Central bolt factory. Every algorithm builds edges through this helper so the
// id-based `source`/`target` representation stays consistent in one place.
export function makeBolt(
    source: Station,
    target: Station,
    options: {
        directed?: boolean
        colour?: string
        turn?: Point
        length?: number
    } = {}
): Bolt {
    return {
        id: makeId(),
        directed: options.directed ?? false,
        source: source.id,
        target: target.id,
        turn: options.turn ?? calculateTurn(source, target),
        length: options.length ?? chebyshevDistance(source, target),
        colour: options.colour ?? DEFAULT_BOLT_COLOUR,
    }
}

// Junction stations are synthetic vertices added by some solvers (backbone,
// Steiner, star). They are named so `clearJunctions` can strip them later.
export function makeJunction(name: string, x: number, z: number): Station {
    return { id: makeId(), name, description: '', colour: '#f2a788', x, z }
}

// Fast id -> station lookup for resolving bolt endpoints at render/compute time.
export function stationsById(network: Network): Map<string, Station> {
    const map = new Map<string, Station>()
    for (const station of network.stations) {
        map.set(station.id, station)
    }
    return map
}
