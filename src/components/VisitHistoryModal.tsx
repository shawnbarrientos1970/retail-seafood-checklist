import React, { useState, useEffect, useMemo } from 'react';
import { ChecklistData, SavedStoreVisit } from '../types';
import {
  getSavedVisits,
  deleteVisitFromHistory,
  clearAllVisitsHistory,
  saveVisitToHistory,
} from '../utils/historyStorage';
import { generateStoreVisitPDF } from '../utils/pdfGenerator';
import { MountainWestLogo } from './MountainWestLogo';
import {
  X,
  Clock,
  Search,
  Printer,
  FileDown,
  Trash2,
  FolderOpen,
  Calendar,
  User,
  PackageX,
  Camera,
  CheckCircle2,
  AlertTriangle,
  BookmarkPlus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface VisitHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: ChecklistData;
  onLoadVisit: (data: ChecklistData) => void;
  onOpenPdfPreview: (data: ChecklistData) => void;
}

export const VisitHistoryModal: React.FC<VisitHistoryModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onLoadVisit,
  onOpenPdfPreview,
}) => {
  const [visits, setVisits] = useState<SavedStoreVisit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [loadConfirmVisit, setLoadConfirmVisit] = useState<SavedStoreVisit | null>(null);
  const [saveCurrentSuccess, setSaveCurrentSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reload visits when opened
  useEffect(() => {
    if (isOpen) {
      setVisits(getSavedVisits());
      setDeleteConfirmId(null);
      setShowClearAllConfirm(false);
      setLoadConfirmVisit(null);
      setSaveCurrentSuccess(false);
      setToastMessage(null);
    }
  }, [isOpen]);

  // Keyboard escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (loadConfirmVisit) {
          setLoadConfirmVisit(null);
        } else if (deleteConfirmId) {
          setDeleteConfirmId(null);
        } else if (showClearAllConfirm) {
          setShowClearAllConfirm(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, loadConfirmVisit, deleteConfirmId, showClearAllConfirm]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered visits
  const filteredVisits = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return visits;
    return visits.filter(
      (v) =>
        v.storeNumber.toLowerCase().includes(q) ||
        v.districtNumber.toLowerCase().includes(q) ||
        v.visitDate.toLowerCase().includes(q) ||
        v.merchandiserName.toLowerCase().includes(q)
    );
  }, [visits, searchQuery]);

  const handleDelete = (id: string) => {
    const updated = deleteVisitFromHistory(id);
    setVisits(updated);
    setDeleteConfirmId(null);
    showToast('Visit record deleted from device.');
  };

  const handleClearAll = () => {
    clearAllVisitsHistory();
    setVisits([]);
    setShowClearAllConfirm(false);
    showToast('All saved visit records cleared.');
  };

  const handleSaveCurrent = () => {
    const res = saveVisitToHistory(currentData);
    if (res.success) {
      setVisits(getSavedVisits());
      setSaveCurrentSuccess(true);
      showToast(`Store #${res.visit.storeNumber} visit saved to history!`);
      setTimeout(() => setSaveCurrentSuccess(false), 3000);
    } else {
      showToast(res.error || 'Failed to save visit.');
    }
  };

  const handleDirectDownload = (visit: SavedStoreVisit) => {
    try {
      const doc = generateStoreVisitPDF(visit.data);
      const filename = `MountainWest_Store${visit.storeNumber}_${visit.visitDate}.pdf`;
      doc.save(filename);
      showToast(`Downloaded ${filename}`);
    } catch (err) {
      console.error('PDF download error:', err);
      showToast('Could not generate PDF download.');
    }
  };

  const handleConfirmLoad = (visit: SavedStoreVisit) => {
    onLoadVisit(visit.data);
    setLoadConfirmVisit(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="visit-history-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-2 sm:p-4 pb-[max(0.75rem,calc(0.75rem+env(safe-area-inset-bottom,0px)))] pt-[max(0.75rem,calc(0.75rem+env(safe-area-inset-top,0px)))]"
    >
      <div
        id="visit-history-modal-dialog"
        className="w-full max-w-2xl h-full max-h-[92vh] bg-slate-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <header className="px-4 py-3 bg-[#091b34] text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-900/60 border border-blue-700/60 flex items-center justify-center shrink-0 text-sky-300">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                  Store Visit History
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-900/90 text-sky-200 border border-blue-700/60 shrink-0">
                  {visits.length} {visits.length === 1 ? 'Record' : 'Records'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                Saved store inspections on this device
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Save current visit shortcut button */}
            {currentData.header.storeNumber.trim() && (
              <button
                type="button"
                id="history-save-current-btn"
                onClick={handleSaveCurrent}
                className="hidden sm:flex min-h-[44px] items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                title="Save current active visit into history"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>{saveCurrentSuccess ? 'Saved!' : 'Save Active'}</span>
              </button>
            )}

            <button
              type="button"
              id="history-modal-close-btn"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] rounded-xl bg-white/10 hover:bg-rose-600 active:bg-rose-700 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close History (Esc)"
              aria-label="Close History"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="bg-sky-50 border-b border-sky-200 text-sky-900 text-xs px-4 py-2 font-medium flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="p-3 bg-white border-b border-slate-200 shrink-0 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="history-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Store #, District #, Date, or Merchandiser..."
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#104f9b] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile save active shortcut */}
          {currentData.header.storeNumber.trim() && (
            <div className="flex sm:hidden justify-between items-center bg-blue-50/80 border border-blue-200/80 rounded-xl p-2 text-xs">
              <span className="text-blue-900 font-medium truncate">
                Active Store #{currentData.header.storeNumber}
              </span>
              <button
                type="button"
                onClick={handleSaveCurrent}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>{saveCurrentSuccess ? 'Saved!' : 'Save Active'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Visits List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {visits.length === 0 ? (
            <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-slate-200/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#104f9b] mb-3 shadow-xs">
                <Clock className="w-7 h-7" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-800 mb-1">
                No Store Visits Saved Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">
                When you perform store audits and visit checks, your completed reports can be saved here for offline record-keeping, re-printing, and reviewing past inspections.
              </p>
              {currentData.header.storeNumber.trim() ? (
                <button
                  type="button"
                  id="history-save-first-btn"
                  onClick={handleSaveCurrent}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#104f9b] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#0c4080] active:scale-98 transition-all cursor-pointer shadow-xs"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Save Current Store #{currentData.header.storeNumber} Visit</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
                  Fill in a Store # in Step 1 to save an inspection report.
                </span>
              )}
            </div>
          ) : filteredVisits.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6">
              <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No visits matching &ldquo;{searchQuery}&rdquo;</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs text-[#104f9b] font-bold underline cursor-pointer"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            filteredVisits.map((visit) => {
              const isDeleting = deleteConfirmId === visit.id;

              return (
                <div
                  key={visit.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all overflow-hidden"
                >
                  {/* Top Bar of Visit Card */}
                  <div className="p-3 sm:p-4 pb-2.5 border-b border-slate-100">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-extrabold text-[#104f9b] tracking-tight">
                            Store #{visit.storeNumber}
                          </h4>
                          <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                            District {visit.districtNumber}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500 bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md flex items-center gap-1 border border-blue-100">
                            <Calendar className="w-3 h-3 text-blue-600" />
                            {visit.visitDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1 truncate">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <strong className="text-slate-700">{visit.merchandiserName}</strong>
                          </span>
                          <span>•</span>
                          <span className="text-[11px] text-slate-400 truncate">
                            Saved {visit.formattedDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metrics Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1.5 text-xs">
                      {/* OOS Metric */}
                      <div
                        className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 text-[11px] border ${
                          visit.totalOOS > 0
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        <PackageX className="w-3.5 h-3.5" />
                        <span>{visit.totalOOS} Out of Stock</span>
                      </div>

                      {/* Standards passed */}
                      <div className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium text-[11px] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {visit.complianceYes} Yes / {visit.complianceNo} No
                        </span>
                      </div>

                      {/* Photos attached */}
                      <div className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium text-[11px] flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-blue-600" />
                        <span>{visit.photosCount} Photos</span>
                      </div>
                    </div>

                    {/* Notes preview if any */}
                    {visit.generalNotesSnippet && (
                      <p className="mt-2 text-[11px] text-slate-600 bg-slate-50 rounded-lg p-2 border border-slate-100 italic line-clamp-2">
                        &ldquo;{visit.generalNotesSnippet}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Actions Toolbar */}
                  <div className="p-2.5 bg-slate-50/70 flex items-center justify-between gap-1.5 flex-wrap">
                    {/* Primary actions: Preview PDF & Load Form */}
                    <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-[200px]">
                      {/* View & Print PDF */}
                      <button
                        type="button"
                        id={`history-preview-btn-${visit.id}`}
                        onClick={() => onOpenPdfPreview(visit.data)}
                        className="min-h-[44px] px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                        title="View & Print Official PDF Report"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#104f9b]" />
                        <span>Print / Preview PDF</span>
                      </button>

                      {/* Quick Download */}
                      <button
                        type="button"
                        id={`history-download-btn-${visit.id}`}
                        onClick={() => handleDirectDownload(visit)}
                        className="min-h-[44px] px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                        title="Download PDF file directly"
                      >
                        <FileDown className="w-3.5 h-3.5 text-slate-600" />
                        <span className="hidden sm:inline">Download</span>
                      </button>

                      {/* Load to Active Form */}
                      <button
                        type="button"
                        id={`history-load-btn-${visit.id}`}
                        onClick={() => setLoadConfirmVisit(visit)}
                        className="min-h-[44px] px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-[#104f9b] border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                        title="Load this store visit into active checklist"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Load Form</span>
                      </button>
                    </div>

                    {/* Delete action with safety confirmation */}
                    <div className="shrink-0">
                      {isDeleting ? (
                        <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-xl">
                          <span className="text-[10px] font-bold text-rose-700 px-1">Delete?</span>
                          <button
                            type="button"
                            onClick={() => handleDelete(visit.id)}
                            className="min-h-[36px] px-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="min-h-[36px] px-2 rounded-lg text-slate-600 hover:text-slate-800 text-xs cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          id={`history-delete-btn-${visit.id}`}
                          onClick={() => setDeleteConfirmId(visit.id)}
                          className="min-h-[44px] min-w-[44px] rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:bg-rose-100 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete this record"
                          aria-label="Delete this record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        {visits.length > 0 && (
          <footer className="px-4 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between gap-2 shrink-0 text-xs">
            <div className="text-slate-500 text-[11px]">
              Stored locally on this device
            </div>

            {showClearAllConfirm ? (
              <div className="flex items-center gap-1 bg-rose-50 border border-rose-300 p-1 rounded-xl">
                <span className="text-[11px] font-bold text-rose-700 px-1">Clear all {visits.length} records?</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="min-h-[36px] px-2.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 cursor-pointer"
                >
                  Yes, Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearAllConfirm(false)}
                  className="min-h-[36px] px-2 rounded-lg text-slate-600 hover:text-slate-800 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="history-clear-all-btn"
                onClick={() => setShowClearAllConfirm(true)}
                className="min-h-[40px] px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 active:bg-rose-100 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All History</span>
              </button>
            )}
          </footer>
        )}

        {/* Confirmation Dialog for Loading Saved Visit into Active Form */}
        {loadConfirmVisit && (
          <div className="absolute inset-0 z-60 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#104f9b] flex items-center justify-center">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Load Store #{loadConfirmVisit.storeNumber} Visit?
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  This will populate the active checklist with the saved visit data from{' '}
                  <strong className="text-slate-700">{loadConfirmVisit.visitDate}</strong>.
                  Any unsaved current inputs will be replaced.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setLoadConfirmVisit(null)}
                  className="flex-1 min-h-[44px] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmLoad(loadConfirmVisit)}
                  className="flex-1 min-h-[44px] px-3 py-2 rounded-xl bg-[#104f9b] hover:bg-[#0c4080] active:bg-[#093264] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1"
                >
                  <span>Load Record</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
