import { ChecklistData, SavedStoreVisit } from '../types';

export const VISIT_HISTORY_STORAGE_KEY = 'mwd_store_visit_records_history';

/**
 * Calculate summary metrics from ChecklistData
 */
export function calculateVisitMetrics(data: ChecklistData) {
  const selfServeOOS = Number(data.caseDepartment.selfServeCase.numberOfOOS) || 0;
  const frozenDoorsOOS = Number(data.caseDepartment.frozenDoorsBunkers.numberOfOOS) || 0;
  const wetDryOOS = Number(data.caseDepartment.wetDryRacks.numberOfOOS) || 0;
  const fullServeOOS = Number(data.caseDepartment.fullServiceCase.numberOfOOS) || 0;
  const totalOOS = selfServeOOS + frozenDoorsOOS + wetDryOOS + fullServeOOS;

  // Checklist items
  const caseValues = [
    data.caseDepartment.clerkScheduledAndInSeafood,
    data.caseDepartment.seafoodCasePulledNightBefore,
    data.caseDepartment.seafoodCaseCleanOdorFree,
    data.caseDepartment.taresDoneDaily,
    data.caseDepartment.deliveriesCheckedInvoice,
    data.caseDepartment.regulatoryDecalsAllergens,
    data.caseDepartment.selfServeCase.faced,
    data.caseDepartment.selfServeCase.tagged,
    data.caseDepartment.selfServeCase.setToSchematic,
    data.caseDepartment.selfServeCase.culledRotated,
    data.caseDepartment.selfServeCase.properlyMarkedDown,
    data.caseDepartment.frozenDoorsBunkers.setToSchematic,
    data.caseDepartment.frozenDoorsBunkers.facedAndTagged,
    data.caseDepartment.wetDryRacks.faced,
    data.caseDepartment.wetDryRacks.tagged,
    data.caseDepartment.wetDryRacks.setToSchematic,
    data.caseDepartment.fullServiceCase.setToSchematic,
    data.caseDepartment.fullServiceCase.properDividers,
    data.caseDepartment.fullServiceCase.correctSluCool,
    data.caseDepartment.fullServiceCase.cookedShrimpDated,
    data.caseDepartment.fullServiceCase.shellfishHarvestTags90Days,
    data.caseDepartment.perishableLinkUsed,
  ];

  const complianceValues = Object.values(data.compliance);
  const allValues = [...caseValues, ...complianceValues];

  const complianceYes = allValues.filter((v) => v === true).length;
  const complianceNo = allValues.filter((v) => v === false).length;
  const complianceBlank = allValues.filter((v) => v === null).length;

  const photosCount = Object.values(data.photos).filter((p) => Boolean(p)).length;

  return {
    totalOOS,
    complianceYes,
    complianceNo,
    complianceBlank,
    photosCount,
  };
}

/**
 * Read all saved visits from localStorage
 */
export function getSavedVisits(): SavedStoreVisit[] {
  try {
    const raw = localStorage.getItem(VISIT_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Sort most recent first
      return parsed.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
    }
  } catch (err) {
    console.warn('Failed to load store visit history from localStorage:', err);
  }
  return [];
}

/**
 * Save or update a store visit in history
 */
export function saveVisitToHistory(data: ChecklistData, existingId?: string): {
  success: boolean;
  visit: SavedStoreVisit;
  error?: string;
} {
  const metrics = calculateVisitMetrics(data);
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const storeNum = data.header.storeNumber.trim() || 'Unknown';
  const id = existingId || `visit_${Date.now()}_${storeNum.replace(/\s+/g, '_')}`;

  const visitRecord: SavedStoreVisit = {
    id,
    savedAt: now.toISOString(),
    formattedDate,
    storeNumber: storeNum,
    districtNumber: data.header.districtNumber.trim() || '—',
    visitDate: data.header.visitDate || now.toISOString().split('T')[0],
    merchandiserName: data.header.merchandiserName.trim() || '—',
    totalOOS: metrics.totalOOS,
    complianceYes: metrics.complianceYes,
    complianceNo: metrics.complianceNo,
    photosCount: metrics.photosCount,
    generalNotesSnippet: data.generalNotes.trim().slice(0, 120),
    data: JSON.parse(JSON.stringify(data)), // deep copy
  };

  const currentList = getSavedVisits();
  const existingIndex = currentList.findIndex((item) => item.id === id);

  let updatedList: SavedStoreVisit[];
  if (existingIndex >= 0) {
    updatedList = [...currentList];
    updatedList[existingIndex] = visitRecord;
  } else {
    // If there's an existing record with the same storeNumber and visitDate, update it instead of creating duplicates
    const sameStoreAndDateIdx = currentList.findIndex(
      (item) => item.storeNumber === storeNum && item.visitDate === visitRecord.visitDate
    );
    if (sameStoreAndDateIdx >= 0) {
      updatedList = [...currentList];
      visitRecord.id = currentList[sameStoreAndDateIdx].id;
      updatedList[sameStoreAndDateIdx] = visitRecord;
    } else {
      updatedList = [visitRecord, ...currentList];
    }
  }

  // Attempt to write to localStorage, with quota error fallback
  try {
    localStorage.setItem(VISIT_HISTORY_STORAGE_KEY, JSON.stringify(updatedList));
    return { success: true, visit: visitRecord };
  } catch (err) {
    console.warn('LocalStorage full, attempting quota fallback by trimming oldest photo attachments:', err);

    // Fallback: reduce photos in older visits to save space
    try {
      const streamlined = updatedList.map((item, index) => {
        if (index === 0) return item; // keep full data on most recent
        return {
          ...item,
          data: {
            ...item.data,
            photos: {
              coolerFreezer: null,
              selfServe: null,
              fullServe: null,
              frozenDoorsBunkers: null,
              spiceRacks: null,
            },
          },
        };
      });
      localStorage.setItem(VISIT_HISTORY_STORAGE_KEY, JSON.stringify(streamlined));
      return { success: true, visit: visitRecord };
    } catch (secondErr) {
      console.error('Failed to save visit record to localStorage:', secondErr);
      return {
        success: false,
        visit: visitRecord,
        error: 'Storage limit reached on device. Please clear older records.',
      };
    }
  }
}

/**
 * Delete a specific record from history
 */
export function deleteVisitFromHistory(id: string): SavedStoreVisit[] {
  const currentList = getSavedVisits();
  const updated = currentList.filter((item) => item.id !== id);
  try {
    localStorage.setItem(VISIT_HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete visit record:', err);
  }
  return updated;
}

/**
 * Clear all history records
 */
export function clearAllVisitsHistory(): void {
  try {
    localStorage.removeItem(VISIT_HISTORY_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear visit history:', err);
  }
}
