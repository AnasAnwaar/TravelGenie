import type { CollectionConfig } from 'payload'

const isOwner = ({ req: { user } }: { req: { user?: { id: string | number } | null } }) =>
  user ? { user: { equals: user.id } } : false

export const NotificationTokens: CollectionConfig = {
  slug: 'notification-tokens',
  admin: { useAsTitle: 'token' },
  access: { create: ({ req: { user } }) => Boolean(user), read: isOwner, update: isOwner, delete: isOwner },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'token', type: 'text', required: true, unique: true },
    { name: 'platform', type: 'select', options: ['web', 'android', 'ios'], required: true },
  ],
}
