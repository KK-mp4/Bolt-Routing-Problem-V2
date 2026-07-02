interface MstResult {
    cost: number
    edges: [number, number][]
}

// Prim's MST over an arbitrary point array using Chebyshev distance.
function mstCost(points: Station[]): MstResult {
    const n = points.length
    const edges: [number, number][] = []

    if (n <= 1) {
        return { cost: 0, edges }
    }

    const included = new Array<boolean>(n).fill(false)
    const key = new Array<number>(n).fill(Infinity)
    const parent = new Array<number>(n).fill(-1)

    key[0] = 0
    let cost = 0

    for (let count = 0; count < n; ++count) {
        // Find the not-yet-included point with the smallest key.
        let minKey = Infinity
        let u = -1
        for (let i = 0; i < n; ++i) {
            if (!included[i] && key[i] < minKey) {
                minKey = key[i]
                u = i
            }
        }

        if (u === -1) break // Should not happen for a connected metric graph.

        included[u] = true
        if (parent[u] !== -1) {
            edges.push([parent[u], u])
            cost += minKey
        }

        // Relax the remaining points against the freshly added one.
        for (let v = 0; v < n; ++v) {
            if (!included[v]) {
                const distance = chebyshevDistance(points[u], points[v])
                if (distance < key[v]) {
                    key[v] = distance
                    parent[v] = u
                }
            }
        }
    }

    return { cost, edges }
}

// Octilinear Hanan grid: intersections of the diagonal lines through terminals.
// Line through terminal i: x + z = a_i. Line through terminal j: x - z = b_j.
// Their intersection is x = (a_i + b_j) / 2, z = (a_i - b_j) / 2.
function hananCandidates(terminals: Station[]): Station[] {
    const seen = new Set<string>()
    const candidates: Station[] = []

    // Terminals themselves are not valid Steiner candidates.
    for (const t of terminals) {
        seen.add(`${t.x},${t.z}`)
    }

    for (let i = 0; i < terminals.length; ++i) {
        const a = terminals[i].x + terminals[i].z
        for (let j = 0; j < terminals.length; ++j) {
            if (i === j) continue
            const b = terminals[j].x - terminals[j].z
            const x = Math.round((a + b) / 2)
            const z = Math.round((a - b) / 2)
            const key = `${x},${z}`
            if (seen.has(key)) continue
            seen.add(key)
            candidates.push(makeJunction(x, z))
        }
    }

    return candidates
}

function makeJunction(x: number, z: number): Station {
    return { name: 'Junction \u2116', description: '', colour: '#f2a788', x, z }
}

export function runIteratedSteinerTree(network: Network): Network {
    const terminals = network.stations.slice()
    const n = terminals.length

    if (n <= 2) {
        // Nothing for a Steiner point to improve.
        return buildNetwork(terminals, terminals, mstCost(terminals).edges)
    }

    const candidates = hananCandidates(terminals)

    const current = terminals.slice()
    let best = mstCost(current)
    const maxJunctions = n // Safety cap; a Steiner tree needs at most n - 2.

    while (current.length - n < maxJunctions) {
        let bestGain = 0
        let bestCandidateIdx = -1
        let bestResult: MstResult | null = null

        for (let c = 0; c < candidates.length; ++c) {
            const trial = current.concat(candidates[c])
            const result = mstCost(trial)
            const gain = best.cost - result.cost
            if (gain > bestGain) {
                bestGain = gain
                bestCandidateIdx = c
                bestResult = result
            }
        }

        if (bestCandidateIdx === -1 || !bestResult) break // No improvement left.

        current.push(candidates[bestCandidateIdx])
        candidates.splice(bestCandidateIdx, 1)
        best = bestResult
    }

    // Prune added junctions that ended up with degree < 3; they add no value.
    const pruned = prune(current, n)

    return buildNetwork(terminals, pruned.points, pruned.mst.edges)
}

// Async variant that yields to the event loop between iterations so the heavy
// Iterated 1-Steiner search doesn't lock the UI. Progressively reports the best
// network found so far, mirroring generateNNGraphASYNC.
export async function runIteratedSteinerTreeASYNC(
    network: Network,
    callback: (result: Network) => void
): Promise<void> {
    const terminals = network.stations.slice()
    const n = terminals.length

    if (n <= 2) {
        // Nothing for a Steiner point to improve.
        callback(buildNetwork(terminals, terminals, mstCost(terminals).edges))
        return
    }

    const candidates = hananCandidates(terminals)

    const current = terminals.slice()
    let best = mstCost(current)
    const maxJunctions = n // Safety cap; a Steiner tree needs at most n - 2.

    // Show the plain MST before any junctions are inserted.
    callback(buildNetwork(terminals, current, best.edges))
    await new Promise(resolve => setTimeout(resolve, 0))

    while (current.length - n < maxJunctions) {
        let bestGain = 0
        let bestCandidateIdx = -1
        let bestResult: MstResult | null = null

        for (let c = 0; c < candidates.length; ++c) {
            const trial = current.concat(candidates[c])
            const result = mstCost(trial)
            const gain = best.cost - result.cost
            if (gain > bestGain) {
                bestGain = gain
                bestCandidateIdx = c
                bestResult = result
            }
        }

        if (bestCandidateIdx === -1 || !bestResult) break // No improvement left.

        current.push(candidates[bestCandidateIdx])
        candidates.splice(bestCandidateIdx, 1)
        best = bestResult

        // Report progress and hand control back to the browser.
        callback(buildNetwork(terminals, current, best.edges))
        await new Promise(resolve => setTimeout(resolve, 0))
    }

    // Prune added junctions that ended up with degree < 3; they add no value.
    const pruned = prune(current, n)

    callback(buildNetwork(terminals, pruned.points, pruned.mst.edges))
}

function prune(
    points: Station[],
    terminalCount: number
): { points: Station[]; mst: MstResult } {
    let currentPoints = points
    let mst = mstCost(currentPoints)

    // Iterate until every junction has degree >= 3.
    for (;;) {
        const degree = new Array<number>(currentPoints.length).fill(0)
        for (const [u, v] of mst.edges) {
            degree[u]++
            degree[v]++
        }

        let removeIdx = -1
        for (let i = terminalCount; i < currentPoints.length; ++i) {
            if (degree[i] < 3) {
                removeIdx = i
                break
            }
        }

        if (removeIdx === -1) break

        currentPoints = currentPoints.filter((_, i) => i !== removeIdx)
        mst = mstCost(currentPoints)
    }

    return { points: currentPoints, mst }
}

function buildNetwork(
    terminals: Station[],
    points: Station[],
    edges: [number, number][]
): Network {
    const stations = terminals.slice()

    // Name and append surviving junctions so clearJunctions can strip them later.
    let junctionCount = 0
    for (let i = terminals.length; i < points.length; ++i) {
        stations.push({
            name: `Junction \u2116${junctionCount++}`,
            description: '',
            colour: '#f2a788',
            x: points[i].x,
            z: points[i].z,
        })
    }

    const bolts: Bolt[] = edges.map(([u, v]) => {
        const a = stations[u]
        const b = stations[v]
        return {
            directed: false,
            station_a: { name: a.name, x: a.x, z: a.z },
            turn: calculateTurn(a, b),
            station_b: { name: b.name, x: b.x, z: b.z },
            length: chebyshevDistance(a, b),
            colour: '#8f7f10',
        }
    })

    return { stations, bolts }
}
