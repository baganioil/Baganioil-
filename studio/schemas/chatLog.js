import {defineType, defineField} from 'sanity'
import {BellIcon} from '@sanity/icons'

export default defineType({
  name: 'chatLog',
  title: 'Chat Logs',
  type: 'document',
  icon: BellIcon,
  readOnly: true,
  fields: [
    defineField({
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
      description: 'Unique identifier linking all messages from the same conversation.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'userMessage',
      title: 'User Message',
      type: 'text',
      rows: 3,
      description: 'The question or message sent by the website visitor.',
    }),
    defineField({
      name: 'botReply',
      title: 'Bot Reply',
      type: 'text',
      rows: 5,
      description: 'The AI response that was sent back to the user.',
    }),
    defineField({
      name: 'retrievedTypes',
      title: 'Content Types Retrieved',
      type: 'array',
      of: [{type: 'string'}],
      description: "Which content types from Sanity matched the user's question (product, faq, store, article). Empty means no match was found.",
    }),
    defineField({
      name: 'noContentFound',
      title: 'No Content Found (Out-of-Scope)',
      type: 'boolean',
      description: 'If true, the question was outside the website content and the bot declined to answer. Use this to identify gaps in your content.',
    }),
    defineField({
      name: 'pageUrl',
      title: 'Page URL',
      type: 'string',
      description: 'The page the visitor was on when they sent this message.',
    }),
    defineField({
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
      description: 'When this message was sent.',
    }),
  ],
  preview: {
    select: {
      title: 'userMessage',
      subtitle: 'timestamp',
      noContent: 'noContentFound',
    },
    prepare({title, subtitle, noContent}) {
      const label = title
        ? (title.length > 70 ? title.slice(0, 70) + '…' : title)
        : '(empty message)'
      const date = subtitle ? new Date(subtitle).toLocaleString('en-PH') : ''
      const flag = noContent ? ' ⚠️ No match' : ''
      return {
        title: label,
        subtitle: date + flag,
      }
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'timestampDesc',
      by: [{field: 'timestamp', direction: 'desc'}],
    },
  ],
})
