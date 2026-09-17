import React, { useState, useEffect } from 'react';
import { ChecklistData } from './types';
import { StepIndicator } from './components/StepIndicator';
import { Step1Header } from './components/Step1Header';
import { Step2CaseChecks } from './components/Step2CaseChecks';
import { Step3Compliance } from './components/Step3Compliance';
import { Step4PhotosNotes } from './components/Step4PhotosNotes';
import { Step5Summary } from './components/Step5Summary';
import { VisitHistoryModal } from './components/VisitHistoryModal';
import { PdfPreviewModal } from './components/PdfPreviewModal';
import { MountainWestLogo } from './components/MountainWestLogo';
import { ChevronLeft, ChevronRight, FileDown, ShieldCheck, RotateCcw, CheckCircle2, Share2, Clock } from 'lucide-react';
import { generateStoreVisitPDF } from './utils/pdfGenerator';
import { shareStoreVisitPDF } from './utils/pdfShare';
import { getSavedVisits } from './utils/historyStorage';

const FORM_AUTOSAVE_KEY = 'mwd_store_visit_form_state';
const STEP_AUTOSAVE_KEY = 'mwd_store_visit_current_step';

const getTodayDateString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const initialData: ChecklistData = {
  header: {
    districtNumber: '',
    storeNumber: '',
    visitDate: getTodayDateString(),
    merchandiserName: '',
  },
  caseDepartment: {
    clerkScheduledAndInSeafood: null,
    seafoodCasePulledNightBefore: null,
    seafoodCaseCleanOdorFree: null,
    taresDoneDaily: null,
    deliveriesCheckedInvoice: null,
    regulatoryDecalsAllergens: null,
    selfServeCase: {
      faced: null,
      tagged: null,
      setToSchematic: null,
      numberOfOOS: 0,
      oosNotes: '',
      culledRotated: null,
      properlyMarkedDown: null,
    },
    frozenDoorsBunkers: {
      setToSchematic: null,
      numberOfOOS: 0,
      oosNotes: '',
      facedAndTagged: null,
    },
    wetDryRacks: {
      faced: null,
      tagged: null,
      setToSchematic: null,
      numberOfOOS: 0,
      oosNotes: '',
    },
    fullServiceCase: {
      setToSchematic: null,
      numberOfOOS: 0,
      oosNotes: '',
      properDividers: null,
      correctSluCool: null,
      cookedShrimpDated: null,
      shellfishHarvestTags90Days: null,
    },
    perishableLinkUsed: null,
  },
  compliance: {
    adSupport: null,
    coolersFreezersOrganizedDated: null,
    temperatureChecks: null,
    salesPurchasesTrackingReviewed: null,
    form120Submitted: null,
    visionProScannedProductionList: null,
    schematicIntegrityOnline: null,
    newProgramBulletinMeatSeafood: null,
    foodSafetyHandlingDatingPolicy: null,
    markDownProcedures: null,
  },
  photos: {
    coolerFreezer: null,
    selfServe: null,
    fullServe: null,
    frozenDoorsBunkers: null,
    spiceRacks: null,
  },
  generalNotes: '',
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const savedStep = localStorage.getItem(STEP_AUTOSAVE_KEY);
      if (savedStep) {
        const num = parseInt(savedStep, 10);
        if (num >= 1 && num <= 5) return num;
      }
    } catch {
      // ignore
    }
    return 1;
  });
  const totalSteps = 5;

  const [data, setData] = useState<ChecklistData>(() => {
    try {
      const saved = localStorage.getItem(FORM_AUTOSAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialData,
          header: {
            ...initialData.header,
            ...(parsed.header || {}),
            visitDate: parsed.header?.visitDate || getTodayDateString(),
          },
          caseDepartment: {
            ...initialData.caseDepartment,
            ...(parsed.caseDepartment || {}),
            selfServeCase: {
              ...initialData.caseDepartment.selfServeCase,
              ...(parsed.caseDepartment?.selfServeCase || {}),
              numberOfOOS:
                typeof parsed.caseDepartment?.selfServeCase?.numberOfOOS === 'number'
                  ? parsed.caseDepartment.selfServeCase.numberOfOOS
                  : 0,
            },
            frozenDoorsBunkers: {
              ...initialData.caseDepartment.frozenDoorsBunkers,
              ...(parsed.caseDepartment?.frozenDoorsBunkers || {}),
              numberOfOOS:
                typeof parsed.caseDepartment?.frozenDoorsBunkers?.numberOfOOS === 'number'
                  ? parsed.caseDepartment.frozenDoorsBunkers.numberOfOOS
                  : 0,
            },
            wetDryRacks: {
              ...initialData.caseDepartment.wetDryRacks,
              ...(parsed.caseDepartment?.wetDryRacks || {}),
              numberOfOOS:
                typeof parsed.caseDepartment?.wetDryRacks?.numberOfOOS === 'number'
                  ? parsed.caseDepartment.wetDryRacks.numberOfOOS
                  : 0,
            },
            fullServiceCase: {
              ...initialData.caseDepartment.fullServiceCase,
              ...(parsed.caseDepartment?.fullServiceCase || {}),
              numberOfOOS:
                typeof parsed.caseDepartment?.fullServiceCase?.numberOfOOS === 'number'
                  ? parsed.caseDepartment.fullServiceCase.numberOfOOS
                  : 0,
            },
          },
          compliance: {
            ...initialData.compliance,
            ...(parsed.compliance || {}),
          },
          photos: {
            ...initialData.photos,
            ...(parsed.photos || {}),
          },
          generalNotes: typeof parsed.generalNotes === 'string' ? parsed.generalNotes : '',
        };
      }
    } catch (e) {
      console.warn('Failed to restore form state from localStorage:', e);
    }

    return {
      ...initialData,
      header: {
        ...initialData.header,
        visitDate: getTodayDateString(),
      },
    };
  });

  const [headerErrors, setHeaderErrors] = useState<Record<string, string>>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyCount, setHistoryCount] = useState<number>(() => {
    try {
      return getSavedVisits().length;
    } catch {
      return 0;
    }
  });
  const [historyPdfPreviewData, setHistoryPdfPreviewData] = useState<ChecklistData | null>(null);

  // Automatically save form state to localStorage every time an input changes
  useEffect(() => {
    try {
      localStorage.setItem(FORM_AUTOSAVE_KEY, JSON.stringify(data));
      setIsSaved(true);
    } catch (err) {
      // If photo storage quota is exceeded, safely preserve all textual & check inputs
      try {
        const dataWithoutPhotos = { ...data, photos: initialData.photos };
        localStorage.setItem(FORM_AUTOSAVE_KEY, JSON.stringify(dataWithoutPhotos));
        setIsSaved(true);
      } catch (fallbackErr) {
        console.warn('Unable to persist form state to localStorage:', fallbackErr);
      }
    }
  }, [data]);

  // Persist current wizard step to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STEP_AUTOSAVE_KEY, String(currentStep));
    } catch {
      // ignore
    }
  }, [currentStep]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!data.header.districtNumber.trim()) {
      errors.districtNumber = 'Please enter District #';
    }
    if (!data.header.storeNumber.trim()) {
      errors.storeNumber = 'Please enter Store #';
    }
    if (!data.header.merchandiserName.trim()) {
      errors.merchandiserName = 'Please enter Merchandiser Name';
    }

    setHeaderErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepSelect = (step: number) => {
    if (step > currentStep && currentStep === 1) {
      if (!validateStep1()) return;
    }
    setCurrentStep(step);
  };

  const handleResetChecklist = () => {
    try {
      localStorage.removeItem(FORM_AUTOSAVE_KEY);
      localStorage.removeItem(STEP_AUTOSAVE_KEY);
    } catch {
      // ignore
    }
    const fresh = {
      ...initialData,
      header: {
        ...initialData.header,
        visitDate: getTodayDateString(),
      },
    };
    setData(fresh);
    setCurrentStep(1);
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Mobile Division Bar */}
      <header className="sticky top-0 z-40 bg-[#091b34] text-white border-b border-blue-950/80 pt-safe no-print shadow-sm">
        <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MountainWestLogo variant="compact" />
            <div
              className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-400/90 font-medium bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md"
              title="Form inputs automatically save to your device"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Auto-saved</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {data.header.storeNumber && (
              <div className="hidden sm:block px-2.5 py-1 rounded-md bg-blue-900/60 border border-blue-700/60 text-[11px] font-mono font-bold text-sky-200">
                Store #{data.header.storeNumber}
              </div>
            )}
            <button
              type="button"
              id="top-history-btn"
              onClick={() => {
                setHistoryCount(getSavedVisits().length);
                setShowHistoryModal(true);
              }}
              className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-950/90 border border-blue-800/80 text-xs text-blue-200 hover:text-white hover:bg-blue-900/80 active:bg-blue-800 transition-colors cursor-pointer relative"
              title="View saved store visit history on this device"
            >
              <Clock className="w-3.5 h-3.5 shrink-0 text-sky-400" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-sky-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {historyCount}
                </span>
              )}
            </button>
            <button
              type="button"
              id="top-reset-checklist-btn"
              onClick={() => setShowResetConfirm(true)}
              className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-950/90 border border-blue-800/80 text-xs text-blue-200 hover:text-white hover:bg-blue-900/80 active:bg-blue-800 transition-colors cursor-pointer"
              title="Reset all checks to blank"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Progress Step Indicator */}
        <div className="max-w-md mx-auto">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            onSelectStep={handleStepSelect}
          />
        </div>
      </header>

      {/* Main Content Area (iPhone scrollable viewport with safe area clearance) */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))]">
        {currentStep === 1 && (
          <Step1Header
            data={data.header}
            onChange={(updated) => {
              setData((prev) => ({
                ...prev,
                header: { ...prev.header, ...updated },
              }));
              // Clear error if user typed
              setHeaderErrors((prev) => {
                const next = { ...prev };
                Object.keys(updated).forEach((k) => delete next[k]);
                return next;
              });
            }}
            errors={headerErrors}
          />
        )}

        {currentStep === 2 && (
          <Step2CaseChecks
            data={data.caseDepartment}
            onChange={(updater) => {
              setData((prev) => ({
                ...prev,
                caseDepartment: updater(prev.caseDepartment),
              }));
            }}
          />
        )}

        {currentStep === 3 && (
          <Step3Compliance
            data={data.compliance}
            onChange={(updater) => {
              setData((prev) => ({
                ...prev,
                compliance: updater(prev.compliance),
              }));
            }}
          />
        )}

        {currentStep === 4 && (
          <Step4PhotosNotes
            photos={data.photos}
            generalNotes={data.generalNotes}
            onUpdatePhoto={(slot, dataUrl) => {
              setData((prev) => ({
                ...prev,
                photos: {
                  ...prev.photos,
                  [slot]: dataUrl,
                },
              }));
            }}
            onUpdateNotes={(notes) => {
              setData((prev) => ({
                ...prev,
                generalNotes: notes,
              }));
            }}
          />
        )}

        {currentStep === 5 && (
          <Step5Summary
            data={data}
            onReset={() => setShowResetConfirm(true)}
            onOpenHistory={() => {
              setHistoryCount(getSavedVisits().length);
              setShowHistoryModal(true);
            }}
          />
        )}
      </main>

      {/* Bottom Sticky Action Bar (iPhone-friendly touch bar with safe-area-inset-bottom) */}
      <nav
        aria-label="Wizard navigation"
        style={{
          paddingBottom: 'max(0.75rem, calc(0.75rem + env(safe-area-inset-bottom, 0px)))',
        }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 pt-3 fixed-footer-safe no-print shadow-lg"
      >
        <div className="max-w-md mx-auto flex items-center gap-3">
          {/* Previous Button */}
          {currentStep > 1 && (
            <button
              type="button"
              id="wizard-prev-btn"
              onClick={handlePrev}
              className="flex-1 min-h-[48px] py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 font-semibold text-sm text-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {/* Next Button or Final Step Action */}
          {currentStep < totalSteps ? (
            <button
              type="button"
              id="wizard-next-btn"
              onClick={handleNext}
              className="flex-1 min-h-[48px] py-3 px-4 rounded-xl bg-[#104f9b] hover:bg-[#0c4080] active:bg-[#093264] font-bold text-sm text-white flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex-1 flex gap-2">
              <button
                type="button"
                id="wizard-quick-share-btn"
                onClick={() => shareStoreVisitPDF(data)}
                className="flex-1 min-h-[48px] py-3 px-3 rounded-xl bg-[#104f9b] hover:bg-[#0c4080] active:bg-[#093264] font-bold text-sm text-white flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                type="button"
                id="wizard-quick-pdf-btn"
                onClick={() => {
                  const doc = generateStoreVisitPDF(data);
                  const fileName = `MountainWest_Store${data.header.storeNumber || 'Checklist'}_${data.header.visitDate || 'Visit'}.pdf`;
                  doc.save(fileName);
                }}
                className="min-h-[48px] px-3.5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 font-semibold text-xs text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Download PDF directly"
              >
                <FileDown className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 pb-[max(1rem,calc(1rem+env(safe-area-inset-bottom,0px)))] backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 text-center shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Start New Visit?</h3>
              <p className="text-xs text-slate-500 mt-1">
                This will clear all current checklist answers, notes, and photos for Store #{data.header.storeNumber || ''}.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetChecklist}
                className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-xs font-semibold text-white flex items-center justify-center cursor-pointer"
              >
                Reset Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Local Store Visit History Modal */}
      <VisitHistoryModal
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setHistoryCount(getSavedVisits().length);
        }}
        currentData={data}
        onLoadVisit={(savedData) => {
          setData(savedData);
          setCurrentStep(5);
          setHistoryCount(getSavedVisits().length);
        }}
        onOpenPdfPreview={(previewData) => {
          setHistoryPdfPreviewData(previewData);
        }}
      />

      {/* Historical Report PDF Print & Preview Modal */}
      {historyPdfPreviewData && (
        <PdfPreviewModal
          isOpen={Boolean(historyPdfPreviewData)}
          onClose={() => setHistoryPdfPreviewData(null)}
          data={historyPdfPreviewData}
        />
      )}
    </div>
  );
}
