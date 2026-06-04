import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const format = request.nextUrl.searchParams.get('format')

    // ── Total counts ──────────────────────────────────────────────────────
    const [formsResult, totalSubsResult] = await Promise.all([
      payload.find({ collection: 'forms',            limit: 0, depth: 0 }),
      payload.find({ collection: 'form-submissions', limit: 0, depth: 0 }),
    ])

    // ── Last 30 days ──────────────────────────────────────────────────────
    const since = new Date()
    since.setDate(since.getDate() - 30)

    const recentResult = await payload.find({
      collection: 'form-submissions',
      limit: 1000,
      depth: 1,
      sort: '-createdAt',
      where: { createdAt: { greater_than: since.toISOString() } },
    })

    // Group by date (YYYY-MM-DD)
    const dateMap: Record<string, number> = {}
    for (let i = 0; i < 30; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dateMap[d.toISOString().slice(0, 10)] = 0
    }
    for (const sub of recentResult.docs) {
      const day = new Date((sub as any).createdAt).toISOString().slice(0, 10)
      if (day in dateMap) dateMap[day]++
    }

    // Group by form
    const formMap: Record<string, { title: string; count: number }> = {}
    for (const sub of recentResult.docs) {
      const form    = (sub as any).form
      const formId  = typeof form === 'object' ? form?.id : form
      const title   = typeof form === 'object' ? (form?.title ?? 'Unknown') : String(formId)
      if (formId) {
        if (!formMap[formId]) formMap[formId] = { title, count: 0 }
        formMap[formId].count++
      }
    }

    // ── Status pipeline (all submissions, up to 2000) ─────────────────────
    const allStatusResult = await payload.find({
      collection: 'form-submissions',
      limit: 2000,
      depth: 0,
      sort: '-createdAt',
    })

    const byStatus = { new: 0, 'in-review': 0, contacted: 0, closed: 0 } as Record<string, number>
    for (const sub of allStatusResult.docs) {
      const s = (sub as any).status ?? 'new'
      byStatus[s] = (byStatus[s] ?? 0) + 1
    }

    // ── Recent 10 submissions (for dashboard table) ───────────────────────
    const recent10 = await payload.find({
      collection: 'form-submissions',
      limit: 10,
      depth: 1,
      sort: '-createdAt',
    })

    const recent = recent10.docs.map((sub: any) => ({
      id:        sub.id,
      createdAt: sub.createdAt,
      formTitle: typeof sub.form === 'object' ? (sub.form?.title ?? 'Unknown') : 'Unknown',
      score:     sub.score   ?? null,
      status:    sub.status  ?? 'new',
    }))

    // ── CSV export ────────────────────────────────────────────────────────
    if (format === 'csv') {
      const allSubs = await payload.find({
        collection: 'form-submissions',
        limit: 5000,
        depth: 1,
        sort: '-createdAt',
      })

      const rows: string[] = ['ID,Form,Status,Score,Submitted At']
      for (const sub of allSubs.docs) {
        const formTitle = typeof (sub as any).form === 'object'
          ? ((sub as any).form?.title ?? '')
          : ''
        rows.push([
          sub.id,
          `"${formTitle.replace(/"/g, '""')}"`,
          (sub as any).status  ?? 'new',
          (sub as any).score   ?? '',
          (sub as any).createdAt,
        ].join(','))
      }

      return new NextResponse(rows.join('\n'), {
        headers: {
          'Content-Type':        'text/csv',
          'Content-Disposition': `attachment; filename="form-submissions-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      })
    }

    // ── JSON response ─────────────────────────────────────────────────────
    return NextResponse.json({
      totalForms:       formsResult.totalDocs,
      totalSubmissions: totalSubsResult.totalDocs,
      byDate:  Object.entries(dateMap)
                 .sort((a, b) => a[0].localeCompare(b[0]))
                 .map(([date, count]) => ({ date, count })),
      byForm:  Object.entries(formMap)
                 .map(([formId, { title, count }]) => ({ formId, title, count }))
                 .sort((a, b) => b.count - a.count),
      byStatus,
      recent,
    })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
