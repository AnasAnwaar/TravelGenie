import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'appId'] as const

export function getFirebaseApp(): FirebaseApp {
  const isConfigured = requiredConfigKeys.every((key) => Boolean(firebaseConfig[key]))

  if (!isConfigured) {
    throw new Error('Firebase is not configured. Copy .env.example to .env.local and add your Firebase web app values.')
  }

  return getApps().length ? getApp() : initializeApp(firebaseConfig)
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp())
}

export const googleAuthProvider = new GoogleAuthProvider()

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === 'undefined' || !(await isSupported())) return null

  return getMessaging(getFirebaseApp())
}

export const firebaseVapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
