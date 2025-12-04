/**
 * Assessment Service - Handles all assessment data operations
 * Includes offline storage, cloud sync, and CRUD operations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { firestore, storage, COLLECTIONS, STORAGE_PATHS } from '@/config/firebase';
import { Assessment, Photo, Signature, ValidationResult, HEIP_REQUIREMENTS } from '@/models/Assessment';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  ASSESSMENTS: '@assessments',
  PENDING_SYNC: '@pending_sync',
  LAST_SYNC: '@last_sync',
};

export class AssessmentService {
  /**
   * Create a new assessment with default values
   */
  static async createNewAssessment(advisorName: string): Promise<Assessment> {
    const now = new Date();
    const assessmentId = this.generateAssessmentId();

    const newAssessment: Assessment = {
      customer: {
        name: '',
        georgiaPowerAccountNumber: '',
        serviceAddress: '',
        propertyType: 'Single Family' as any,
        propertyStatus: 'Homeowner' as any,
      },
      metadata: {
        id: assessmentId,
        assessmentDate: now,
        startTime: now,
        meetsMinimumDuration: false,
        contractorName: 'Go Eco Energy Solutions',
        contractorLicense: 'BPI Certified',
        contractorId: '[LICENSE NUMBER]',
        contractorPhone: '(555) 123-4567',
        contractorWebsite: 'ecoenergysolutions.org',
        advisorName,
        assessmentCost: HEIP_REQUIREMENTS.ASSESSMENT_COST,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
        syncedToCloud: false,
      },
      photos: [],
      photoChecklist: {
        hvacNameplate: false,
        waterHeaterNameplate: false,
        atticInsulation: false,
        foundationCrawlspace: false,
        windowsDoorsExterior: false,
        roomInterior: false,
        exteriorHome: false,
      },
      roomFindings: [],
      energyBills: {
        currentMonthlyElectricBill: '',
        summerAverage: '',
        winterAverage: '',
        billTrend: 'Unknown',
      },
      comfortConcerns: {
        hotAreas: [],
        coldAreas: [],
        draftLocations: [],
        overallComfortLevel: 'Some Issues',
      },
      hvacSystem: {
        type: 'Gas Furnace + AC' as any,
        age: 'Unknown' as any,
        makeModel: '',
        seerRating: '',
        condition: 'Fair' as any,
      },
      waterHeater: {
        type: 'Gas Tank' as any,
        age: 'Unknown' as any,
        makeModel: '',
        capacity: '50 gallons',
        condition: 'Fair' as any,
      },
      insulationEnvelope: {
        atticInsulationRValue: 'R-11 to R-19' as any,
        atticInsulationType: 'None/Unknown' as any,
        atticDepthInches: '1-3 inches',
        foundationType: 'Slab' as any,
        foundationInsulated: false,
        wallInsulated: false,
      },
      windowsDoors: {
        windowCount: 0,
        windowType: 'Double Pane' as any,
        windowCondition: 'Fair' as any,
        doorCount: 0,
        doorCondition: 'Fair' as any,
        stormWindowsPresent: false,
        stormDoorsPresent: false,
      },
      ductSystem: {
        ductTestPerformed: false,
      },
      recommendedMeasures: this.getDefaultRecommendedMeasures(),
      rebateCalculation: {
        selectedStateProgram: 'Georgia Power HEIP' as any,
        heipPathway: 'Individual Improvements' as any,
        totalHEIPRebate: 0,
        totalHEARRebate: 0,
        totalHERRebate: 0,
        totalFederalTaxCredit: 0,
        maxCombinedSavings: 0,
        programRestrictionNotes: 'State programs are mutually exclusive - choose only ONE state program, but you CAN stack with federal tax credits.',
      },
      customerAcknowledgment: {
        receivedComprehensiveAssessment: false,
        discussedEnergyBills: false,
        understandsRecommendations: false,
        receivedRebateInformation: false,
        understandsStateProgramExclusive: false,
        paidAssessmentFee: false,
        allPhotosSubmitted: false,
      },
      signatures: [],
    };

    // Save to local storage
    await this.saveAssessmentLocally(newAssessment);

    return newAssessment;
  }

  /**
   * Generate unique assessment ID in format: ABC-YYYYMMDD-XXXXX
   */
  static generateAssessmentId(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');

    return `ABC-${year}${month}${day}-${random}`;
  }

  /**
   * Get default recommended measures with HEIP rebate amounts
   */
  static getDefaultRecommendedMeasures() {
    return [
      {
        id: uuidv4(),
        measureType: 'hvac' as any,
        name: 'Heat Pump HVAC',
        description: 'ENERGY STAR certified heat pump system installation',
        recommended: true,
        heipRebateAmount: 1000,
        federalTaxCredit25C: 2000,
        requirementsNotes: 'ENERGY STAR certified',
      },
      {
        id: uuidv4(),
        measureType: 'water_heater' as any,
        name: 'Heat Pump Water Heater',
        description: 'ENERGY STAR heat pump water heater (UEF ≥2.0)',
        recommended: true,
        heipRebateAmount: 500,
        federalTaxCredit25C: 2000,
        requirementsNotes: 'UEF ≥2.0',
      },
      {
        id: uuidv4(),
        measureType: 'insulation' as any,
        name: 'Attic Insulation',
        description: 'Attic insulation upgrade (if existing < R-11)',
        recommended: true,
        heipRebateAmount: 250,
        federalTaxCredit25C: 1200,
        requirementsNotes: 'Existing must be < R-11',
      },
      {
        id: uuidv4(),
        measureType: 'insulation' as any,
        name: 'Wall Insulation',
        description: 'Wall insulation installation',
        recommended: true,
        heipRebateAmount: 200,
        federalTaxCredit25C: 1200,
      },
      {
        id: uuidv4(),
        measureType: 'air_sealing' as any,
        name: 'Air Sealing',
        description: 'Whole-home air sealing (requires 20% CFM50 reduction)',
        recommended: true,
        heipRebateAmount: 300,
        federalTaxCredit25C: 1200,
        requirementsNotes: 'Requires 20% CFM50 reduction',
      },
      {
        id: uuidv4(),
        measureType: 'duct_sealing' as any,
        name: 'Duct Sealing',
        description: 'Duct sealing and insulation (requires 30% CFM reduction)',
        recommended: true,
        heipRebateAmount: 300,
        federalTaxCredit25C: 0,
        requirementsNotes: 'Requires 30% CFM reduction',
      },
      {
        id: uuidv4(),
        measureType: 'windows' as any,
        name: 'Windows',
        description: 'ENERGY STAR certified windows replacement',
        recommended: true,
        heipRebateAmount: 250,
        federalTaxCredit25C: 600,
        requirementsNotes: 'ENERGY STAR certified',
      },
      {
        id: uuidv4(),
        measureType: 'doors' as any,
        name: 'Doors',
        description: 'ENERGY STAR certified exterior doors',
        recommended: true,
        heipRebateAmount: 150,
        federalTaxCredit25C: 500,
        requirementsNotes: 'ENERGY STAR certified',
      },
      {
        id: uuidv4(),
        measureType: 'thermostat' as any,
        name: 'Smart Thermostat',
        description: 'Smart thermostat installation (through GP Marketplace)',
        recommended: true,
        heipRebateAmount: 75,
        federalTaxCredit25C: 0,
        requirementsNotes: 'Through GP Marketplace',
      },
    ];
  }

  /**
   * Save assessment to local storage
   */
  static async saveAssessmentLocally(assessment: Assessment): Promise<void> {
    try {
      // Update timestamp
      assessment.metadata.updatedAt = new Date();

      // Get existing assessments
      const assessments = await this.getAllAssessmentsLocally();

      // Update or add assessment
      const index = assessments.findIndex(a => a.metadata.id === assessment.metadata.id);
      if (index >= 0) {
        assessments[index] = assessment;
      } else {
        assessments.push(assessment);
      }

      // Save to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));

      // Add to sync queue if not synced
      if (!assessment.metadata.syncedToCloud) {
        await this.addToSyncQueue(assessment.metadata.id);
      }
    } catch (error) {
      console.error('Error saving assessment locally:', error);
      throw error;
    }
  }

  /**
   * Get all assessments from local storage
   */
  static async getAllAssessmentsLocally(): Promise<Assessment[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting assessments locally:', error);
      return [];
    }
  }

  /**
   * Get single assessment by ID from local storage
   */
  static async getAssessmentLocally(id: string): Promise<Assessment | null> {
    try {
      const assessments = await this.getAllAssessmentsLocally();
      return assessments.find(a => a.metadata.id === id) || null;
    } catch (error) {
      console.error('Error getting assessment locally:', error);
      return null;
    }
  }

  /**
   * Delete assessment from local storage
   */
  static async deleteAssessmentLocally(id: string): Promise<void> {
    try {
      const assessments = await this.getAllAssessmentsLocally();
      const filtered = assessments.filter(a => a.metadata.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting assessment locally:', error);
      throw error;
    }
  }

  /**
   * Add assessment to sync queue
   */
  static async addToSyncQueue(assessmentId: string): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
      const queue: string[] = data ? JSON.parse(data) : [];

      if (!queue.includes(assessmentId)) {
        queue.push(assessmentId);
        await AsyncStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(queue));
      }
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  }

  /**
   * Sync assessment to Firestore
   */
  static async syncAssessmentToCloud(assessment: Assessment): Promise<boolean> {
    try {
      const docRef = firestore()
        .collection(COLLECTIONS.ASSESSMENTS)
        .doc(assessment.metadata.id);

      await docRef.set({
        ...assessment,
        metadata: {
          ...assessment.metadata,
          syncedToCloud: true,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
      });

      // Update local copy
      assessment.metadata.syncedToCloud = true;
      await this.saveAssessmentLocally(assessment);

      // Remove from sync queue
      await this.removeFromSyncQueue(assessment.metadata.id);

      return true;
    } catch (error) {
      console.error('Error syncing assessment to cloud:', error);
      return false;
    }
  }

  /**
   * Remove assessment from sync queue
   */
  static async removeFromSyncQueue(assessmentId: string): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
      const queue: string[] = data ? JSON.parse(data) : [];
      const filtered = queue.filter(id => id !== assessmentId);
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing from sync queue:', error);
    }
  }

  /**
   * Sync all pending assessments
   */
  static async syncAllPending(): Promise<{ success: number; failed: number }> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
      const queue: string[] = data ? JSON.parse(data) : [];

      let success = 0;
      let failed = 0;

      for (const assessmentId of queue) {
        const assessment = await this.getAssessmentLocally(assessmentId);
        if (assessment) {
          const synced = await this.syncAssessmentToCloud(assessment);
          if (synced) {
            success++;
          } else {
            failed++;
          }
        }
      }

      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

      return { success, failed };
    } catch (error) {
      console.error('Error syncing all pending:', error);
      return { success: 0, failed: 0 };
    }
  }

  /**
   * Upload photo to Firebase Storage
   */
  static async uploadPhoto(photo: Photo, assessmentId: string): Promise<string> {
    try {
      const reference = storage().ref(
        STORAGE_PATHS.PHOTOS(assessmentId, photo.id)
      );

      await reference.putFile(photo.uri);
      const downloadUrl = await reference.getDownloadURL();

      return downloadUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  }

  /**
   * Upload signature to Firebase Storage
   */
  static async uploadSignature(signature: Signature, assessmentId: string): Promise<string> {
    try {
      const reference = storage().ref(
        STORAGE_PATHS.SIGNATURES(assessmentId, signature.id)
      );

      // Convert base64 to blob/file and upload
      await reference.putString(signature.signatureDataUrl, 'data_url');
      const downloadUrl = await reference.getDownloadURL();

      return downloadUrl;
    } catch (error) {
      console.error('Error uploading signature:', error);
      throw error;
    }
  }

  /**
   * Calculate assessment duration in minutes
   */
  static calculateDuration(assessment: Assessment): number {
    if (!assessment.metadata.endTime) {
      const now = new Date();
      return Math.floor((now.getTime() - assessment.metadata.startTime.getTime()) / 60000);
    }

    return Math.floor(
      (assessment.metadata.endTime.getTime() - assessment.metadata.startTime.getTime()) / 60000
    );
  }

  /**
   * Validate assessment for HEIP compliance
   */
  static validateAssessment(assessment: Assessment): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Customer info validation
    if (!assessment.customer.name) errors.push('Customer name is required');
    if (!assessment.customer.georgiaPowerAccountNumber)
      errors.push('Georgia Power account number is required');
    if (!assessment.customer.serviceAddress) errors.push('Service address is required');

    // Duration validation
    const duration = this.calculateDuration(assessment);
    if (duration < HEIP_REQUIREMENTS.MINIMUM_DURATION_MINUTES) {
      warnings.push(
        `Assessment duration (${duration} min) is less than required 90 minutes for HEIP compliance`
      );
    }

    // Photo validation
    if (!assessment.photoChecklist.hvacNameplate)
      errors.push('HVAC nameplate photo is required');
    if (!assessment.photoChecklist.waterHeaterNameplate)
      errors.push('Water heater nameplate photo is required');
    if (!assessment.photoChecklist.atticInsulation)
      errors.push('Attic insulation photos are required (minimum 3)');
    if (!assessment.photoChecklist.foundationCrawlspace)
      errors.push('Foundation/crawlspace photos are required (minimum 3)');
    if (!assessment.photoChecklist.windowsDoorsExterior)
      errors.push('Windows and doors exterior photos are required');
    if (!assessment.photoChecklist.roomInterior)
      errors.push('Room interior photos are required (minimum 3 rooms)');
    if (!assessment.photoChecklist.exteriorHome)
      errors.push('Exterior home photos are required');

    // Room findings validation
    if (assessment.roomFindings.length < HEIP_REQUIREMENTS.MINIMUM_ROOMS) {
      errors.push(`Minimum ${HEIP_REQUIREMENTS.MINIMUM_ROOMS} rooms must be evaluated`);
    }

    // Equipment validation
    if (!assessment.hvacSystem.makeModel)
      warnings.push('HVAC make/model should be documented');
    if (!assessment.waterHeater.makeModel)
      warnings.push('Water heater make/model should be documented');

    // Signature validation
    const hasCustomerSignature = assessment.signatures.some(s => s.type === 'customer');
    const hasAdvisorSignature = assessment.signatures.some(s => s.type === 'advisor');

    if (!hasCustomerSignature) errors.push('Customer signature is required');
    if (!hasAdvisorSignature) errors.push('Advisor signature is required');

    // Acknowledgment validation
    const ack = assessment.customerAcknowledgment;
    if (!ack.receivedComprehensiveAssessment || !ack.discussedEnergyBills ||
        !ack.understandsRecommendations || !ack.receivedRebateInformation ||
        !ack.understandsStateProgramExclusive || !ack.paidAssessmentFee ||
        !ack.allPhotosSubmitted) {
      errors.push('All customer acknowledgment items must be checked');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Calculate total rebates for selected measures
   */
  static calculateTotalRebates(assessment: Assessment): void {
    const selectedMeasures = assessment.recommendedMeasures.filter(m => m.recommended);

    let totalHEIP = 0;
    let totalHEAR = 0;
    let totalHER = 0;
    let totalFederal = 0;

    selectedMeasures.forEach(measure => {
      totalHEIP += measure.heipRebateAmount;
      totalHEAR += measure.hearRebateAmount || 0;
      totalHER += measure.herRebateAmount || 0;
      totalFederal += measure.federalTaxCredit25C;
    });

    // Apply HEIP pathway limits
    if (assessment.rebateCalculation.heipPathway === 'Individual Improvements') {
      totalHEIP = Math.min(totalHEIP, HEIP_REQUIREMENTS.HEIP_INDIVIDUAL_MAX);
    } else {
      totalHEIP = Math.min(totalHEIP, HEIP_REQUIREMENTS.HEIP_WHOLE_HOUSE_MAX);
    }

    // Add home energy audit credit
    totalFederal += 150; // Assessment qualifies for $150 federal tax credit

    assessment.rebateCalculation.totalHEIPRebate = totalHEIP;
    assessment.rebateCalculation.totalHEARRebate = totalHEAR;
    assessment.rebateCalculation.totalHERRebate = totalHER;
    assessment.rebateCalculation.totalFederalTaxCredit = totalFederal;

    // Calculate max combined (highest state program + federal)
    const maxStateRebate = Math.max(totalHEIP, totalHEAR, totalHER);
    assessment.rebateCalculation.maxCombinedSavings = maxStateRebate + totalFederal;
  }
}
