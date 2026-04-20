'use server'

import * as PayloadLayouts from '@payloadcms/next/layouts'
import configPromise from '@payload-config'
import { importMap } from './admin/importMap'

export async function serverFunction(args: Parameters<typeof PayloadLayouts.handleServerFunctions>[0]) {
  return PayloadLayouts.handleServerFunctions({ ...args, config: configPromise, importMap })
}
