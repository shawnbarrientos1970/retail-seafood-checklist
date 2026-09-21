import { ChecklistData, SavedVisit } from '../types';

const VISITS_STORAGE_KEY = 'mwd_saved_store_visits';

export function calculateAuditStats(data: ChecklistData) {
  let passed = 0;
  let failed = 0;
  let na = 0;

  // Case department items:
  const deptBooleans = [
    data.caseDepartment.clerkScheduledAndInSeafood,
    data.caseDepartment.seafoodCasePulledNightBefore,
    data.caseDepartment.seafoodCaseCleanOdorFree,
    data.caseDepartment.taresDoneDaily,
    data.caseDepartment.deliveriesCheckedInvoice,
    data.caseDepartment.regulatoryDecalsAllergens,
    data.caseDepartment.perishableLinkUsed,
    // selfServe
    data.caseDepartment.selfServeCase.faced,
    data.caseDepartment.selfServeCase.tagged,
    data.caseDepartment.selfServeCase.setToSchematic,
    data.caseDepartment.selfServeCase.culledRotated,
    data.caseDepartment.selfServeCase.properlyMarkedDown,
    // frozen
    data.caseDepartment.frozenDoorsBunkers.setToSchematic,
    data.caseDepartment.frozenDoorsBunkers.facedAndTagged,
    // wet dry
    data.caseDepartment.wetDryRacks.faced,
    data.caseDepartment.wetDryRacks.tagged,
    data.caseDepartment.wetDryRacks.setToSchematic,
    // full service
    data.caseDepartment.fullServiceCase.setToSchematic,
    data.caseDepartment.fullServiceCase.properDividers,
    data.caseDepartment.fullServiceCase.correctSluCool,
    data.caseDepartment.fullServiceCase.cookedShrimpDated,
    data.caseDepartment.fullServiceCase.shellfishHarvestTags90Days,
  ];

  deptBooleans.forEach((val) => {
    if (val === true) passed++;
    else if (val === false) failed++;
    else na++;
  });

  // Compliance items:
  const complianceBooleans = [
    data.compliance.adSupport,
    data.compliance.coolersFreezersOrganizedDated,
    data.compliance.temperatureChecks,
    data.compliance.salesPurchasesTrackingReviewed,
    data.compliance.form120Submitted,
    data.compliance.visionProScannedProductionList,
    data.compliance.schematicIntegrityOnline,
    data.compliance.newProgramBulletinMeatSeafood,
    data.compliance.foodSafetyHandlingDatingPolicy,
    data.compliance.markDownProcedures,
  ];

  complianceBooleans.forEach((val) => {
    if (val === true) passed++;
    else if (val === false) failed++;
    else na++;
  });

  const totalAnswered = passed + failed;
  const scorePercent = totalAnswered > 0 ? Math.round((passed / totalAnswered) * 100) : 100;

  const totalOOS =
    (data.caseDepartment.selfServeCase.numberOfOOS || 0) +
    (data.caseDepartment.frozenDoorsBunkers.numberOfOOS || 0) +
    (data.caseDepartment.wetDryRacks.numberOfOOS || 0) +
    (data.caseDepartment.fullServiceCase.numberOfOOS || 0);

  return {
    passed,
    failed,
    na,
    totalAnswered,
    scorePercent,
    totalOOS,
  };
}

export function getSavedVisits(): SavedVisit[] {
  try {
    const raw = localStorage.getItem(VISITS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.warn('Error reading saved visits from localStorage:', err);
    return [];
  }
}

export function saveVisit(data: ChecklistData): SavedVisit {
  const stats = calculateAuditStats(data);
  const visits = getSavedVisits();

  // Strip or downscale photo data if localStorage is near quota
  const visitToSave: SavedVisit = {
    id: `visit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    storeNumber: data.header.storeNumber || 'N/A',
    districtNumber: data.header.districtNumber || 'N/A',
    visitDate: data.header.visitDate || new Date().toISOString().split('T')[0],
    merchandiserName: data.header.merchandiserName || 'Merchandiser',
    totalScore: stats.scorePercent,
    totalItemsChecked: stats.totalAnswered,
    passedCount: stats.passed,
    failedCount: stats.failed,
    totalOOS: stats.totalOOS,
    data: JSON.parse(JSON.stringify(data)),
  };

  const updated = [visitToSave, ...visits];

  try {
    localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    // If quota exceeded, strip photos and try again
    console.warn('Quota exceeded when saving visit, stripping heavy photos...');
    try {
      const lightweightVisits = updated.map((v) => ({
        ...v,
        data: {
          ...v.data,
          photos: {
            coolerFreezer: null,
            selfServe: null,
            fullServe: null,
            frozenDoorsBunkers: null,
            spiceRacks: null,
          },
        },
      }));
      localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(lightweightVisits));
    } catch (fallbackErr) {
      console.error('Failed to save visit to localStorage:', fallbackErr);
    }
  }

  return visitToSave;
}

export function deleteVisit(id: string): void {
  try {
    const visits = getSavedVisits();
    const filtered = visits.filter((v) => v.id !== id);
    localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Error deleting visit from localStorage:', err);
  }
}

export function clearAllVisits(): void {
  try {
    localStorage.removeItem(VISITS_STORAGE_KEY);
  } catch (err) {
    console.warn('Error clearing visits:', err);
  }
}
