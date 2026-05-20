'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { AiToolbarButton } from './AiToolbarButton'
import { AiContentPlugin } from './AiContentPlugin'

export const AiContentFeatureClient = createClientFeature({
  toolbarFixed: {
    groups: [
      {
        key: 'ai-content',
        type: 'buttons',
        order: 100,
        items: [
          {
            key: 'ai-write-fixed',
            Component: AiToolbarButton,
            order: 100,
          },
        ],
      },
    ],
  },
  toolbarInline: {
    groups: [
      {
        key: 'ai-content-inline',
        type: 'buttons',
        order: 100,
        items: [
          {
            key: 'ai-write-inline',
            Component: AiToolbarButton,
            order: 100,
          },
        ],
      },
    ],
  },
  plugins: [
    {
      Component: AiContentPlugin,
      position: 'top',
    },
  ],
})
