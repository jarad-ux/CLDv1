/**
 * Property Details Screen - Placeholder
 * TODO: Implement full property details collection
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AssessmentFlowParamList } from '@/navigation/AssessmentFlowNavigator';
import { useAssessmentStore } from '@/store/assessmentStore';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  navigation: StackNavigationProp<AssessmentFlowParamList, 'PropertyDetails'>;
};

const PropertyDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const { saveCurrentAssessment } = useAssessmentStore();

  const handleNext = async () => {
    await saveCurrentAssessment();
    navigation.navigate('EnergyBills');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Property Details Screen</Text>
      <Text style={styles.subtext}>Collect additional property details</Text>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next: Energy Bills</Text>
        <Icon name="arrow-forward" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  placeholder: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  subtext: { fontSize: 14, color: '#666', marginBottom: 30 },
  nextButton: {
    backgroundColor: '#0066CC',
    padding: 18,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
});

export default PropertyDetailsScreen;
