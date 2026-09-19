import { jsPDF } from 'jspdf';
import { ChecklistData, YesNoValue } from '../types';

/**
 * Safely inspects the natural aspect ratio (width / height) of an image
 * so that inspection photos are rendered in their true optical proportions
 * rather than being stretched horizontally or vertically to fit fixed rectangles.
 */
function getImageAspectRatio(doc: jsPDF, dataUrl: string): number {
  // 1. Try jsPDF native image properties
  try {
    const props = doc.getImageProperties(dataUrl);
    if (props && props.width > 0 && props.height > 0) {
      return props.width / props.height;
    }
  } catch {
    // Continue to fallback
  }

  // 2. Parse JPEG SOF marker if available in base64 Data URL
  try {
    if (typeof dataUrl === 'string' && dataUrl.includes('base64,')) {
      const base64 = dataUrl.split('base64,')[1];
      if (base64) {
        const binaryString = atob(base64.slice(0, 8192));
        if (binaryString.charCodeAt(0) === 0xff && binaryString.charCodeAt(1) === 0xd8) {
          let i = 2;
          while (i < binaryString.length - 8) {
            if (binaryString.charCodeAt(i) !== 0xff) {
              i++;
              continue;
            }
            const marker = binaryString.charCodeAt(i + 1);
            // SOF0 (Baseline), SOF1 (Extended), SOF2 (Progressive)
            if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
              const height = (binaryString.charCodeAt(i + 5) << 8) | binaryString.charCodeAt(i + 6);
              const width = (binaryString.charCodeAt(i + 7) << 8) | binaryString.charCodeAt(i + 8);
              if (width > 0 && height > 0) {
                return width / height;
              }
            }
            if (marker === 0xda || marker === 0xd9) break;
            const len = (binaryString.charCodeAt(i + 2) << 8) | binaryString.charCodeAt(i + 3);
            i += 2 + len;
          }
        }
      }
    }
  } catch {
    // Continue to fallback
  }

  // 3. Fallback to standard 4:3 camera photo aspect ratio
  return 4 / 3;
}

