export interface HeaderInfo {
  districtNumber: string;
  storeNumber: string;
  visitDate: string;
  merchandiserName: string;
}

export type YesNoValue = boolean | null;

export interface SelfServeCaseChecks {
  faced: boolean | null;
  tagged: boolean | null;
  setToSchematic: boolean | null;
  numberOfOOS: number | '';
  oosNotes?: string;
  culledRotated: boolean | null;
  properlyMarkedDown: boolean | null;
}

export interface FrozenDoorsChecks {
  setToSchematic: boolean | null;
  numberOfOOS: number | '';
  oosNotes?: string;
  facedAndTagged: boolean | null;
}

export interface WetDryRacksChecks {
  faced: boolean | null;
  tagged: boolean | null;
  setToSchematic: boolean | null;
  numberOfOOS: number | '';
  oosNotes?: string;
}

export interface FullServiceCaseChecks {
  setToSchematic: boolean | null;
  numberOfOOS: number | '';
  oosNotes?: string;
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
  selfServeCase: SelfServeCaseChecks;
  frozenDoorsBunkers: FrozenDoorsChecks;
  wetDryRacks: WetDryRacksChecks;
  fullServiceCase: FullServiceCaseChecks;
  perishableLinkUsed: boolean | null;
}

export interface ComplianceTrainingChecks {
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

export interface PhotoCaptureData {
  coolerFreezer: string | null;
  selfServe: string | null;
  fullServe: string | null;
  frozenDoorsBunkers: string | null;
  spiceRacks: string | null;
}

export interface ChecklistData {
  header: HeaderInfo;
  caseDepartment: CaseDepartmentChecks;
  compliance: ComplianceTrainingChecks;
  photos: PhotoCaptureData;
  generalNotes: string;
}

export interface SavedStoreVisit {
  id: string;
  savedAt: string;
  formattedDate: string;
  storeNumber: string;
  districtNumber: string;
  visitDate: string;
  merchandiserName: string;
  totalOOS: number;
  complianceYes: number;
  complianceNo: number;
  photosCount: number;
  generalNotesSnippet: string;
  data: ChecklistData;
}

