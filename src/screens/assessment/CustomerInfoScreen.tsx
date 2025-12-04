/**
 * Customer Info Screen
 * Step 1: Collect customer and property information
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AssessmentFlowParamList } from '@/navigation/AssessmentFlowNavigator';
import { useAssessmentStore } from '@/store/assessmentStore';
import { PropertyType, PropertyStatus } from '@/models/Assessment';
import Icon from 'react-native-vector-icons/MaterialIcons';

type CustomerInfoNavigationProp = StackNavigationProp<AssessmentFlowParamList, 'CustomerInfo'>;

interface Props {
  navigation: CustomerInfoNavigationProp;
}

const CustomerInfoScreen: React.FC<Props> = ({ navigation }) => {
  const { currentAssessment, updateCurrentAssessment, saveCurrentAssessment, startAssessment } =
    useAssessmentStore();

  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('GA');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>(PropertyType.SINGLE_FAMILY);
  const [propertyStatus, setPropertyStatus] = useState<PropertyStatus>(PropertyStatus.HOMEOWNER);

  useEffect(() => {
    // Load existing data if available
    if (currentAssessment) {
      setName(currentAssessment.customer.name || '');
      setAccountNumber(currentAssessment.customer.georgiaPowerAccountNumber || '');
      setAddress(currentAssessment.customer.serviceAddress || '');
      setCity(currentAssessment.customer.city || '');
      setState(currentAssessment.customer.state || 'GA');
      setZipCode(currentAssessment.customer.zipCode || '');
      setPhone(currentAssessment.customer.phoneNumber || '');
      setEmail(currentAssessment.customer.email || '');
      setPropertyType(currentAssessment.customer.propertyType);
      setPropertyStatus(currentAssessment.customer.propertyStatus);
    }
  }, [currentAssessment]);

  const handleNext = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Required Field', 'Customer name is required');
      return;
    }
    if (!accountNumber.trim()) {
      Alert.alert('Required Field', 'Georgia Power account number is required');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Required Field', 'Service address is required');
      return;
    }

    // Update assessment
    updateCurrentAssessment({
      customer: {
        name: name.trim(),
        georgiaPowerAccountNumber: accountNumber.trim(),
        serviceAddress: address.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim(),
        phoneNumber: phone.trim(),
        email: email.trim(),
        propertyType,
        propertyStatus,
      },
    });

    // Start assessment timer if not already started
    if (currentAssessment?.metadata.status === 'draft') {
      startAssessment();
    }

    // Save and navigate
    await saveCurrentAssessment();
    navigation.navigate('PropertyDetails');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Customer Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Customer Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter customer name"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Georgia Power Account Number <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="Enter account number"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Service Address <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter street address"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 2 }]}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="City"
              autoCapitalize="words"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              value={state}
              onChangeText={setState}
              placeholder="GA"
              autoCapitalize="characters"
              maxLength={2}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>ZIP Code</Text>
          <TextInput
            style={styles.input}
            value={zipCode}
            onChangeText={setZipCode}
            placeholder="Enter ZIP code"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="(555) 123-4567"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="customer@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.sectionTitle}>Property Details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Type</Text>
          <View style={styles.radioGroup}>
            {Object.values(PropertyType).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.radioButton,
                  propertyType === type && styles.radioButtonSelected,
                ]}
                onPress={() => setPropertyType(type)}
              >
                <Icon
                  name={propertyType === type ? 'radio-button-checked' : 'radio-button-unchecked'}
                  size={24}
                  color={propertyType === type ? '#0066CC' : '#999'}
                />
                <Text
                  style={[
                    styles.radioText,
                    propertyType === type && styles.radioTextSelected,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Property Status</Text>
          <View style={styles.radioGroup}>
            {Object.values(PropertyStatus).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.radioButton,
                  propertyStatus === status && styles.radioButtonSelected,
                ]}
                onPress={() => setPropertyStatus(status)}
              >
                <Icon
                  name={propertyStatus === status ? 'radio-button-checked' : 'radio-button-unchecked'}
                  size={24}
                  color={propertyStatus === status ? '#0066CC' : '#999'}
                />
                <Text
                  style={[
                    styles.radioText,
                    propertyStatus === status && styles.radioTextSelected,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {propertyStatus === PropertyStatus.RENTER && (
          <View style={styles.warningBox}>
            <Icon name="warning" size={20} color="#FF9800" />
            <Text style={styles.warningText}>
              Note: HEIP rebates are only available for homeowners. Renters are not eligible.
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next: Property Details</Text>
          <Icon name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#F44336',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  radioGroup: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
  },
  radioButtonSelected: {
    backgroundColor: '#E3F2FD',
  },
  radioText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  radioTextSelected: {
    color: '#0066CC',
    fontWeight: '600',
  },
  warningBox: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    padding: 15,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#E65100',
    marginLeft: 10,
  },
  nextButton: {
    backgroundColor: '#0066CC',
    padding: 18,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default CustomerInfoScreen;
