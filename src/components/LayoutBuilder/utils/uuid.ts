/**
 * Generate a short unique ID for new layout block instances.
 * Uses crypto.randomUUID if available, otherwise falls back to Math.random.
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36)
}
