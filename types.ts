export interface StoreHeader {
  districtNumber: string;
  storeNumber: string;
  visitDate: string;
  merchandiserName: string;
}

export interface SelfServeCaseCheck {
  faced: boolean | null;
  tagged: boolean | null;
  setToSchematic: boolean | null;
  numberOfOOS: number;
  oosNotes: string;
  culledRotated: boolean | null;
  properlyMarkedDown: boolean | null;
}

export interface FrozenDoorsBunkersCheck {
  setToSchematic: boolean | null;
  numberOfOOS: number;
  oosDoors?: number;
  oosBunkers?: number;
  oosNotes: string;
  facedAndTagged: boolean | null;
}

export interface WetDryRacksCheck {
  faced: boolean | null;
  tagged: boolean | null;
  setToSchematic: boolean | null;
  numberOfOOS: number;
  oosNotes: string;
}

export interface FullServiceCaseCheck {
  setToSchematic: boolean | null;
  numberOfOOS: number;
  oosNotes: string;
  properDividers: boolean | null;
  correctSluCool: boolean | null;
  cookedShrimpDated: boolean | null;
  shellfishHarvestTags90Days: boolean | null;
}

export interface CaseDepartmentChecks {
  clerkScheduledAndInSeafood: boolean | null;
  seafoodCasePulledNightBefore: boolean | null;
  seafoodCaseCleanOdorFree: boolean | null;
  taresDoneDaily: boolean | null;
  deliveriesCheckedInvoice: boolean | null;
  regulatoryDecalsAllergens: boolean | null;
  decalsAllergens?: boolean | null;
  decalsColorAdded?: boolean | null;
  decalsConsumerAdvisory?: boolean | null;
  selfServeCase: SelfServeCaseCheck;
  frozenDoorsBunkers: FrozenDoorsBunkersCheck;
  wetDryRacks: WetDryRacksCheck;
  fullServiceCase: FullServiceCaseCheck;
  perishableLinkUsed: boolean | null;
}

export interface ComplianceChecks {
  adSupport: boolean | null;
  coolersFreezersOrganizedDated: boolean | null;
  temperatureChecks: boolean | null;
  salesPurchasesTrackingReviewed: boolean | null;
  form120Submitted: boolean | null;
  visionProScannedProductionList: boolean | null;
  schematicIntegrityOnline: boolean | null;
  newProgramBulletinMeatSeafood: boolean | null;
  foodSafetyHandlingDatingPolicy: boolean | null;
  markDownProcedures: boolean | null;
}

export type PhotoSlot = 'coolerFreezer' | 'selfServe' | 'fullServe' | 'frozenDoorsBunkers' | 'spiceRacks';

export interface PhotoData {
  coolerFreezer: string | null;
  selfServe: string | null;
  fullServe: string | null;
  frozenDoorsBunkers: string | null;
  spiceRacks: string | null;
}

export interface ChecklistData {
  header: StoreHeader;
  caseDepartment: CaseDepartmentChecks;
  compliance: ComplianceChecks;
  photos: PhotoData;
  generalNotes: string;
}

export interface SavedVisit {
  id: string;
  timestamp: number;
  storeNumber: string;
  districtNumber: string;
  visitDate: string;
  merchandiserName: string;
  totalScore: number;
  totalItemsChecked: number;
  passedCount: number;
  failedCount: number;
  totalOOS: number;
  data: ChecklistData;
}
