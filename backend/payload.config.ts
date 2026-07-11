import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { NotificationTokens } from './src/collections/NotificationTokens'
import { Trips } from './src/collections/Trips'
import { Users } from './src/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Users, Trips, NotificationTokens],
  cors: [process.env.FRONTEND_URL || 'http://localhost:5173'],
  csrf: [process.env.FRONTEND_URL || 'http://localhost:5173'],
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URL || 'file:./data/travelgenie.db' },
    push: process.env.NODE_ENV !== 'production',
    wal: true,
  }),
  secret: process.env.PAYLOAD_SECRET || 'development-only-change-this-before-production',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
