export type LlmsTxtEntry = {
  title: string
  slug: string
  summary: string
}

export type LlmsTxtSection = {
  heading: string
  entries: LlmsTxtEntry[]
}

export function formatLlmsTxt(siteName: string, siteDescription: string, sections: LlmsTxtSection[]): string {
  const lines: string[] = [
    `# ${siteName}`,
    '',
    `> ${siteDescription}`,
    '',
  ]

  for (const section of sections) {
    if (section.entries.length === 0) continue
    lines.push(`## ${section.heading}`)
    lines.push('')
    for (const entry of section.entries) {
      const slug = entry.slug.startsWith('/') ? entry.slug : `/${entry.slug}`
      lines.push(`- [${entry.title}](${slug}): ${entry.summary}`)
    }
    lines.push('')
  }

  return lines.join('\n').trim() + '\n'
}
