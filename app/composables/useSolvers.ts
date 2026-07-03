// Data-driven registry of every graph solver. This replaces the giant switch
// that used to live in index.vue and is the single place that maps a solver id
// to its algorithm and options. It is consumed by the main page (active
// solver), the Pareto page (run all) and any UI that lists solvers.

export interface SolverDefinition {
    id: string
    label: string
    // Short tags describing the solver against the three criteria of this
    // problem (tunnel length / sparsity, average travel time, local stability).
    // Rendered as pills next to the solver selector.
    properties: string[]
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
        properties: [],
        run: network => ({ stations: network.stations, bolts: [] }),
    },
    {
        id: 'star',
        label: 'Tree graph',
        properties: ['sparse', 'locally stable'],
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
        properties: ['dense', 'locally stable', 'fastest routes'],
        run: network => generateCompleteGraph(network),
    },
    {
        id: 'nearest-neighbor',
        label: 'Nearest neighbor',
        properties: ['sparse', 'locally unstable'],
        run: network => generateNNGraph(network),
        runAsync: (network, _settings, onProgress) =>
            generateNNGraphASYNC(network, onProgress),
    },
    {
        id: 'hamiltonian',
        label: 'Hamiltonian cycle',
        properties: ['sparse', 'locally unstable', 'directed'],
        run: network => generateLoopGraph(network),
    },
    {
        id: 'prims',
        label: "Prim's algorithm",
        properties: ['sparse', 'locally unstable', 'min length'],
        run: network => runPrimsAlgotithm(network),
    },
    {
        id: 'kruskals',
        label: "Kruskal's algorithm",
        properties: ['sparse', 'locally unstable', 'min length'],
        run: network => runKruskalsAlgotithm(generateCompleteGraph(network)),
    },
    {
        id: 'steiner',
        label: 'Steiner tree',
        properties: [
            'sparse',
            'locally unstable',
            'min length',
            'adds junctions',
        ],
        run: network => runIteratedSteinerTree(network),
        runAsync: (network, _settings, onProgress) =>
            runIteratedSteinerTreeASYNC(network, onProgress),
    },
    {
        id: 'spanner',
        label: 'Greedy t-spanner',
        properties: ['tunable', 'locally unstable'],
        run: (network, settings) =>
            generateSpannerGraph(
                network,
                Number(settings.solvers.spanner.stretch)
            ),
    },
    {
        id: 'yao',
        label: 'Yao-8 graph',
        properties: ['sparse', 'locally stable', 'spanner'],
        run: network => generateYaoGraph(network),
    },
    {
        id: 'theta',
        label: 'Theta-8 graph',
        properties: ['sparse', 'locally stable', 'spanner'],
        run: network => generateThetaGraph(network),
    },
    {
        id: 'delaunay',
        label: 'Delaunay',
        properties: ['sparse', 'locally stable'],
        run: network => generateDelaunayGraph(network),
    },
    {
        id: 'gabriel',
        label: 'Gabriel graph',
        properties: ['sparse', 'locally stable'],
        run: network => generateGabrielGraph(network),
    },
    {
        id: 'rng',
        label: 'Relative neighborhood',
        properties: ['sparse', 'locally stable'],
        run: network => generateRNGGraph(network),
    },
    {
        id: 'backbone',
        label: 'Hub backbone',
        properties: ['sparse', 'locally stable'],
        run: (network, settings) => {
            switch (settings.solvers.backbone.style) {
                case 'grid':
                    return generateGridBackboneGraph(
                        network,
                        Number(settings.solvers.backbone.grid)
                    )
                case 'knn':
                    return generateKnnBackboneGraph(
                        network,
                        Number(settings.solvers.backbone.knn)
                    )
                default:
                    return generateBackboneGraph(
                        network,
                        Number(settings.solvers.backbone.hubs)
                    )
            }
        },
    },
    {
        id: 'unit-square',
        label: 'Unit-square graph',
        properties: ['sparse', 'locally stable', 'tunable'],
        run: (network, settings) =>
            generateUnitSquareGraph(
                network,
                Number(settings.solvers.unitSquare.radius)
            ),
    },
    {
        id: 'hnsw',
        label: 'HNSW navigable',
        properties: ['sparse', 'locally stable'],
        run: (network, settings) =>
            generateHnswGraph(network, Number(settings.solvers.hnsw.m)),
    },
    {
        id: 'dynamic-spanner',
        label: 'Dynamic t-spanner',
        properties: ['sparse', 'locally stable', 'spanner', 'tunable'],
        run: (network, settings) =>
            generateDynamicSpannerGraph(
                network,
                Number(settings.solvers.dynamicSpanner.stretch)
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
                locally_stable: solver.properties.includes('locally stable'),
            })
        } catch (error) {
            console.error(`Solver "${solver.id}" failed:`, error)
        }
    }

    return results
}
