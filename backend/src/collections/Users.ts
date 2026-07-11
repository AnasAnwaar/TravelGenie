import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'firebaseUID',
      type: 'text',
      unique: true,
      admin: { description: 'Firebase Authentication UID, when the account is linked to Firebase.' },
    },
    {
      name: 'preferences',
      type: 'json',
      admin: { description: 'Travel style, interests, accessibility, language, and currency preferences.' },
    },
  ],
}
