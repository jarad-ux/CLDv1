/**
 * Home Screen
 * Main landing screen for the HEIP Assessment App
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { useAssessmentStore } from '@/store/assessmentStore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const {
    createNewAssessment,
    loadAllAssessments,
    assessments,
    syncAllPending,
    isSyncing,
    lastSyncTime,
  } = useAssessmentStore();

  useEffect(() => {
    loadAllAssessments();
  }, []);

  const handleStartNewAssessment = async () => {
    try {
      // In production, you'd get the advisor name from auth/login
      const advisorName = 'Energy Advisor'; // Placeholder

      await createNewAssessment(advisorName);
      navigation.navigate('AssessmentFlow');
    } catch (error) {
      Alert.alert('Error', 'Failed to create new assessment');
    }
  };

  const handleSync = async () => {
    try {
      const result = await syncAllPending();
      Alert.alert(
        'Sync Complete',
        `Successfully synced ${result.success} assessments. ${result.failed} failed.`
      );
    } catch (error) {
      Alert.alert('Sync Error', 'Failed to sync assessments');
    }
  };

  const draftAssessments = assessments.filter(a => a.metadata.status === 'draft' || a.metadata.status === 'in_progress');
  const completedAssessments = assessments.filter(a => a.metadata.status === 'completed');
  const pendingSyncCount = assessments.filter(a => !a.metadata.syncedToCloud).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Go Eco Energy Solutions</Text>
        <Text style={styles.subtitle}>Georgia Power HEIP Assessment</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="assignment" size={32} color="#0066CC" />
          <Text style={styles.statNumber}>{assessments.length}</Text>
          <Text style={styles.statLabel}>Total Assessments</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="edit" size={32} color="#FF9800" />
          <Text style={styles.statNumber}>{draftAssessments.length}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="check-circle" size={32} color="#4CAF50" />
          <Text style={styles.statNumber}>{completedAssessments.length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleStartNewAssessment}
      >
        <Icon name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.primaryButtonText}>Start New Assessment</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('AssessmentList')}
      >
        <Icon name="list" size={24} color="#0066CC" />
        <Text style={styles.secondaryButtonText}>View All Assessments</Text>
      </TouchableOpacity>

      <View style={styles.syncSection}>
        <View style={styles.syncHeader}>
          <Icon name="cloud" size={20} color="#666" />
          <Text style={styles.syncTitle}>Cloud Sync</Text>
        </View>
        {pendingSyncCount > 0 && (
          <Text style={styles.syncWarning}>
            {pendingSyncCount} assessment{pendingSyncCount > 1 ? 's' : ''} pending sync
          </Text>
        )}
        {lastSyncTime && (
          <Text style={styles.syncTime}>
            Last synced: {format(lastSyncTime, 'MMM d, yyyy h:mm a')}
          </Text>
        )}
        <TouchableOpacity
          style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
          onPress={handleSync}
          disabled={isSyncing}
        >
          <Icon name="sync" size={20} color="#fff" />
          <Text style={styles.syncButtonText}>
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>HEIP Assessment Requirements</Text>
        <View style={styles.infoItem}>
          <Icon name="check" size={20} color="#4CAF50" />
          <Text style={styles.infoText}>Minimum 90-minute assessment</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="check" size={20} color="#4CAF50" />
          <Text style={styles.infoText}>Room-by-room evaluation (min 3 rooms)</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="check" size={20} color="#4CAF50" />
          <Text style={styles.infoText}>Mandatory photo documentation</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="check" size={20} color="#4CAF50" />
          <Text style={styles.infoText}>Customer & advisor signatures</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#0066CC',
    margin: 15,
    padding: 18,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 18,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0066CC',
  },
  secondaryButtonText: {
    color: '#0066CC',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  syncSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  syncTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  syncWarning: {
    color: '#FF9800',
    fontSize: 14,
    marginBottom: 5,
  },
  syncTime: {
    color: '#666',
    fontSize: 12,
    marginBottom: 10,
  },
  syncButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncButtonDisabled: {
    backgroundColor: '#ccc',
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
});

export default HomeScreen;
