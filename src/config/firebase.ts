/* ============================================
   Firebase Configuration
   ============================================
   
   To use Firebase Authentication:
   1. Create a Firebase project at https://console.firebase.google.com
   2. Enable Email/Password auth in Authentication > Sign-in method
   3. Create a .env file in the project root with your config:
      
      VITE_FIREBASE_API_KEY=your_api_key
      VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
      VITE_FIREBASE_PROJECT_ID=your_project_id
      VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
      VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
      VITE_FIREBASE_APP_ID=your_app_id

   4. Register a test user in Firebase Console or via the app
   
   If no Firebase config is provided, the app falls back to
   demo mode with mock authentication.
   ============================================ */

import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

// Check if Firebase is properly configured
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

let app: FirebaseApp | null = null
let auth: Auth | null = null

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
}

export { app, auth, signInWithEmailAndPassword, signOut, onAuthStateChanged }
export type { User }
