/**
 * Assessment Store - Global state management using Zustand
 */

import { create } from 'zustand';
import { Assessment, Photo, Signature, RoomFinding } from '@/models/Assessment';
import { AssessmentService } from '@/services/AssessmentService';

interface AssessmentStore {
  // Current assessment being edited
  currentAssessment: Assessment | null;

  // List of all assessments
  assessments: Assessment[];

  // Loading and sync states
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;

  // Actions
  createNewAssessment: (advisorName: string) => Promise<void>;
  loadAssessment: (id: string) => Promise<void>;
  loadAllAssessments: () => Promise<void>;
  saveCurrentAssessment: () => Promise<void>;
  updateCurrentAssessment: (updates: Partial<Assessment>) => void;
  deleteAssessment: (id: string) => Promise<void>;

  // Photo actions
  addPhoto: (photo: Photo) => void;
  removePhoto: (photoId: string) => void;

  // Signature actions
  addSignature: (signature: Signature) => void;

  // Room findings actions
  addRoomFinding: (room: RoomFinding) => void;
  updateRoomFinding: (roomId: string, updates: Partial<RoomFinding>) => void;
  removeRoomFinding: (roomId: string) => void;

  // Duration tracking
  startAssessment: () => void;
  endAssessment: () => void;

  // Sync actions
  syncToCloud: () => Promise<void>;
  syncAllPending: () => Promise<void>;

  // Validation
  validateCurrentAssessment: () => { isValid: boolean; errors: string[]; warnings: string[] };

