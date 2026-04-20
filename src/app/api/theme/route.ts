import { NextResponse } from 'next/server'
import { getTheme } from '@/lib/payload'
import { buildThemeCssVarMap } from '@/lib/theme'

export async function GET() {
  try {
    const theme = await getTheme()
    const vars = buildThemeCssVarMap(theme)
    return NextResponse.json({ vars }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ vars: {} }, { status: 500 })
  }
}
