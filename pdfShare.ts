import { ChecklistData } from '../types';
import { generateStoreVisitPDF } from './pdfGenerator';
import { calculateAuditStats } from './historyStorage';

/**
 * Ensures the PDF download executes first before any share dialog or fallback.
 */
export async function shareStoreVisitPDF(
  data: ChecklistData,
  reportType: 'simple' | 'detailed' = 'simple'
): Promise<void> {
  const stats = calculateAuditStats(data);
  const storeNum = data.header.storeNumber || 'N/A';
  const visitDate = data.header.visitDate || new Date().toISOString().split('T')[0];
  const merchandiser = data.header.merchandiserName || 'Merchandiser';

  // RULE 5: Trigger successful PDF download FIRST before any share actions execute
  const doc = await generateStoreVisitPDF(data, reportType, true);

  const shareTitle = `MWD Seafood Store Visit - Store #${storeNum}`;
  const shareText = `Mountain West Division (Albertsons, Safeway, & Lucky) Seafood Merchandising Report for Store #${storeNum} on ${visitDate}. Passed: ${stats.passed}, Deficiencies: ${stats.failed}, Total OOS: ${stats.totalOOS}. Merchandiser: ${merchandiser}.`;

  try {
    const pdfBlob = doc.output('blob');
    const fileName = `MWD_Seafood_Visit_Store_${storeNum}_${visitDate}_${reportType}.pdf`;
    const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

    // Try native Web Share with file attachment (iOS Safari supported)
    if (
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [pdfFile] })
    ) {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        files: [pdfFile],
      });
      return;
    }

    // Try text-only native Web Share
    if (typeof navigator.share === 'function') {
      await navigator.share({
        title: shareTitle,
        text: shareText,
      });
      return;
    }
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      // User dismissed native share sheet; PDF was already downloaded safely
      return;
    }
    console.warn('Web Share dialog closed or unhandled:', err);
  }

  // Fallback: Open mailto with summary
  const subject = encodeURIComponent(
    `MWD Seafood Store Visit Report - Store #${storeNum} (${visitDate}) [Albertsons, Safeway, & Lucky]`
  );
  const body = encodeURIComponent(
    `Hello,\n\nPlease find the summary for Mountain West Division (Albertsons, Safeway, & Lucky) Seafood Merchandising visit at Store #${storeNum}.\n\n` +
      `• Date: ${visitDate}\n` +
      `• Merchandiser: ${merchandiser}\n` +
      `• Passed Items: ${stats.passed}\n` +
      `• Deficiencies: ${stats.failed}\n` +
      `• Total Out of Stock: ${stats.totalOOS}\n\n` +
      (reportType === 'detailed' && data.generalNotes ? `Notes: ${data.generalNotes}\n\n` : '') +
      `The official ${reportType === 'simple' ? '2-Page Simple' : '3-Page Detailed'} PDF report has been downloaded to this device.`
  );

  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
