import {defineType, defineField, defineArrayMember} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero Section', default: true},
    {name: 'about', title: 'About Section'},
    {name: 'testimonials', title: 'Testimonials'},
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({name: 'subtitle', title: 'Eyebrow Text', type: 'string'}),
        defineField({name: 'title', title: 'Headline', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        defineField({name: 'buttonText', title: 'Button Label', type: 'string'}),
        defineField({name: 'buttonUrl', title: 'Button URL', type: 'string'}),
      ],
    }),
    defineField({
      name: 'about',
      title: 'About Section',
      type: 'object',
      group: 'about',
      fields: [
        defineField({name: 'subtitle', title: 'Eyebrow Text', type: 'string'}),
        defineField({name: 'title', title: 'Headline', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
        defineField({name: 'years', title: 'Years in Business', type: 'number'}),
        defineField({name: 'rating', title: 'Rating (e.g. 4.9)', type: 'string'}),
        defineField({name: 'ratingCount', title: 'Rating Count (e.g. 15.5K)', type: 'string'}),
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      group: 'testimonials',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'quote', title: 'Quote', type: 'text', rows: 3}),
            defineField({name: 'author', title: 'Author Name', type: 'string'}),
            defineField({name: 'role', title: 'Role / Description', type: 'string'}),
            defineField({
              name: 'image',
              title: 'Author Photo',
              type: 'image',
              options: {hotspot: true},
            }),
          ],
          preview: {
            select: {title: 'author', subtitle: 'role', media: 'image'},
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Homepage Content'}
    },
  },
})
