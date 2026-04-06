import {defineType, defineField} from 'sanity'
import {CogIcon} from '@sanity/icons'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'contact', title: 'Contact Info'},
    {name: 'social', title: 'Social Media'},
    {name: 'integrations', title: 'Integrations'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Site Name',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      group: 'general',
    }),
    defineField({
      name: 'keywords',
      title: 'Meta Keywords',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'year',
      title: 'Footer Year',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'social',
      title: 'Social Media Links',
      type: 'object',
      group: 'social',
      fields: [
        {name: 'facebook', title: 'Facebook URL', type: 'url'},
        {name: 'instagram', title: 'Instagram URL', type: 'url'},
        {name: 'twitter', title: 'Twitter / X URL', type: 'url'},
        {name: 'pinterest', title: 'Pinterest URL', type: 'url'},
      ],
    }),
    defineField({
      name: 'facebookPageId',
      title: 'Facebook Page ID',
      type: 'string',
      group: 'integrations',
      description: 'Numeric Page ID for the Messenger Chat widget',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
