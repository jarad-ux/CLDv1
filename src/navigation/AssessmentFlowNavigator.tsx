/**
 * Assessment Flow Navigator
 * Step-by-step workflow for HEIP assessments
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import assessment screens
import CustomerInfoScreen from '@/screens/assessment/CustomerInfoScreen';
import PropertyDetailsScreen from '@/screens/assessment/PropertyDetailsScreen';
import EnergyBillsScreen from '@/screens/assessment/EnergyBillsScreen';
import ComfortConcernsScreen from '@/screens/assessment/ComfortConcernsScreen';
import HVACSystemScreen from '@/screens/assessment/HVACSystemScreen';
import WaterHeaterScreen from '@/screens/assessment/WaterHeaterScreen';
import InsulationEnvelopeScreen from '@/screens/assessment/InsulationEnvelopeScreen';
import WindowsDoorsScreen from '@/screens/assessment/WindowsDoorsScreen';
import DuctSystemScreen from '@/screens/assessment/DuctSystemScreen';
import RoomByRoomScreen from '@/screens/assessment/RoomByRoomScreen';
import PhotosScreen from '@/screens/assessment/PhotosScreen';
import RecommendationsScreen from '@/screens/assessment/RecommendationsScreen';
import RebatesScreen from '@/screens/assessment/RebatesScreen';
import SignaturesScreen from '@/screens/assessment/SignaturesScreen';
import ReviewScreen from '@/screens/assessment/ReviewScreen';

export type AssessmentFlowParamList = {
  CustomerInfo: undefined;
  PropertyDetails: undefined;
  EnergyBills: undefined;
  ComfortConcerns: undefined;
  HVACSystem: undefined;
  WaterHeater: undefined;
  InsulationEnvelope: undefined;
  WindowsDoors: undefined;
  DuctSystem: undefined;
  RoomByRoom: undefined;
  Photos: undefined;
  Recommendations: undefined;
  Rebates: undefined;
  Signatures: undefined;
  Review: undefined;
};

const Stack = createStackNavigator<AssessmentFlowParamList>();

const AssessmentFlowNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="CustomerInfo"
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#0066CC',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              // Show save confirmation or auto-save
              navigation.navigate('Review' as any);
            }}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>Review</Text>
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen
        name="CustomerInfo"
        component={CustomerInfoScreen}
        options={{ title: 'Step 1: Customer Info' }}
      />
      <Stack.Screen
        name="PropertyDetails"
        component={PropertyDetailsScreen}
        options={{ title: 'Step 2: Property Details' }}
      />
      <Stack.Screen
        name="EnergyBills"
        component={EnergyBillsScreen}
        options={{ title: 'Step 3: Energy Bills' }}
      />
      <Stack.Screen
        name="ComfortConcerns"
        component={ComfortConcernsScreen}
        options={{ title: 'Step 4: Comfort Concerns' }}
      />
      <Stack.Screen
        name="HVACSystem"
        component={HVACSystemScreen}
        options={{ title: 'Step 5: HVAC System' }}
      />
      <Stack.Screen
        name="WaterHeater"
        component={WaterHeaterScreen}
        options={{ title: 'Step 6: Water Heater' }}
      />
      <Stack.Screen
        name="InsulationEnvelope"
        component={InsulationEnvelopeScreen}
        options={{ title: 'Step 7: Insulation' }}
      />
      <Stack.Screen
        name="WindowsDoors"
        component={WindowsDoorsScreen}
        options={{ title: 'Step 8: Windows & Doors' }}
      />
      <Stack.Screen
        name="DuctSystem"
        component={DuctSystemScreen}
        options={{ title: 'Step 9: Duct System' }}
      />
      <Stack.Screen
        name="RoomByRoom"
        component={RoomByRoomScreen}
        options={{ title: 'Step 10: Room Findings' }}
      />
      <Stack.Screen
        name="Photos"
        component={PhotosScreen}
        options={{ title: 'Step 11: Photos' }}
      />
      <Stack.Screen
        name="Recommendations"
        component={RecommendationsScreen}
        options={{ title: 'Step 12: Recommendations' }}
      />
      <Stack.Screen
        name="Rebates"
        component={RebatesScreen}
        options={{ title: 'Step 13: Rebates' }}
      />
      <Stack.Screen
        name="Signatures"
        component={SignaturesScreen}
        options={{ title: 'Step 14: Signatures' }}
      />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{
          title: 'Review & Submit',
          headerRight: undefined, // Remove the Review button on the review screen
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AssessmentFlowNavigator;
