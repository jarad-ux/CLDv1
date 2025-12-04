/**
 * HEIP Assessment App
 * Georgia Power Home Energy Assessment Mobile Application
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeFirebase } from './src/config/firebase';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize Firebase on app start
    initializeFirebase().then(success => {
      if (success) {
        console.log('App initialized successfully');
      } else {
        console.error('App initialization failed');
      }
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0066CC" />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
