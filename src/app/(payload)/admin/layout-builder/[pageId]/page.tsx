import React from 'react'
import { LayoutBuilderFullScreen } from '@/components/LayoutBuilder/LayoutBuilderFullScreen'

interface Props {
  params: Promise<{ pageId: string }>
}

export default async function LayoutBuilderPage({ params }: Props) {
  const { pageId } = await params
  return <LayoutBuilderFullScreen pageId={pageId} />
}

export function generateMetadata() {
  return { title: 'Layout Builder — ATech Admin' }
}
