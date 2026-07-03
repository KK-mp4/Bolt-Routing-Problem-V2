// Data-driven registry of every graph solver. This replaces the giant switch
// that used to live in index.vue and is the single place that maps a solver id
// to its algorithm and options. It is consumed by the main page (active
// solver), the Pareto page (run all) and any UI that lists solvers.

export interface SolverDefinition {
    id: string
    label: string
    // Synchronous run producing the final network.
    run: (network: Network, settings: AppSettings) => Network
    // Optional progressive variant for heavy solvers (reports intermediate
    // results so the UI can animate without freezing).
    runAsync?: (
        network: Network,
        settings: AppSettings,
        onProgress: (result: Network) => void
    ) => Promise<void>
}

export const SOLVERS: SolverDefinition[] = [
    {
        id: 'none',
        label: 'None',
        run: network => ({ stations: network.stations, bolts: [] }),
    },
    {
        id: 'star',
        label: 'Star graph',
        run: (network, settings) =>
            generateStarGraph(
                network,
                Number(settings.solvers.star.rayCount),
                settings.solvers.star.mergeAt
            ),
    },
    {
        id: 'complete',
        label: 'Complete graph',
        run: network => generateCompleteGraph(network),
    },
    {
        id: 'nearest-neighbor',
        label: 'Nearest neighbor',
        run: network => generateNNGraph(network),
        runAsync: (network, _settings, onProgress) =>
            generateNNGraphASYNC(network, onProgress),
    },
    {
        id: 'hamiltonian',
        label: 'Hamiltonian cycle',
        run: network => generateLoopGraph(network),
    },
    {
        id: 'prims',
        label: "Prim's algorithm",
        run: network => runPrimsAlgotithm(network),
    },
    {
        id: 'kruskals',
        label: "Kruskal's algorithm",
        run: network => runKruskalsAlgotithm(generateCompleteGraph(network)),
    },
    {
        id: 'steiner',
        label: 'Steiner tree',
        run: network => runIteratedSteinerTree(network),
        runAsync: (network, _settings, onProgress) =>
            runIteratedSteinerTreeASYNC(network, onProgress),
    },
    {
        id: 'spanner',
        label: 'Greedy t-spanner',
        run: (network, settings) =>
            generateSpannerGraph(
                network,
                Number(settings.solvers.spanner.stretch)
            ),
    },
    {
        id: 'yao',
        label: 'Yao-8 graph',
        run: network => generateYaoGraph(network),
    },
    {
        id: 'delaunay',
        label: 'Delaunay',
        run: network => generateDelaunayGraph(network),
    },
    {
        id: 'gabriel',
        label: 'Gabriel graph',
        run: network => generateGabrielGraph(network),
    },
    {
        id: 'rng',
        label: 'Relative neighborhood',
        run: network => generateRNGGraph(network),
    },
    {
        id: 'backbone',
        label: 'Hub backbone',
        run: (network, settings) =>
            settings.solvers.backbone.style === 'grid'
                ? generateGridBackboneGraph(
                      network,
                      Number(settings.solvers.backbone.grid)
                  )
                : generateBackboneGraph(
                      network,
                      Number(settings.solvers.backbone.hubs)
                  ),
    },
]

export function getSolver(id: string): SolverDefinition | undefined {
    return SOLVERS.find(solver => solver.id === id)
}

// Runs a single solver on a clean (junction-free) clone so repeated runs never
// accumulate synthetic vertices and never mutate the working graph in place.
export function runSolver(
    network: Network,
    id: string,
    settings: AppSettings
): Network {
    const solver = getSolver(id)
    if (!solver) return network
    return solver.run(cleanClone(network), settings)
}

// Runs every solver (except the pass-through "none") with the current settings
// and returns benchmark points for the Pareto/scatter plot.
export function runAllSolvers(
    network: Network,
    settings: AppSettings
): PlotData[] {
    const results: PlotData[] = []

    for (const solver of SOLVERS) {
        if (solver.id === 'none') continue
        try {
            const result = solver.run(cleanClone(network), settings)
            const [, totalTunnel] = calculateTotalDist(result)
            results.push({
                graph_name: solver.label,
                length: totalTunnel,
                time: calculateAverageTravelTime(result),
            })
        } catch (error) {
            console.error(`Solver "${solver.id}" failed:`, error)
        }
    }

    return results
}
