import {defineType, defineField} from 'sanity'
import {PinIcon} from '@sanity/icons'

export default defineType({
  name: 'store',
  title: 'Store Location',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Store Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name'},
    }),
    defineField({
      name: 'address',
      title: 'Street Address',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'lat',
      title: 'Latitude',
      type: 'number',
      description: 'e.g. 14.5995',
    }),
    defineField({
      name: 'lng',
      title: 'Longitude',
      type: 'number',
      description: 'e.g. 120.9740',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'city',
    },
  },
  orderings: [
    {
      title: 'City A–Z',
      name: 'cityAsc',
      by: [{field: 'city', direction: 'asc'}],
    },
  ],
})
