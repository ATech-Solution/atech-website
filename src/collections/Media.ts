import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname  = path.dirname(filename)

// Resolve absolute media directory: prefer PAYLOAD_MEDIA_DIR env var,
// otherwise use {project_root}/public/media (2 levels up from src/collections/)
const mediaDir = process.env.PAYLOAD_MEDIA_DIR
  ?? path.resolve(dirname, '../../public/media')

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  upload: {
    staticDir: mediaDir,
    // staticURL: '/media',
    disableLocalStorage: false,
    // ── Image resizing — Payload auto-generates these variants ──────────
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'center',
      },
      {
        name: 'card',
        width: 768,
        height: 480,
        position: 'center',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'center',
      },
      {
        name: 'og',  // OpenGraph / social share
        width: 1200,
        height: 630,
        position: 'center',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon', 'application/pdf', 'video/*'],
    // Focal point for smart cropping
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      label: 'Alt Text',
    },
    {
      name: 'caption',
      type: 'text',
      required: false,
      label: 'Caption',
    },
  ],
}
