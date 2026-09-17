import { jsPDF } from 'jspdf';
import { ChecklistData, YesNoValue } from '../types';

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

  // Helper for checking page overflow
  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawHeaderMini();
    }
  };

  const drawHeaderMini = () => {
    doc.setFillColor(16, 79, 155); // Mountain West Blue
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(`MOUNTAIN WEST DIVISION — STORE #${data.header.storeNumber || 'N/A'} (DISTRICT ${data.header.districtNumber || 'N/A'})`, margin + 4, y + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${data.header.visitDate || 'N/A'}`, pageWidth - margin - 4, y + 5.5, { align: 'right' });
    y += 12;
  };

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
  ensureSpace(12);
  doc.setFillColor(16, 79, 155); // Mountain West Blue
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('STEP 2: CASE & DEPARTMENT CHECKS', margin + 4, y + 4.5);
  doc.text(`TOTAL RECORDED OOS: ${totalOOS}`, pageWidth - margin - 4, y + 4.5, { align: 'right' });
  y += 9;

  const drawCheckItem = (label: string, value: YesNoValue, detail?: string) => {
    ensureSpace(6);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');

    if (value === true) {
      doc.setFillColor(16, 149, 91); // Emerald Green
      doc.roundedRect(margin + 2, y, 9, 3.8, 0.8, 0.8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.text('YES', margin + 6.5, y + 2.7, { align: 'center' });
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
    } else if (value === false) {
      doc.setFillColor(225, 29, 72); // Rose Red
      doc.roundedRect(margin + 2, y, 9, 3.8, 0.8, 0.8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.text('NO', margin + 6.5, y + 2.7, { align: 'center' });
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
    } else {
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin + 2, y, 9, 3.8, 0.8, 0.8, 'FD');
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
    }

    doc.text(label, margin + 13.5, y + 3.2);

    if (detail) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text(detail, pageWidth - margin - 4, y + 3.2, { align: 'right' });
    }

    y += 5.5;
  };

  const drawOOSMetricLine = (label: string, count: number) => {
    ensureSpace(6);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(label, margin + 12.5, y + 3.2);

    doc.setFont('helvetica', 'bold');
    if (count > 0) {
      doc.setTextColor(185, 28, 28);
      doc.text(`${count} Out of Stock`, pageWidth - margin - 4, y + 3.2, { align: 'right' });
    } else {
      doc.setTextColor(100, 116, 139);
      doc.text('0 OOS Items', pageWidth - margin - 4, y + 3.2, { align: 'right' });
    }
    y += 5.5;
  };

  const drawSubheader = (title: string) => {
    ensureSpace(7);
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(margin, y, contentWidth, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(title, margin + 4, y + 3.6);
    y += 6.5;
  };

  const drawOOSNote = (notes?: string, count: number = 1) => {
    if (count <= 0 || !notes || !notes.trim()) return;
    ensureSpace(6);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(185, 28, 28); // rose-700
    const textLines = doc.splitTextToSize(`Missing Items: ${notes.trim()}`, contentWidth - 14);
    for (const line of textLines) {
      ensureSpace(4.5);
      doc.text(line, margin + 12.5, y + 2.5);
      y += 4.5;
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

  y += 3;

  // --- SECTION 2: COMPLIANCE & FOCUSED TRAINING ---
  ensureSpace(12);
  doc.setFillColor(16, 79, 155); // Mountain West Blue
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('STEP 3: COMPLIANCE & FOCUSED TRAINING', margin + 4, y + 4.5);
  y += 9;

  drawCheckItem('Ad Support', data.compliance.adSupport);
  drawCheckItem('Coolers/Freezers Organized And Dated', data.compliance.coolersFreezersOrganizedDated);
  drawCheckItem('Temperature Checks', data.compliance.temperatureChecks);
  drawCheckItem('Sales And Purchases Tracking Reviewed', data.compliance.salesPurchasesTrackingReviewed);
  drawCheckItem('Form 120 Submitted For Short/Poor Quality Product', data.compliance.form120Submitted);
  drawCheckItem('Vision Pro Scanned And Production List Followed', data.compliance.visionProScannedProductionList);
  drawCheckItem('Schematic Integrity - Accessing Schematics Online', data.compliance.schematicIntegrityOnline);
  drawCheckItem('New Program/New Bulletin - Accessing On Meat & Seafood Page', data.compliance.newProgramBulletinMeatSeafood);
  drawCheckItem('Food Safety / Seafood Handling / Dating Policy', data.compliance.foodSafetyHandlingDatingPolicy);
  drawCheckItem('Mark Down Procedures', data.compliance.markDownProcedures);

  y += 3;

  // --- SECTION 3: NOTES & COMMENTS ---
  ensureSpace(20);
  doc.setFillColor(16, 79, 155); // Mountain West Blue
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('STEP 4: GENERAL VISIT NOTES & COMMENTS', margin + 4, y + 4.5);
  y += 9;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  const notesText = data.generalNotes.trim() || 'No general notes entered for this store visit.';
  const splitNotes = doc.splitTextToSize(notesText, contentWidth - 8);
  const notesBoxHeight = Math.max(14, splitNotes.length * 4.5 + 6);
  
  ensureSpace(notesBoxHeight + 4);
  doc.roundedRect(margin, y, contentWidth, notesBoxHeight, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(splitNotes, margin + 4, y + 5);
  y += notesBoxHeight + 5;

  // --- SECTION 4: REQUIRED INSPECTION PHOTOS ---
  const photoKeys: Array<{ key: keyof ChecklistData['photos']; label: string; sub: string }> = [
    { key: 'coolerFreezer', label: '1. Cooler / Freezer', sub: 'Walk-in storage order & dating' },
    { key: 'selfServe', label: '2. Self-Serve Case', sub: 'Facing, schematics & markdown tags' },
    { key: 'fullServe', label: '3. Full-Serve Case', sub: 'Dividers, shrimp dating & ice/case' },
    { key: 'frozenDoorsBunkers', label: '4. Frozen Doors / Bunkers', sub: 'Door schematics & tags' },
    { key: 'spiceRacks', label: '5. Spice Racks', sub: 'Wet & dry racks full, faced & tagged' },
  ];

  const photosWithImages = photoKeys.filter((p) => Boolean(data.photos[p.key]));

  // If there are photos, dedicate a clean, organized page for audit documentation
  if (photosWithImages.length > 0) {
    doc.addPage();
    y = margin;
    doc.setFillColor(16, 79, 155); // Mountain West Blue
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`STEP 4: REQUIRED AUDIT PHOTO DOCUMENTATION (${photosWithImages.length}/5 ATTACHED)`, margin + 4, y + 5.5);
    y += 12;

    const colWidth = (contentWidth - 6) / 2;
    const imgHeight = 48;

    for (let i = 0; i < photosWithImages.length; i++) {
      const item = photosWithImages[i];
      let rawImg = data.photos[item.key];
      if (!rawImg) continue;

      const col = i % 2;
      const xPos = margin + col * (colWidth + 6);

      // Check if starting a new row and need space on page
      if (col === 0 && y + imgHeight + 14 > pageHeight - margin) {
        doc.addPage();
        y = margin;
        drawHeaderMini();
      }

      // Border frame and title for photo
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(xPos, y, colWidth, imgHeight + 9, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(item.label, xPos + 3, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(item.sub, xPos + colWidth - 3, y + 5, { align: 'right' });

      // Determine format and normalize base64 Data URL
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

      try {
        doc.addImage(formattedImg, format, xPos + 2, y + 7, colWidth - 4, imgHeight, undefined, 'FAST');
      } catch (err) {
        console.warn('PDF image embed fallback:', err);
        try {
          doc.addImage(formattedImg, xPos + 2, y + 7, colWidth - 4, imgHeight, undefined, 'FAST');
        } catch {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(7.5);
          doc.setTextColor(148, 163, 184);
          doc.text('[Image rendering unavailable]', xPos + 4, y + 25);
        }
      }

      if (col === 1 || i === photosWithImages.length - 1) {
        y += imgHeight + 13;
      }
    }
  }

  // --- FOOTER SIGN-OFF ---
  ensureSpace(22);
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Report generated electronically by ${data.header.merchandiserName || 'LusaMerica Merchandiser'} on ${new Date().toLocaleString()} for Mountain West Division.`,
    margin,
    y + 3
  );

  return doc;
}
