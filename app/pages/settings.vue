<script setup lang="ts">
useSeoMeta({
    title: 'Settings - Piston Bolt Network Builder',
    description:
        'Tool for generating and editing piston bolt networks for Minecraft',
    ogTitle: 'Piston Bolt Network Builder',
    ogDescription:
        'Tool for generating and editing piston bolt networks for Minecraft',
    ogImage: '/ogImage.webp',
    ogUrl: 'https://bolt-routing-problem-v2.vercel.app/settings',
    twitterTitle: 'Piston Bolt Network Builder',
    twitterDescription:
        'Tool for generating and editing piston bolt networks for Minecraft',
    twitterImage: '/ogImage.webp',
    twitterCard: 'summary',
})

const {
    workingGraph,
    settings,
    presets,
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
} = useAppState()

const network = workingGraph

const userMsg = ref('')
const manifest = ref<PresetManifestEntry[]>([])
const selectedPreset = ref('')
const presetName = ref('')
const storageUsed = ref(0)

const fileInput: Ref<HTMLInputElement | null> = ref(null)

const storagePercent = computed(() =>
    Math.min(100, Math.round((storageUsed.value / LOCAL_STORAGE_QUOTA) * 100))
)

function refreshStorage() {
    storageUsed.value = localStorageUsedBytes()
}

onMounted(async () => {
    await ensureWorkingGraph()
    manifest.value = await fetchPresetManifest()
    refreshStorage()
})

function onSettingsChange() {
    userMsg.value = 'Changes saved.'
}

async function onPresetSelected() {
    const value = selectedPreset.value
    if (!value) return

    const [kind, ...rest] = value.split(':')
    const id = rest.join(':')

    if (kind === 'builtin') {
        const ok = await loadBuiltInPreset(id)
        userMsg.value = ok
            ? 'Preset loaded.'
            : 'Failed to load preset (see console).'
    } else if (kind === 'user') {
        const ok = loadUserPreset(id)
        userMsg.value = ok ? 'Preset loaded.' : 'Preset not found.'
    }

    refreshStorage()
}

function savePreset() {
    const result = saveCurrentAsPreset(presetName.value)
    userMsg.value = result.message
    if (result.ok) {
        presetName.value = ''
        refreshStorage()
    }
}

function removePreset(id: string) {
    deleteUserPreset(id)
    if (selectedPreset.value === `user:${id}`) selectedPreset.value = ''
    userMsg.value = 'Preset deleted.'
    refreshStorage()
}

const triggerFileInput = () => {
    fileInput.value?.click()
}

function importNetwork(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
        const text = reader.result?.toString() ?? ''
        const ok = importNetworkFromText(text)
        userMsg.value = ok
            ? 'Network imported.'
            : 'Import failed: invalid or unreadable JSON.'
        refreshStorage()
    }
    reader.onerror = () => {
        userMsg.value = 'Import failed: could not read the file.'
    }
    reader.readAsText(file)
}

function downloadBlob(content: string, type: string, filename: string) {
    const blob = new Blob([content], { type })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
}

function exportNetwork() {
    downloadBlob(
        JSON.stringify(network.value, null, 4),
        'application/json',
        'network.json'
    )
}

function exportDistanceMatrix() {
    const matrix = buildDistanceMatrix(network.value)
    downloadBlob(
        convertDistanceMatrixToCSV(matrix),
        'text/csv',
        'distance_matrix.csv'
    )
}

function convertDistanceMatrixToCSV(matrix: DistanceMatrix[]) {
    const stationNames = matrix.map(entry => entry.station_name)
    let csvContent = ';"' + stationNames.join('";"') + '"\n'
    for (let i = 0; i < matrix.length; i++) {
        csvContent += `"${stationNames[i]}";"${matrix[i].values.join('";"')}"\n`
    }
    return csvContent
}

function exportScatter() {
    const data = runAllSolvers(network.value, settings.value)
    downloadBlob(convertPlotDataToCSV(data), 'text/csv', 'scatter-plot.csv')
}

