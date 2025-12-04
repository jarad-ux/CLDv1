/**
 * Photos Screen
 * Step 11: Capture and manage required HEIP photos
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AssessmentFlowParamList } from '@/navigation/AssessmentFlowNavigator';
import { useAssessmentStore } from '@/store/assessmentStore';
import { Photo, PhotoCategory, HEIP_REQUIREMENTS } from '@/models/Assessment';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { v4 as uuidv4 } from 'uuid';

type PhotosNavigationProp = StackNavigationProp<AssessmentFlowParamList, 'Photos'>;

interface Props {
  navigation: PhotosNavigationProp;
}

interface PhotoRequirement {
  category: PhotoCategory;
  title: string;
  description: string;
  minRequired: number;
  required: boolean;
}

const PHOTO_REQUIREMENTS: PhotoRequirement[] = [
  {
    category: PhotoCategory.HVAC_NAMEPLATE,
    title: 'HVAC System Nameplate',
    description: 'Clear photo of HVAC nameplate showing make, model, SEER rating',
    minRequired: 1,
    required: true,
  },
  {
    category: PhotoCategory.WATER_HEATER_NAMEPLATE,
    title: 'Water Heater Nameplate',
    description: 'Clear photo of water heater nameplate showing make, model, UEF',
    minRequired: 1,
    required: true,
  },
  {
    category: PhotoCategory.ATTIC_INSULATION,
    title: 'Attic Insulation',
    description: 'Multiple photos showing insulation depth and coverage',
    minRequired: HEIP_REQUIREMENTS.MINIMUM_ATTIC_PHOTOS,
    required: true,
  },
  {
    category: PhotoCategory.FOUNDATION_CRAWLSPACE,
    title: 'Foundation/Crawlspace',
    description: 'Photos of foundation or crawlspace condition',
    minRequired: HEIP_REQUIREMENTS.MINIMUM_FOUNDATION_PHOTOS,
    required: true,
  },
  {
    category: PhotoCategory.WINDOWS_DOORS_EXTERIOR,
    title: 'Windows & Doors (Exterior)',
    description: 'Exterior photos showing windows and doors',
    minRequired: 1,
    required: true,
  },
  {
    category: PhotoCategory.ROOM_INTERIOR,
    title: 'Room Interior',
    description: 'Photos of at least 3 different rooms',
    minRequired: HEIP_REQUIREMENTS.MINIMUM_ROOM_PHOTOS,
    required: true,
  },
  {
    category: PhotoCategory.EXTERIOR_HOME,
    title: 'Exterior Home',
    description: 'Front and back exterior photos of home',
    minRequired: 2,
    required: true,
  },
];

const PhotosScreen: React.FC<Props> = ({ navigation }) => {
  const { currentAssessment, addPhoto, removePhoto, saveCurrentAssessment } = useAssessmentStore();
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory | null>(null);

  const getPhotosForCategory = (category: PhotoCategory): Photo[] => {
    return currentAssessment?.photos.filter((p) => p.category === category) || [];
  };

  const handleTakePhoto = async (category: PhotoCategory) => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
      cameraType: 'back',
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Camera Error', result.errorMessage || 'Failed to take photo');
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    const photo: Photo = {
      id: uuidv4(),
      category,
      uri: asset.uri,
      uploadedToCloud: false,
      timestamp: new Date(),
      required: true,
    };

    addPhoto(photo);
    await saveCurrentAssessment();
  };

  const handleSelectPhoto = async (category: PhotoCategory) => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 5,
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Failed to select photo');
      return;
    }

    const assets = result.assets || [];
    for (const asset of assets) {
      if (!asset.uri) continue;

      const photo: Photo = {
        id: uuidv4(),
        category,
        uri: asset.uri,
        uploadedToCloud: false,
        timestamp: new Date(),
        required: true,
      };

      addPhoto(photo);
    }

    await saveCurrentAssessment();
  };

  const handleDeletePhoto = (photo: Photo) => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          removePhoto(photo.id);
          await saveCurrentAssessment();
        },
      },
    ]);
  };

  const handleNext = async () => {
    // Validate all required photos are captured
    const missingCategories: string[] = [];

    PHOTO_REQUIREMENTS.forEach((req) => {
      const photos = getPhotosForCategory(req.category);
      if (req.required && photos.length < req.minRequired) {
        missingCategories.push(`${req.title} (need ${req.minRequired}, have ${photos.length})`);
      }
    });

    if (missingCategories.length > 0) {
      Alert.alert(
        'Missing Required Photos',
        `Please capture the following required photos:\n\n${missingCategories.join('\n')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    await saveCurrentAssessment();
    navigation.navigate('Recommendations');
  };

  const renderPhotoCategory = (req: PhotoRequirement) => {
    const photos = getPhotosForCategory(req.category);
    const isComplete = photos.length >= req.minRequired;

    return (
      <View key={req.category} style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryHeaderLeft}>
            <Icon
              name={isComplete ? 'check-circle' : 'camera-alt'}
              size={28}
              color={isComplete ? '#4CAF50' : '#0066CC'}
            />
            <View style={styles.categoryTitleContainer}>
              <Text style={styles.categoryTitle}>{req.title}</Text>
              <Text style={styles.categoryDescription}>{req.description}</Text>
            </View>
          </View>
          <View style={styles.photoCount}>
            <Text style={[styles.photoCountText, isComplete && styles.photoCountComplete]}>
              {photos.length}/{req.minRequired}
            </Text>
          </View>
        </View>

        {photos.length > 0 && (
          <ScrollView horizontal style={styles.photoPreviewScroll} showsHorizontalScrollIndicator={false}>
            {photos.map((photo) => (
              <View key={photo.id} style={styles.photoPreview}>
                <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                <TouchableOpacity
                  style={styles.deletePhotoButton}
                  onPress={() => handleDeletePhoto(photo)}
                >
                  <Icon name="close" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.categoryActions}>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => handleTakePhoto(req.category)}
          >
            <Icon name="camera-alt" size={20} color="#fff" />
            <Text style={styles.cameraButtonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={() => handleSelectPhoto(req.category)}
          >
            <Icon name="photo-library" size={20} color="#0066CC" />
            <Text style={styles.galleryButtonText}>From Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const totalRequired = PHOTO_REQUIREMENTS.reduce((sum, req) => sum + req.minRequired, 0);
  const totalCaptured = currentAssessment?.photos.length || 0;
  const allRequiredCaptured = PHOTO_REQUIREMENTS.every(
    (req) => getPhotosForCategory(req.category).length >= req.minRequired
  );

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={styles.progressHeader}>
          <Icon name="photo-camera" size={24} color="#0066CC" />
          <Text style={styles.progressTitle}>Photo Documentation</Text>
        </View>
        <Text style={styles.progressText}>
          {totalCaptured} of {totalRequired} minimum required photos captured
        </Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min((totalCaptured / totalRequired) * 100, 100)}%`,
                backgroundColor: allRequiredCaptured ? '#4CAF50' : '#0066CC',
              },
            ]}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.infoBox}>
          <Icon name="info" size={20} color="#0066CC" />
          <Text style={styles.infoText}>
            All photos are required for HEIP compliance and will be submitted with your assessment
            report for Georgia Power verification.
          </Text>
        </View>

        {PHOTO_REQUIREMENTS.map(renderPhotoCategory)}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !allRequiredCaptured && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!allRequiredCaptured}
        >
          <Text style={styles.nextButtonText}>Next: Recommendations</Text>
          <Icon name="arrow-forward" size={24} color="#fff" />
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
  progressBar: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#0066CC',
    marginLeft: 10,
    lineHeight: 20,
  },
  categoryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 8,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  categoryTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  photoCount: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  photoCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  photoCountComplete: {
    color: '#4CAF50',
  },
  photoPreviewScroll: {
    marginVertical: 12,
  },
  photoPreview: {
    marginRight: 10,
    position: 'relative',
  },
  photoImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deletePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#F44336',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cameraButton: {
    flex: 1,
    backgroundColor: '#0066CC',
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  galleryButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0066CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryButtonText: {
    color: '#0066CC',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  nextButton: {
    backgroundColor: '#0066CC',
    padding: 18,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default PhotosScreen;
