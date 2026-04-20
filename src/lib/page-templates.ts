// Scans src/app/(frontend)/**/page.tsx files for the marker:
//   // Page Template : <Name>
// and returns Payload-compatible select options.
//
// Called at Payload config load time (server-side only).

import fs   from 'fs'
import path from 'path'

export interface PageTemplateOption {
  label: string
  value: string
}

function scanDir(dir: string, results: PageTemplateOption[]): void {
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      scanDir(fullPath, results)
    } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
      let content: string
      try {
        content = fs.readFileSync(fullPath, 'utf-8')
      } catch {
        continue
      }
      const match = content.match(/\/\/\s*Page Template\s*:\s*(.+)/)
      if (match) {
        const name = match[1].trim()
        results.push({
          label: name,
          value: name.toLowerCase().replace(/\s+/g, '-'),
        })
      }
    }
  }
}

export function getPageTemplateOptions(): PageTemplateOption[] {
  const frontendDir = path.join(process.cwd(), 'src', 'app', '(frontend)')
  const results: PageTemplateOption[] = []
  scanDir(frontendDir, results)
  // Sort alphabetically by label for a predictable order in the select
  results.sort((a, b) => a.label.localeCompare(b.label))
  return results
}
