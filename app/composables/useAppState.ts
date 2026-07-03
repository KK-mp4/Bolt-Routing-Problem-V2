import { useLocalStorage } from '@vueuse/core'

// --- localStorage keys (single source of truth for the whole app) ---
const KEY_GRAPH = 'pbn:working-graph'
const KEY_SETTINGS = 'pbn:settings'
const KEY_PRESETS = 'pbn:presets'

const SETTINGS_VERSION = 1

// Rough browser localStorage cap. Used to guard preset saves so we never blow
// past the quota and lose the whole store.
const LOCAL_STORAGE_QUOTA = 5 * 1024 * 1024
const SIZE_SAFETY_MARGIN = 64 * 1024

// --- Defensive coercion helpers (every persisted field gets a fallback) ---

function toNumber(value: unknown, fallback: number): number {
    const n = typeof value === 'string' ? Number(value) : value
    return typeof n === 'number' && Number.isFinite(n) ? n : fallback
}

function toString(value: unknown, fallback: string): string {
    return typeof value === 'string' ? value : fallback
}

function toBoolean(value: unknown, fallback: boolean): boolean {
    return typeof value === 'boolean' ? value : fallback
}

function safeParse(value: string | null): unknown {
    if (!value) return null
    try {
        return JSON.parse(value)
    } catch {
        return null
    }
}

function emptyNetwork(): Network {
    return { stations: [], bolts: [] }
}

function defaultSettings(): AppSettings {
    return {
        version: SETTINGS_VERSION,
        display: { showLabels: false, colourGraph: false, calcStats: true },
        activeSolver: '',
        solvers: {
            star: { rayCount: 8, mergeAt: 'median' },
            spanner: { stretch: 1.5 },
            backbone: { style: 'hubs', hubs: 4, grid: 4 },
        },
    }
}

// --- Normalisation / migration for potentially old or malformed data ---

function normalizeStation(raw: unknown): Station {
    const r = (raw ?? {}) as Record<string, unknown>
    return {
        id: typeof r.id === 'string' && r.id ? r.id : makeId(),
        name: toString(r.name, ''),
        description: toString(r.description, ''),
        colour: toString(r.colour, '#f2a788'),
        x: toNumber(r.x, 0),
        z: toNumber(r.z, 0),
    }
}

export function normalizeNetwork(raw: unknown): Network {
    if (!raw || typeof raw !== 'object') return emptyNetwork()
    const r = raw as Record<string, unknown>

    const rawStations = Array.isArray(r.stations) ? r.stations : []
    const stations = rawStations.map(normalizeStation)

    const stationById = new Map<string, Station>()
    const idByName = new Map<string, string>()
    for (const station of stations) {
        stationById.set(station.id, station)
        if (!idByName.has(station.name)) idByName.set(station.name, station.id)
    }

    const rawBolts = Array.isArray(r.bolts) ? r.bolts : []
    const bolts: Bolt[] = []

    for (const rawBolt of rawBolts) {
        if (!rawBolt || typeof rawBolt !== 'object') continue
        const b = rawBolt as Record<string, unknown>

        let source: string | undefined
        let target: string | undefined

        if (typeof b.source === 'string' && typeof b.target === 'string') {
            // Current id-based format.
            source = b.source
            target = b.target
        } else if (
            b.station_a &&
            typeof b.station_a === 'object' &&
            b.station_b &&
            typeof b.station_b === 'object'
        ) {
            // Legacy embedded-coordinate format: resolve endpoints by name.
            const aName = toString(
                (b.station_a as Record<string, unknown>).name,
                ''
            )
            const bName = toString(
                (b.station_b as Record<string, unknown>).name,
                ''
            )
            source = idByName.get(aName)
            target = idByName.get(bName)
        }

        if (!source || !target) continue
        const sourceStation = stationById.get(source)
        const targetStation = stationById.get(target)
        if (!sourceStation || !targetStation) continue

        const rawTurn = b.turn as Record<string, unknown> | undefined
        const turn =
            rawTurn &&
            Number.isFinite(rawTurn.x as number) &&
            Number.isFinite(rawTurn.z as number)
                ? { x: rawTurn.x as number, z: rawTurn.z as number }
                : calculateTurn(sourceStation, targetStation)

        bolts.push({
            id: typeof b.id === 'string' && b.id ? b.id : makeId(),
            directed: toBoolean(b.directed, false),
            source,
            target,
            turn,
            length: toNumber(
                b.length,
                chebyshevDistance(sourceStation, targetStation)
            ),
            colour: toString(b.colour, '#8f7f10'),
        })
    }

    return { stations, bolts }
}

export function normalizeSettings(raw: unknown): AppSettings {
    const d = defaultSettings()
    if (!raw || typeof raw !== 'object') return d
    const r = raw as Record<string, unknown>
    const display = (r.display ?? {}) as Record<string, unknown>
    const solvers = (r.solvers ?? {}) as Record<string, unknown>
    const star = (solvers.star ?? {}) as Record<string, unknown>
    const spanner = (solvers.spanner ?? {}) as Record<string, unknown>
    const backbone = (solvers.backbone ?? {}) as Record<string, unknown>

    return {
        version: SETTINGS_VERSION,
        display: {
            showLabels: toBoolean(display.showLabels, d.display.showLabels),
            colourGraph: toBoolean(display.colourGraph, d.display.colourGraph),
            calcStats: toBoolean(display.calcStats, d.display.calcStats),
        },
        activeSolver: toString(r.activeSolver, d.activeSolver),
        solvers: {
            star: {
                rayCount: toNumber(star.rayCount, d.solvers.star.rayCount),
                mergeAt: toString(star.mergeAt, d.solvers.star.mergeAt),
            },
            spanner: {
                stretch: toNumber(spanner.stretch, d.solvers.spanner.stretch),
            },
            backbone: {
                style: backbone.style === 'grid' ? 'grid' : 'hubs',
                hubs: toNumber(backbone.hubs, d.solvers.backbone.hubs),
                grid: toNumber(backbone.grid, d.solvers.backbone.grid),
            },
        },
    }
}

