import React, { useState, useEffect, useRef } from 'react';
import { ChecklistData } from '../types';
import { generateStoreVisitPDF, generateSimpleChecklistPDF } from '../utils/pdfGenerator';
import { shareStoreVisitPDF } from '../utils/pdfShare';
import {
  X,
  Printer,
  FileDown,
  ExternalLink,
  Share2,
  CheckCircle2,
  AlertCircle,
  FileText,
  FileCheck2,
  Layers,
} from 'lucide-react';

export type ReportExportType = 'simple' | 'detailed';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ChecklistData;
  initialReportType?: ReportExportType;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
  initialReportType = 'simple',
}) => {
  const [reportType, setReportType] = useState<ReportExportType>(initialReportType);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [printStatus, setPrintStatus] = useState<{ type: 'info' | 'success' | 'error'; message: string } | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const printIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Sync reportType when initialReportType changes on open
  useEffect(() => {
    if (isOpen) {
      setReportType(initialReportType);
    }
  }, [isOpen, initialReportType]);

  // Generate PDF blob URL on open or when reportType changes
  useEffect(() => {
    if (!isOpen) {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
      setPrintStatus(null);
      return;
    }

    setIsGenerating(true);
    let activeBlobUrl: string | null = null;

    try {
      const doc = reportType === 'detailed' ? generateStoreVisitPDF(data) : generateSimpleChecklistPDF(data);
      const blob = doc.output('blob');
      activeBlobUrl = URL.createObjectURL(blob);
      setPdfUrl(activeBlobUrl);
    } catch (err) {
      console.error('Failed to generate PDF preview:', err);
      setPrintStatus({
        type: 'error',
        message: 'Could not render PDF preview. Please use the Download button.',
      });
    } finally {
      setIsGenerating(false);
    }

    return () => {
      if (activeBlobUrl) {
        URL.revokeObjectURL(activeBlobUrl);
      }
      if (printIframeRef.current && printIframeRef.current.parentNode) {
        printIframeRef.current.parentNode.removeChild(printIframeRef.current);
        printIframeRef.current = null;
      }
    };
  }, [isOpen, data, reportType]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const storeNum = data.header.storeNumber || 'Checklist';
  const visitDate = data.header.visitDate || 'Visit';
  const typePrefix = reportType === 'detailed' ? 'DetailedReport' : 'SimpleChecklist';
  const fileName = `MountainWest_${typePrefix}_Store${storeNum}_${visitDate}.pdf`;

  const handlePrint = () => {
    if (!pdfUrl) return;

    try {
      setPrintStatus({ type: 'info', message: 'Opening system print dialog...' });

      // Clean up existing hidden print iframe if any
      if (printIframeRef.current) {
        document.body.removeChild(printIframeRef.current);
        printIframeRef.current = null;
      }

      // Create an invisible iframe pointing to the PDF blob
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.src = pdfUrl;
      printIframeRef.current = iframe;

      document.body.appendChild(iframe);

      iframe.onload = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setPrintStatus(null);
        } catch (printErr) {
          console.warn('Iframe print failed, attempting window.print fallback:', printErr);
          try {
            window.print();
            setPrintStatus(null);
          } catch {
            setPrintStatus({
              type: 'info',
              message: 'Tip: Tap "Open in New Tab" below to print directly from your browser\'s native viewer.',
            });
          }
        }
      };
    } catch (err) {
      console.error('Print trigger error:', err);
      setPrintStatus({
        type: 'info',
        message: 'Tip: Tap "Open in New Tab" below to print directly from your browser\'s native viewer.',
      });
    }
  };

  const handleDownload = () => {
    try {
      const doc = reportType === 'detailed' ? generateStoreVisitPDF(data) : generateSimpleChecklistPDF(data);
      doc.save(fileName);
      setPrintStatus({ type: 'success', message: `${reportType === 'detailed' ? 'Detailed Report' : 'Simple Checklist'} downloaded successfully!` });
      setTimeout(() => setPrintStatus(null), 4000);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      const res = await shareStoreVisitPDF(data, reportType);
      if (res.success) {
        setPrintStatus({ type: 'success', message: res.message });
      } else if (!res.cancelled) {
        setPrintStatus({ type: 'info', message: res.message });
      }
      setTimeout(() => setPrintStatus(null), 5000);
    } catch (err) {
      console.error('Share error:', err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div
      id="pdf-preview-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-2 sm:p-4 pb-[max(0.75rem,calc(0.75rem+env(safe-area-inset-bottom,0px)))] pt-[max(0.75rem,calc(0.75rem+env(safe-area-inset-top,0px)))]"
    >
      <div
        id="pdf-preview-modal-dialog"
        className="w-full max-w-4xl h-full max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Modal Header */}
        <header className="px-4 py-2.5 bg-[#104f9b] text-white flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                {reportType === 'simple' ? (
                  <FileCheck2 className="w-4 h-4 text-white" />
                ) : (
                  <FileText className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-white truncate leading-tight">
                  {reportType === 'simple' ? 'Simple Report (Official Checklist)' : 'Detailed Inspection Report'}
                </h3>
                <p className="text-[11px] text-sky-200 truncate">
                  Store #{data.header.storeNumber || '—'} • Mountain West Division • {data.header.visitDate || 'Today'}
                </p>
              </div>
            </div>

            {/* Quick Header Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Direct Print Button */}
              <button
                type="button"
                id="preview-modal-print-btn"
                onClick={handlePrint}
                disabled={isGenerating || !pdfUrl}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                title="Print PDF Report"
                aria-label="Print PDF Report"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>

              {/* Open in New Tab Button (bypasses iframe sandbox for native print/view) */}
              {pdfUrl && (
                <a
                  id="preview-modal-newtab-btn"
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Open in New Tab"
                  aria-label="Open in New Tab"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Open Tab</span>
                </a>
              )}

              {/* Download Button */}
              <button
                type="button"
                id="preview-modal-download-btn"
                onClick={handleDownload}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Download PDF"
                aria-label="Download PDF"
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden md:inline">Download</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                id="preview-modal-close-btn"
                onClick={onClose}
                className="min-h-[44px] min-w-[44px] rounded-xl bg-white/10 hover:bg-rose-600 active:bg-rose-700 text-white flex items-center justify-center transition-colors cursor-pointer ml-1"
                title="Close Preview (Esc)"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Report Format Switcher Segmented Control */}
          <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl w-full sm:w-auto self-start">
            <button
              type="button"
              id="select-simple-report-tab"
              onClick={() => setReportType('simple')}
              className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                reportType === 'simple'
                  ? 'bg-white text-[#104f9b] shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Simple Report (Checklist Layout)</span>
            </button>
            <button
              type="button"
              id="select-detailed-report-tab"
              onClick={() => setReportType('detailed')}
              className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                reportType === 'detailed'
                  ? 'bg-white text-[#104f9b] shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Detailed Report (Full Audit)</span>
            </button>
          </div>
        </header>

        {/* Status notice banner if any */}
        {printStatus && (
          <div
            className={`px-4 py-2 text-xs flex items-center justify-between gap-2 border-b shrink-0 ${
              printStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : printStatus.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-blue-50 text-blue-900 border-blue-200'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {printStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
              )}
              <span className="truncate">{printStatus.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setPrintStatus(null)}
              className="text-slate-400 hover:text-slate-600 p-1 min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Content / PDF Viewer Body */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col">
          {isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-slate-500">
              <div className="w-8 h-8 border-3 border-[#104f9b] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold">
                Rendering {reportType === 'simple' ? 'Mountain West Checklist' : 'Detailed Report'} preview...
              </p>
            </div>
          ) : pdfUrl ? (
            <div className="flex-1 w-full h-full relative">
              <iframe
                src={`${pdfUrl}#toolbar=1&view=FitH`}
                className="w-full h-full border-0 bg-slate-200"
                title={reportType === 'simple' ? 'Mountain West Division Checklist Preview' : 'Detailed Store Visit Report Preview'}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-slate-500">
              <AlertCircle className="w-8 h-8 text-slate-400" />
              <p className="text-sm font-medium">Unable to display PDF preview.</p>
              <button
                type="button"
                onClick={handleDownload}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#104f9b] text-white font-semibold text-xs flex items-center gap-2 cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Download PDF File Directly</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Bottom Mobile Toolbar */}
        <footer className="px-4 py-2.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <div className="text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">
              {reportType === 'simple'
                ? 'Mountain West 1-Page Checklist + Single Photo Grid Sheet (2 Pages Total • No Field Notes)'
                : 'Executive Audit + Dedicated Field Notes + Single Photo Grid Sheet (3 Pages Total)'}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              {reportType === 'simple' ? 'Y / N / Blank notation with OOS numbers' : 'Complete Audit Scores & Dedicated Field Log'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              id="preview-modal-share-btn"
              onClick={handleShare}
              disabled={isSharing}
              className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-sky-700" />
              <span>Share {reportType === 'simple' ? 'Checklist' : 'Report'}</span>
            </button>

            <button
              type="button"
              id="preview-modal-bottom-download-btn"
              onClick={handleDownload}
              className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2 rounded-xl bg-[#104f9b] hover:bg-[#0c4080] active:bg-[#093264] text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <FileDown className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