function convertPlotDataToCSV(data: PlotData[]) {
    const csvHeader =
        '"Graph";"Total tunnel length, blocks";"Average travel time, s"\n'
    let csvContent = ''
    for (const entry of data) {
        csvContent += `"${entry.graph_name}";${entry.length};${entry.time}\n`
    }
    return csvHeader + csvContent
}
</script>
<template>
    <div class="flex flex-col xl:flex-row">
        <div class="mx-auto mt-3 flex w-[520px] min-w-[520px] flex-col">
            <NuxtLink
                to="/"
                title="Go back to main page"
                class="fixed left-3 top-3 text-xs"
                >← Back</NuxtLink
            >
            <div class="my-auto flex flex-col p-5">
                <a
                    class="mb-7 cursor-pointer text-xl font-extrabold text-primary underline"
                    href="https://github.com/KK-mp4/Bolt-Routing-Problem-V2?tab=readme-ov-file#piston-bolt-network-builder-for-minecraft-v2-wip"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub">
                    User guide available on GitHub:
                </a>

                <BaseToggle
                    v-model="settings.display.showLabels"
                    @change="onSettingsChange"
                    >Show station labels
                    <p class="text-xs text-primary">
                        Displays station labels next to graph vertices
                    </p></BaseToggle
                >
                <BaseToggle
                    v-model="settings.display.colourGraph"
                    @change="onSettingsChange"
                    >Colour graph automatically
                    <p class="text-xs text-primary">
                        Colours graph randomly after generation
                    </p></BaseToggle
                >
                <BaseToggle
                    v-model="settings.display.calcStats"
                    @change="onSettingsChange"
                    >Calculate average travel time
                    <p class="text-xs text-primary">
                        Slows processing time, but unlocks distance matrix
                        heatmap
                    </p></BaseToggle
                >
                <div class="mb-7 h-0 w-full border border-primary" />

                <label class="mb-1 text-sm text-primary">Load preset</label>
                <BaseSelect v-model="selectedPreset" @change="onPresetSelected">
                    <option value="">— Select a preset —</option>
                    <optgroup label="Built-in">
                        <option
                            v-for="entry in manifest"
                            :key="entry.file"
                            :value="`builtin:${entry.file}`">
                            {{ entry.name }}
                        </option>
                    </optgroup>
                    <optgroup v-if="presets.length" label="Saved">
                        <option
                            v-for="preset in presets"
                            :key="preset.id"
                            :value="`user:${preset.id}`">
                            {{ preset.name }}
                        </option>
                    </optgroup>
                </BaseSelect>

                <div
                    v-if="presets.length"
                    class="mb-3 mt-2 flex flex-col gap-1 text-xs">
                    <div
                        v-for="preset in presets"
                        :key="preset.id"
                        class="flex items-center justify-between">
                        <span class="text-accent">{{ preset.name }}</span>
                        <button
                            class="text-primary underline"
                            @click="removePreset(preset.id)">
                            delete
                        </button>
                    </div>
                </div>

                <div class="mb-2 mt-3 flex gap-2">
                    <input
                        v-model="presetName"
                        aria-label="Preset name"
                        placeholder="New preset name"
                        class="w-full rounded-sm bg-primary px-2 font-bold text-background outline-none" />
                </div>
                <BaseButton @click="savePreset"
                    >Save current graph as preset</BaseButton
                >
                <p class="mb-1 text-xs text-primary">
                    Storage used: {{ Math.round(storageUsed / 1024) }} KB /
                    {{ Math.round(LOCAL_STORAGE_QUOTA / 1024) }} KB ({{
                        storagePercent
                    }}%)
                </p>
                <div class="mb-7 h-0 w-full border border-primary" />

                <BaseButton @click="triggerFileInput"
                    >Import network<Icon
                        class="my-auto ml-3"
                        name="bi:filetype-json"
                        size="16px"
                /></BaseButton>
                <input
                    ref="fileInput"
                    type="file"
                    style="display: none"
                    @change="importNetwork" />
                <BaseButton @click="clearWorkingGraph"
                    >Clear network</BaseButton
                >
                <div class="mb-7 h-0 w-full border border-primary" />

                <BaseButton @click="exportNetwork"
                    >Export network<Icon
                        class="my-auto ml-3"
                        name="bi:filetype-json"
                        size="16px"
                /></BaseButton>
                <BaseButton @click="exportDistanceMatrix"
                    >Export distance matrix<Icon
                        class="my-auto ml-3"
                        name="bi:filetype-csv"
                        size="16px"
                /></BaseButton>
                <BaseButton @click="exportScatter"
                    >Export scatter plot<Icon
                        class="my-auto ml-3"
                        name="bi:filetype-csv"
                        size="16px"
                /></BaseButton>
            </div>
            <p class="fixed bottom-0 left-0 select-none text-sm">
                {{ userMsg }}
            </p>
        </div>
        <div class="h-screen flex-1">
            <TheTable
                v-if="network.stations"
                v-model:stations="network.stations" />
        </div>
    </div>
</template>