  // Reset
  clearCurrentAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentStore>((set, get) => ({
  currentAssessment: null,
  assessments: [],
  isLoading: false,
  isSyncing: false,
  lastSyncTime: null,

  createNewAssessment: async (advisorName: string) => {
    set({ isLoading: true });
    try {
      const newAssessment = await AssessmentService.createNewAssessment(advisorName);
      set({
        currentAssessment: newAssessment,
        isLoading: false,
      });
      await get().loadAllAssessments();
    } catch (error) {
      console.error('Error creating assessment:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  loadAssessment: async (id: string) => {
    set({ isLoading: true });
    try {
      const assessment = await AssessmentService.getAssessmentLocally(id);
      set({
        currentAssessment: assessment,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading assessment:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  loadAllAssessments: async () => {
    set({ isLoading: true });
    try {
      const assessments = await AssessmentService.getAllAssessmentsLocally();
      set({
        assessments,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading assessments:', error);
      set({ isLoading: false });
    }
  },

  saveCurrentAssessment: async () => {
    const { currentAssessment } = get();
    if (!currentAssessment) return;

    try {
      // Calculate duration and rebates before saving
      const duration = AssessmentService.calculateDuration(currentAssessment);
      currentAssessment.metadata.durationMinutes = duration;
      currentAssessment.metadata.meetsMinimumDuration = duration >= 90;

      AssessmentService.calculateTotalRebates(currentAssessment);

      await AssessmentService.saveAssessmentLocally(currentAssessment);
      await get().loadAllAssessments();
    } catch (error) {
      console.error('Error saving assessment:', error);
      throw error;
    }
  },

  updateCurrentAssessment: (updates: Partial<Assessment>) => {
    const { currentAssessment } = get();
    if (!currentAssessment) return;

    const updatedAssessment = {
      ...currentAssessment,
      ...updates,
      metadata: {
        ...currentAssessment.metadata,
        ...updates.metadata,
        updatedAt: new Date(),
      },
    };

    set({ currentAssessment: updatedAssessment });
  },

  deleteAssessment: async (id: string) => {
    try {
      await AssessmentService.deleteAssessmentLocally(id);
      await get().loadAllAssessments();

      // If we deleted the current assessment, clear it
      const { currentAssessment } = get();
      if (currentAssessment?.metadata.id === id) {
        set({ currentAssessment: null });
      }
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  },

  addPhoto: (photo: Photo) => {
    const { currentAssessment } = get();
    if (!currentAssessment) return;

    const photos = [...currentAssessment.photos, photo];

    // Update photo checklist based on category
    const photoChecklist = { ...currentAssessment.photoChecklist };
    const categoryPhotos = photos.filter(p => p.category === photo.category);

    switch (photo.category) {
      case 'HVAC System Nameplate':
        photoChecklist.hvacNameplate = true;
        break;
      case 'Water Heater Nameplate':
        photoChecklist.waterHeaterNameplate = true;
        break;
      case 'Attic Insulation':
        photoChecklist.atticInsulation = categoryPhotos.length >= 3;
        break;
      case 'Foundation/Crawlspace':
        photoChecklist.foundationCrawlspace = categoryPhotos.length >= 3;
        break;
      case 'Windows & Doors Exterior':
        photoChecklist.windowsDoorsExterior = true;
        break;
      case 'Room Interior':
        photoChecklist.roomInterior = categoryPhotos.length >= 3;
        break;
      case 'Exterior Home':
        photoChecklist.exteriorHome = true;
        break;
    }

    get().updateCurrentAssessment({ photos, photoChecklist });
  },

  removePhoto: (photoId: string) => {
    const { currentAssessment } = get();
    if (!currentAssessment) return;

    const photos = currentAssessment.photos.filter(p => p.id !== photoId);
    get().updateCurrentAssessment({ photos });
  },

  addSignature: (signature: Signature) => {
    const { currentAssessment } = get();
    if (!currentAssessment) return;

    const signatures = [...currentAssessment.signatures, signature];
    get().updateCurrentAssessment({ signatures });
  },

  addRoomFinding: (room: RoomFinding) => {
    const { currentAssessment } = get();
    if (!currentAssessment) return;

    const roomFindings = [...currentAssessment.roomFindings, room];
    get().updateCurrentAssessment({ roomFindings });
  },

  updateRoomFinding: (roomId: string, updates: Partial<RoomFinding>) => {
    const { currentAssessment } = get();
    if (!currentAssessment) return;

    const roomFindings = currentAssessment.roomFindings.map(room =>
      room.id === roomId ? { ...room, ...updates } : room
    );
    get().updateCurrentAssessment({ roomFindings });
  },

  removeRoomFinding: (roomId: string) => {
    const { currentAssessment } = get();
    if (!currentAssessment) return;

    const roomFindings = currentAssessment.roomFindings.filter(room => room.id !== roomId);
    get().updateCurrentAssessment({ roomFindings });
  },

  startAssessment: () => {
    const { currentAssessment } = get();
    if (!currentAssessment) return;

    get().updateCurrentAssessment({
      metadata: {
        ...currentAssessment.metadata,
        startTime: new Date(),
        status: 'in_progress',
      },
    });
  },

  endAssessment: () => {
    const { currentAssessment } = get();
    if (!currentAssessment) return;

    const endTime = new Date();
    const duration = Math.floor(
      (endTime.getTime() - currentAssessment.metadata.startTime.getTime()) / 60000
    );

    get().updateCurrentAssessment({
      metadata: {
        ...currentAssessment.metadata,
        endTime,
        durationMinutes: duration,
        meetsMinimumDuration: duration >= 90,
        status: 'completed',
      },
    });
  },

  syncToCloud: async () => {
    const { currentAssessment } = get();
    if (!currentAssessment) return;

    set({ isSyncing: true });
    try {
      await AssessmentService.syncAssessmentToCloud(currentAssessment);
      set({
        isSyncing: false,
        lastSyncTime: new Date(),
      });
      await get().loadAssessment(currentAssessment.metadata.id);
    } catch (error) {
      console.error('Error syncing to cloud:', error);
      set({ isSyncing: false });
      throw error;
    }
  },

  syncAllPending: async () => {
    set({ isSyncing: true });
    try {
      const result = await AssessmentService.syncAllPending();
      set({
        isSyncing: false,
        lastSyncTime: new Date(),
      });
      await get().loadAllAssessments();
      return result;
    } catch (error) {
      console.error('Error syncing all pending:', error);
      set({ isSyncing: false });
      throw error;
    }
  },

  validateCurrentAssessment: () => {
    const { currentAssessment } = get();
    if (!currentAssessment) {
      return {
        isValid: false,
        errors: ['No assessment loaded'],
        warnings: [],
      };
    }

    return AssessmentService.validateAssessment(currentAssessment);
  },

  clearCurrentAssessment: () => {
    set({ currentAssessment: null });
  },
}));
