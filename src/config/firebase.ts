/**
 * Firebase Configuration
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a Firebase project at https://console.firebase.google.com
 * 2. Add iOS and Android apps to your Firebase project
 * 3. Download google-services.json (Android) and GoogleService-Info.plist (iOS)
 * 4. Place google-services.json in android/app/
 * 5. Place GoogleService-Info.plist in ios/
 * 6. Replace the config values below with your Firebase project credentials
 * 7. Enable Firestore Database and Firebase Storage in Firebase Console
 * 8. Set up Firestore Security Rules (see firestore.rules)
 */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Firebase configuration
// TODO: Replace with your actual Firebase project config
export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Export Firebase services
export { auth, firestore, storage };

// Firestore collections
export const COLLECTIONS = {
  ASSESSMENTS: 'assessments',
  USERS: 'users',
  CONTRACTORS: 'contractors',
  PHOTOS: 'photos',
  SYNC_QUEUE: 'sync_queue',
};

// Storage paths
export const STORAGE_PATHS = {
  PHOTOS: (assessmentId: string, photoId: string) =>
    `assessments/${assessmentId}/photos/${photoId}`,
  PDFS: (assessmentId: string) =>
    `assessments/${assessmentId}/pdf/report.pdf`,
  SIGNATURES: (assessmentId: string, signatureId: string) =>
    `assessments/${assessmentId}/signatures/${signatureId}`,
};

// Initialize Firebase (already initialized by @react-native-firebase)
export const initializeFirebase = async () => {
  try {
    // Firebase is auto-initialized on app start with React Native Firebase
    console.log('Firebase initialized successfully');

    // Optional: Enable offline persistence
    await firestore().settings({
      persistence: true,
      cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
    });

    console.log('Firestore offline persistence enabled');
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return false;
  }
};
