// // src/components/UniversalPruneButton.tsx
// 'use client'
// import React from 'react'
// import { Button, useDocumentInfo } from '@payloadcms/ui'

// export const UniversalPruneButton: React.FC = () => {
//   // Fix: Use collectionSlug and globalSlug instead of collection and global
//   const { collectionSlug, globalSlug, id } = useDocumentInfo()
  
//   const slug = globalSlug || collectionSlug
//   const isGlobal = !!globalSlug

//   const handlePrune = async () => {
//     if (!slug) {
//       alert('Error: Could not determine document information.')
//       return
//     }

//     if (!confirm(`Delete all versions for this ${isGlobal ? 'global' : 'document'}?`)) return

//     // Pass the type and slug to our custom endpoint
//     const params = new URLSearchParams({
//       slug: slug,
//       type: isGlobal ? 'global' : 'collection',
//       id: id?.toString() || '',
//     })

//     const res = await fetch(`/api/prune-versions?${params.toString()}`, {
//       method: 'POST',
//     })

//     if (res.ok) {
//       alert('Version history cleared.')
//       window.location.reload()
//     } else {
//       const data = await res.json()
//       alert(`Error: ${data.error || 'Unknown error'}`)
//     }
//   }

//   return (
//     <div style={{ marginTop: '10px', borderTop: '1px solid #444', paddingTop: '10px' }}>
//       <Button size="small" buttonStyle="secondary" onClick={handlePrune}>
//         Clear Version History
//       </Button>
//     </div>
//   )
// }