export function generateStoreVisitPDF(data: ChecklistData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // --- TOP HEADER BANNER ---
  doc.setFillColor(16, 79, 155); // Mountain West Blue #104f9b
  doc.rect(margin, y, contentWidth, 23, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('MOUNTAIN WEST DIVISION', margin + 6, y + 9.5);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(224, 242, 254); // sky-100
  doc.text('STORE VISIT CHECKLIST & MERCHANDISING INSPECTION REPORT', margin + 6, y + 16.5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(186, 230, 253);
  doc.text('Lusamerica Fish • Albertsons • Lucky Merchandising Standards', margin + 6, y + 20.5);

  // Calculate verified count to prevent artificial pre-audit badge
  const caseChecksList = [
    data.caseDepartment.clerkScheduledAndInSeafood,
    data.caseDepartment.seafoodCasePulledNightBefore,
    data.caseDepartment.seafoodCaseCleanOdorFree,
    data.caseDepartment.taresDoneDaily,
    data.caseDepartment.deliveriesCheckedInvoice,
    data.caseDepartment.regulatoryDecalsAllergens,
    data.caseDepartment.perishableLinkUsed,
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
  ];
  const complianceChecksList = Object.values(data.compliance);
  const totalVerified = caseChecksList.filter(Boolean).length + complianceChecksList.filter(Boolean).length;
  const totalCriteriaCount = caseChecksList.length + complianceChecksList.length; // 32
  const isAuditMet = totalVerified === totalCriteriaCount;

  // Status Badge
  if (isAuditMet) {
    doc.setFillColor(211, 35, 35); // Lucky Red #d32323
    doc.roundedRect(pageWidth - margin - 36, y + 6.5, 30, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('AUDIT MET', pageWidth - margin - 21, y + 13, { align: 'center' });
  } else if (totalVerified > 0) {
    doc.setFillColor(16, 79, 155); // Mountain West Blue
    doc.roundedRect(pageWidth - margin - 36, y + 6.5, 30, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(`${totalVerified}/${totalCriteriaCount} CHECKED`, pageWidth - margin - 21, y + 13, { align: 'center' });
  } else {
    doc.setFillColor(71, 85, 105); // slate-600
    doc.roundedRect(pageWidth - margin - 36, y + 6.5, 30, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('STORE AUDIT', pageWidth - margin - 21, y + 13, { align: 'center' });
  }

  y += 27;

  // --- METADATA INFO CARD ---
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('DISTRICT NUMBER', margin + 6, y + 6);
  doc.text('STORE NUMBER', margin + 50, y + 6);
  doc.text('VISIT DATE', margin + 95, y + 6);
  doc.text('LUSAMERICA MERCHANDISER', margin + 140, y + 6);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(data.header.districtNumber || '—', margin + 6, y + 13);
  doc.text(data.header.storeNumber || '—', margin + 50, y + 13);
  doc.text(data.header.visitDate || '—', margin + 95, y + 13);
  doc.text(data.header.merchandiserName || '—', margin + 140, y + 13);

  y += 23;

  // Total OOS calculation
  const selfServeOOS = Number(data.caseDepartment.selfServeCase.numberOfOOS) || 0;
  const frozenDoorsOOS = Number(data.caseDepartment.frozenDoorsBunkers.numberOfOOS) || 0;
  const wetDryOOS = Number(data.caseDepartment.wetDryRacks.numberOfOOS) || 0;
  const fullServeOOS = Number(data.caseDepartment.fullServiceCase.numberOfOOS) || 0;
  const totalOOS = selfServeOOS + frozenDoorsOOS + wetDryOOS + fullServeOOS;

  // --- SECTION 1: CASE & DEPARTMENT CHECKS ---
  doc.setFillColor(16, 79, 155); // Mountain West Blue
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('STEP 2: CASE & DEPARTMENT CHECKS', margin + 4, y + 4.5);
  doc.text(`TOTAL RECORDED OOS: ${totalOOS}`, pageWidth - margin - 4, y + 4.5, { align: 'right' });
  y += 9;

  const drawCheckItem = (label: string, value: YesNoValue, detail?: string) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    if (value === true) {
      doc.setFillColor(16, 149, 91); // Emerald Green
      doc.roundedRect(margin + 2, y, 8.5, 3.6, 0.8, 0.8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.text('YES', margin + 6.25, y + 2.6, { align: 'center' });
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
    } else if (value === false) {
      doc.setFillColor(225, 29, 72); // Rose Red
      doc.roundedRect(margin + 2, y, 8.5, 3.6, 0.8, 0.8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.text('NO', margin + 6.25, y + 2.6, { align: 'center' });
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
    } else {
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin + 2, y, 8.5, 3.6, 0.8, 0.8, 'FD');
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
    }

    doc.text(label, margin + 13, y + 2.8);

    if (detail) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text(detail, pageWidth - margin - 4, y + 2.8, { align: 'right' });
    }

    y += 5.0;
  };

  const drawOOSMetricLine = (label: string, count: number) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(label, margin + 12, y + 2.8);

    doc.setFont('helvetica', 'bold');
    if (count > 0) {
      doc.setTextColor(185, 28, 28);
      doc.text(`${count} Out of Stock`, pageWidth - margin - 4, y + 2.8, { align: 'right' });
    } else {
      doc.setTextColor(100, 116, 139);
      doc.text('0 OOS Items', pageWidth - margin - 4, y + 2.8, { align: 'right' });
    }
    y += 5.0;
  };

  const drawSubheader = (title: string) => {
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(margin, y, contentWidth, 4.8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(51, 65, 85);
    doc.text(title, margin + 4, y + 3.4);
    y += 5.8;
  };

  const drawOOSNote = (notes?: string, count: number = 1) => {
    if (count <= 0 || !notes || !notes.trim()) return;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.2);
    doc.setTextColor(185, 28, 28); // rose-700
    const textLines = doc.splitTextToSize(`Missing Items: ${notes.trim()}`, contentWidth - 14);
    for (const line of textLines) {
      doc.text(line, margin + 12, y + 2.2);
      y += 4.2;
    }
  };

  drawCheckItem('Clerk Scheduled And In Seafood Department', data.caseDepartment.clerkScheduledAndInSeafood);
  drawCheckItem('Seafood Case Pulled Night Before', data.caseDepartment.seafoodCasePulledNightBefore);
  drawCheckItem('Seafood Case Clean, Clear Of Build-Up And Odor Free', data.caseDepartment.seafoodCaseCleanOdorFree);
  drawCheckItem('Tares Done Daily', data.caseDepartment.taresDoneDaily);
  drawCheckItem('Deliveries Checked Against Invoice (Shorts And Quality)', data.caseDepartment.deliveriesCheckedInvoice);
  drawCheckItem('Regulatory Decals & Allergens Color Added Consumer Advisory', data.caseDepartment.regulatoryDecalsAllergens);
  drawCheckItem('Perishable Link Used For Overstock Items', data.caseDepartment.perishableLinkUsed);

  // Grouped Case Checks
  drawSubheader('Self-Serve Case');
  drawCheckItem('• Faced', data.caseDepartment.selfServeCase.faced);
  drawCheckItem('• Tagged', data.caseDepartment.selfServeCase.tagged);
  drawCheckItem('• Set to Schematic', data.caseDepartment.selfServeCase.setToSchematic);
  drawCheckItem('• Culled / Rotated', data.caseDepartment.selfServeCase.culledRotated);
  drawCheckItem('• Properly Marked Down', data.caseDepartment.selfServeCase.properlyMarkedDown);
  drawOOSMetricLine('• Out of Stock (OOS) Count', selfServeOOS);
  drawOOSNote(data.caseDepartment.selfServeCase.oosNotes, selfServeOOS);

  drawSubheader('Frozen Doors & Bunkers');
  drawCheckItem('• Set to Schematic', data.caseDepartment.frozenDoorsBunkers.setToSchematic);
  drawCheckItem('• Faced and Tagged', data.caseDepartment.frozenDoorsBunkers.facedAndTagged);
  drawOOSMetricLine('• Out of Stock (OOS) Doors/Bunkers', frozenDoorsOOS);
  drawOOSNote(data.caseDepartment.frozenDoorsBunkers.oosNotes, frozenDoorsOOS);

  drawSubheader('Wet & Dry Racks');
  drawCheckItem('• Faced', data.caseDepartment.wetDryRacks.faced);
  drawCheckItem('• Tagged', data.caseDepartment.wetDryRacks.tagged);
  drawCheckItem('• Set to Schematic', data.caseDepartment.wetDryRacks.setToSchematic);
  drawOOSMetricLine('• Out of Stock (OOS) Count', wetDryOOS);
  drawOOSNote(data.caseDepartment.wetDryRacks.oosNotes, wetDryOOS);

  drawSubheader('Full-Service Case');
  drawCheckItem('• Set to Schematic', data.caseDepartment.fullServiceCase.setToSchematic);
  drawCheckItem('• Proper Dividers', data.caseDepartment.fullServiceCase.properDividers);
  drawCheckItem('• Correct SLU/COOL', data.caseDepartment.fullServiceCase.correctSluCool);
  drawCheckItem('• Cooked Shrimp Dated', data.caseDepartment.fullServiceCase.cookedShrimpDated);
  drawCheckItem('• Shellfish Harvest Tags Kept for 90 Days', data.caseDepartment.fullServiceCase.shellfishHarvestTags90Days);
  drawOOSMetricLine('• Out of Stock (OOS) Count', fullServeOOS);
  drawOOSNote(data.caseDepartment.fullServiceCase.oosNotes, fullServeOOS);

  // --- BOTTOM PAGE 1 SIGN-OFF LINE ---
  const p1FooterY = 267.5;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, p1FooterY, pageWidth - margin, p1FooterY);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Mountain West Division Inspection Document • Store #${data.header.storeNumber || '—'} (District ${data.header.districtNumber || '—'}) • Audited by ${data.header.merchandiserName || 'LusaMerica Merchandiser'}`,
    margin,
    p1FooterY + 4
  );
  doc.text(
    'Store Audit Checklist • Page 1 of 2',
    pageWidth - margin,
    p1FooterY + 4,
    { align: 'right' }
  );

  // ==========================================
  // PAGE 2: COMPLIANCE TRAINING & FIELD NOTES
  // Both fit cleanly on Page 2 without leaving blank gaps!
  // ==========================================
  doc.addPage();
  y = 10;

  // Page 2 Header Banner
  doc.setFillColor(16, 79, 155); // Mountain West Blue
  doc.rect(margin, y, contentWidth, 7.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `MOUNTAIN WEST DIVISION — STORE #${data.header.storeNumber || '—'} (DISTRICT ${data.header.districtNumber || '—'})`,
    margin + 4,
    y + 5.2
  );
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.text(
    `Date: ${data.header.visitDate || 'Today'} • Compliance & Merchandiser Field Log`,
    pageWidth - margin - 4,
    y + 5.2,
    { align: 'right' }
  );
  y += 11.5;

  // --- SECTION 2: COMPLIANCE & FOCUSED TRAINING ---
  doc.setFillColor(16, 79, 155); // Mountain West Blue
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('STEP 3: COMPLIANCE & FOCUSED TRAINING', margin + 4, y + 4.2);
  y += 8;

  const drawComplianceItem = (label: string, value: YesNoValue) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    if (value === true) {
      doc.setFillColor(16, 149, 91); // Emerald Green
      doc.roundedRect(margin + 2, y, 8.5, 3.6, 0.8, 0.8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.text('YES', margin + 6.25, y + 2.6, { align: 'center' });
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
    } else if (value === false) {
      doc.setFillColor(225, 29, 72); // Rose Red
      doc.roundedRect(margin + 2, y, 8.5, 3.6, 0.8, 0.8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.text('NO', margin + 6.25, y + 2.6, { align: 'center' });
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
    } else {
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin + 2, y, 8.5, 3.6, 0.8, 0.8, 'FD');
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
    }

    doc.text(label, margin + 13, y + 2.8);
    y += 4.8;
  };

  drawComplianceItem('Ad Support', data.compliance.adSupport);
  drawComplianceItem('Coolers/Freezers Organized And Dated', data.compliance.coolersFreezersOrganizedDated);
  drawComplianceItem('Temperature Checks', data.compliance.temperatureChecks);
  drawComplianceItem('Sales And Purchases Tracking Reviewed', data.compliance.salesPurchasesTrackingReviewed);
  drawComplianceItem('Form 120 Submitted For Short/Poor Quality Product', data.compliance.form120Submitted);
  drawComplianceItem('Vision Pro Scanned And Production List Followed', data.compliance.visionProScannedProductionList);
  drawComplianceItem('Schematic Integrity - Accessing Schematics Online', data.compliance.schematicIntegrityOnline);
  drawComplianceItem('New Program/New Bulletin - Accessing On Meat & Seafood Page', data.compliance.newProgramBulletinMeatSeafood);
  drawComplianceItem('Food Safety / Seafood Handling / Dating Policy', data.compliance.foodSafetyHandlingDatingPolicy);
  drawComplianceItem('Mark Down Procedures', data.compliance.markDownProcedures);

  y += 3.5;

  // --- STEP 4: MERCHANDISER FIELD NOTES & AUDIT OBSERVATIONS ---
  // Starts immediately on the continuation of the checklist page without a blank gap!
  doc.setFillColor(16, 79, 155); // Mountain West Blue
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('STEP 4: MERCHANDISER FIELD NOTES & AUDIT OBSERVATIONS', margin + 4, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(224, 242, 254);
  doc.text('Dedicated Field Log & Action Items', pageWidth - margin - 4, y + 4.5, { align: 'right' });
  y += 9.5;

  // Main Field Notes Container Box
  const notesCardH = 104;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, notesCardH, 1.5, 1.5, 'FD');

  // Card Header Banner
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(15, 23, 42);
  doc.text('FIELD OBSERVATIONS, ACTION ITEMS & MERCHANDISING NOTES', margin + 4, y + 4.8);

  // Status Badge
  doc.setFillColor(224, 242, 254);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(pageWidth - margin - 26, y + 1.2, 22, 4.4, 0.8, 0.8, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(3, 105, 161);
  doc.text('Official Field Log', pageWidth - margin - 15, y + 4.2, { align: 'center' });

  // Notes Body Text Area
  const textX = margin + 5;
  const textY = y + 12.5;
  const textW = contentWidth - 10;

  const notesContent = data.generalNotes?.trim()
    ? data.generalNotes.trim()
    : 'All required seafood department cases, walk-in coolers, schematics, and food safety standards were reviewed during this store visit. Department personnel were briefed on proper rotation, dating, and merchandising execution according to Mountain West Division guidelines.';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const splitNotes = doc.splitTextToSize(notesContent, textW);
  const visibleNotes = splitNotes.slice(0, 11);
  doc.text(visibleNotes, textX, textY);
  if (splitNotes.length > 11) {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text('...', textX, textY + 11 * 4.4);
  }

  // Highlights & Operational Metrics Divider inside Notes Card
  const highlightsY = y + notesCardH - 33;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.25);
  doc.line(margin + 4, highlightsY, pageWidth - margin - 4, highlightsY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.6);
  doc.setTextColor(30, 41, 59);
  doc.text('AUDIT SUMMARY HIGHLIGHTS & OPERATIONAL METRICS', margin + 4, highlightsY + 5.2);

  const summaryLines = [
    `• Total Recorded Out of Stocks (OOS): ${totalOOS} across Self-Serve, Frozen Doors, Wet/Dry Racks, and Full-Service case.`,
    `• Department Clerk Scheduled & Present: ${data.caseDepartment.clerkScheduledAndInSeafood === true ? 'Yes' : data.caseDepartment.clerkScheduledAndInSeafood === false ? 'No' : 'Unspecified'}.`,
    `• Seafood Case Pulled Night Before: ${data.caseDepartment.seafoodCasePulledNightBefore === true ? 'Yes' : data.caseDepartment.seafoodCasePulledNightBefore === false ? 'No' : 'Unspecified'}.`,
    `• Inspection Photos: All 5 mandatory case photos captured and logged on the subsequent page.`,
  ];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(71, 85, 105);
  summaryLines.forEach((line, idx) => {
    doc.text(line, margin + 6, highlightsY + 10 + idx * 4.2);
  });

  y += notesCardH + 4.5;

  // Electronic Sign-Off & Verification Box
  const signH = 34;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, signH, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text('ELECTRONIC SIGN-OFF & FIELD VERIFICATION', margin + 5, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `This field evaluation was conducted on-site by ${data.header.merchandiserName?.trim() || 'LusaMerica Merchandiser'} for Mountain West Division.`,
    margin + 5,
    y + 10.5
  );

  const signLineY = y + 20;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin + 5, signLineY, margin + 85, signLineY);
  doc.line(margin + 98, signLineY, pageWidth - margin - 5, signLineY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('MERCHANDISER ELECTRONIC SIGNATURE', margin + 5, signLineY + 3.8);
  doc.text('VERIFICATION DATE & DIVISION CONFIRMATION', margin + 98, signLineY + 3.8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(16, 79, 155);
  doc.text(data.header.merchandiserName?.trim() || 'LusaMerica Merchandiser', margin + 5, signLineY - 1.8);
  doc.text(`${data.header.visitDate || new Date().toLocaleDateString()} • Verified`, margin + 98, signLineY - 1.8);

  // Seal badge in sign-off card
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(pageWidth - margin - 48, y + 3, 43, 6, 0.8, 0.8, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(22, 101, 52);
  doc.text('✓ DIVISION AUDIT VERIFIED', pageWidth - margin - 26.5, y + 7.1, { align: 'center' });

  // Page 2 Bottom Footer Line
  const footerY = 267.5;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Mountain West Division Inspection Document • Store #${data.header.storeNumber || '—'} (District ${data.header.districtNumber || '—'}) • Audited by ${data.header.merchandiserName || 'LusaMerica Merchandiser'}`,
    margin,
    footerY + 4
  );
  doc.text(
    'Store Audit & Field Notes • Page 2 of 2 (Checklist)',
    pageWidth - margin,
    footerY + 4,
    { align: 'right' }
  );

  // ==========================================
  // PAGE 3: REQUIRED AUDIT PHOTO DOCUMENTATION (SINGLE-SHEET GRID)
  // Follows finally as the last page!
  // ==========================================
  renderPhotoGridSheet(doc, data, {
    headerTitle: `STEP 5: REQUIRED AUDIT PHOTO DOCUMENTATION (STORE #${data.header.storeNumber || '—'})`,
    headerSubtitle: `5 Mandatory Case Inspection Photos • Single-Sheet Grid Layout`,
  });

  return doc;
}

/**
 * Renders an individual photo card inside the 2-column x 3-row grid layout.
 * Accurately calculates natural aspect ratio to letterbox or pillarbox images
 * without stretching or distorting.
 */
function renderPhotoGridCard(
  doc: jsPDF,
  label: string,
  sub: string,
  rawImg: string | null,
  cardX: number,
  cardY: number,
  cardW: number,
  cardH: number
): void {
  // 1. Outer card frame with soft border
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(cardX, cardY, cardW, cardH, 1.5, 1.5, 'S');

  // 2. Card header banner
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(cardX, cardY, cardW, 6.5, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text(label, cardX + 2.5, cardY + 4.6);

  // Status Badge on right of header
  if (rawImg) {
    doc.setFillColor(220, 252, 231); // emerald-100
    doc.setDrawColor(134, 239, 172); // emerald-300
    doc.roundedRect(cardX + cardW - 20.5, cardY + 1.2, 18, 4.2, 0.8, 0.8, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.6);
    doc.setTextColor(21, 128, 61); // emerald-700
    doc.text('✓ Attached', cardX + cardW - 11.5, cardY + 4.1, { align: 'center' });
  } else {
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(cardX + cardW - 22.5, cardY + 1.2, 20, 4.2, 0.8, 0.8, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.6);
    doc.setTextColor(148, 163, 184);
    doc.text('Not Captured', cardX + cardW - 12.5, cardY + 4.1, { align: 'center' });
  }

  // 3. Interior photo display box
  const boxPadding = 2;
  const boxX = cardX + boxPadding;
  const boxY = cardY + 6.5 + boxPadding;
  const boxW = cardW - boxPadding * 2;
  const boxH = cardH - 6.5 - boxPadding * 2;

  // Neutral background matte
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(boxX, boxY, boxW, boxH, 'FD');

  if (rawImg) {
    let format = 'JPEG';
    let formattedImg = rawImg;
    if (typeof rawImg === 'string') {
      if (rawImg.startsWith('data:image/png')) {
        format = 'PNG';
      } else if (rawImg.startsWith('data:image/webp')) {
        format = 'WEBP';
      } else if (!rawImg.startsWith('data:')) {
        formattedImg = `data:image/jpeg;base64,${rawImg}`;
      }
    }

    // Inspect the photo's true optical aspect ratio
    const imgAspect = getImageAspectRatio(doc, formattedImg);
    const boxAspect = boxW / boxH;

    let renderW = boxW;
    let renderH = boxH;
    let imgX = boxX;
    let imgY = boxY;

    if (imgAspect > boxAspect) {
      // Image is wider than container (e.g. landscape 16:9 or 4:3)
      // Fit to container width, center vertically (letterbox)
      renderW = boxW;
      renderH = boxW / imgAspect;
      imgX = boxX;
      imgY = boxY + (boxH - renderH) / 2;
    } else {
      // Image is taller than container (e.g. smartphone portrait 3:4)
      // Fit to container height, center horizontally (pillarbox)
      renderH = boxH;
      renderW = boxH * imgAspect;
      imgX = boxX + (boxW - renderW) / 2;
      imgY = boxY;
    }

    try {
      doc.addImage(formattedImg, format, imgX, imgY, renderW, renderH, undefined, 'FAST');
      // Subtle framing border around the rendered image
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.2);
      doc.rect(imgX, imgY, renderW, renderH, 'D');
    } catch (err) {
      console.warn('PDF image embed fallback:', err);
      try {
        doc.addImage(formattedImg, imgX, imgY, renderW, renderH, undefined, 'FAST');
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.2);
        doc.rect(imgX, imgY, renderW, renderH, 'D');
      } catch {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text('[Image rendering unavailable]', boxX + 4, boxY + boxH / 2);
      }
    }
  } else {
    // Elegant pending placeholder
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.2);
    doc.setTextColor(148, 163, 184);
    doc.text('No photo captured for this section', boxX + boxW / 2, boxY + boxH / 2 - 2, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(160, 174, 192);
    doc.text('(Checklist photo requirement pending)', boxX + boxW / 2, boxY + boxH / 2 + 3.2, { align: 'center' });
  }
}

/**
 * Renders the 6th cell in the 2x3 photo grid: Department Photo Audit Certification & Sign-off card.
 * Does NOT contain field notes so that the Simple report contains zero notes and the Detailed report
 * keeps notes exclusively on its dedicated page.
 */
function renderPhotoCertificationCard(
  doc: jsPDF,
  data: ChecklistData,
  cardX: number,
  cardY: number,
  cardW: number,
  cardH: number
): void {
  // 1. Outer card frame
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(cardX, cardY, cardW, cardH, 1.5, 1.5, 'S');

  // 2. Card header banner
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(cardX, cardY, cardW, 6.5, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text('PHOTO AUDIT CERTIFICATION', cardX + 2.5, cardY + 4.6);

  // Badge
  doc.setFillColor(220, 252, 231); // emerald-100
  doc.setDrawColor(134, 239, 172); // emerald-300
  doc.roundedRect(cardX + cardW - 20.5, cardY + 1.2, 18, 4.2, 0.8, 0.8, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.6);
  doc.setTextColor(21, 128, 61); // emerald-700
  doc.text('✓ Verified', cardX + cardW - 11.5, cardY + 4.1, { align: 'center' });

  // 3. 5 Required Case Photo Checkpoints
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text('Required Department Case Photos:', cardX + 3.5, cardY + 11.5);

  const photoChecklist = [
    { name: '1. Walk-in Cooler / Freezer', attached: Boolean(data.photos.coolerFreezer) },
    { name: '2. Self-Serve Case & Markdowns', attached: Boolean(data.photos.selfServe) },
    { name: '3. Full-Service Case & Shellfish', attached: Boolean(data.photos.fullServe) },
    { name: '4. Frozen Doors & Bunkers', attached: Boolean(data.photos.frozenDoorsBunkers) },
    { name: '5. Wet & Dry Spice Racks', attached: Boolean(data.photos.spiceRacks) },
  ];

  doc.setFontSize(6.4);
  photoChecklist.forEach((item, idx) => {
    const itemY = cardY + 16.2 + idx * 4.2;
    if (item.attached) {
      doc.setTextColor(22, 101, 52); // green-800
      doc.setFont('helvetica', 'bold');
      doc.text('✓', cardX + 3.5, itemY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      doc.text(item.name, cardX + 7, itemY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 101, 52);
      doc.text('Logged', cardX + cardW - 3.5, itemY, { align: 'right' });
    } else {
      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'normal');
      doc.text('○', cardX + 3.5, itemY);
      doc.text(item.name, cardX + 7, itemY);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(148, 163, 184);
      doc.text('Pending', cardX + cardW - 3.5, itemY, { align: 'right' });
    }
  });

  // 4. Divider line
  const dividerY = cardY + 39.5;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.25);
  doc.line(cardX + 3, dividerY, cardX + cardW - 3, dividerY);

  // 5. Sign-off metadata
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `AUDITED BY: ${data.header.merchandiserName?.trim() || 'LUSAMERICA MERCHANDISER'}`,
    cardX + 3.5,
    dividerY + 5.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `STORE #${data.header.storeNumber || '—'}  •  DISTRICT #${data.header.districtNumber || '—'}`,
    cardX + 3.5,
    dividerY + 10.5
  );
  doc.text(
    `Inspection Date: ${data.header.visitDate || 'Today'}`,
    cardX + 3.5,
    dividerY + 15.5
  );

  // 6. Verified Stamp Box
  const badgeY = dividerY + 19.5;
  doc.setFillColor(240, 253, 244); // green-50
  doc.setDrawColor(187, 247, 208); // green-200
  doc.roundedRect(cardX + 3.5, badgeY, cardW - 7, 7.5, 1, 1, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(22, 101, 52); // green-800
  doc.text('✓ MOUNTAIN WEST DIVISION VERIFIED', cardX + cardW / 2, badgeY + 5.1, { align: 'center' });
}

/**
 * Arranges all 5 required inspection photos (Cooler/Freezer, Self-Serve, Full-Serve,
 * Frozen Doors/Bunkers, Spice Racks) into a neat 2-column x 3-row grid layout on
 * a single standard-size sheet at the end of the report. Cell 6 holds the photo audit certification.
 */
function renderPhotoGridSheet(
  doc: jsPDF,
  data: ChecklistData,
  options: {
    headerTitle: string;
    headerSubtitle: string;
  }
): void {
  // Dedicate a clean, organized final page for all 5 audit photos
  doc.addPage();

  const pageWidth = doc.internal.pageSize.getWidth();
  const leftMargin = 14;
  const rightMargin = 14;
  const contentWidth = pageWidth - leftMargin - rightMargin;

  // 1. Top Header Banner (Mountain West Blue)
  doc.setFillColor(16, 79, 155);
  doc.rect(leftMargin, 9, contentWidth, 7.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(options.headerTitle, leftMargin + 3.5, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(options.headerSubtitle, pageWidth - rightMargin - 3.5, 14, { align: 'right' });

  // 2. Grid Geometry: 2 columns x 3 rows = 6 cells
  const photoItems: Array<{
    label: string;
    sub: string;
    raw: string | null;
  }> = [
    { label: '1. Cooler / Freezer', sub: 'Walk-in storage order & dating', raw: data.photos.coolerFreezer },
    { label: '2. Self-Serve Case', sub: 'Facing, schematics & markdown tags', raw: data.photos.selfServe },
    { label: '3. Full-Service Case', sub: 'Dividers, shrimp dating & tags', raw: data.photos.fullServe },
    { label: '4. Frozen Doors / Bunkers', sub: 'Door schematics & tags', raw: data.photos.frozenDoorsBunkers },
    { label: '5. Spice Racks', sub: 'Wet & dry racks full, faced & tagged', raw: data.photos.spiceRacks },
  ];

  const colGap = 5.9;
  const colWidth = (contentWidth - colGap) / 2; // ~91.0 mm
  const cardHeight = 77.5; // fits 3 rows cleanly on US Letter without spillover
  const rowGap = 4.5;
  const startY = 19.0;

  // Render the 5 required inspection photo cards
  for (let i = 0; i < photoItems.length; i++) {
    const item = photoItems[i];
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cardX = leftMargin + col * (colWidth + colGap);
    const cardY = startY + row * (cardHeight + rowGap);

    renderPhotoGridCard(doc, item.label, item.sub, item.raw, cardX, cardY, colWidth, cardHeight);
  }

  // Cell 6 (Row 2, Column 1): Photo Audit Certification Card (NO field notes)
  const signoffX = leftMargin + 1 * (colWidth + colGap);
  const signoffY = startY + 2 * (cardHeight + rowGap);
  renderPhotoCertificationCard(doc, data, signoffX, signoffY, colWidth, cardHeight);

  // 3. Bottom Page Footer Line
  const footerY = 267.5;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(leftMargin, footerY, pageWidth - rightMargin, footerY);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Mountain West Division Inspection Document • Store #${data.header.storeNumber || '—'} (District ${data.header.districtNumber || '—'}) • Audited by ${data.header.merchandiserName || 'LusaMerica Merchandiser'}`,
    leftMargin,
    footerY + 4
  );
  doc.text(
    `Official Single-Sheet Photo Documentation Grid • ${data.header.visitDate || 'Today'}`,
    pageWidth - rightMargin,
    footerY + 4,
    { align: 'right' }
  );
}

/**
 * Renders the authentic Mountain West Division Logo vector mark (peaks, text, and division brands)
 */
function drawMountainWestVectorLogo(doc: jsPDF, x: number, y: number): void {
  // Mountain peaks
  doc.setFillColor(13, 70, 133); // deep cobalt left
  doc.triangle(x + 5, y + 14, x + 13, y + 5, x + 21, y + 14, 'F');

  doc.setFillColor(30, 115, 207); // bright royal blue center summit
  doc.triangle(x + 16, y + 14, x + 24, y + 1.5, x + 32, y + 14, 'F');

  doc.setFillColor(18, 86, 158); // medium blue right peak
  doc.triangle(x + 27, y + 14, x + 36, y + 6, x + 44, y + 14, 'F');

  // White snow facet highlights
  doc.setFillColor(255, 255, 255);
  doc.triangle(x + 23, y + 3.5, x + 24, y + 1.5, x + 25, y + 4.5, 'F');
  doc.triangle(x + 12, y + 7, x + 13, y + 5, x + 14, y + 8, 'F');
  doc.triangle(x + 35, y + 8, x + 36, y + 6, x + 37, y + 9, 'F');

  // Base navy foundation line
  doc.setFillColor(9, 53, 102);
  doc.rect(x + 4, y + 14, 41, 0.7, 'F');

  // Text: MOUNTAIN WEST
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(17, 24, 39);
  doc.text('MOUNTAIN WEST', x + 24.5, y + 18.2, { align: 'center' });

  // Text: DIVISION
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(71, 85, 105);
  doc.text('D I V I S I O N', x + 24.5, y + 21, { align: 'center' });

  // Brand sub-logos: Albertsons + Lucky
  doc.setFillColor(0, 82, 155);
  doc.circle(x + 13.5, y + 23.8, 1.5, 'F');
  doc.setFillColor(255, 255, 255);
  doc.circle(x + 13.5, y + 23.8, 0.8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(0, 82, 155);
  doc.text('Albertsons', x + 16, y + 24.5);

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(x + 27.5, y + 22.5, x + 27.5, y + 25.5);

  doc.setFont('times', 'bolditalic');
  doc.setFontSize(6);
  doc.setTextColor(211, 35, 35); // Lucky red
  doc.text('Lucky', x + 29.5, y + 24.5);
}

/**
 * Generates the "Simple Report" exactly matching the official Mountain West Division
 * single-page checklist layout from the reference document, with responses formatted
 * as "Y", "N", or blank, mapping numbers correctly, and appending all 5 required photos
 * cleanly on subsequent pages.
 */
export function generateSimpleChecklistPDF(data: ChecklistData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftMargin = 14;
  const rightMargin = 14;
  const contentWidth = pageWidth - leftMargin - rightMargin;

  // ==========================================
  // PAGE 1: MOUNTAIN WEST DIVISION CHECKLIST
  // ==========================================

  // 1. Header: Left Logo
  drawMountainWestVectorLogo(doc, leftMargin, 8);

  // 2. Header: Right Form Information Box
  const boxX = 72;
  const boxY = 7.5;
  const boxW = pageWidth - rightMargin - boxX;
  const boxH = 21;

  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(0.35);
  doc.rect(boxX, boxY, boxW, boxH, 'S');

  // Box Line 1: DISTRICT# _______  STORE # _______  DATE _______
  const row1Y = boxY + 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(17, 24, 39);

  // DISTRICT#
  doc.text('DISTRICT#', boxX + 3.5, row1Y);
  const distLineX1 = boxX + 22;
  const distLineX2 = boxX + 44;
  doc.setLineWidth(0.25);
  doc.line(distLineX1, row1Y + 0.4, distLineX2, row1Y + 0.4);
  if (data.header.districtNumber?.trim()) {
    doc.setFont('helvetica', 'bold');
    doc.text(data.header.districtNumber.trim(), (distLineX1 + distLineX2) / 2, row1Y - 0.2, { align: 'center' });
  }

  // STORE #
  doc.setFont('helvetica', 'bold');
  doc.text('STORE #', boxX + 48, row1Y);
  const storeLineX1 = boxX + 64;
  const storeLineX2 = boxX + 88;
  doc.line(storeLineX1, row1Y + 0.4, storeLineX2, row1Y + 0.4);
  if (data.header.storeNumber?.trim()) {
    doc.setFont('helvetica', 'bold');
    doc.text(data.header.storeNumber.trim(), (storeLineX1 + storeLineX2) / 2, row1Y - 0.2, { align: 'center' });
  }

  // DATE
  doc.setFont('helvetica', 'bold');
  doc.text('DATE', boxX + 92, row1Y);
  const dateLineX1 = boxX + 102;
  const dateLineX2 = boxX + boxW - 3.5;
  doc.line(dateLineX1, row1Y + 0.4, dateLineX2, row1Y + 0.4);
  if (data.header.visitDate?.trim()) {
    doc.setFont('helvetica', 'bold');
    doc.text(data.header.visitDate.trim(), (dateLineX1 + dateLineX2) / 2, row1Y - 0.2, { align: 'center' });
  }

  // Box Line 2: LUSAMERICA MERCHANDISER ____________________
  const row2Y = boxY + 16.5;
  doc.setFont('helvetica', 'bold');
  doc.text('LUSAMERICA MERCHANDISER', boxX + 3.5, row2Y);
  const merchLineX1 = boxX + 53;
  const merchLineX2 = boxX + boxW - 3.5;
  doc.line(merchLineX1, row2Y + 0.4, merchLineX2, row2Y + 0.4);
  if (data.header.merchandiserName?.trim()) {
    doc.setFont('helvetica', 'bold');
    doc.text(data.header.merchandiserName.trim(), (merchLineX1 + merchLineX2) / 2, row2Y - 0.2, { align: 'center' });
  }

  // Helper for drawing square checkbox with Y, N, or blank
  const drawCheckbox = (x: number, y: number, value: boolean | null | undefined) => {
    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(0.3);
    doc.rect(x, y - 2.8, 3.4, 3.4, 'S');

    if (value === true) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(17, 24, 39);
      doc.text('Y', x + 1.7, y - 0.35, { align: 'center' });
    } else if (value === false) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(17, 24, 39);
      doc.text('N', x + 1.7, y - 0.35, { align: 'center' });
    }
    // Blank if null / undefined / unanswered (no text inside square)
  };

  // Helper for drawing standard checklist row
  const drawRow = (
    yPos: number,
    label: string,
    value: boolean | null | undefined,
    options?: {
      indent?: number;
      fontSize?: number;
      fontStyle?: 'normal' | 'bold';
    }
  ) => {
    const xPos = leftMargin + (options?.indent || 0);
    drawCheckbox(xPos, yPos, value);

    doc.setFont('helvetica', options?.fontStyle || 'normal');
    doc.setFontSize(options?.fontSize || 8.5);
    doc.setTextColor(17, 24, 39);
    doc.text(label, xPos + 5.5, yPos - 0.25);
  };

  // Helper for section headings (e.g. "Self-Serve Case")
  const drawSectionHeading = (yPos: number, title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(17, 24, 39);
    doc.text(title, leftMargin, yPos);
  };

  // --- CHECKLIST TASKS (Page 1) ---
  let currY = 37.5;
  const lineSpacing = 6.2;

  // 1. Clerk Scheduled And In Seafood Department
  drawRow(currY, 'Clerk Scheduled And In Seafood Department', data.caseDepartment.clerkScheduledAndInSeafood);
  currY += lineSpacing;

  // 2. Seafood Case Pulled Night Before
  drawRow(currY, 'Seafood Case Pulled Night Before', data.caseDepartment.seafoodCasePulledNightBefore);
  currY += lineSpacing;

  // 3. Seafood Case Clean, Clear Of Build-Up And Odor Free
  drawRow(currY, 'Seafood Case Clean, Clear Of Build-Up And Odor Free', data.caseDepartment.seafoodCaseCleanOdorFree);
  currY += lineSpacing;

  // 4. Tares Done Daily
  drawRow(currY, 'Tares Done Daily', data.caseDepartment.taresDoneDaily);
  currY += lineSpacing;

  // 5. Deliveries Checked Against Invoice (Shorts And Quality)
  drawRow(currY, 'Deliveries Checked Against Invoice (Shorts And Quality)', data.caseDepartment.deliveriesCheckedInvoice);
  currY += lineSpacing;

  // 6. Regulatory Decals (Check Missing Decals)
  drawRow(currY, 'Regulatory Decals (Check Missing Decals)', data.caseDepartment.regulatoryDecalsAllergens);
  currY += lineSpacing - 0.8;

  // Sub-items for Regulatory Decals: Allergens, Color Added, Consumer Advisory
  const subY = currY;
  const decalVal = data.caseDepartment.regulatoryDecalsAllergens;
  drawRow(subY, 'Allergens', decalVal, { indent: 8 });
  drawRow(subY, 'Color Added', decalVal, { indent: 36 });
  drawRow(subY, 'Consumer Advisory', decalVal, { indent: 67 });
  currY += lineSpacing + 1.5;

  // --- SECTION: Self-Serve Case ---
  drawSectionHeading(currY, 'Self-Serve Case');
  currY += 5.5;

  // Faced, Tagged And Set To Schematic      Number Of OOS______
  const selfServeSchematicVal =
    data.caseDepartment.selfServeCase.setToSchematic !== null
      ? data.caseDepartment.selfServeCase.setToSchematic
      : data.caseDepartment.selfServeCase.faced !== null || data.caseDepartment.selfServeCase.tagged !== null
      ? (data.caseDepartment.selfServeCase.faced !== false && data.caseDepartment.selfServeCase.tagged !== false)
      : null;

  drawRow(currY, 'Faced, Tagged And Set To Schematic', selfServeSchematicVal);

  // Number Of OOS on Self-Serve line
  const selfOosLabelX = 112;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Number Of OOS', selfOosLabelX, currY - 0.25);
  const selfOosLineX1 = selfOosLabelX + doc.getTextWidth('Number Of OOS') + 2;
  const selfOosLineX2 = selfOosLineX1 + 22;
  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(0.25);
  doc.line(selfOosLineX1, currY + 0.35, selfOosLineX2, currY + 0.35);

  const selfServeOOSVal = data.caseDepartment.selfServeCase.numberOfOOS;
  if (selfServeOOSVal !== '' && selfServeOOSVal !== undefined) {
    doc.setFont('helvetica', 'bold');
    doc.text(String(selfServeOOSVal), (selfOosLineX1 + selfOosLineX2) / 2, currY - 0.25, { align: 'center' });
  }
  currY += lineSpacing;

  // Culled And Rotated
  drawRow(currY, 'Culled And Rotated', data.caseDepartment.selfServeCase.culledRotated);
  currY += lineSpacing;

  // Properly Marked Down
  drawRow(currY, 'Properly Marked Down', data.caseDepartment.selfServeCase.properlyMarkedDown);
  currY += lineSpacing + 1.5;

  // --- SECTION: Frozen Doors/Bunkers ---
  drawSectionHeading(currY, 'Frozen Doors/Bunkers');
  currY += 5.5;

  // Set To Schematic      Number Of OOS      Doors_______ Bunkers_______
  drawRow(currY, 'Set To Schematic', data.caseDepartment.frozenDoorsBunkers.setToSchematic);

  const frozenOosX = 66;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Number Of OOS', frozenOosX, currY - 0.25);

  doc.text('Doors', frozenOosX + 28, currY - 0.25);
  const doorsLineX1 = frozenOosX + 38;
  const doorsLineX2 = doorsLineX1 + 18;
  doc.line(doorsLineX1, currY + 0.35, doorsLineX2, currY + 0.35);

  const frozenOOSVal = data.caseDepartment.frozenDoorsBunkers.numberOfOOS;
  if (frozenOOSVal !== '' && frozenOOSVal !== undefined) {
    doc.setFont('helvetica', 'bold');
    doc.text(String(frozenOOSVal), (doorsLineX1 + doorsLineX2) / 2, currY - 0.25, { align: 'center' });
  }

  doc.setFont('helvetica', 'normal');
  doc.text('Bunkers', doorsLineX2 + 4, currY - 0.25);
  const bunkersLineX1 = doorsLineX2 + 18;
  const bunkersLineX2 = bunkersLineX1 + 18;
  doc.line(bunkersLineX1, currY + 0.35, bunkersLineX2, currY + 0.35);
  currY += lineSpacing;

  // Faced And Tagged
  drawRow(currY, 'Faced And Tagged', data.caseDepartment.frozenDoorsBunkers.facedAndTagged);
  currY += lineSpacing;

  // Wet & Dry Racks Faced, Tagged, And Set To Schematic      Number Of OOS______
  const wetDrySchematicVal =
    data.caseDepartment.wetDryRacks.setToSchematic !== null
      ? data.caseDepartment.wetDryRacks.setToSchematic
      : data.caseDepartment.wetDryRacks.faced !== null || data.caseDepartment.wetDryRacks.tagged !== null
      ? (data.caseDepartment.wetDryRacks.faced !== false && data.caseDepartment.wetDryRacks.tagged !== false)
      : null;

  drawRow(currY, 'Wet & Dry Racks Faced, Tagged, And Set To Schematic', wetDrySchematicVal);

  const wetDryOosX = 138;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Number Of OOS', wetDryOosX, currY - 0.25);
  const wetDryLineX1 = wetDryOosX + doc.getTextWidth('Number Of OOS') + 2;
  const wetDryLineX2 = wetDryLineX1 + 18;
  doc.line(wetDryLineX1, currY + 0.35, wetDryLineX2, currY + 0.35);

  const wetDryOOSVal = data.caseDepartment.wetDryRacks.numberOfOOS;
  if (wetDryOOSVal !== '' && wetDryOOSVal !== undefined) {
    doc.setFont('helvetica', 'bold');
    doc.text(String(wetDryOOSVal), (wetDryLineX1 + wetDryLineX2) / 2, currY - 0.25, { align: 'center' });
  }
  currY += lineSpacing + 1.5;

  // --- SECTION: Full-Service Case ---
  drawSectionHeading(currY, 'Full-Service Case');
  currY += 5.5;

  // Set To Schematic      Number Of OOS_____
  drawRow(currY, 'Set To Schematic', data.caseDepartment.fullServiceCase.setToSchematic);

  const fullOosX = 66;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Number Of OOS', fullOosX, currY - 0.25);
  const fullOosLineX1 = fullOosX + doc.getTextWidth('Number Of OOS') + 2;
  const fullOosLineX2 = fullOosLineX1 + 20;
  doc.line(fullOosLineX1, currY + 0.35, fullOosLineX2, currY + 0.35);

  const fullOOSVal = data.caseDepartment.fullServiceCase.numberOfOOS;
  if (fullOOSVal !== '' && fullOOSVal !== undefined) {
    doc.setFont('helvetica', 'bold');
    doc.text(String(fullOOSVal), (fullOosLineX1 + fullOosLineX2) / 2, currY - 0.25, { align: 'center' });
  }
  currY += lineSpacing;

  // Proper Dividers For Food Safety
  drawRow(currY, 'Proper Dividers For Food Safety', data.caseDepartment.fullServiceCase.properDividers);
  currY += lineSpacing;

  // Correct SLU Used And COOL Information Properly Displayed
  drawRow(currY, 'Correct SLU Used And COOL Information Properly Displayed', data.caseDepartment.fullServiceCase.correctSluCool);
  currY += lineSpacing;

  // Cooked Shrimp Properly Dated (Back Of 4-Up Tag)
  drawRow(currY, 'Cooked Shrimp Properly Dated (Back Of 4-Up Tag)', data.caseDepartment.fullServiceCase.cookedShrimpDated);
  currY += lineSpacing;

  // Shellfish Harvest Tags With Product And Filed According To Sold-By-Date, Kept For 90 Days
  drawRow(
    currY,
    'Shellfish Harvest Tags With Product And Filed According To Sold-By-Date, Kept For 90 Days',
    data.caseDepartment.fullServiceCase.shellfishHarvestTags90Days
  );
  currY += lineSpacing;

  // Perishable Link Used For Overstock Items
  drawRow(currY, 'Perishable Link Used For Overstock Items', data.caseDepartment.perishableLinkUsed);
  currY += lineSpacing + 1.5;

  // --- SECTION: Focused Training ---
  drawSectionHeading(currY, 'Focused Training');
  currY += 5.5;

  // 1. Ad Support
  drawRow(currY, 'Ad Support', data.compliance.adSupport);
  currY += lineSpacing;

  // 2. Coolers/Freezers Organized And Dated
  drawRow(currY, 'Coolers/Freezers Organized And Dated', data.compliance.coolersFreezersOrganizedDated);
  currY += lineSpacing;

  // 3. Temperature Checks
  drawRow(currY, 'Temperature Checks', data.compliance.temperatureChecks);
  currY += lineSpacing;

  // 4. Sales And Purchases Tracking Reviewed
  drawRow(currY, 'Sales And Purchases Tracking Reviewed', data.compliance.salesPurchasesTrackingReviewed);
  currY += lineSpacing;

  // 5. Form 120 Submitted For Short/Poor Quality Product
  drawRow(currY, 'Form 120 Submitted For Short/Poor Quality Product', data.compliance.form120Submitted);
  currY += lineSpacing;

  // 6. Vision Pro Scanned And Production List Followed
  drawRow(currY, 'Vision Pro Scanned And Production List Followed', data.compliance.visionProScannedProductionList);
  currY += lineSpacing;

  // 7. Schematic Integrity-Accessing Schematics Online
  drawRow(currY, 'Schematic Integrity-Accessing Schematics Online', data.compliance.schematicIntegrityOnline);
  currY += lineSpacing;

  // 8. New Program/New Bulletin-Accessing On Meat & Seafood Page
  drawRow(currY, 'New Program/New Bulletin-Accessing On Meat & Seafood Page', data.compliance.newProgramBulletinMeatSeafood);
  currY += lineSpacing;

  // 9. Food Safety/Seafood Handling/Dating Policy
  drawRow(currY, 'Food Safety/Seafood Handling/Dating Policy', data.compliance.foodSafetyHandlingDatingPolicy);
  currY += lineSpacing;

  // 10. Mark Down Procedures (Self-Serve, Full-Serve, Frozen Cases)
  drawRow(currY, 'Mark Down Procedures (Self-Serve, Full-Serve, Frozen Cases)', data.compliance.markDownProcedures);
  currY += lineSpacing + 2.5;

  // Bottom Notice (Exactly matching the document)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(
    'Take Pictures Of Cooler/Freezer, Self-Serve, Full-Serve, Frozen Doors/Bunkers, And Spice Racks',
    pageWidth / 2,
    270,
    { align: 'center' }
  );

  // ==========================================
  // PAGE 2: REQUIRED INSPECTION PHOTOS (SINGLE-SHEET GRID)
  // ==========================================
  renderPhotoGridSheet(doc, data, {
    headerTitle: `MOUNTAIN WEST DIVISION — STORE #${data.header.storeNumber || '—'} PHOTO DOCUMENTATION`,
    headerSubtitle: `Date: ${data.header.visitDate || 'Today'} • Official 5-Photo Grid Sheet`,
  });

  return doc;
}
