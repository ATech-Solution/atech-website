// Extract plain text from a Lexical rich-text JSON object
function extractPlainText(value: any): string {
  if (!value || typeof value !== 'object') return ''
  if (value.type === 'text') return value.text ?? ''
  if (Array.isArray(value.children)) {
    return value.children.map(extractPlainText).join(' ')
  }
  if (value.root?.children) {
    return value.root.children.map(extractPlainText).join('\n')
  }
  return ''
}

function flattenValue(value: any): string {
  if (value === null || value === undefined) return ''

  // Lexical rich text — has root.children
  if (typeof value === 'object' && value.root?.children) {
    return extractPlainText(value)
  }

  // Relationship — single { id, ... } or array of relationships
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'object' && item !== null) {
          return String(item.id ?? item.value ?? JSON.stringify(item))
        }
        return String(item)
      })
      .join(',')
  }

  if (typeof value === 'object') {
    // Single relationship with id
    if ('id' in value) return String(value.id)
    // Upload with filename
    if ('filename' in value) return String(value.filename)
    return JSON.stringify(value)
  }

  return String(value)
}

function escapeCsvField(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function docsToCsv(docs: any[]): string {
  if (docs.length === 0) return ''

  // Collect all unique keys across all docs
  const keySet = new Set<string>()
  for (const doc of docs) {
    for (const key of Object.keys(doc)) {
      keySet.add(key)
    }
  }
  const headers = Array.from(keySet)

  const headerRow = headers.map(escapeCsvField).join(',')
  const dataRows = docs.map((doc) =>
    headers
      .map((key) => escapeCsvField(flattenValue(doc[key])))
      .join(','),
  )

  return [headerRow, ...dataRows].join('\r\n')
}
