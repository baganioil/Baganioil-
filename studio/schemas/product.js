import {defineType, defineField, defineArrayMember} from 'sanity'
import {PackageIcon} from '@sanity/icons'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: PackageIcon,
  groups: [
    {name: 'basic', title: 'Basic Info', default: true},
    {name: 'content', title: 'Descriptions'},
    {name: 'specs', title: 'Specs & Features'},
    {name: 'faqs', title: 'FAQs'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'basic',
      options: {source: 'name'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'line',
      title: 'Product Line',
      type: 'string',
      group: 'basic',
      options: {
        list: ['Amihan', 'Laon', 'Aman', 'Anitun'],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'CSS Filter Class',
      type: 'string',
      group: 'basic',
      description: 'Lowercase: amihan, laon, aman, or anitun',
    }),
    defineField({
      name: 'spec',
      title: 'Spec Label',
      type: 'string',
      group: 'basic',
      description: 'e.g. "10W-40 | JASO MB | 1 Liter"',
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      group: 'basic',
      options: {hotspot: true},
    }),
    defineField({
      name: 'shortDesc',
      title: 'Short Description',
      type: 'text',
      group: 'basic',
      rows: 2,
      description: 'Shown on product listing cards',
    }),
    defineField({
      name: 'description',
      title: 'Main Description',
      type: 'text',
      group: 'content',
      rows: 4,
    }),
    defineField({
      name: 'description2',
      title: 'Secondary Description',
      type: 'text',
      group: 'content',
      rows: 3,
    }),
    defineField({
      name: 'specs',
      title: 'Specifications Table',
      type: 'array',
      group: 'specs',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'key', title: 'Spec Name', type: 'string'}),
            defineField({name: 'value', title: 'Value', type: 'string'}),
          ],
          preview: {
            select: {title: 'key', subtitle: 'value'},
          },
        }),
      ],
    }),
    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      group: 'specs',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Feature Title', type: 'string'}),
            defineField({name: 'desc', title: 'Description', type: 'text', rows: 2}),
            defineField({
              name: 'icon',
              title: 'Icon URL',
              type: 'string',
              description: 'e.g. /images/icon-service-6.svg',
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'desc'},
          },
        }),
      ],
    }),
    defineField({
      name: 'applications',
      title: 'Applications',
      type: 'array',
      group: 'specs',
      description: 'Where / what this product is used for',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'faqs',
      title: 'Product FAQs',
      type: 'array',
      group: 'faqs',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'q', title: 'Question', type: 'string'}),
            defineField({name: 'a', title: 'Answer', type: 'text', rows: 3}),
          ],
          preview: {
            select: {title: 'q', subtitle: 'a'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'spec',
      media: 'image',
    },
  },
  orderings: [
    {
      title: 'Product Line',
      name: 'lineAsc',
      by: [
        {field: 'line', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
})
