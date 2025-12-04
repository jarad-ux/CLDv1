/**
 * Review Screen
 * Final review before submission
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { useAssessmentStore } from '@/store/assessmentStore';
import { PDFService } from '@/services/PDFService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';

type ReviewNavigationProp = StackNavigationProp<RootStackParamList>;

const ReviewScreen: React.FC = () => {
  const navigation = useNavigation<ReviewNavigationProp>();
  const {
    currentAssessment,
    validateCurrentAssessment,
    saveCurrentAssessment,
    syncToCloud,
    isSyncing,
  } = useAssessmentStore();

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!currentAssessment) {
    return (
      <View style={styles.container}>
        <Text>No assessment loaded</Text>
      </View>
    );
  }

  const validation = validateCurrentAssessment();

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdfPath = await PDFService.generatePDF(currentAssessment);
      await saveCurrentAssessment();

      Alert.alert(
        'PDF Generated',
        'Your HEIP assessment report has been generated successfully.',
        [
          { text: 'OK' },
          {
            text: 'Share PDF',
            onPress: () => PDFService.sharePDF(pdfPath),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSync = async () => {
    try {
      await syncToCloud();
      Alert.alert('Success', 'Assessment synced to cloud successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to sync assessment to cloud');
    }
  };

  const handleSubmit = async () => {
    if (!validation.isValid) {
      Alert.alert(
        'Validation Errors',
        `Please fix the following issues:\n\n${validation.errors.join('\n')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (validation.warnings.length > 0) {
      Alert.alert(
        'Warning',
        `The following warnings were found:\n\n${validation.warnings.join('\n')}\n\nDo you want to continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Continue',
            onPress: async () => {
              await handleGeneratePDF();
              await handleSync();

              Alert.alert(
                'Assessment Complete',
                'Your HEIP assessment has been completed and is ready for submission to Georgia Power.',
                [
                  {
                    text: 'Done',
                    onPress: () => navigation.navigate('Home'),
                  },
                ]
              );
            },
          },
        ]
      );
    } else {
      await handleGeneratePDF();
      await handleSync();

      Alert.alert(
        'Assessment Complete',
        'Your HEIP assessment has been completed and is ready for submission to Georgia Power.',
        [
          {
            text: 'Done',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    }
  };

  const duration = currentAssessment.metadata.durationMinutes || 0;
  const durationMet = currentAssessment.metadata.meetsMinimumDuration;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Icon name="assignment-turned-in" size={48} color="#0066CC" />
          <Text style={styles.title}>Assessment Review</Text>
          <Text style={styles.subtitle}>{currentAssessment.metadata.id}</Text>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.sectionTitle}>Assessment Status</Text>
          <View style={styles.statusRow}>
            <Icon
              name={durationMet ? 'check-circle' : 'warning'}
              size={24}
              color={durationMet ? '#4CAF50' : '#FF9800'}
            />
            <Text style={styles.statusText}>
              Duration: {duration} minutes {durationMet ? '(✓ Meets 90+ min requirement)' : '(⚠ Does not meet requirement)'}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Icon
              name={validation.isValid ? 'check-circle' : 'error'}
              size={24}
              color={validation.isValid ? '#4CAF50' : '#F44336'}
            />
            <Text style={styles.statusText}>
              Validation: {validation.isValid ? 'Passed' : `${validation.errors.length} errors`}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Icon
              name={currentAssessment.metadata.syncedToCloud ? 'cloud-done' : 'cloud-off'}
              size={24}
              color={currentAssessment.metadata.syncedToCloud ? '#4CAF50' : '#999'}
            />
            <Text style={styles.statusText}>
              Cloud Sync: {currentAssessment.metadata.syncedToCloud ? 'Synced' : 'Pending'}
            </Text>
          </View>
        </View>

        {validation.errors.length > 0 && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Validation Errors:</Text>
            {validation.errors.map((error, index) => (
              <Text key={index} style={styles.errorText}>• {error}</Text>
            ))}
          </View>
        )}

        {validation.warnings.length > 0 && (
          <View style={styles.warningCard}>
            <Text style={styles.warningTitle}>Warnings:</Text>
            {validation.warnings.map((warning, index) => (
              <Text key={index} style={styles.warningText}>• {warning}</Text>
            ))}
          </View>
        )}

        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Assessment Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Customer:</Text>
            <Text style={styles.summaryValue}>{currentAssessment.customer.name}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Address:</Text>
            <Text style={styles.summaryValue}>{currentAssessment.customer.serviceAddress}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Assessment Date:</Text>
            <Text style={styles.summaryValue}>
              {format(new Date(currentAssessment.metadata.assessmentDate), 'MMM d, yyyy')}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Photos Captured:</Text>
            <Text style={styles.summaryValue}>{currentAssessment.photos.length}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rooms Evaluated:</Text>
            <Text style={styles.summaryValue}>{currentAssessment.roomFindings.length}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Recommendations:</Text>
            <Text style={styles.summaryValue}>
              {currentAssessment.recommendedMeasures.filter(m => m.recommended).length}
            </Text>
          </View>
        </View>

        <View style={styles.rebateCard}>
          <Text style={styles.sectionTitle}>Potential Savings</Text>

          <View style={styles.rebateRow}>
            <Text style={styles.rebateLabel}>HEIP Rebates:</Text>
            <Text style={styles.rebateValue}>${currentAssessment.rebateCalculation.totalHEIPRebate}</Text>
          </View>

          <View style={styles.rebateRow}>
            <Text style={styles.rebateLabel}>Federal Tax Credits:</Text>
            <Text style={styles.rebateValue}>${currentAssessment.rebateCalculation.totalFederalTaxCredit}</Text>
          </View>

          <View style={[styles.rebateRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Maximum Combined:</Text>
            <Text style={styles.totalValue}>${currentAssessment.rebateCalculation.maxCombinedSavings}</Text>
          </View>
        </View>

        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={[styles.actionButton, isGeneratingPDF && styles.actionButtonDisabled]}
            onPress={handleGeneratePDF}
            disabled={isGeneratingPDF}
          >
            <Icon name="picture-as-pdf" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>
              {isGeneratingPDF ? 'Generating...' : 'Generate PDF Report'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.syncButton, isSyncing && styles.actionButtonDisabled]}
            onPress={handleSync}
            disabled={isSyncing}
          >
            <Icon name="cloud-upload" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>
              {isSyncing ? 'Syncing...' : 'Sync to Cloud'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, !validation.isValid && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isGeneratingPDF || isSyncing}
        >
          {isGeneratingPDF || isSyncing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="check-circle" size={24} color="#fff" />
              <Text style={styles.submitButtonText}>Complete & Submit</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  statusCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
    marginBottom: 5,
  },
  warningCard: {
    backgroundColor: '#FFF3E0',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: '#F57C00',
    marginBottom: 5,
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  rebateCard: {
    backgroundColor: '#E3F2FD',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  rebateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rebateLabel: {
    fontSize: 14,
    color: '#0066CC',
  },
  rebateValue: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#0066CC',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  actionsCard: {
    margin: 15,
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#0066CC',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionButtonDisabled: {
    backgroundColor: '#ccc',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  syncButton: {
    backgroundColor: '#4CAF50',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ReviewScreen;
