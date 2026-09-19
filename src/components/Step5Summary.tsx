import React, { useState } from 'react';
import { ChecklistData } from '../types';
import { generateStoreVisitPDF, generateSimpleChecklistPDF } from '../utils/pdfGenerator';
import { shareStoreVisitPDF } from '../utils/pdfShare';
import { saveVisitToHistory } from '../utils/historyStorage';
import { PhotoModal } from './PhotoModal';
import { PdfPreviewModal, ReportExportType } from './PdfPreviewModal';
import {
  FileDown,
  Printer,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  User,
  PackageX,
  ShieldCheck,
  Camera,
  Check,
  X,
  Minus,
  RotateCcw,
  Eye,
  Share2,
  Clock,
  BookmarkPlus,
  FileCheck2,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Step5SummaryProps {
  data: ChecklistData;
  onReset: () => void;
  onOpenHistory?: () => void;
}

export const Step5Summary: React.FC<Step5SummaryProps> = ({ data, onReset, onOpenHistory }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const [activePhotoKey, setActivePhotoKey] = useState<string | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [previewReportType, setPreviewReportType] = useState<ReportExportType>('simple');
  const [saveHistorySuccess, setSaveHistorySuccess] = useState(false);

  // Calculations
  const selfServeOOS = Number(data.caseDepartment.selfServeCase.numberOfOOS) || 0;
  const frozenDoorsOOS = Number(data.caseDepartment.frozenDoorsBunkers.numberOfOOS) || 0;
  const wetDryOOS = Number(data.caseDepartment.wetDryRacks.numberOfOOS) || 0;
  const fullServeOOS = Number(data.caseDepartment.fullServiceCase.numberOfOOS) || 0;
  const totalOOS = selfServeOOS + frozenDoorsOOS + wetDryOOS + fullServeOOS;

  const complianceYes = Object.values(data.compliance).filter((v) => v === true).length;
  const complianceNo = Object.values(data.compliance).filter((v) => v === false).length;
  const photosCount = Object.values(data.photos).filter(Boolean).length;

  const handleOpenReportPreview = (type: ReportExportType) => {
    setPreviewReportType(type);
    setShowPdfPreview(true);
  };

  const renderYesNoBadge = (val: boolean | null | undefined) => {
    if (val === true) {
      return (
        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-xs shrink-0">
          <Check className="w-3.5 h-3.5 stroke-[2.5]" /> YES
        </span>
      );
    }
    if (val === false) {
      return (
        <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 text-xs shrink-0">
          <X className="w-3.5 h-3.5 stroke-[2.5]" /> NO
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-xs shrink-0">
        <Minus className="w-3 h-3 stroke-[2.5]" /> Blank
      </span>
    );
  };

  const formatYesNoShort = (val: boolean | null | undefined) => {
    if (val === true) return 'YES';
    if (val === false) return 'NO';
    return 'Blank';
  };

  const handleSharePDF = async () => {
    try {
      setIsSharing(true);
      setShareFeedback(null);
      const result = await shareStoreVisitPDF(data);
      if (result.success) {
        // Auto-save to device history on successful share
        if (data.header.storeNumber.trim()) {
          saveVisitToHistory(data);
        }
        setShareFeedback({ type: 'success', message: result.message });
        setTimeout(() => setShareFeedback(null), 5000);
      } else if (!result.cancelled) {
        setShareFeedback({ type: 'info', message: result.message });
        setTimeout(() => setShareFeedback(null), 5000);
      }
    } catch (err) {
      console.error('Error sharing PDF report:', err);
      setShareFeedback({
        type: 'error',
        message: 'Could not open share menu. PDF report can be downloaded directly.',
      });
      setTimeout(() => setShareFeedback(null), 5000);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      setPdfSuccess(false);

      // Brief delay so UI shows generating state
      await new Promise((resolve) => setTimeout(resolve, 300));

      const doc = generateStoreVisitPDF(data);
      const fileName = `MountainWest_Store${data.header.storeNumber || 'Checklist'}_${data.header.visitDate || 'Visit'}.pdf`;
      doc.save(fileName);

      // Auto-save to device history on PDF download
      if (data.header.storeNumber.trim()) {
        saveVisitToHistory(data);
      }

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error('Error creating PDF:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSaveToHistory = () => {
    if (!data.header.storeNumber.trim()) {
      setShareFeedback({
        type: 'error',
        message: 'Please provide a Store # in Step 1 before saving to history.',
      });
      setTimeout(() => setShareFeedback(null), 4000);
      return;
    }
    const res = saveVisitToHistory(data);
    if (res.success) {
      setSaveHistorySuccess(true);
      setShareFeedback({
        type: 'success',
        message: `Store #${res.visit.storeNumber} visit saved to device history!`,
      });
      setTimeout(() => setSaveHistorySuccess(false), 3500);
      setTimeout(() => setShareFeedback(null), 5000);
    } else {
      setShareFeedback({
        type: 'error',
        message: res.error || 'Failed to save visit record.',
      });
      setTimeout(() => setShareFeedback(null), 5000);
    }
  };

  const handlePrintPreview = () => {
    setShowPdfPreview(true);
  };

  const photoList = [
    { key: 'coolerFreezer', label: 'Cooler / Freezer', url: data.photos.coolerFreezer, sectionNum: 1 },
    { key: 'selfServe', label: 'Self-Serve Case', url: data.photos.selfServe, sectionNum: 2 },
    { key: 'fullServe', label: 'Full-Serve Case', url: data.photos.fullServe, sectionNum: 3 },
    { key: 'frozenDoorsBunkers', label: 'Frozen Doors / Bunkers', url: data.photos.frozenDoorsBunkers, sectionNum: 4 },
    { key: 'spiceRacks', label: 'Spice Racks', url: data.photos.spiceRacks, sectionNum: 5 },
  ];

  const lightboxItems = photoList
    .filter((it): it is typeof it & { url: string } => Boolean(it.url))
    .map((it) => ({
      key: it.key,
      url: it.url,
      label: it.label,
      sectionNum: it.sectionNum,
    }));

  return (
    <div id="step-5-container" className="space-y-4">
      {/* Header card with confirmation */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#104f9b] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              5
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Inspection Summary</h3>
              <p className="text-xs text-slate-500">
                Mountain West Division Store Visit Report
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#104f9b] border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#104f9b]" />
            Ready for Export
          </span>
        </div>

        {/* Final Report Export Options: Simple vs Detailed */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#104f9b]" />
              Select Report Export Format
            </span>
            <span className="text-[11px] text-slate-500">Opens preview before printing/downloading</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* OPTION 1: Generate Simple Report */}
            <button
              type="button"
              id="generate-simple-report-btn"
              onClick={() => handleOpenReportPreview('simple')}
              className="w-full text-left p-4 rounded-2xl border-2 border-[#104f9b] bg-gradient-to-br from-blue-50/70 to-white hover:from-blue-100/70 hover:to-blue-50 active:scale-[0.99] transition-all cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#104f9b] text-white flex items-center justify-center shadow-xs">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#104f9b] text-white tracking-wide uppercase">
                    Official Format
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#104f9b] transition-colors">
                  Generate Simple Report
                </h4>
                <p className="text-[11.5px] text-slate-600 mt-1 leading-snug">
                  Mountain West Division checklist layout with <strong className="text-slate-800 font-semibold">Y / N / Blank</strong> notation, OOS numbers, and direct transition to the 5-photo grid sheet (Field Notes omitted).
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-blue-200/60 flex items-center justify-between text-xs font-bold text-[#104f9b]">
                <span className="inline-flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Preview Checklist
                </span>
                <span className="text-[11px] font-semibold text-slate-500">2 Pages (Checklist + Photo Grid)</span>
              </div>
            </button>

            {/* OPTION 2: Generate Detailed Report */}
            <button
              type="button"
              id="generate-detailed-report-btn"
              onClick={() => handleOpenReportPreview('detailed')}
              className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-[#104f9b] bg-white hover:bg-slate-50/80 active:scale-[0.99] transition-all cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-[#104f9b] text-white flex items-center justify-center transition-colors shadow-xs">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                    Full Audit
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#104f9b] transition-colors">
                  Generate Detailed Report
                </h4>
                <p className="text-[11.5px] text-slate-600 mt-1 leading-snug">
                  Executive audit scorecard, integrated Field Notes & observations log, and single-page 5-photo grid.
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-[#104f9b]">
                <span className="inline-flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Preview Detailed Audit
                </span>
                <span className="text-[11px] font-semibold text-slate-500">3 Pages (Audit + Notes + Photos)</span>
              </div>
            </button>
          </div>

          {/* Secondary Quick Toolbar: Share, Direct Download & Device History */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              id="quick-share-pdf-btn"
              onClick={handleSharePDF}
              disabled={isSharing || isGeneratingPDF}
              className="min-h-[44px] py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {isSharing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#104f9b] border-t-transparent rounded-full animate-spin" />
                  <span>Sharing...</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-sky-700" />
                  <span>Share Sheet</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="save-to-history-btn"
              onClick={handleSaveToHistory}
              className="min-h-[44px] py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-[#104f9b] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-blue-200/90"
              title="Save this completed store visit to local device history"
            >
              {saveHistorySuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5 text-[#104f9b]" />
                  <span>Save History</span>
                </>
              )}
            </button>

            {onOpenHistory && (
              <button
                type="button"
                id="view-saved-history-btn"
                onClick={onOpenHistory}
                className="col-span-2 sm:col-span-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                title="View previous store inspections saved on this device"
              >
                <Clock className="w-3.5 h-3.5 text-slate-600" />
                <span>Visit History</span>
              </button>
            )}
          </div>

          {/* Feedback banner */}
          {shareFeedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 border transition-all ${
                shareFeedback.type === 'success'
                  ? 'bg-blue-50 border-blue-200 text-[#104f9b]'
                  : shareFeedback.type === 'info'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {shareFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#104f9b]" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{shareFeedback.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Store Metadata Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Building2 className="w-4 h-4 text-[#104f9b] shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-slate-400">Store & District</div>
              <div className="text-xs font-bold text-slate-800 truncate">
                Store #{data.header.storeNumber || '—'} (Dist. {data.header.districtNumber || '—'})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Calendar className="w-4 h-4 text-[#104f9b] shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-slate-400">Visit Date</div>
              <div className="text-xs font-bold text-slate-800 truncate">
                {data.header.visitDate || '—'}
              </div>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <User className="w-4 h-4 text-[#104f9b] shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">LusaMerica Merchandiser</div>
              <div className="text-xs font-bold text-slate-800 truncate">
                {data.header.merchandiserName || '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Bento */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-center">
          <div className="flex items-center justify-center text-[#d32323] mb-1">
            <PackageX className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-slate-900">{totalOOS}</div>
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight mt-0.5">
            Total OOS
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-center">
          <div className="flex items-center justify-center text-[#104f9b] mb-1">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-slate-900">{complianceYes}/10</div>
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight mt-0.5">
            Compliance (YES)
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-center">
          <div className="flex items-center justify-center text-sky-600 mb-1">
            <Camera className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-slate-900">{photosCount}/5</div>
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight mt-0.5">
            Photos
          </div>
        </div>
      </div>

      {/* Case & Department Checks Summary */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Case & Department Checks
          </h4>
          <span className="text-[11px] text-slate-500">Yes / No Status</span>
        </div>

        <div className="space-y-1.5 text-xs">
          {[
            { label: 'Clerk Scheduled And In Seafood Department', val: data.caseDepartment.clerkScheduledAndInSeafood },
            { label: 'Seafood Case Pulled Night Before', val: data.caseDepartment.seafoodCasePulledNightBefore },
            { label: 'Seafood Case Clean, Odor Free & Clear of Build-Up', val: data.caseDepartment.seafoodCaseCleanOdorFree },
            { label: 'Tares Done Daily', val: data.caseDepartment.taresDoneDaily },
            { label: 'Deliveries Checked Against Invoice', val: data.caseDepartment.deliveriesCheckedInvoice },
            { label: 'Regulatory Decals & Allergens Consumer Advisory', val: data.caseDepartment.regulatoryDecalsAllergens },
            { label: 'Perishable Link Used For Overstock Items', val: data.caseDepartment.perishableLinkUsed },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
              <span className="text-slate-700 pr-2">{item.label}</span>
              {renderYesNoBadge(item.val)}
            </div>
          ))}
        </div>

        {/* Detailed Case Out-of-Stock Tallies */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Case Merchandising & Out of Stock Tallies
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[10px] font-semibold">Self-Serve Case</div>
              <div className="font-semibold text-slate-900 mt-0.5">
                {selfServeOOS} OOS items
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Faced: <span className="font-bold">{formatYesNoShort(data.caseDepartment.selfServeCase.faced)}</span> | Tagged: <span className="font-bold">{formatYesNoShort(data.caseDepartment.selfServeCase.tagged)}</span>
              </div>
              {selfServeOOS >= 1 && data.caseDepartment.selfServeCase.oosNotes?.trim() && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[11px] text-rose-700 bg-rose-50/70 p-1.5 rounded">
                  <span className="font-bold text-rose-800">Missing:</span> {data.caseDepartment.selfServeCase.oosNotes.trim()}
                </div>
              )}
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[10px] font-semibold">Frozen Doors / Bunkers</div>
              <div className="font-semibold text-slate-900 mt-0.5">
                {frozenDoorsOOS} OOS doors/bunkers
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Schematic: <span className="font-bold">{formatYesNoShort(data.caseDepartment.frozenDoorsBunkers.setToSchematic)}</span> | Faced: <span className="font-bold">{formatYesNoShort(data.caseDepartment.frozenDoorsBunkers.facedAndTagged)}</span>
              </div>
              {frozenDoorsOOS >= 1 && data.caseDepartment.frozenDoorsBunkers.oosNotes?.trim() && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[11px] text-rose-700 bg-rose-50/70 p-1.5 rounded">
                  <span className="font-bold text-rose-800">Missing:</span> {data.caseDepartment.frozenDoorsBunkers.oosNotes.trim()}
                </div>
              )}
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[10px] font-semibold">Wet & Dry Racks</div>
              <div className="font-semibold text-slate-900 mt-0.5">
                {wetDryOOS} OOS items
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Faced: <span className="font-bold">{formatYesNoShort(data.caseDepartment.wetDryRacks.faced)}</span> | Schematic: <span className="font-bold">{formatYesNoShort(data.caseDepartment.wetDryRacks.setToSchematic)}</span>
              </div>
              {wetDryOOS >= 1 && data.caseDepartment.wetDryRacks.oosNotes?.trim() && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[11px] text-rose-700 bg-rose-50/70 p-1.5 rounded">
                  <span className="font-bold text-rose-800">Missing:</span> {data.caseDepartment.wetDryRacks.oosNotes.trim()}
                </div>
              )}
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[10px] font-semibold">Full-Service Case</div>
              <div className="font-semibold text-slate-900 mt-0.5">
                {fullServeOOS} OOS items
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                SLU/COOL: <span className="font-bold">{formatYesNoShort(data.caseDepartment.fullServiceCase.correctSluCool)}</span> | Tags 90D: <span className="font-bold">{formatYesNoShort(data.caseDepartment.fullServiceCase.shellfishHarvestTags90Days)}</span>
              </div>
              {fullServeOOS >= 1 && data.caseDepartment.fullServiceCase.oosNotes?.trim() && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[11px] text-rose-700 bg-rose-50/70 p-1.5 rounded">
                  <span className="font-bold text-rose-800">Missing:</span> {data.caseDepartment.fullServiceCase.oosNotes.trim()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance & Focused Training Summary */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Compliance & Training ({complianceYes} YES / {complianceNo} NO)
          </h4>
          <span className="text-[11px] text-slate-500">10 Standards</span>
        </div>

        <div className="grid grid-cols-1 gap-1 text-xs">
          {[
            { label: 'Ad Support', val: data.compliance.adSupport },
            { label: 'Coolers/Freezers Organized And Dated', val: data.compliance.coolersFreezersOrganizedDated },
            { label: 'Temperature Checks', val: data.compliance.temperatureChecks },
            { label: 'Sales And Purchases Tracking Reviewed', val: data.compliance.salesPurchasesTrackingReviewed },
            { label: 'Form 120 Submitted For Short/Poor Quality Product', val: data.compliance.form120Submitted },
            { label: 'Vision Pro Scanned And Production List Followed', val: data.compliance.visionProScannedProductionList },
            { label: 'Schematic Integrity-Accessing Schematics Online', val: data.compliance.schematicIntegrityOnline },
            { label: 'New Program/New Bulletin-Accessing On Meat & Seafood Page', val: data.compliance.newProgramBulletinMeatSeafood },
            { label: 'Food Safety/Seafood Handling/Dating Policy', val: data.compliance.foodSafetyHandlingDatingPolicy },
            { label: 'Mark Down Procedures', val: data.compliance.markDownProcedures },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
              <span className="text-slate-700">{item.label}</span>
              {renderYesNoBadge(item.val)}
            </div>
          ))}
        </div>
      </div>

      {/* Photo Documentation Thumbnails by Section */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Audit Photo Verification ({photosCount}/5)
            </h4>
            <p className="text-[11px] text-slate-500">
              Verify captured pictures before generating final PDF report
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#104f9b]">Tap photo to enlarge</span>
        </div>

        <div className="space-y-2.5">
          {photoList.map((item, idx) => {
            return (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/70"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-slate-900 block truncate">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {item.url ? '✓ Photo verified & ready for PDF' : 'Photo not attached'}
                    </span>
                  </div>
                </div>

                {item.url ? (
                  <button
                    type="button"
                    onClick={() => setActivePhotoKey(item.key)}
                    className="flex items-center gap-2 shrink-0 group text-left"
                    title={`Review ${item.label} full size in lightbox`}
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 border-2 border-blue-400/80 shadow-2xs relative shrink-0">
                      <img
                        src={item.url}
                        alt={item.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#104f9b] group-hover:underline hidden sm:inline">
                      View
                    </span>
                  </button>
                ) : (
                  <div className="w-14 h-14 rounded-lg border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center shrink-0 text-slate-400">
                    <Camera className="w-4 h-4 text-slate-300" />
                    <span className="text-[9px] font-medium text-slate-400 mt-0.5">Empty</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* General Notes */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          General Visit Notes
        </h4>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
          {data.generalNotes.trim() ? data.generalNotes : 'No general visit notes entered.'}
        </div>
      </div>

      {/* Bottom Reset Checklist Action */}
      <div className="pt-2 pb-4 text-center">
        <button
          type="button"
          onClick={onReset}
          className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 active:bg-rose-100 rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Checklist / New Store Visit
        </button>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      <PhotoModal
        isOpen={Boolean(activePhotoKey)}
        onClose={() => setActivePhotoKey(null)}
        photos={lightboxItems}
        activeKey={activePhotoKey}
        onSelectPhoto={(key) => setActivePhotoKey(key)}
      />

      {/* Official PDF Report Print & Preview Modal */}
      <PdfPreviewModal
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        data={data}
        initialReportType={previewReportType}
      />
    </div>
  );
};
