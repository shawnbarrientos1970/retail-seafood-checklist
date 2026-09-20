import React, { useState, useEffect } from 'react';
import { ChecklistData, SavedVisit } from '../types';
import { getSavedVisits, deleteVisit, clearAllVisits } from '../utils/historyStorage';
import { generateStoreVisitPDF } from '../utils/pdfGenerator';
import {
  X,
  Search,
  Calendar,
  Building2,
  Trash2,
  Eye,
  FileDown,
  RotateCcw,
  Clock,
  AlertCircle,
  CheckCircle2,
  Store
} from 'lucide-react';

interface VisitHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: ChecklistData;
  onLoadVisit: (savedData: ChecklistData) => void;
  onOpenPdfPreview: (previewData: ChecklistData) => void;
}

export const VisitHistoryModal: React.FC<VisitHistoryModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onLoadVisit,
  onOpenPdfPreview,
}) => {
  const [visits, setVisits] = useState<SavedVisit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setVisits(getSavedVisits());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredVisits = visits.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      v.storeNumber.toLowerCase().includes(q) ||
      v.districtNumber.toLowerCase().includes(q) ||
      v.merchandiserName.toLowerCase().includes(q) ||
      v.visitDate.includes(q)
    );
  });

  const handleDelete = (id: string) => {
    deleteVisit(id);
    setVisits(getSavedVisits());
    setDeleteConfirmId(null);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all saved store visit records on this device?')) {
      clearAllVisits();
      setVisits([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-[#091b34] text-white px-4 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900/80 flex items-center justify-center text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Store Visit History</h2>
              <p className="text-[10px] text-blue-200">
                {visits.length} {visits.length === 1 ? 'visit' : 'visits'} saved locally on this device
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        {visits.length > 0 && (
          <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by store #, district, or merchandiser..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#104f9b] focus:ring-1 focus:ring-blue-100"
              />
            </div>
            {visits.length > 1 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 px-2 py-1.5 rounded-lg hover:bg-rose-50 cursor-pointer shrink-0"
              >
                Clear All
              </button>
            )}
          </div>
        )}

        {/* Visits List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {visits.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#104f9b] flex items-center justify-center mx-auto">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">No Saved Visits Yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  When you complete a checklist on Step 5, click &quot;Save to Visit History&quot; to archive and review visits anytime.
                </p>
              </div>
            </div>
          ) : filteredVisits.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-xs text-slate-500 font-medium">
                No store visits match &quot;{searchQuery}&quot;.
              </p>
            </div>
          ) : (
            filteredVisits.map((visit) => {
              const scoreBadgeClass =
                visit.totalScore >= 90
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : visit.totalScore >= 75
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-rose-100 text-rose-800 border-rose-200';

              return (
                <div
                  key={visit.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">
                          Store #{visit.storeNumber}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                          District {visit.districtNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{visit.visitDate}</span>
                        </span>
                        <span>•</span>
                        <span>{visit.merchandiserName}</span>
                      </div>
                    </div>

                    <div
                      className={`px-2.5 py-1 rounded-lg border text-xs font-black text-center ${scoreBadgeClass}`}
                    >
                      {visit.totalScore}%
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="flex items-center gap-4 text-[11px] py-1 px-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-emerald-700 font-medium">
                      ✓ {visit.passedCount} Passed
                    </span>
                    <span className="text-rose-600 font-medium">
                      ✗ {visit.failedCount} Deficiencies
                    </span>
                    <span className="text-amber-700 font-medium">
                      ⚠ {visit.totalOOS} OOS
                    </span>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onLoadVisit(visit.data);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-[#104f9b] bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="Load this visit into the checklist form"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Load Form</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await generateStoreVisitPDF(visit.data, 'simple', true);
                          } catch (err) {
                            console.error('History PDF download error:', err);
                          }
                          onOpenPdfPreview(visit.data);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="Download and preview report"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => generateStoreVisitPDF(visit.data, 'simple', true)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="Download PDF"
                      >
                        <FileDown className="w-3 h-3 text-slate-500" />
                        <span>PDF</span>
                      </button>
                    </div>

                    {deleteConfirmId === visit.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDelete(visit.id)}
                          className="px-2 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded-md cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-0.5 text-[10px] text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(visit.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete visit record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
