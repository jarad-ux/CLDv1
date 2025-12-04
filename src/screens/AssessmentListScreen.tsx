/**
 * Assessment List Screen
 * Displays all assessments with search and filter
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { useAssessmentStore } from '@/store/assessmentStore';
import { Assessment } from '@/models/Assessment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';

type AssessmentListNavigationProp = StackNavigationProp<RootStackParamList, 'AssessmentList'>;

interface Props {
  navigation: AssessmentListNavigationProp;
}

const AssessmentListScreen: React.FC<Props> = ({ navigation }) => {
  const { assessments, loadAllAssessments, loadAssessment, deleteAssessment } = useAssessmentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    loadAllAssessments();
  }, []);

  useEffect(() => {
    // Filter assessments based on search query
    if (searchQuery.trim() === '') {
      setFilteredAssessments(assessments);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = assessments.filter(
        a =>
          a.customer.name.toLowerCase().includes(query) ||
          a.customer.serviceAddress.toLowerCase().includes(query) ||
          a.customer.georgiaPowerAccountNumber.includes(query) ||
          a.metadata.id.toLowerCase().includes(query)
      );
      setFilteredAssessments(filtered);
    }
  }, [searchQuery, assessments]);

  const handleOpenAssessment = async (assessment: Assessment) => {
    await loadAssessment(assessment.metadata.id);
    navigation.navigate('AssessmentFlow');
  };

  const handleDeleteAssessment = (assessment: Assessment) => {
    Alert.alert(
      'Delete Assessment',
      `Are you sure you want to delete assessment for ${assessment.customer.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAssessment(assessment.metadata.id);
              Alert.alert('Success', 'Assessment deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete assessment');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'in_progress':
        return '#FF9800';
      default:
        return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'check-circle';
      case 'in_progress':
        return 'edit';
      default:
        return 'description';
    }
  };

  const renderAssessmentItem = ({ item }: { item: Assessment }) => (
    <TouchableOpacity
      style={styles.assessmentCard}
      onPress={() => handleOpenAssessment(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Icon
            name={getStatusIcon(item.metadata.status)}
            size={24}
            color={getStatusColor(item.metadata.status)}
          />
          <View style={styles.headerText}>
            <Text style={styles.customerName}>{item.customer.name || 'Unnamed Customer'}</Text>
            <Text style={styles.assessmentId}>{item.metadata.id}</Text>
          </View>
        </View>
        {!item.metadata.syncedToCloud && (
          <Icon name="cloud-off" size={20} color="#FF9800" />
        )}
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Icon name="location-on" size={16} color="#666" />
          <Text style={styles.infoText} numberOfLines={1}>
            {item.customer.serviceAddress || 'No address'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="calendar-today" size={16} color="#666" />
          <Text style={styles.infoText}>
            {format(new Date(item.metadata.assessmentDate), 'MMM d, yyyy')}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="timer" size={16} color="#666" />
          <Text style={styles.infoText}>
            {item.metadata.durationMinutes
              ? `${item.metadata.durationMinutes} minutes`
              : 'In progress'}
          </Text>
          {item.metadata.meetsMinimumDuration && (
            <Icon name="check" size={16} color="#4CAF50" style={styles.checkIcon} />
          )}
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.metadata.status) }]}>
          <Text style={styles.statusText}>
            {item.metadata.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteAssessment(item);
          }}
          style={styles.deleteButton}
        >
          <Icon name="delete" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, address, or account..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="clear" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {filteredAssessments.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="assignment" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchQuery ? 'No assessments found' : 'No assessments yet'}
          </Text>
          {!searchQuery && (
            <Text style={styles.emptySubtext}>
              Tap "Start New Assessment" on the home screen to begin
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredAssessments}
          renderItem={renderAssessmentItem}
          keyExtractor={(item) => item.metadata.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    padding: 15,
  },
  assessmentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  assessmentId: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  cardBody: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  checkIcon: {
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default AssessmentListScreen;
