import { ChecklistData } from '../types';
import { generateStoreVisitPDF, generateSimpleChecklistPDF } from './pdfGenerator';

export interface ShareReportResult {
  success: boolean;
  cancelled?: boolean;
  method: 'native-file' | 'native-text' | 'download-fallback';
  message: string;
}

/**
 * Checks if the Web Share API is available in the current browser environment.
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Shares the generated PDF report using the Web Share API (Messages, Mail, AirDrop, WhatsApp, etc.).
 * Gracefully falls back to downloading the PDF if Web Share is unavailable or restricted.
 */
export async function shareStoreVisitPDF(
  data: ChecklistData,
  reportType: 'detailed' | 'simple' = 'simple'
): Promise<ShareReportResult> {
  const doc = reportType === 'detailed' ? generateStoreVisitPDF(data) : generateSimpleChecklistPDF(data);
  const storeNum = data.header.storeNumber || 'Checklist';
  const visitDate = data.header.visitDate || 'Visit';
  const typePrefix = reportType === 'detailed' ? 'DetailedReport' : 'SimpleChecklist';
  const fileName = `MountainWest_${typePrefix}_Store${storeNum}_${visitDate}.pdf`;
  
  const title = `Mountain West Store #${storeNum} ${reportType === 'detailed' ? 'Detailed Audit Report' : 'Checklist'}`;
  const text = `Mountain West Division Seafood Inspection Report for Store #${storeNum} (${data.header.visitDate || 'Today'}). Audited by ${data.header.merchandiserName || 'Merchandiser'}.`;

  let pdfFile: File | null = null;
  try {
    const blob = doc.output('blob');
    pdfFile = new File([blob], fileName, { type: 'application/pdf' });
  } catch (err) {
    console.warn('Could not construct File object for sharing:', err);
  }

  // 1. Check if native Web Share with file attachments is supported
  if (
    pdfFile &&
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function'
  ) {
    try {
      const shareData = {
        title,
        text,
        files: [pdfFile],
      };

      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return {
          success: true,
          method: 'native-file',
          message: 'Report shared successfully!',
        };
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return {
          success: false,
          cancelled: true,
          method: 'native-file',
          message: 'Share sheet closed.',
        };
      }
      console.warn('File share failed, trying text share or download fallback:', err);
    }
  }

  // 2. If file sharing failed or unsupported, try text Web Share
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title,
        text,
      });
      // Also download the PDF so the user has the actual file
      doc.save(fileName);
      return {
        success: true,
        method: 'native-text',
        message: 'Report details shared; PDF saved to your downloads to attach.',
      };
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return {
          success: false,
          cancelled: true,
          method: 'native-text',
          message: 'Share sheet closed.',
        };
      }
      console.warn('Web Share text sharing failed:', err);
    }
  }

  // 3. Fallback: Save PDF directly to device
  doc.save(fileName);
  return {
    success: true,
    method: 'download-fallback',
    message: 'PDF report downloaded to your device.',
  };
}
