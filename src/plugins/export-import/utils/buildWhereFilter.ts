import type { Where } from 'payload'

interface Filter {
  status?: string
  dateFrom?: string
  dateTo?: string
}

export function buildWhereFilter(filter: Filter = {}): Where {
  const conditions: Where[] = []

  if (filter.status) {
    conditions.push({ status: { equals: filter.status } })
  }

  if (filter.dateFrom) {
    conditions.push({ createdAt: { greater_than_equal: filter.dateFrom } })
  }

  if (filter.dateTo) {
    conditions.push({ createdAt: { less_than_equal: filter.dateTo } })
  }

  if (conditions.length === 0) return {}
  if (conditions.length === 1) return conditions[0]
  return { and: conditions }
}
