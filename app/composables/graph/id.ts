// Stable unique id generator for stations and bolts. Uses the platform UUID
// when available and falls back to a random string for older environments.
export function makeId(): string {
    if (
        typeof crypto !== 'undefined' &&
        typeof crypto.randomUUID === 'function'
    ) {
        return crypto.randomUUID()
    }
    return (
        'id-' +
        Math.random().toString(36).slice(2) +
        '-' +
        Date.now().toString(36)
    )
}
