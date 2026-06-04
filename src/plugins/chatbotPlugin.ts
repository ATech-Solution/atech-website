import type { Config, Plugin } from 'payload'
import { ChatbotGlobal } from './chatbot/ChatbotGlobal'
import { ChatbotLeadsCollection } from './chatbot/ChatbotLeadsCollection'
import { ChatbotEventsCollection } from './chatbot/ChatbotEventsCollection'
import { seedChatbotContent } from './chatbot/seed'

export const CHATBOT_PLUGIN_METADATA = {
  name: 'Chatbot Widget',
  slug: 'chatbot',
  version: '1.0.0',
  description:
    'Floating chat widget with a nested Q&A tree, WhatsApp redirect, contact form capture, and analytics. Fully configurable from the admin panel.',
}

export const chatbotPlugin = (): Plugin =>
  (incomingConfig: Config): Config => {
    return {
      ...incomingConfig,

      globals: [...(incomingConfig.globals ?? []), ChatbotGlobal],

      collections: [
        ...(incomingConfig.collections ?? []),
        ChatbotLeadsCollection,
        ChatbotEventsCollection,
      ],

      onInit: async (payload) => {
        if (incomingConfig.onInit) await incomingConfig.onInit(payload)

        if (process.env.NEXT_PHASE === 'phase-production-build') return

        // ── Self-seed into plugins collection ──────────────────────────────
        try {
          const existing = await payload.find({
            collection: 'plugins',
            where: { slug: { equals: CHATBOT_PLUGIN_METADATA.slug } },
            limit: 1,
          })

          if (existing.totalDocs === 0) {
            await payload.create({
              collection: 'plugins',
              data: {
                name: CHATBOT_PLUGIN_METADATA.name,
                slug: CHATBOT_PLUGIN_METADATA.slug,
                pluginType: 'built-in',
                category: 'utility',
                status: 'active',
                version: CHATBOT_PLUGIN_METADATA.version,
                author: 'ATech',
                description: CHATBOT_PLUGIN_METADATA.description,
                autoActivate: true,
                features: [
                  {
                    featureName: 'Nested Q&A Tree',
                    featureDescription:
                      'Unlimited-depth question and answer tree, editable from admin',
                    featureType: 'collection',
                  },
                  {
                    featureName: 'WhatsApp Redirect',
                    featureDescription:
                      'Per-node or global WhatsApp URL with configurable phone number',
                    featureType: 'hook',
                  },
                  {
                    featureName: 'Contact Form & Lead Capture',
                    featureDescription:
                      'Name + email form on selected nodes, stored in chatbot-leads collection',
                    featureType: 'hook',
                  },
                  {
                    featureName: 'Analytics',
                    featureDescription:
                      'Click tracking for nodes, WhatsApp taps, and form submissions',
                    featureType: 'script',
                  },
                  {
                    featureName: 'Availability Hours',
                    featureDescription:
                      'Show offline message outside Mon–Fri 9am–5pm HKT',
                    featureType: 'script',
                  },
                ],
              },
            })
            payload.logger.info('✅ Chatbot plugin seeded into Plugins collection.')
          }
        } catch (err) {
          payload.logger.warn(
            `⚠ Chatbot plugin record seed skipped: ${(err as Error).message}`,
          )
        }

        // ── Seed initial Q&A content ───────────────────────────────────────
        await seedChatbotContent(payload)
      },
    }
  }
