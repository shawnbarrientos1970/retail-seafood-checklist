import React, { useState } from 'react';
import { ChecklistData } from '../types';
import { calculateAuditStats, saveVisit } from '../utils/historyStorage';
import { generateStoreVisitPDF } from '../utils/pdfGenerator';
import { shareStoreVisitPDF } from '../utils/pdfShare';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileDown,
  Share2,
  BookmarkCheck,
  RotateCcw,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  FileText,
  Printer
} from 'lucide-react';
import { PdfPreviewModal } from './PdfPreviewModal';

interface Step5SummaryProps {
  data: ChecklistData;
  onReset: () => void;
  onOpenHistory: () => void;
}

export const Step5Summary: React.FC<Step5SummaryProps> = ({
  data,
  onReset,
  onOpenHistory,
}) => {
  const stats = calculateAuditStats(data);
  const [isSavedLocally, setIsSavedLocally] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewType, setPreviewType] = useState<'simple' | 'detailed'>('simple');
  const [showDeficiencies, setShowDeficiencies] = useState(true);

  const handleSaveVisit = () => {
    saveVisit(data);
    setIsSavedLocally(true);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const handlePreview = async (type: 'simple' | 'detailed') => {
    setIsGeneratingPdf(true);
    setPreviewType(type);
    try {
      // RULE 5: Ensure the app triggers a successful PDF download before any preview or share actions execute
      await generateStoreVisitPDF(data, type, true);
    } catch (e) {
      console.error('Failed to download PDF before preview:', e);
    } finally {
      setIsGeneratingPdf(false);
      setShowPreviewModal(true);
    }
  };

  const handleShare = async (type: 'simple' | 'detailed') => {
    setIsGeneratingPdf(true);
    try {
      // shareStoreVisitPDF already enforces downloading the PDF first
      await shareStoreVisitPDF(data, type);
    } catch (e) {
      console.error('Failed to share PDF:', e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Compile list of failed items
  const failedItems: { section: string; title: string }[] = [];

  const checksMapping = [
    { section: 'Operations', title: 'Clerk Scheduled and In Seafood', val: data.caseDepartment.clerkScheduledAndInSeafood },
    { section: 'Operations', title: 'Seafood Case Pulled Night Before', val: data.caseDepartment.seafoodCasePulledNightBefore },
    { section: 'Operations', title: 'Seafood Case Clean & Odor Free', val: data.caseDepartment.seafoodCaseCleanOdorFree },
    { section: 'Operations', title: 'Scale Tares Done Daily', val: data.caseDepartment.taresDoneDaily },
    { section: 'Operations', title: 'Deliveries Checked Against Invoice', val: data.caseDepartment.deliveriesCheckedInvoice },
    { section: 'Operations', title: 'Regulatory Decals & Allergens in Place', val: data.caseDepartment.regulatoryDecalsAllergens },
    { section: 'Operations', title: 'Perishable Link Tool Used', val: data.caseDepartment.perishableLinkUsed },

    { section: 'Self-Serve', title: 'Self-Serve: Faced to Front', val: data.caseDepartment.selfServeCase.faced },
    { section: 'Self-Serve', title: 'Self-Serve: Tagged 100%', val: data.caseDepartment.selfServeCase.tagged },
    { section: 'Self-Serve', title: 'Self-Serve: Set to Schematic', val: data.caseDepartment.selfServeCase.setToSchematic },
    { section: 'Self-Serve', title: 'Self-Serve: Culled & Rotated (FIFO)', val: data.caseDepartment.selfServeCase.culledRotated },
    { section: 'Self-Serve', title: 'Self-Serve: Markdown Procedures Followed', val: data.caseDepartment.selfServeCase.properlyMarkedDown },

    { section: 'Frozen & Dry', title: 'Frozen Doors/Bunkers: Set to Schematic', val: data.caseDepartment.frozenDoorsBunkers.setToSchematic },
    { section: 'Frozen & Dry', title: 'Frozen Doors/Bunkers: Faced & Tagged', val: data.caseDepartment.frozenDoorsBunkers.facedAndTagged },
    { section: 'Frozen & Dry', title: 'Wet/Dry Racks: Faced, Tagged & Merchandised', val: data.caseDepartment.wetDryRacks.faced },

    { section: 'Full Service', title: 'Full Service: Set to Schematic', val: data.caseDepartment.fullServiceCase.setToSchematic },
    { section: 'Full Service', title: 'Full Service: Proper Dividers / Cross-Contact', val: data.caseDepartment.fullServiceCase.properDividers },
    { section: 'Full Service', title: 'Full Service: Correct SLU & COOL Tags', val: data.caseDepartment.fullServiceCase.correctSluCool },
    { section: 'Full Service', title: 'Full Service: Cooked Shrimp Dated & Separated', val: data.caseDepartment.fullServiceCase.cookedShrimpDated },
    { section: 'Full Service', title: 'Full Service: Shellfish Harvest Tags Kept 90 Days', val: data.caseDepartment.fullServiceCase.shellfishHarvestTags90Days },

    { section: 'Compliance', title: 'Ad Support & Promotional Accuracy', val: data.compliance.adSupport },
    { section: 'Compliance', title: 'Coolers & Freezers Organized & Dated', val: data.compliance.coolersFreezersOrganizedDated },
    { section: 'Compliance', title: 'Temperature Checks Logged', val: data.compliance.temperatureChecks },
    { section: 'Compliance', title: 'Sales & Purchases Tracking Reviewed', val: data.compliance.salesPurchasesTrackingReviewed },
    { section: 'Compliance', title: 'Form 120 Submitted (Shrink / Credits)', val: data.compliance.form120Submitted },
    { section: 'Compliance', title: 'Vision Pro Scanned Production List Followed', val: data.compliance.visionProScannedProductionList },
    { section: 'Compliance', title: 'Schematic Integrity Online (ePOG)', val: data.compliance.schematicIntegrityOnline },
    { section: 'Compliance', title: 'New Program Bulletin Executed', val: data.compliance.newProgramBulletinMeatSeafood },
    { section: 'Compliance', title: 'Food Safety Handling & Dating Policy', val: data.compliance.foodSafetyHandlingDatingPolicy },
    { section: 'Compliance', title: 'Markdown Procedures & Freshness Protocol', val: data.compliance.markDownProcedures },
  ];

  checksMapping.forEach((c) => {
    if (c.val === false) {
      failedItems.push({ section: c.section, title: c.title });
    }
  });

  return (
    <div className="space-y-4">
      {/* Top Visit Summary Banner */}
      <div className="bg-gradient-to-br from-[#091b34] to-[#104f9b] rounded-2xl p-5 text-white shadow-md">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
            Audit Complete • Store #{data.header.storeNumber || '---'}
          </div>
          <h2 className="text-xl font-extrabold mt-0.5">Visit Summary</h2>
          <p className="text-xs text-blue-200 mt-1">
            District {data.header.districtNumber || '---'} • {data.header.visitDate}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
          <div className="bg-white/5 rounded-xl p-2">
            <span className="text-emerald-400 text-base font-bold block">{stats.passed}</span>
            <span className="text-[10px] text-blue-200 font-medium">Passed</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2">
            <span className="text-rose-400 text-base font-bold block">{stats.failed}</span>
            <span className="text-[10px] text-blue-200 font-medium">Deficiencies</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2">
            <span className="text-amber-400 text-base font-bold block">{stats.totalOOS}</span>
            <span className="text-[10px] text-blue-200 font-medium">Out of Stock</span>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2.5">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
          Report Export & Actions
        </div>

        <div className="space-y-2">
          {/* Simple Report Box */}
          <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#104f9b]">Simple Report (Official 2-Page)</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-[#104f9b]">2 Pages</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Full checklist, OOS metrics & single-sheet 5-photo grid. Omits field notes.
              </p>
            </div>
            <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
              <button
                type="button"
                id="download-simple-pdf-btn"
                disabled={isGeneratingPdf}
                onClick={() => handlePreview('simple')}
                className="flex-1 sm:flex-initial min-h-[44px] px-3 py-2 rounded-xl bg-[#104f9b] hover:bg-[#0c4080] active:bg-[#093264] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Download Simple (2-Pg)</span>
              </button>
              <button
                type="button"
                id="share-simple-pdf-btn"
                disabled={isGeneratingPdf}
                onClick={() => handleShare('simple')}
                className="min-h-[44px] px-2.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                title="Share 2-Page Simple Report"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
              </button>
            </div>
          </div>

          {/* Detailed Report Box */}
          <div className="p-3 rounded-xl border border-slate-300 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">Detailed Report (Comprehensive 3-Page)</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">3 Pages</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Executive summary, dedicated field notes on separate page & single-sheet 5-photo grid.
              </p>
            </div>
            <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
              <button
                type="button"
                id="download-detailed-pdf-btn"
                disabled={isGeneratingPdf}
                onClick={() => handlePreview('detailed')}
                className="flex-1 sm:flex-initial min-h-[44px] px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Download Detailed (3-Pg)</span>
              </button>
              <button
                type="button"
                id="share-detailed-pdf-btn"
                disabled={isGeneratingPdf}
                onClick={() => handleShare('detailed')}
                className="min-h-[44px] px-2.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                title="Share 3-Page Detailed Report"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            id="preview-report-btn"
            disabled={isGeneratingPdf}
            onClick={() => handlePreview('simple')}
            className="flex-1 min-h-[44px] px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#104f9b]" />
            <span>Interactive PDF Preview</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            id="save-visit-history-btn"
            onClick={handleSaveVisit}
            className={`flex-1 min-h-[42px] px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              saveSuccessMsg
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BookmarkCheck className={`w-4 h-4 ${saveSuccessMsg ? 'text-emerald-600' : 'text-slate-500'}`} />
            <span>{saveSuccessMsg ? 'Visit Saved to Device!' : 'Save to Visit History'}</span>
          </button>

          <button
            type="button"
            id="view-saved-visits-btn"
            onClick={onOpenHistory}
            className="min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Browse past visits"
          >
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span>History</span>
          </button>
        </div>
      </div>

      {/* Action Items / Deficiencies Callout */}
      {failedItems.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-xs">
          <button
            type="button"
            onClick={() => setShowDeficiencies((prev) => !prev)}
            className="w-full flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Items Requiring Action ({failedItems.length})</span>
            </div>
            {showDeficiencies ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showDeficiencies && (
            <div className="mt-3 space-y-1.5 pt-2 border-t border-rose-100">
              {failedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-lg bg-rose-50/50 text-xs"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">{item.title}</span>
                    <span className="text-[10px] text-slate-500 ml-1.5 font-medium">
                      ({item.section})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Visit Details & Notes Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-2.5">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Visit Notes & Observations
        </h3>
        <p className="text-xs text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
          {data.generalNotes.trim() ? data.generalNotes : 'No additional visit notes recorded.'}
        </p>
      </div>

      {/* Start New Visit Footer Link */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset and start a fresh store visit</span>
        </button>
      </div>

      {/* Modal Preview */}
      <PdfPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        data={data}
        initialReportType={previewType}
      />
    </div>
  );
};
