import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {
  HomeIcon,
  CogIcon,
  PackageIcon,
  DocumentsIcon,
  PinIcon,
  HelpCircleIcon,
} from '@sanity/icons'
import {schemaTypes} from './schemas'

// Custom sidebar structure
const structure = (S) =>
  S.list()
    .title('Bagani Oil CMS')
    .items([
      // --- Singletons ---
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings'),
        ),
      S.listItem()
        .title('Homepage Content')
        .id('homepage')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
            .title('Homepage Content'),
        ),

      S.divider(),

      S.documentTypeListItem('product').title('Products').icon(PackageIcon),
      S.documentTypeListItem('article').title('News & Articles').icon(DocumentsIcon),
      S.documentTypeListItem('store').title('Store Locations').icon(PinIcon),
      S.documentTypeListItem('faq').title('FAQs').icon(HelpCircleIcon),
    ])

export default defineConfig({
  name: 'bagani-oil',
  title: 'Bagani Oil',

  // Replace with your actual Sanity project ID after creating the project
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'c7mgn6k7',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
