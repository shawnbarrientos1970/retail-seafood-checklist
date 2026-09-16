export interface HeaderInfo {
  districtNumber: string;
  storeNumber: string;
  visitDate: string;
  merchandiserName: string;
}

export interface SelfServeCaseChecks {
  faced: boolean;
  tagged: boolean;
  setToSchematic: boolean;
  numberOfOOS: number | '';
  oosNotes?: string;
  culledRotated: boolean;
  properlyMarkedDown: boolean;
}

export interface FrozenDoorsChecks {
  setToSchematic: boolean;
  numberOfOOS: number | '';
  oosNotes?: string;
  facedAndTagged: boolean;
}

export interface WetDryRacksChecks {
  faced: boolean;
  tagged: boolean;
  setToSchematic: boolean;
  numberOfOOS: number | '';
  oosNotes?: string;
}

export interface FullServiceCaseChecks {
  setToSchematic: boolean;
  numberOfOOS: number | '';
  oosNotes?: string;
  properDividers: boolean;
  correctSluCool: boolean;
  cookedShrimpDated: boolean;
  shellfishHarvestTags90Days: boolean;
}

export interface CaseDepartmentChecks {
  clerkScheduledAndInSeafood: boolean;
  seafoodCasePulledNightBefore: boolean;
  seafoodCaseCleanOdorFree: boolean;
  taresDoneDaily: boolean;
  deliveriesCheckedInvoice: boolean;
  regulatoryDecalsAllergens: boolean;
  selfServeCase: SelfServeCaseChecks;
  frozenDoorsBunkers: FrozenDoorsChecks;
  wetDryRacks: WetDryRacksChecks;
  fullServiceCase: FullServiceCaseChecks;
  perishableLinkUsed: boolean;
}

export interface ComplianceTrainingChecks {
  adSupport: boolean;
  coolersFreezersOrganizedDated: boolean;
  temperatureChecks: boolean;
  salesPurchasesTrackingReviewed: boolean;
  form120Submitted: boolean;
  visionProScannedProductionList: boolean;
  schematicIntegrityOnline: boolean;
  newProgramBulletinMeatSeafood: boolean;
  foodSafetyHandlingDatingPolicy: boolean;
  markDownProcedures: boolean;
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
