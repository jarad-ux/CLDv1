/**
 * Complete TypeScript data model for HEIP-compliant Home Energy Assessment
 * Mirrors the Georgia Power HEIP Compliance Document structure
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export enum PropertyType {
  SINGLE_FAMILY = 'Single Family',
  TOWNHOME = 'Townhome',
  OTHER = 'Other',
}

export enum PropertyStatus {
  HOMEOWNER = 'Homeowner',
  RENTER = 'Renter',
}

export enum HVACType {
  GAS_FURNACE_AC = 'Gas Furnace + AC',
  ELECTRIC_FURNACE_AC = 'Electric Furnace + AC',
  HEAT_PUMP = 'Heat Pump',
  MINI_SPLIT = 'Mini Split',
  BOILER = 'Boiler',
  OTHER = 'Other',
}

export enum WaterHeaterType {
  GAS_TANK = 'Gas Tank',
  ELECTRIC_TANK = 'Electric Tank',
  GAS_TANKLESS = 'Gas Tankless',
  ELECTRIC_TANKLESS = 'Electric Tankless',
  HEAT_PUMP = 'Heat Pump Water Heater',
  OTHER = 'Other',
}

export enum AgeRange {
  LESS_THAN_5 = '0-5 years',
  FIVE_TO_10 = '6-10 years',
  ELEVEN_TO_15 = '11-15 years',
  SIXTEEN_TO_20 = '16-20 years',
  OVER_20 = 'Over 20 years',
  UNKNOWN = 'Unknown',
}

export enum InsulationType {
  FIBERGLASS_BATT = 'Fiberglass Batt',
  BLOWN_FIBERGLASS = 'Blown Fiberglass',
  BLOWN_CELLULOSE = 'Blown Cellulose',
  SPRAY_FOAM = 'Spray Foam',
  RIGID_FOAM = 'Rigid Foam',
  NONE = 'None/Unknown',
}

export enum InsulationRValue {
  NONE = 'None/R-0',
  R_0_TO_10 = 'R-0 to R-10',
  R_11_TO_19 = 'R-11 to R-19',
  R_20_TO_30 = 'R-20 to R-30',
  R_31_TO_38 = 'R-31 to R-38',
  R_39_PLUS = 'R-39+',
}

export enum WindowType {
  SINGLE_PANE = 'Single Pane',
  DOUBLE_PANE = 'Double Pane',
  TRIPLE_PANE = 'Triple Pane',
  ENERGY_STAR = 'ENERGY STAR',
  MIXED = 'Mixed',
}

export enum Condition {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor',
  FAILING = 'Failing',
}

export enum FoundationType {
  SLAB = 'Slab',
  CRAWLSPACE = 'Crawlspace',
  BASEMENT = 'Basement',
  PIER_BEAM = 'Pier & Beam',
}

export enum RebateProgram {
  HEIP = 'Georgia Power HEIP',
  HEAR = 'Georgia HEAR',
  HER = 'Georgia HER',
  HOPEWORKS = 'HopeWorks',
  EASE = 'EASE',
}

export enum HEIPPathway {
  INDIVIDUAL = 'Individual Improvements',
  WHOLE_HOUSE = 'Whole House',
}

export enum PhotoCategory {
  HVAC_NAMEPLATE = 'HVAC System Nameplate',
  WATER_HEATER_NAMEPLATE = 'Water Heater Nameplate',
  ATTIC_INSULATION = 'Attic Insulation',
  FOUNDATION_CRAWLSPACE = 'Foundation/Crawlspace',
  WINDOWS_DOORS_EXTERIOR = 'Windows & Doors Exterior',
  ROOM_INTERIOR = 'Room Interior',
  EXTERIOR_HOME = 'Exterior Home',
}

// ============================================================================
// CORE INTERFACES
// ============================================================================

export interface Photo {
  id: string;
  category: PhotoCategory;
  uri: string; // Local file path or cloud URL
  uploadedToCloud: boolean;
  cloudUrl?: string;
  timestamp: Date;
  caption?: string;
  required: boolean;
}

export interface Signature {
  id: string;
  type: 'customer' | 'advisor';
  signatureDataUrl: string; // Base64 encoded signature image
  printedName: string;
  timestamp: Date;
  ipAddress?: string;
}

export interface CustomerInfo {
  name: string;
  georgiaPowerAccountNumber: string;
  serviceAddress: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  email?: string;
  propertyType: PropertyType;
  propertyStatus: PropertyStatus;
}

export interface AssessmentMetadata {
  id: string; // Format: ABC-YYYYMMDD-XXXXX
  assessmentDate: Date;
  startTime: Date;
  endTime?: Date;
  durationMinutes?: number;
  meetsMinimumDuration: boolean; // Must be 90+ minutes for HEIP
  contractorName: string;
  contractorLicense: string;
  contractorId: string;
  contractorPhone: string;
  contractorWebsite?: string;
  advisorName: string;
  advisorSignature?: Signature;
  customerSignature?: Signature;
  assessmentCost: number; // Default $150
  status: 'draft' | 'in_progress' | 'completed' | 'submitted';
  createdAt: Date;
  updatedAt: Date;
  syncedToCloud: boolean;
}

export interface EnergyBillsDiscussion {
  currentMonthlyElectricBill: string;
  summerAverage: string;
  winterAverage: string;
  billTrend: 'Increasing' | 'Decreasing' | 'Stable' | 'Unknown';
  hasGasBill?: boolean;
  gasMonthlyAverage?: string;
}

export interface ComfortConcerns {
  hotAreas: string[];
  coldAreas: string[];
  draftLocations: string[];
  overallComfortLevel: 'Very Comfortable' | 'Comfortable' | 'Some Issues' | 'Uncomfortable' | 'Very Uncomfortable';
  additionalNotes?: string;
}

export interface HVACSystem {
  type: HVACType;
  age: AgeRange;
  makeModel: string;
  seerRating: string;
  capacity?: string; // e.g., "3 Ton"
  condition: Condition;
  conditionNotes?: string;
  nameplatePhotoId?: string;
}

export interface WaterHeater {
  type: WaterHeaterType;
  age: AgeRange;
  makeModel: string;
  uef?: string; // Uniform Energy Factor
  capacity: string; // e.g., "50 gallons"
  condition: Condition;
  conditionNotes?: string;
  nameplatePhotoId?: string;
}

export interface InsulationEnvelope {
  atticInsulationRValue: InsulationRValue;
  atticInsulationType: InsulationType;
  atticDepthInches: string;
  atticAirLeaksNotes?: string;
  foundationType: FoundationType;
  foundationInsulated: boolean;
  foundationInsulationRValue?: string;
  wallInsulated: boolean;
  wallInsulationRValue?: string;
}

export interface WindowsDoors {
  windowCount: number;
  windowType: WindowType;
  windowCondition: Condition;
  doorCount: number;
  doorCondition: Condition;
  stormWindowsPresent: boolean;
  stormDoorsPresent: boolean;
}

export interface DuctSystem {
  ductTestPerformed: boolean;
  cfm25Result?: number;
  ductCondition?: Condition;
  ductConditionNotes?: string;
  ductLocation?: string; // e.g., "Attic", "Crawlspace"
  ductInsulated?: boolean;
}

export interface RoomFinding {
  id: string;
  roomName: string;
  comfortIssues: string[];
  windowCount: number;
  doorCount: number;
  ventCount: number;
  lightingType: string;
  additionalNotes?: string;
  photoIds: string[];
}

export interface RecommendedMeasure {
  id: string;
  measureType: 'hvac' | 'water_heater' | 'insulation' | 'air_sealing' | 'duct_sealing' | 'windows' | 'doors' | 'thermostat';
  name: string;
  description: string;
  recommended: boolean;
  heipRebateAmount: number;
  hearRebateAmount?: number;
  herRebateAmount?: number;
  federalTaxCredit25C: number;
  estimatedCost?: number;
  estimatedSavingsAnnual?: string;
  requirementsNotes?: string;
}

export interface RebateCalculation {
  selectedStateProgram: RebateProgram;
  heipPathway?: HEIPPathway;
  totalHEIPRebate: number;
  totalHEARRebate: number;
  totalHERRebate: number;
  totalFederalTaxCredit: number;
  maxCombinedSavings: number;
  programRestrictionNotes: string;
}

export interface CustomerAcknowledgment {
  receivedComprehensiveAssessment: boolean;
  discussedEnergyBills: boolean;
  understandsRecommendations: boolean;
  receivedRebateInformation: boolean;
  understandsStateProgramExclusive: boolean;
  paidAssessmentFee: boolean;
  allPhotosSubmitted: boolean;
  acknowledgedAt?: Date;
}

// ============================================================================
// MAIN ASSESSMENT INTERFACE
// ============================================================================

export interface Assessment {
  // Section 1: Customer & Property
  customer: CustomerInfo;

  // Section 2: Assessment Summary & Metadata
  metadata: AssessmentMetadata;

  // Photos (mandatory requirements)
  photos: Photo[];
  photoChecklist: {
    hvacNameplate: boolean;
    waterHeaterNameplate: boolean;
    atticInsulation: boolean; // Min 3 photos
    foundationCrawlspace: boolean; // Min 3 photos
    windowsDoorsExterior: boolean;
    roomInterior: boolean; // Min 3 rooms
    exteriorHome: boolean; // Before/after
  };

  // Section 3: Room-by-Room Findings
  roomFindings: RoomFinding[]; // Minimum 3 rooms required

  // Section 6: Customer Consultation Summary
  energyBills: EnergyBillsDiscussion;
  comfortConcerns: ComfortConcerns;
  hvacSystem: HVACSystem;
  waterHeater: WaterHeater;
  insulationEnvelope: InsulationEnvelope;
  windowsDoors: WindowsDoors;
  ductSystem: DuctSystem;

  // Section 4 & 5: Recommendations & Rebates
  recommendedMeasures: RecommendedMeasure[];
  rebateCalculation: RebateCalculation;

  // Section 7: Acknowledgment & Signatures
  customerAcknowledgment: CustomerAcknowledgment;
  signatures: Signature[];

  // PDF Generation
  generatedPdfUrl?: string;
  pdfGeneratedAt?: Date;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const HEIP_REQUIREMENTS = {
  MINIMUM_DURATION_MINUTES: 90,
  MINIMUM_ROOMS: 3,
  MINIMUM_ATTIC_PHOTOS: 3,
  MINIMUM_FOUNDATION_PHOTOS: 3,
  MINIMUM_ROOM_PHOTOS: 3,
  ASSESSMENT_COST: 150,
  HEIP_INDIVIDUAL_MAX: 750,
  HEIP_WHOLE_HOUSE_MAX: 1250,
};

export const MEASURE_REBATES = {
  HEIP: {
    HEAT_PUMP_HVAC: 1000,
    HEAT_PUMP_WATER_HEATER: 500,
    ATTIC_INSULATION: 250,
    WALL_INSULATION: 200,
    AIR_SEALING: 300,
    DUCT_SEALING: 300,
    WINDOWS: 250,
    DOORS: 150,
    SMART_THERMOSTAT: 75,
  },
  FEDERAL_25C: {
    HEAT_PUMP_HVAC: 2000,
    HEAT_PUMP_WATER_HEATER: 2000,
    INSULATION_AIR_SEALING: 1200,
    WINDOWS: 600,
    DOORS: 500,
    ELECTRICAL_PANEL: 600,
    HOME_ENERGY_AUDIT: 150,
  },
  HEAR_MAX: 14000,
  HER_MAX: 8000,
};
