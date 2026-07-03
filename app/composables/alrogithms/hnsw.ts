// HNSW-like navigable graph.
//
// A compact take on the Hierarchical Navigable Small World structure used by
// vector databases. Stations are inserted one at a time; each is assigned a
// random top layer from a geometric distribution, so most stations only live on
// the dense bottom layer while a few also appear on sparser upper layers that
// act as express lanes. On every layer a station connects to (roughly) its M
// nearest neighbours found by a greedy navigation from the current entry point.
// The result is sparse with bounded degree, gives short O(log n)-style routes
// thanks to the upper layers, and is inherently incremental: inserting a station
// only touches the nodes reached during its own local search.
//
// The rendered network is the union of the connections across all layers.
export function generateHnswGraph(network: Network, targetM: number): Network {
    const stations = network.stations
    const n = stations.length
    if (n <= 1) return { stations: stations.slice(), bolts: [] }

    const M = Math.max(2, Math.round(targetM))
    const Mmax0 = M * 2
    const mL = 1 / Math.log(M)
    const ef = Math.max(16, M * 2)

    const distance = (a: number, b: number) =>
        chebyshevDistance(stations[a], stations[b])

    // Deterministic PRNG so repeated runs (and the scatter plot) are stable.
    const rand = mulberry32(0x9e3779b9 ^ n)

    // layers[l] maps a node to its neighbour set on that layer.
    const layers: Map<number, Set<number>>[] = []

    const layerNeighbours = (l: number, node: number): Set<number> => {
        while (layers.length <= l) layers.push(new Map())
        const layer = layers[l]
        let set = layer.get(node)
        if (!set) {
            set = new Set<number>()
            layer.set(node, set)
        }
        return set
    }

    // Greedy descent: return the node closest to q reachable from `entry`.
    const greedyClosest = (q: number, entry: number, l: number): number => {
        let current = entry
        let currentDist = distance(q, current)
        let improved = true
        while (improved) {
            improved = false
            for (const nb of layerNeighbours(l, current)) {
                const d = distance(q, nb)
                if (d < currentDist) {
                    currentDist = d
                    current = nb
                    improved = true
                }
            }
        }
        return current
    }

    // Best-first search of one layer, returning up to `efn` closest nodes.
    const searchLayer = (
        q: number,
        entry: number,
        efn: number,
        l: number
    ): number[] => {
        const visited = new Set<number>([entry])
        const candidates: [number, number][] = [[distance(q, entry), entry]]
        const results: [number, number][] = [[distance(q, entry), entry]]

        const furthestResult = (): [number, number] => {
            let worst = results[0]
            for (const r of results) if (r[0] > worst[0]) worst = r
            return worst
        }

        while (candidates.length > 0) {
            let bestIdx = 0
            for (let k = 1; k < candidates.length; ++k) {
                if (candidates[k][0] < candidates[bestIdx][0]) bestIdx = k
            }
            const nearest = candidates.splice(bestIdx, 1)[0]
            if (nearest[0] > furthestResult()[0]) break

            for (const nb of layerNeighbours(l, nearest[1])) {
                if (visited.has(nb)) continue
                visited.add(nb)
                const d = distance(q, nb)
                if (results.length < efn || d < furthestResult()[0]) {
                    candidates.push([d, nb])
                    results.push([d, nb])
                    if (results.length > efn) {
                        let worstIdx = 0
                        for (let k = 1; k < results.length; ++k) {
                            if (results[k][0] > results[worstIdx][0])
                                worstIdx = k
                        }
                        results.splice(worstIdx, 1)
                    }
                }
            }
        }

        return results.map(r => r[1])
    }

    // Keep the `k` candidates closest to q.
    const selectNeighbours = (
        q: number,
        candidates: number[],
        k: number
    ): number[] =>
        [...candidates]
            .filter(c => c !== q)
            .sort((a, b) => distance(q, a) - distance(q, b))
            .slice(0, k)

    let entryPoint = -1
    let maxLevel = -1

    for (let q = 0; q < n; ++q) {
        const level = Math.floor(-Math.log(rand() + 1e-12) * mL)
        for (let l = 0; l <= level; ++l) layerNeighbours(l, q)

        if (entryPoint === -1) {
            entryPoint = q
            maxLevel = level
            continue
        }

        let entry = entryPoint
        for (let l = maxLevel; l > level; --l) {
            entry = greedyClosest(q, entry, l)
        }

        for (let l = Math.min(maxLevel, level); l >= 0; --l) {
            const found = searchLayer(q, entry, ef, l)
            const cap = l === 0 ? Mmax0 : M
            const selected = selectNeighbours(q, found, M)

            for (const e of selected) {
                layerNeighbours(l, q).add(e)
                layerNeighbours(l, e).add(q)
            }

            // Prune over-connected neighbours back to the layer's degree cap.
            for (const e of selected) {
                const set = layerNeighbours(l, e)
                if (set.size > cap) {
                    const kept = new Set(selectNeighbours(e, [...set], cap))
                    for (const old of [...set]) {
                        if (!kept.has(old)) {
                            set.delete(old)
                            layerNeighbours(l, old).delete(e)
                        }
                    }
                }
            }

            if (found.length > 0) {
                entry = found.reduce((a, b) =>
                    distance(q, b) < distance(q, a) ? b : a
                )
            }
        }

        if (level > maxLevel) {
            entryPoint = q
            maxLevel = level
        }
    }

    // Flatten every layer's connections into undirected bolts.
    const seen = new Set<string>()
    const bolts: Bolt[] = []
    for (const layer of layers) {
        for (const [node, set] of layer) {
            for (const nb of set) {
                if (node === nb) continue
                const key = node < nb ? `${node}-${nb}` : `${nb}-${node}`
                if (seen.has(key)) continue
                seen.add(key)
                bolts.push(makeBolt(stations[node], stations[nb]))
            }
        }
    }

    return { stations: stations.slice(), bolts }
}

// Small deterministic PRNG (mulberry32).
function mulberry32(seed: number): () => number {
    let a = seed >>> 0
    return function () {
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}
