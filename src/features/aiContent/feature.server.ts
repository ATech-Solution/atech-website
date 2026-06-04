import { createServerFeature } from '@payloadcms/richtext-lexical'

export const AiContentFeature = createServerFeature({
  key: 'aiContent',
  feature: {
    ClientFeature: '@/features/aiContent/feature.client#AiContentFeatureClient',
  },
})