function normalizePreset(raw: unknown): Preset | null {
    if (!raw || typeof raw !== 'object') return null
    const r = raw as Record<string, unknown>
    return {
        id: typeof r.id === 'string' && r.id ? r.id : makeId(),
        name: toString(r.name, 'Untitled'),
        savedAt: toNumber(r.savedAt, Date.now()),
        network: normalizeNetwork(r.network),
    }
}

function normalizePresets(raw: unknown): Preset[] {
    if (!Array.isArray(raw)) return []
    return raw
        .map(normalizePreset)
        .filter((preset): preset is Preset => preset !== null)
}

// --- Persisted singletons (module scope => truly shared across the app) ---

const workingGraph = useLocalStorage<Network>(KEY_GRAPH, emptyNetwork(), {
    serializer: {
        read: value => normalizeNetwork(safeParse(value)),
        write: value => JSON.stringify(value),
    },
})

const settings = useLocalStorage<AppSettings>(KEY_SETTINGS, defaultSettings(), {
    serializer: {
        read: value => normalizeSettings(safeParse(value)),
        write: value => JSON.stringify(value),
    },
})

const presets = useLocalStorage<Preset[]>(KEY_PRESETS, [], {
    serializer: {
        read: value => normalizePresets(safeParse(value)),
        write: value => JSON.stringify(value),
    },
})

// --- localStorage size accounting ---

export function localStorageUsedBytes(): number {
    if (typeof localStorage === 'undefined') return 0
    let total = 0
    for (let i = 0; i < localStorage.length; ++i) {
        const key = localStorage.key(i)
        if (key === null) continue
        const value = localStorage.getItem(key) ?? ''
        total += (key.length + value.length) * 2 // UTF-16 code units
    }
    return total
}

export interface SaveResult {
    ok: boolean
    message: string
}

function saveCurrentAsPreset(name: string): SaveResult {
    const trimmed = name.trim()
    if (!trimmed) {
        return { ok: false, message: 'Preset name cannot be empty.' }
    }

    const preset: Preset = {
        id: makeId(),
        name: trimmed,
        savedAt: Date.now(),
        network: cloneNetwork(workingGraph.value),
    }

    const nextPresets = [...presets.value, preset]
    const serialized = JSON.stringify(nextPresets)

    // Project the total footprint after replacing the presets entry.
    const oldValue =
        typeof localStorage !== 'undefined'
            ? (localStorage.getItem(KEY_PRESETS) ?? '')
            : ''
    const oldBytes = (KEY_PRESETS.length + oldValue.length) * 2
    const newBytes = (KEY_PRESETS.length + serialized.length) * 2
    const projected = localStorageUsedBytes() - oldBytes + newBytes

    if (projected + SIZE_SAFETY_MARGIN > LOCAL_STORAGE_QUOTA) {
        return {
            ok: false,
            message: 'Not enough localStorage space to save this preset.',
        }
    }

    presets.value = nextPresets
    return { ok: true, message: `Saved preset "${trimmed}".` }
}

function deleteUserPreset(id: string): void {
    presets.value = presets.value.filter(preset => preset.id !== id)
}

async function fetchPresetManifest(): Promise<PresetManifestEntry[]> {
    try {
        const response = await fetch('/data/presets.json')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = safeParse(await response.text())
        if (!Array.isArray(data)) return []
        return data
            .filter(
                (entry): entry is Record<string, unknown> =>
                    !!entry &&
                    typeof entry === 'object' &&
                    typeof (entry as Record<string, unknown>).file === 'string'
            )
            .map(entry => ({
                file: entry.file as string,
                name: toString(entry.name, entry.file as string),
            }))
    } catch (error) {
        console.error('Failed to load preset manifest:', error)
        return []
    }
}

async function loadBuiltInPreset(file: string): Promise<boolean> {
    try {
        const response = await fetch(`/data/${file}`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        workingGraph.value = normalizeNetwork(safeParse(await response.text()))
        return true
    } catch (error) {
        console.error(`Failed to load preset "${file}":`, error)
        return false
    }
}

function loadUserPreset(id: string): boolean {
    const preset = presets.value.find(p => p.id === id)
    if (!preset) return false
    workingGraph.value = cloneNetwork(preset.network)
    return true
}

function importNetworkFromText(text: string): boolean {
    const data = safeParse(text)
    if (!data || typeof data !== 'object') return false
    workingGraph.value = normalizeNetwork(data)
    return true
}

function clearWorkingGraph(): void {
    workingGraph.value = emptyNetwork()
}

// Loads the default network on first ever visit (empty working graph).
async function ensureWorkingGraph(): Promise<void> {
    if (workingGraph.value.stations.length > 0) return
    await loadBuiltInPreset('network.json')
}

export function useAppState() {
    return {
        workingGraph,
        settings,
        presets,
        // actions
        ensureWorkingGraph,
        fetchPresetManifest,
        loadBuiltInPreset,
        loadUserPreset,
        saveCurrentAsPreset,
        deleteUserPreset,
        importNetworkFromText,
        clearWorkingGraph,
        localStorageUsedBytes,
        LOCAL_STORAGE_QUOTA,
    }
}
