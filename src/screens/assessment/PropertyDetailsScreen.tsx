/**
 * Property Details Screen - Step 2
 * Confirm and expand property information
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AssessmentFlowParamList } from '@/navigation/AssessmentFlowNavigator';
import { useAssessmentStore } from '@/store/assessmentStore';
import {
  StepperHeader,
  Card,
  SectionHeader,
  PrimaryButton,
} from '@/components';
import { theme } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text } from 'react-native';

type PropertyDetailsNavigationProp = StackNavigationProp<AssessmentFlowParamList, 'PropertyDetails'>;

interface Props {
  navigation: PropertyDetailsNavigationProp;
}

const PropertyDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const { currentAssessment, saveCurrentAssessment } = useAssessmentStore();

  const handleNext = async () => {
    // Just confirm and proceed - main property details were collected in CustomerInfo
    await saveCurrentAssessment();
    navigation.navigate('EnergyBills');
  };

  if (!currentAssessment) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StepperHeader
        currentStep={2}
        totalSteps={15}
        title="Property Confirmation"
        subtitle="Review property details"
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card>
            <SectionHeader
              title="Property Summary"
              icon="home"
              iconColor={theme.colors.primary.main}
              subtitle="Confirm these details are correct"
            />

            <View style={styles.infoRow}>
              <Icon name="location-on" size={20} color={theme.colors.text.secondary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{currentAssessment.customer.serviceAddress}</Text>
                {currentAssessment.customer.city && (
                  <Text style={styles.infoValue}>
                    {currentAssessment.customer.city}, {currentAssessment.customer.state} {currentAssessment.customer.zipCode}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="business" size={20} color={theme.colors.text.secondary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Property Type</Text>
                <Text style={styles.infoValue}>{currentAssessment.customer.propertyType}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="person" size={20} color={theme.colors.text.secondary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={styles.infoValue}>{currentAssessment.customer.propertyStatus}</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.cardSpacing}>
            <SectionHeader
              title="Assessment Timer"
              icon="timer"
              iconColor={theme.colors.secondary.main}
            />

            <View style={styles.timerInfo}>
              <Icon name="schedule" size={32} color={theme.colors.primary.main} />
              <View style={styles.timerText}>
                <Text style={styles.timerLabel}>Assessment Started</Text>
                <Text style={styles.timerValue}>
                  {new Date(currentAssessment.metadata.startTime).toLocaleTimeString()}
                </Text>
                <Text style={styles.timerNote}>
                  HEIP requires a minimum 90-minute assessment
                </Text>
              </View>
            </View>
          </Card>

          {currentAssessment.customer.propertyStatus === 'Renter' && (
            <Card style={styles.cardSpacing} padding="md">
              <View style={styles.warningBox}>
                <Icon name="warning" size={24} color={theme.colors.warning} />
                <Text style={styles.warningText}>
                  Note: HEIP rebates are only available for homeowners. Renters are not eligible for HEIP rebates, but may qualify for other programs.
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Next: Energy Bills"
          onPress={handleNext}
          icon="arrow-forward"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  cardSpacing: {
    marginTop: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  infoTextContainer: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  timerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.secondary.light + '20',
    borderRadius: theme.borderRadius.md,
  },
  timerText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  timerLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  timerValue: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: 4,
  },
  timerNote: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.warning + '15',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  warningText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  footer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
});

export default PropertyDetailsScreen;
