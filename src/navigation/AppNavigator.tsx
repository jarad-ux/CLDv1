/**
 * Main App Navigator
 * Defines the navigation structure for the HEIP Assessment App
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Assessment } from '@/models/Assessment';

// Import screens (these will be created)
import HomeScreen from '@/screens/HomeScreen';
import AssessmentListScreen from '@/screens/AssessmentListScreen';
import AssessmentFlowNavigator from './AssessmentFlowNavigator';

export type RootStackParamList = {
  Home: undefined;
  AssessmentList: undefined;
  AssessmentFlow: { assessmentId?: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'HEIP Assessment' }}
        />
        <Stack.Screen
          name="AssessmentList"
          component={AssessmentListScreen}
          options={{ title: 'Assessments' }}
        />
        <Stack.Screen
          name="AssessmentFlow"
          component={AssessmentFlowNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
