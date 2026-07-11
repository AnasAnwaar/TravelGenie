import type { CollectionConfig } from 'payload'

const isOwner = ({ req: { user } }: { req: { user?: { id: string | number } | null } }) => {
  if (!user) return false
  return { user: { equals: user.id } }
}

export const Trips: CollectionConfig = {
  slug: 'trips',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'user', 'status', 'updatedAt'] },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: isOwner,
    update: isOwner,
    delete: isOwner,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    {
      name: 'destination',
      type: 'group',
      fields: [
        { name: 'city', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
      ],
    },
    {
      name: 'dates',
      type: 'group',
      fields: [{ name: 'start', type: 'date' }, { name: 'end', type: 'date' }],
    },
    { name: 'travelers', type: 'number', min: 1, defaultValue: 1 },
    { name: 'budget', type: 'number', min: 0 },
    { name: 'status', type: 'select', defaultValue: 'planning', options: ['planning', 'upcoming', 'completed', 'cancelled'] },
    { name: 'preferencesSnapshot', type: 'json' },
    { name: 'itinerary', type: 'json' },
  ],
}
