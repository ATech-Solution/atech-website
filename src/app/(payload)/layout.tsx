'use server'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import type { ServerFunctionClient } from 'payload'
import { importMap } from './admin/importMap'
import configPromise from '@payload-config'
import React from 'react'
import '@payloadcms/next/css'  // Payload admin UI styles (240KB, required)
import '@/styles/admin.scss'   // Custom brand overrides (loads after, so it wins)
import './custom.css'          // Custom styles for the admin UI (optional)

// import * as PayloadLayouts from '@payloadcms/next/layouts'

// Payload built-in compiled stylesheet — required for admin UI styling
// import '@payloadcms/ui/styles.css'
// @import '~@payloadcms/ui/scss';
// import './global1.css'
// import './global2.css'
// import './global3.css'

// that conflicted with the installed package and broke popup/dropdown menus.
// export default async function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <PayloadLayouts.RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
//       {children}
//     </PayloadLayouts.RootLayout>
//   )
// }

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config: configPromise, importMap })
}

export default async function PayloadLayout({ children }: Args) {
  return (
    <RootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  )
}