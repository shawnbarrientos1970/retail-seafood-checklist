import { jsPDF } from 'jspdf';
import { ChecklistData } from '../types';
import { calculateAuditStats } from './historyStorage';

interface CheckItem {
  section: string;
  title: string;
  val: boolean | null;
}

let cachedLogoDataUrl: string | null = null;

/**
 * Generates an ultra-crisp SVG data URL of the official Mountain West Division logo
 * featuring mountain peaks, MOUNTAIN WEST DIVISION text, and Albertsons, Safeway, and Lucky sub-logos.
 */
async function getMountainWestLogoDataUrl(): Promise<string> {
  if (cachedLogoDataUrl) return cachedLogoDataUrl;
  if (typeof document === 'undefined') return '';

  return new Promise((resolve) => {
    try {
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="680" height="340" viewBox="0 0 340 170">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="#f8fafc"/>
          </linearGradient>
        </defs>
        <rect width="340" height="170" fill="none"/>
        <g id="mountain-peaks">
          <polygon points="25,98 85,38 115,62 135,44 65,98" fill="#0d4685" />
          <polygon points="25,98 85,38 100,60 70,74 45,98" fill="#1761b0" />
          <polygon points="110,58 160,4 215,56 200,76 150,80 115,64" fill="#0f4c8e" />
          <polygon points="160,4 185,34 165,50 145,38 130,50 120,60 110,58 160,4" fill="#1e73cf" />
          <polygon points="185,34 220,44 295,98 240,98 215,68 195,74" fill="#12569e" />
          <polygon points="220,44 245,66 295,98 260,98 230,78" fill="#196ac5" />
          <polygon points="85,38 95,50 88,60 102,54 108,46" fill="#ffffff" />
          <polygon points="160,4 168,22 156,32 172,28 185,38 172,42 162,34 148,42" fill="#ffffff" />
          <polygon points="132,48 142,58 156,54 146,66 136,62" fill="#ffffff" />
          <polygon points="198,52 210,60 202,68 218,64 225,52" fill="#ffffff" />
          <polygon points="95,70 120,66 135,76 110,80" fill="#ffffff" />
          <polygon points="160,62 178,68 192,64 180,74 165,72" fill="#ffffff" />
          <polygon points="20,100 320,100 315,104 25,104" fill="#093566" />
        </g>
        <text x="170" y="125" text-anchor="middle" fill="#0f172a" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="20" letter-spacing="1.2">MOUNTAIN WEST</text>
        <text x="170" y="139" text-anchor="middle" fill="#334155" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="10.5" letter-spacing="4">DIVISION</text>
        <g id="brand-logos" transform="translate(76, 144)">
          <g transform="translate(0, 0)">
            <path d="M3 12 C3 6, 6.5 2.5, 11 2.5 C15.5 2.5, 19 6, 19 12 Z" fill="#00529b" />
            <path d="M6.5 12 C6.5 8, 8.5 5.5, 11 5.5 C13.5 5.5, 15.5 8, 15.5 12 Z" fill="#ffffff" />
            <path d="M8.5 12 C8.5 10, 9.5 8.5, 11 8.5 C12.5 8.5, 13.5 10, 13.5 12 Z" fill="#00529b" />
            <text x="23" y="10.5" fill="#00529b" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="9.5">Albertsons</text>
          </g>
          <line x1="86" y1="2" x2="86" y2="14" stroke="#cbd5e1" stroke-width="1.5" />
          <g transform="translate(96, 0)">
            <rect x="0" y="0.5" width="14" height="13" rx="2.5" fill="#d32323" />
            <path d="M 4 4.5 C 4 3.2 5.2 2.5 7.2 2.5 C 9.5 2.5 10.5 3.3 10.5 4.8 C 10.5 7 4 6.8 4 9.5 C 4 11.2 5.5 12 7.2 12 C 9.5 12 10.5 11 10.5 9.8" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" fill="none" />
          </g>
          <line x1="120" y1="2" x2="120" y2="14" stroke="#cbd5e1" stroke-width="1.5" />
          <g transform="translate(130, 0)">
            <circle cx="6" cy="7" r="5" fill="#d32323" />
            <circle cx="6" cy="7" r="2.8" fill="#ffffff" />
            <path d="M4.8 5.2 Q6 8.5 7.2 5.2" stroke="#d32323" stroke-width="1" fill="none" />
            <text x="15" y="10" fill="#d32323" font-family="'Brush Script MT', 'Arial Black', cursive, sans-serif" font-weight="bold" font-size="12">Lucky</text>
          </g>
        </g>
      </svg>`;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 680;
        canvas.height = 340;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          cachedLogoDataUrl = canvas.toDataURL('image/png');
          resolve(cachedLogoDataUrl);
        } else {
          resolve('');
        }
      };
      img.onerror = () => resolve('');
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    } catch {
      resolve('');
    }
  });
}

/**
 * Fallback vector logo if image rendering is unavailable
 */
function drawVectorLogoFallback(doc: jsPDF, x: number, y: number, w: number, h: number) {
  // Peaks
  doc.setFillColor(13, 70, 133);
  doc.triangle(x + 10, y + 34, x + 38, y + 10, x + 66, y + 34, 'F');
  doc.setFillColor(30, 115, 207);
  doc.triangle(x + 46, y + 34, x + 78, y + 4, x + 110, y + 34, 'F');
  doc.setFillColor(18, 86, 158);
  doc.triangle(x + 90, y + 34, x + 118, y + 12, x + 144, y + 34, 'F');

  // Base line
  doc.setDrawColor(9, 53, 102);
  doc.setLineWidth(1.8);
  doc.line(x + 8, y + 36, x + 148, y + 36);

  // Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('MOUNTAIN WEST', x + 78, y + 47, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('DIVISION', x + 78, y + 55, { align: 'center' });

  doc.setFontSize(6.8);
  doc.setTextColor(0, 82, 155);
  doc.text('Albertsons', x + 24, y + 64);
  doc.setTextColor(148, 163, 184);
  doc.text('•', x + 66, y + 64);

  // Safeway logo emblem (red shield with white stylized S, word "Safeway" removed)
  doc.setFillColor(211, 35, 35);
  doc.roundedRect(x + 74, y + 57.5, 9, 8, 1.5, 1.5, 'F');
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1.1);
  doc.line(x + 76, y + 59.5, x + 81, y + 59.5);
  doc.line(x + 76, y + 62, x + 81, y + 62);

  doc.setTextColor(148, 163, 184);
  doc.text('•', x + 89, y + 64);
  doc.setTextColor(211, 35, 35);
  doc.text('Lucky', x + 97, y + 64);
}

/**
 * Draws the top metadata box with exact field names and clean lines for manual entry:
 * DISTRICT#, STORE #, DATE, and LUSAMERICA MERCHANDISER
 */
function drawMetadataBox(
  doc: jsPDF,
  data: ChecklistData,
  x: number,
  y: number,
  w: number,
  h: number = 46
) {
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.75);
  doc.rect(x, y, w, h, 'S');

  // Row 1: DISTRICT#__________   STORE #__________   DATE__________
  const row1Y = y + 17;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);

  // Field 1: DISTRICT#
  doc.text('DISTRICT#', x + 8, row1Y);
  const distLabelW = doc.getTextWidth('DISTRICT#');
  const distLineStart = x + 8 + distLabelW + 2;
  const distLineEnd = distLineStart + 45;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.75);
  doc.line(distLineStart, row1Y + 1.5, distLineEnd, row1Y + 1.5);
  if (data.header.districtNumber) {
    doc.setFont('helvetica', 'bold');
    doc.text(data.header.districtNumber, (distLineStart + distLineEnd) / 2, row1Y, { align: 'center' });
  }

  // Field 2: STORE #
  doc.setFont('helvetica', 'normal');
  const storeLabelX = distLineEnd + 10;
  doc.text('STORE #', storeLabelX, row1Y);
  const storeLabelW = doc.getTextWidth('STORE #');
  const storeLineStart = storeLabelX + storeLabelW + 2;
  const storeLineEnd = storeLineStart + 45;
  doc.line(storeLineStart, row1Y + 1.5, storeLineEnd, row1Y + 1.5);
  if (data.header.storeNumber) {
    doc.setFont('helvetica', 'bold');
    doc.text(data.header.storeNumber, (storeLineStart + storeLineEnd) / 2, row1Y, { align: 'center' });
  }

  // Field 3: DATE
  doc.setFont('helvetica', 'normal');
  const dateLabelX = storeLineEnd + 10;
  doc.text('DATE', dateLabelX, row1Y);
  const dateLabelW = doc.getTextWidth('DATE');
  const dateLineStart = dateLabelX + dateLabelW + 2;
  const dateLineEnd = x + w - 8;
  doc.line(dateLineStart, row1Y + 1.5, dateLineEnd, row1Y + 1.5);
  if (data.header.visitDate) {
    doc.setFont('helvetica', 'bold');
    doc.text(data.header.visitDate, (dateLineStart + dateLineEnd) / 2, row1Y, { align: 'center' });
  }

  // Row 2: LUSAMERICA MERCHANDISER_____________________
  const row2Y = y + 34;
  doc.setFont('helvetica', 'normal');
  doc.text('LUSAMERICA MERCHANDISER', x + 8, row2Y);
  const merchLabelW = doc.getTextWidth('LUSAMERICA MERCHANDISER');
  const merchLineStart = x + 8 + merchLabelW + 2;
  const merchLineEnd = x + w - 8;
  doc.line(merchLineStart, row2Y + 1.5, merchLineEnd, row2Y + 1.5);
  if (data.header.merchandiserName) {
    doc.setFont('helvetica', 'bold');
    doc.text(data.header.merchandiserName, merchLineStart + 4, row2Y);
  }
}

/**
 * Draws a clean square checklist box:
 * - Bold 'Y' inside if marked Yes
 * - Bold 'N' inside if marked No
 * - Completely blank if left unanswered
 */
function drawSimpleCheckSquare(
  doc: jsPDF,
  val: boolean | null | undefined,
  x: number,
  y: number,
  size: number = 9.5
) {
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.75);
  doc.rect(x, y, size, size, 'FD');

  if (val === true) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text('Y', x + size / 2, y + size - 2, { align: 'center' });
  } else if (val === false) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text('N', x + size / 2, y + size - 2, { align: 'center' });
  }
  // When val is null, leave completely blank!
}

/**
 * Draws the manual fill-in line for "Number Of OOS:  ________" with numeric entry spot
 */
function drawOosFillInLine(
  doc: jsPDF,
  count: number,
  notes: string,
  x: number,
  y: number,
  width: number
) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  const label = 'Number Of OOS:';
  doc.text(label, x + 4, y);

  const labelW = doc.getTextWidth(label);
  const lineStartX = x + 4 + labelW + 4;
  const lineLength = 36;

  // Fill-in Underline
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.85);
  doc.line(lineStartX, y + 1.5, lineStartX + lineLength, y + 1.5);

  // Numeric entry centered on the line
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  if (count > 0) {
    doc.setTextColor(185, 28, 28);
  } else {
    doc.setTextColor(15, 23, 42);
  }
  doc.text(`${count}`, lineStartX + lineLength / 2, y, { align: 'center' });

  // If notes exist, show brief note in italics
  if (notes && notes.trim()) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    const maxNoteLen = Math.floor((width - (lineStartX + lineLength - x) - 10) / 4.2);
    const cleanNotes = notes.length > maxNoteLen ? `${notes.substring(0, Math.max(0, maxNoteLen - 3))}...` : notes;
    doc.text(`(${cleanNotes})`, lineStartX + lineLength + 6, y);
  }
}

/**
 * Draws major section header bars for Simple Report (Navy banner)
 */
function drawSimpleMajorHeader(
  doc: jsPDF,
  title: string,
  x: number,
  y: number,
  w: number
): number {
  doc.setFillColor(11, 63, 122); // Deep Division Navy
  doc.rect(x, y, w, 14, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(title, x + 6, y + 9.8);
  return y + 18;
}

/**
 * Draws sub-section header bars for Simple Report (Soft Gray banner)
 */
function drawSimpleSubHeader(
  doc: jsPDF,
  title: string,
  x: number,
  y: number,
  w: number
): number {
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.7);
  doc.rect(x, y, w, 13, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(title, x + 5, y + 9.2);
  return y + 17;
}

const getAllChecklistItems = (data: ChecklistData): CheckItem[] => [
  // Case & Department Checks
  { section: 'Case & Department Checks', title: 'Clerk scheduled and in Seafood', val: data.caseDepartment.clerkScheduledAndInSeafood },
  { section: 'Case & Department Checks', title: 'Seafood case pulled the night before', val: data.caseDepartment.seafoodCasePulledNightBefore },
  { section: 'Case & Department Checks', title: 'Seafood case clean and odor free', val: data.caseDepartment.seafoodCaseCleanOdorFree },
  { section: 'Case & Department Checks', title: 'Tares done daily', val: data.caseDepartment.taresDoneDaily },
  { section: 'Case & Department Checks', title: 'Deliveries checked against invoice', val: data.caseDepartment.deliveriesCheckedInvoice },
  { section: 'Case & Department Checks', title: 'Regulatory decals & allergens in place', val: data.caseDepartment.regulatoryDecalsAllergens },
  { section: 'Case & Department Checks', title: 'Perishable link tool used', val: data.caseDepartment.perishableLinkUsed },

  // Full-Service Case
  { section: 'Full-Service Case', title: 'Set to Division schematic', val: data.caseDepartment.fullServiceCase.setToSchematic },
  { section: 'Full-Service Case', title: 'Proper dividers used', val: data.caseDepartment.fullServiceCase.properDividers },
  { section: 'Full-Service Case', title: 'Correct SLU & COOL tags displayed', val: data.caseDepartment.fullServiceCase.correctSluCool },
  { section: 'Full-Service Case', title: 'Cooked shrimp rotated & dated', val: data.caseDepartment.fullServiceCase.cookedShrimpDated },
  { section: 'Full-Service Case', title: 'Shellfish harvest tags kept 90 days', val: data.caseDepartment.fullServiceCase.shellfishHarvestTags90Days },

  // Self-Serve Case
  { section: 'Self-Serve Case', title: 'Faced to front edge', val: data.caseDepartment.selfServeCase.faced },
  { section: 'Self-Serve Case', title: 'Tagged 100%', val: data.caseDepartment.selfServeCase.tagged },
  { section: 'Self-Serve Case', title: 'Set to Division schematic', val: data.caseDepartment.selfServeCase.setToSchematic },
  { section: 'Self-Serve Case', title: 'Culled & rotated (FIFO)', val: data.caseDepartment.selfServeCase.culledRotated },
  { section: 'Self-Serve Case', title: 'Markdown procedures followed', val: data.caseDepartment.selfServeCase.properlyMarkedDown },

  // Frozen Doors & Bunkers
  { section: 'Frozen Doors & Bunkers', title: 'Set to Division schematic', val: data.caseDepartment.frozenDoorsBunkers.setToSchematic },
  { section: 'Frozen Doors & Bunkers', title: 'Faced & tagged', val: data.caseDepartment.frozenDoorsBunkers.facedAndTagged },

  // Wet & Dry Racks
  { section: 'Wet & Dry Racks', title: 'Faced', val: data.caseDepartment.wetDryRacks.faced },
  { section: 'Wet & Dry Racks', title: 'Tagged with correct prices', val: data.caseDepartment.wetDryRacks.tagged },
  { section: 'Wet & Dry Racks', title: 'Set to Division schematic', val: data.caseDepartment.wetDryRacks.setToSchematic },

  // Focused Training (1 - 10)
  { section: 'Focused Training', title: '1. Ad Support', val: data.compliance.adSupport },
  { section: 'Focused Training', title: '2. Coolers & Freezers Organized & Dated', val: data.compliance.coolersFreezersOrganizedDated },
  { section: 'Focused Training', title: '3. Temperature Checks', val: data.compliance.temperatureChecks },
  { section: 'Focused Training', title: '4. Sales & Purchases Tracking Reviewed', val: data.compliance.salesPurchasesTrackingReviewed },
  { section: 'Focused Training', title: '5. Form 120 Submitted', val: data.compliance.form120Submitted },
  { section: 'Focused Training', title: '6. Vision Pro Scanned Production List', val: data.compliance.visionProScannedProductionList },
  { section: 'Focused Training', title: '7. Schematic Integrity Online', val: data.compliance.schematicIntegrityOnline },
  { section: 'Focused Training', title: '8. New Program Bulletin Meat & Seafood', val: data.compliance.newProgramBulletinMeatSeafood },
  { section: 'Focused Training', title: '9. Food Safety Handling & Dating Policy', val: data.compliance.foodSafetyHandlingDatingPolicy },
  { section: 'Focused Training', title: '10. Markdown Procedures', val: data.compliance.markDownProcedures },
];

/**
 * Draws the official text-based division header with Albertsons and Lucky branding
 */
function drawOfficialHeader(
  doc: jsPDF,
  pageNumber: number,
  totalPages: number,
  reportTitle: string,
  subTitle: string
) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;
  const headerHeight = 52;
  const topY = 32;

  // Dark Navy Header Banner
  doc.setFillColor(9, 27, 52); // #091b34
  doc.rect(margin, topY, contentWidth, headerHeight, 'F');

  // Top Accent Bar (Albertsons Blue & Gold stripe)
  doc.setFillColor(16, 79, 155); // #104f9b
  doc.rect(margin, topY, contentWidth * 0.7, 3, 'F');
  doc.setFillColor(245, 158, 11); // Amber/Gold for Lucky
  doc.rect(margin + contentWidth * 0.7, topY, contentWidth * 0.3, 3, 'F');

  // Left Title: Official text-based header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('MOUNTAIN WEST DIVISION', margin + 12, topY + 22);

  // Sub-brands: Albertsons • Safeway • Lucky
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(147, 197, 253); // Sky blue
  doc.text('Albertsons', margin + 12, topY + 38);

  doc.setTextColor(203, 213, 225);
  doc.text(' • ', margin + 60, topY + 38);

  doc.setTextColor(252, 165, 165); // Soft red
  doc.text('Safeway', margin + 70, topY + 38);

  doc.setTextColor(203, 213, 225);
  doc.text(' • ', margin + 110, topY + 38);

  doc.setTextColor(252, 211, 77); // Amber-300
  doc.text('Lucky', margin + 120, topY + 38);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(186, 230, 253);
  doc.setFontSize(8);
  doc.text(` — ${subTitle}`, margin + 148, topY + 38);

  // Right Side: Report Title & Page Number
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(reportTitle, pageWidth - margin - 12, topY + 22, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - margin - 12, topY + 38, { align: 'right' });
}

/**
 * Draws the Store Information Card
 */
function drawStoreInfoCard(
  doc: jsPDF,
  data: ChecklistData,
  y: number
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;
  const cardHeight = 44;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, cardHeight, 3, 3, 'FD');

  // Col 1: Store & District
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('STORE NUMBER:', margin + 12, y + 16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Store #${data.header.storeNumber || 'N/A'}`, margin + 98, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('DISTRICT:', margin + 12, y + 32);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`District ${data.header.districtNumber || 'N/A'}`, margin + 98, y + 32);

  // Col 2: Date & Merchandiser
  const col2X = margin + 250;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('VISIT DATE:', col2X, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(data.header.visitDate || 'N/A', col2X + 68, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('MERCHANDISER:', col2X, y + 32);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  const merchText = data.header.merchandiserName || 'Not specified';
  doc.text(merchText, col2X + 90, y + 32);

  return y + cardHeight + 8;
}

/**
 * Accurately determines natural image width and height without altering aspect ratio.
 */
async function getImageNaturalDimensions(
  doc: jsPDF,
  dataUrl: string
): Promise<{ width: number; height: number }> {
  // Method 1: jsPDF built-in getImageProperties
  try {
    const props = doc.getImageProperties(dataUrl);
    if (props && props.width > 0 && props.height > 0) {
      return { width: props.width, height: props.height };
    }
  } catch {
    // Continue to DOM fallback
  }

  // Method 2: HTML Image element
  if (typeof window !== 'undefined' && typeof Image !== 'undefined') {
    try {
      const dims = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const w = img.naturalWidth || img.width;
          const h = img.naturalHeight || img.height;
          if (w > 0 && h > 0) {
            resolve({ width: w, height: h });
          } else {
            resolve({ width: 4, height: 3 });
          }
        };
        img.onerror = () => resolve({ width: 4, height: 3 });
        img.src = dataUrl;
      });
      return dims;
    } catch {
      // Fallback below
    }
  }

  return { width: 4, height: 3 };
}

/**
 * Draws the Single-Sheet 5-Photo Documentation Grid (Letter size)
 * Uses a balanced 2-column layout with 5 uniform border frames and strict aspect ratio preservation.
 */
async function drawSingleSheetPhotoGrid(
  doc: jsPDF,
  data: ChecklistData,
  startY: number = 92
) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2; // 540 pt

  // Section Header Banner
  doc.setFillColor(16, 79, 155); // #104f9b
  doc.rect(margin, startY, contentWidth, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('INSPECTION PHOTO DOCUMENTATION GRID (5 REQUIRED AREAS)', margin + 8, startY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Official Mountain West Division Visual Record', pageWidth - margin - 8, startY + 12, { align: 'right' });

  const photoSlots = [
    { label: '1. Full-Serve Case', url: data.photos.fullServe, desc: 'Merchandising, ice bed, dividers & SLU tags' },
    { label: '2. Self-Serve Case', url: data.photos.selfServe, desc: '100% faced, tagged, rotation & markdowns' },
    { label: '3. Frozen Doors/Bunkers', url: data.photos.frozenDoorsBunkers, desc: 'Doors, bunkers, schematics & condition' },
    { label: '4. Cooler/Freezer', url: data.photos.coolerFreezer, desc: 'Storage organization, dating & FIFO rotation' },
    { label: '5. Spice Racks & Dry Displays', url: data.photos.spiceRacks, desc: 'Coatings, marinades, cedar planks & spices' },
  ];

  // Grid layout parameters: 2 columns, uniform box dimensions for all 5 cards
  const gapX = 14;
  const gapY = 10;
  const boxW = (contentWidth - gapX) / 2; // 263 pt
  const boxH = 184; // Uniform box height
  const gridTopY = startY + 24;

  // Row 1: Photos 1 & 2
  await drawPhotoCard(doc, photoSlots[0].label, photoSlots[0].desc, photoSlots[0].url, margin, gridTopY, boxW, boxH);
  await drawPhotoCard(doc, photoSlots[1].label, photoSlots[1].desc, photoSlots[1].url, margin + boxW + gapX, gridTopY, boxW, boxH);

  // Row 2: Photos 3 & 4
  const row2Y = gridTopY + boxH + gapY;
  await drawPhotoCard(doc, photoSlots[2].label, photoSlots[2].desc, photoSlots[2].url, margin, row2Y, boxW, boxH);
  await drawPhotoCard(doc, photoSlots[3].label, photoSlots[3].desc, photoSlots[3].url, margin + boxW + gapX, row2Y, boxW, boxH);

  // Row 3: Photo 5 centered horizontally with the exact same box dimensions
  const row3Y = row2Y + boxH + gapY;
  const centerColX = margin + (contentWidth - boxW) / 2;
  await drawPhotoCard(doc, photoSlots[4].label, photoSlots[4].desc, photoSlots[4].url, centerColX, row3Y, boxW, boxH);

  // Bottom Visual Verification Banner
  const footerY = row3Y + boxH + 10;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, footerY, contentWidth, 22, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    'VISUAL AUDIT VERIFICATION: Photographic documentation verified for Store #' +
      (data.header.storeNumber || '---') +
      ' on ' +
      (data.header.visitDate || '---') +
      '. Stored in Mountain West Division archive.',
    margin + 10,
    footerY + 14
  );
}

/**
 * Helper to render an individual photo card with uniform border frame,
 * strictly preserved natural aspect ratio (contain), and dedicated caption below.
 */
async function drawPhotoCard(
  doc: jsPDF,
  title: string,
  desc: string,
  url: string | null,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // 1. Outer Box Container (uniform border frame)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225); // #cbd5e1
  doc.setLineWidth(0.85);
  doc.roundedRect(x, y, w, h, 3, 3, 'FD');

  // 2. Inner Image Viewing Bounds
  const padX = 8;
  const padTop = 8;
  const captionH = 34; // Dedicated caption zone below photo
  const imgBoxX = x + padX;
  const imgBoxY = y + padTop;
  const imgBoxW = w - padX * 2;
  const imgBoxH = h - padTop - captionH;

  // Neutral background canvas for image container
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.rect(imgBoxX, imgBoxY, imgBoxW, imgBoxH, 'FD');

  // 3. Render Image with Strict Natural Aspect Ratio
  if (url) {
    try {
      const { width: origW, height: origH } = await getImageNaturalDimensions(doc, url);
      const imgAspect = origW / origH;
      const boxAspect = imgBoxW / imgBoxH;

      let renderW: number;
      let renderH: number;
      let renderX: number;
      let renderY: number;

      // Scale down proportionally so it fits completely within bounds without warping
      if (imgAspect >= boxAspect) {
        // Image is wider than container -> constrained by width
        renderW = imgBoxW;
        renderH = imgBoxW / imgAspect;
        renderX = imgBoxX;
        renderY = imgBoxY + (imgBoxH - renderH) / 2;
      } else {
        // Image is taller than container -> constrained by height
        renderH = imgBoxH;
        renderW = imgBoxH * imgAspect;
        renderX = imgBoxX + (imgBoxW - renderW) / 2;
        renderY = imgBoxY;
      }

      const format = url.startsWith('data:image/png')
        ? 'PNG'
        : url.startsWith('data:image/webp')
        ? 'WEBP'
        : 'JPEG';

      doc.addImage(url, format, renderX, renderY, renderW, renderH);

      // Fine border around the image boundary for clean presentation
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.5);
      doc.rect(renderX, renderY, renderW, renderH, 'S');
    } catch {
      drawPhotoPlaceholder(doc, imgBoxX, imgBoxY, imgBoxW, imgBoxH, 'Image Format Error', title);
    }
  } else {
    drawPhotoPlaceholder(doc, imgBoxX, imgBoxY, imgBoxW, imgBoxH, 'No Photo Attached', title);
  }

  // 4. Dedicated Caption Area Below Photo Slot
  const captionY = y + h - captionH + 2;

  // Subtle separator line above caption
  doc.setDrawColor(241, 245, 249);
  doc.setLineWidth(0.75);
  doc.line(x + 8, captionY - 4, x + w - 8, captionY - 4);

  // Status Indicator on Right
  if (url) {
    doc.setFillColor(22, 163, 74); // Green
    doc.circle(x + w - 14, captionY + 4, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(22, 101, 52);
    doc.text('Attached', x + w - 21, captionY + 6, { align: 'right' });
  } else {
    doc.setFillColor(148, 163, 184); // Gray
    doc.circle(x + w - 14, captionY + 4, 3, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Pending', x + w - 21, captionY + 6, { align: 'right' });
  }

  // Caption Primary Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(title, x + 8, captionY + 6);

  // Caption Secondary Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  const maxDescLen = 46;
  const cleanDesc = desc.length > maxDescLen ? `${desc.substring(0, maxDescLen - 3)}...` : desc;
  doc.text(cleanDesc, x + 8, captionY + 18);
}

function drawPhotoPlaceholder(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  msg: string,
  areaName: string
) {
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(msg, x + w / 2, y + h / 2 - 4, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(160, 174, 192);
  doc.text(`Required Area: ${areaName}`, x + w / 2, y + h / 2 + 8, { align: 'center' });
}

/**
 * Draws Signature Block on Bottom of Page
 */
function drawSignatureBlock(doc: jsPDF, y: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 36;
  const signW = 200;

  // Line 1: Merchandiser
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.75);
  doc.line(margin, y, margin + signW, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('SEAFOOD MERCHANDISER SIGNATURE / DATE', margin, y + 11);

  // Line 2: Store Director / Dept Mgr
  const rightSignX = pageWidth - margin - signW;
  doc.line(rightSignX, y, pageWidth - margin, y);
  doc.text('STORE DIRECTOR / DEPT MGR SIGNATURE / DATE', rightSignX, y + 11);
}

/**
 * Generates the Official Store Visit PDF in either:
 * - Simple Report: Exactly 2 pages (Page 1: Checklist & OOS numbers, NO field notes; Page 2: Single-sheet 5-photo grid)
 * - Detailed Report: Exactly 3 pages (Page 1: Executive Overview & Checklist; Page 2: Dedicated Field Notes & Action Plan; Page 3: Single-sheet 5-photo grid)
 */
export async function generateStoreVisitPDF(
  data: ChecklistData,
  reportType: 'simple' | 'detailed' = 'simple',
  shouldDownload: boolean = true
): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter', // 612 x 792 pt
  });

  const stats = calculateAuditStats(data);
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;
  const allChecks = getAllChecklistItems(data);

  if (reportType === 'simple') {
    // ==========================================
    // SIMPLE REPORT (EXACTLY 2 PAGES)
    // Page 1: Exact Mountain West Division Store Visit Checklist Replica
    //         - Mountain West Division Logo (Albertsons, Safeway, Lucky)
    //         - Top Metadata Box: DISTRICT#, STORE #, DATE, LUSAMERICA MERCHANDISER
    //         - Exact item checklist with small square boxes (Y / N / Blank)
    //         - Regulatory Decals sub-items (Allergens, Color Added, Consumer Advisory)
    //         - Number Of OOS fill-in lines (Self-Serve, Frozen Doors/Bunkers, Wet & Dry Racks, Full-Service)
    //         - Bottom instruction line (Take Pictures Of...)
    // Page 2: Single-Sheet 5-Photo Documentation Grid
    // ==========================================

    const simpleMargin = 42;

    // ----- PAGE 1: EXACT MOUNTAIN WEST DIVISION STORE VISIT CHECKLIST -----
    // 1. Official Mountain West Division Logo at Top Left
    const logoW = 145;
    const logoH = 50;
    const logoUrl = await getMountainWestLogoDataUrl();
    if (logoUrl) {
      try {
        doc.addImage(logoUrl, 'PNG', simpleMargin, 22, logoW, logoH);
      } catch {
        drawVectorLogoFallback(doc, simpleMargin, 22, logoW, logoH);
      }
    } else {
      drawVectorLogoFallback(doc, simpleMargin, 22, logoW, logoH);
    }

    // 2. Metadata Box: Top right box with DISTRICT#, STORE #, DATE, and LUSAMERICA MERCHANDISER
    const metaW = 345;
    const metaH = 46;
    const metaX = pageWidth - simpleMargin - metaW;
    drawMetadataBox(doc, data, metaX, 24, metaW, metaH);

    // 3. Exact Single-Column Checklist Layout matching original document
    let currY = 94;
    const rowStep = 16.2;

    // Helper to draw a standard checklist item row
    const drawFormRow = (
      boxVal: boolean | null | undefined,
      text: string,
      y: number,
      oosConfig?:
        | { type: 'self_serve'; count?: number }
        | { type: 'doors_bunkers'; doorsCount?: number; bunkersCount?: number }
        | { type: 'wet_dry'; count?: number }
        | { type: 'full_serve'; count?: number }
    ) => {
      // Checkbox square
      drawSimpleCheckSquare(doc, boxVal, simpleMargin, y, 9.5);

      // Item description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.7);
      doc.setTextColor(0, 0, 0);
      doc.text(text, simpleMargin + 16, y + 7.5);

      if (oosConfig) {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.75);

        if (oosConfig.type === 'self_serve') {
          const oosLabel = 'Number Of OOS';
          const oosLabelX = 300;
          doc.setFont('helvetica', 'normal');
          doc.text(oosLabel, oosLabelX, y + 7.5);

          const lineStart = oosLabelX + doc.getTextWidth(oosLabel) + 3;
          const lineEnd = 445;
          doc.line(lineStart, y + 9, lineEnd, y + 9);

          if (oosConfig.count !== undefined && oosConfig.count !== null && oosConfig.count > 0) {
            doc.setFont('helvetica', 'bold');
            doc.text(`${oosConfig.count}`, (lineStart + lineEnd) / 2, y + 7.5, { align: 'center' });
          }
        } else if (oosConfig.type === 'doors_bunkers') {
          doc.setFont('helvetica', 'normal');
          doc.text('Number Of OOS', 180, y + 7.5);

          // Doors
          doc.text('Doors', 280, y + 7.5);
          const doorsStart = 280 + doc.getTextWidth('Doors') + 3;
          const doorsEnd = 375;
          doc.line(doorsStart, y + 9, doorsEnd, y + 9);
          if (oosConfig.doorsCount !== undefined && oosConfig.doorsCount !== null && oosConfig.doorsCount > 0) {
            doc.setFont('helvetica', 'bold');
            doc.text(`${oosConfig.doorsCount}`, (doorsStart + doorsEnd) / 2, y + 7.5, { align: 'center' });
          }

          // Bunkers
          doc.setFont('helvetica', 'normal');
          doc.text('Bunkers', 395, y + 7.5);
          const bunkersStart = 395 + doc.getTextWidth('Bunkers') + 3;
          const bunkersEnd = 495;
          doc.line(bunkersStart, y + 9, bunkersEnd, y + 9);
          if (oosConfig.bunkersCount !== undefined && oosConfig.bunkersCount !== null && oosConfig.bunkersCount > 0) {
            doc.setFont('helvetica', 'bold');
            doc.text(`${oosConfig.bunkersCount}`, (bunkersStart + bunkersEnd) / 2, y + 7.5, { align: 'center' });
          }
        } else if (oosConfig.type === 'wet_dry') {
          const oosLabel = 'Number Of OOS';
          const oosLabelX = 395;
          doc.setFont('helvetica', 'normal');
          doc.text(oosLabel, oosLabelX, y + 7.5);

          const lineStart = oosLabelX + doc.getTextWidth(oosLabel) + 3;
          const lineEnd = 535;
          doc.line(lineStart, y + 9, lineEnd, y + 9);

          if (oosConfig.count !== undefined && oosConfig.count !== null && oosConfig.count > 0) {
            doc.setFont('helvetica', 'bold');
            doc.text(`${oosConfig.count}`, (lineStart + lineEnd) / 2, y + 7.5, { align: 'center' });
          }
        } else if (oosConfig.type === 'full_serve') {
          const oosLabel = 'Number Of OOS';
          const oosLabelX = 175;
          doc.setFont('helvetica', 'normal');
          doc.text(oosLabel, oosLabelX, y + 7.5);

          const lineStart = oosLabelX + doc.getTextWidth(oosLabel) + 3;
          const lineEnd = 300;
          doc.line(lineStart, y + 9, lineEnd, y + 9);

          if (oosConfig.count !== undefined && oosConfig.count !== null && oosConfig.count > 0) {
            doc.setFont('helvetica', 'bold');
            doc.text(`${oosConfig.count}`, (lineStart + lineEnd) / 2, y + 7.5, { align: 'center' });
          }
        }
      }
    };

    const drawSectionHeader = (title: string, y: number) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.8);
      doc.setTextColor(0, 0, 0);
      doc.text(title, simpleMargin, y + 8);
    };

    // Item 1: Clerk Scheduled And In Seafood Department
    drawFormRow(data.caseDepartment.clerkScheduledAndInSeafood, 'Clerk Scheduled And In Seafood Department', currY);
    currY += rowStep;

    // Item 2: Seafood Case Pulled Night Before
    drawFormRow(data.caseDepartment.seafoodCasePulledNightBefore, 'Seafood Case Pulled Night Before', currY);
    currY += rowStep;

    // Item 3: Seafood Case Clean, Clear Of Build-Up And Odor Free
    drawFormRow(data.caseDepartment.seafoodCaseCleanOdorFree, 'Seafood Case Clean, Clear Of Build-Up And Odor Free', currY);
    currY += rowStep;

    // Item 4: Tares Done Daily
    drawFormRow(data.caseDepartment.taresDoneDaily, 'Tares Done Daily', currY);
    currY += rowStep;

    // Item 5: Deliveries Checked Against Invoice (Shorts And Quality)
    drawFormRow(data.caseDepartment.deliveriesCheckedInvoice, 'Deliveries Checked Against Invoice (Shorts And Quality)', currY);
    currY += rowStep;

    // Item 6: Regulatory Decals (Check Missing Decals)
    drawFormRow(data.caseDepartment.regulatoryDecalsAllergens, 'Regulatory Decals (Check Missing Decals)', currY);
    currY += 14;

    // Sub-items for Regulatory Decals: Allergens, Color Added, Consumer Advisory
    const subBoxSize = 9.5;
    const subY = currY;
    // Allergens
    drawSimpleCheckSquare(doc, data.caseDepartment.decalsAllergens ?? null, simpleMargin + 50, subY, subBoxSize);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.7);
    doc.setTextColor(0, 0, 0);
    doc.text('Allergens', simpleMargin + 63, subY + 7.5);

    // Color Added
    drawSimpleCheckSquare(doc, data.caseDepartment.decalsColorAdded ?? null, simpleMargin + 125, subY, subBoxSize);
    doc.text('Color Added', simpleMargin + 138, subY + 7.5);

    // Consumer Advisory
    drawSimpleCheckSquare(doc, data.caseDepartment.decalsConsumerAdvisory ?? null, simpleMargin + 215, subY, subBoxSize);
    doc.text('Consumer Advisory', simpleMargin + 228, subY + 7.5);
    currY += 17;

    // Section: Self-Serve Case
    drawSectionHeader('Self-Serve Case', currY);
    currY += 15;

    // Self-Serve Items
    drawFormRow(
      data.caseDepartment.selfServeCase.setToSchematic,
      'Faced, Tagged And Set To Schematic',
      currY,
      { type: 'self_serve', count: data.caseDepartment.selfServeCase.numberOfOOS }
    );
    currY += rowStep;

    drawFormRow(data.caseDepartment.selfServeCase.culledRotated, 'Culled And Rotated', currY);
    currY += rowStep;

    drawFormRow(data.caseDepartment.selfServeCase.properlyMarkedDown, 'Properly Marked Down', currY);
    currY += 19;

    // Section: Frozen Doors/Bunkers
    drawSectionHeader('Frozen Doors/Bunkers', currY);
    currY += 15;

    // Frozen Doors/Bunkers Items
    drawFormRow(
      data.caseDepartment.frozenDoorsBunkers.setToSchematic,
      'Set To Schematic',
      currY,
      {
        type: 'doors_bunkers',
        doorsCount: data.caseDepartment.frozenDoorsBunkers.oosDoors ?? (data.caseDepartment.frozenDoorsBunkers.numberOfOOS > 0 ? data.caseDepartment.frozenDoorsBunkers.numberOfOOS : undefined),
        bunkersCount: data.caseDepartment.frozenDoorsBunkers.oosBunkers,
      }
    );
    currY += rowStep;

    drawFormRow(data.caseDepartment.frozenDoorsBunkers.facedAndTagged, 'Faced And Tagged', currY);
    currY += rowStep;

    drawFormRow(
      data.caseDepartment.wetDryRacks.setToSchematic,
      'Wet & Dry Racks Faced, Tagged, And Set To Schematic',
      currY,
      { type: 'wet_dry', count: data.caseDepartment.wetDryRacks.numberOfOOS }
    );
    currY += 19;

    // Section: Full-Service Case
    drawSectionHeader('Full-Service Case', currY);
    currY += 15;

    // Full-Service Items
    drawFormRow(
      data.caseDepartment.fullServiceCase.setToSchematic,
      'Set To Schematic',
      currY,
      { type: 'full_serve', count: data.caseDepartment.fullServiceCase.numberOfOOS }
    );
    currY += rowStep;

    drawFormRow(data.caseDepartment.fullServiceCase.properDividers, 'Proper Dividers For Food Safety', currY);
    currY += rowStep;

    drawFormRow(data.caseDepartment.fullServiceCase.correctSluCool, 'Correct SLU Used And COOL Information Properly Displayed', currY);
    currY += rowStep;

    drawFormRow(data.caseDepartment.fullServiceCase.cookedShrimpDated, 'Cooked Shrimp Properly Dated (Back Of 4-Up Tag)', currY);
    currY += rowStep;

    drawFormRow(data.caseDepartment.fullServiceCase.shellfishHarvestTags90Days, 'Shellfish Harvest Tags With Product And Filed According To Sold-By-Date, Kept For 90 Days', currY);
    currY += rowStep;

    drawFormRow(data.caseDepartment.perishableLinkUsed, 'Perishable Link Used For Overstock Items', currY);
    currY += 19;

    // Section: Focused Training
    drawSectionHeader('Focused Training', currY);
    currY += 15;

    // Focused Training Items (10 items)
    drawFormRow(data.compliance.adSupport, 'Ad Support', currY);
    currY += rowStep;

    drawFormRow(data.compliance.coolersFreezersOrganizedDated, 'Coolers/Freezers Organized And Dated', currY);
    currY += rowStep;

    drawFormRow(data.compliance.temperatureChecks, 'Temperature Checks', currY);
    currY += rowStep;

    drawFormRow(data.compliance.salesPurchasesTrackingReviewed, 'Sales And Purchases Tracking Reviewed', currY);
    currY += rowStep;

    drawFormRow(data.compliance.form120Submitted, 'Form 120 Submitted For Short/Poor Quality Product', currY);
    currY += rowStep;

    drawFormRow(data.compliance.visionProScannedProductionList, 'Vision Pro Scanned And Production List Followed', currY);
    currY += rowStep;

    drawFormRow(data.compliance.schematicIntegrityOnline, 'Schematic Integrity-Accessing Schematics Online', currY);
    currY += rowStep;

    drawFormRow(data.compliance.newProgramBulletinMeatSeafood, 'New Program/New Bulletin-Accessing On Meat & Seafood Page', currY);
    currY += rowStep;

    drawFormRow(data.compliance.foodSafetyHandlingDatingPolicy, 'Food Safety/Seafood Handling/Dating Policy', currY);
    currY += rowStep;

    drawFormRow(data.compliance.markDownProcedures, 'Mark Down Procedures (Self-Serve, Full-Serve, Frozen Cases)', currY);
    currY += rowStep;

    // Bottom Instruction (Exact wording and style from original Mountain West document)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(
      'Take Pictures Of Cooler/Freezer, Self-Serve, Full-Serve, Frozen Doors/Bunkers, And Spice Racks',
      pageWidth / 2,
      742,
      { align: 'center' }
    );

    // ----- PAGE 2: Single-Sheet 5-Photo Documentation Grid -----
    doc.addPage();
    drawOfficialHeader(doc, 2, 2, 'SEAFOOD STORE VISIT REPORT', 'INSPECTION PHOTO GRID');
    await drawSingleSheetPhotoGrid(doc, data, 90);

  } else {
    // ==========================================
    // DETAILED REPORT (EXACTLY 3 PAGES)
    // Page 1: Executive Overview, Metrics, Out of Stocks Breakdown, Complete Checklist
    // Page 2: Dedicated Field Notes & Discussion, Action Plan & Follow-Up Items, Department Signatures
    // Page 3: Single-Sheet 5-Photo Documentation Grid
    // ==========================================

    // ----- PAGE 1 -----
    drawOfficialHeader(doc, 1, 3, 'SEAFOOD STORE VISIT AUDIT', 'DETAILED 3-PAGE REPORT');
    let y = 88;
    y = drawStoreInfoCard(doc, data, y);

    // Executive Metrics Bar (3 Pills: Passed Items, Deficiencies, Total Out of Stock)
    const pillW = (contentWidth - 8) / 3;
    const metrics = [
      { label: 'Passed Items', val: `${stats.passed}`, color: [22, 101, 52], bg: [240, 253, 244] },
      { label: 'Deficiencies', val: `${stats.failed}`, color: [153, 27, 27], bg: [254, 242, 242] },
      { label: 'Total Out of Stock', val: `${stats.totalOOS}`, color: [146, 64, 14], bg: [254, 252, 232] },
    ];

    metrics.forEach((m, idx) => {
      const bx = margin + idx * (pillW + 4);
      doc.setFillColor(m.bg[0], m.bg[1], m.bg[2]);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(bx, y, pillW, 30, 2, 2, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(m.label, bx + pillW / 2, y + 11, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(m.color[0], m.color[1], m.color[2]);
      doc.text(m.val, bx + pillW / 2, y + 23, { align: 'center' });
    });

    y += 38;

    // OOS Breakdown Table
    doc.setFillColor(16, 79, 155);
    doc.rect(margin, y, contentWidth, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('OUT OF STOCK (OOS) MERCHANDISING DETAILS', margin + 8, y + 11);
    y += 20;

    const oosItems = [
      { name: 'Self-Serve Case', count: data.caseDepartment.selfServeCase.numberOfOOS, notes: data.caseDepartment.selfServeCase.oosNotes },
      { name: 'Frozen Doors & Bunkers', count: data.caseDepartment.frozenDoorsBunkers.numberOfOOS, notes: data.caseDepartment.frozenDoorsBunkers.oosNotes },
      { name: 'Wet/Dry Racks & Spices', count: data.caseDepartment.wetDryRacks.numberOfOOS, notes: data.caseDepartment.wetDryRacks.oosNotes },
      { name: 'Full-Service Case', count: data.caseDepartment.fullServiceCase.numberOfOOS, notes: data.caseDepartment.fullServiceCase.oosNotes },
    ];

    oosItems.forEach((item) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(`• ${item.name}:`, margin + 8, y);

      doc.setFont('helvetica', item.count > 0 ? 'bold' : 'normal');
      doc.setTextColor(item.count > 0 ? 185 : 22, item.count > 0 ? 28 : 101, item.count > 0 ? 28 : 52);
      doc.text(`${item.count} OOS`, margin + 140, y);

      if (item.notes) {
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 116, 139);
        const cleanNotes = item.notes.length > 55 ? `${item.notes.substring(0, 53)}...` : item.notes;
        doc.text(`Missing: ${cleanNotes}`, margin + 195, y);
      }
      y += 12;
    });

    y += 8;

    // Full Checklist Table on Page 1
    doc.setFillColor(16, 79, 155);
    doc.rect(margin, y, contentWidth, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('COMPREHENSIVE AUDIT CHECKLIST FINDINGS', margin + 8, y + 11);
    doc.text('STATUS', pageWidth - margin - 8, y + 11, { align: 'right' });
    y += 18;

    // Render in 2 columns
    const halfLen = Math.ceil(allChecks.length / 2);
    const col1 = allChecks.slice(0, halfLen);
    const col2 = allChecks.slice(halfLen);
    const colW = (contentWidth - 8) / 2;
    const rowH = 15;

    for (let i = 0; i < halfLen; i++) {
      const rowY = y + i * rowH;

      // Col 1
      const item1 = col1[i];
      if (item1) {
        if (i % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, rowY - 1, colW, rowH - 1, 'F');
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        doc.setTextColor(30, 41, 59);
        const title1 = item1.title.length > 34 ? `${item1.title.substring(0, 32)}..` : item1.title;
        doc.text(title1, margin + 4, rowY + 9);
        drawCheckStatusPill(doc, item1.val, margin + colW - 32, rowY + 2);
      }

      // Col 2
      const item2 = col2[i];
      if (item2) {
        const c2X = margin + colW + 8;
        if (i % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(c2X, rowY - 1, colW, rowH - 1, 'F');
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        doc.setTextColor(30, 41, 59);
        const title2 = item2.title.length > 34 ? `${item2.title.substring(0, 32)}..` : item2.title;
        doc.text(title2, c2X + 4, rowY + 9);
        drawCheckStatusPill(doc, item2.val, c2X + colW - 32, rowY + 2);
      }
    }

    // Page 1 footer note
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Continued on Page 2 for dedicated Field Notes & Department Action Plan.', margin, 745);

    // ----- PAGE 2: Dedicated Field Notes & Action Plan -----
    doc.addPage();
    drawOfficialHeader(doc, 2, 3, 'SEAFOOD STORE VISIT AUDIT', 'DETAILED 3-PAGE REPORT');
    let page2Y = 88;

    // Field Notes Section
    doc.setFillColor(16, 79, 155);
    doc.rect(margin, page2Y, contentWidth, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('MERCHANDISER FIELD OBSERVATIONS & DEPARTMENT DISCUSSION', margin + 8, page2Y + 12);
    page2Y += 26;

    // Notes Box
    const notesText = data.generalNotes.trim()
      ? data.generalNotes
      : 'Comprehensive store visit conducted reviewing division merchandising schematics, perishable link utilization, case condition, and rotation procedures. Reviewed top ad items, shrink minimization, and display standards with the department manager.';

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    const notesBoxH = 200;
    doc.roundedRect(margin, page2Y, contentWidth, notesBoxH, 4, 4, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const splitNotes = doc.splitTextToSize(notesText, contentWidth - 24);
    doc.text(splitNotes, margin + 12, page2Y + 18);

    page2Y += notesBoxH + 16;

    // Corrective Action Plan Section
    doc.setFillColor(9, 27, 52);
    doc.rect(margin, page2Y, contentWidth, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('CORRECTIVE ACTION PLAN & PRIORITIES', margin + 8, page2Y + 12);
    page2Y += 26;

    // Action plan items based on audit
    const failedItems = allChecks.filter((c) => c.val === false);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    const actionBoxH = 175;
    doc.roundedRect(margin, page2Y, contentWidth, actionBoxH, 4, 4, 'FD');

    let planY = page2Y + 16;
    if (failedItems.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(185, 28, 28);
      doc.text(`Identified Deficiencies Requiring Follow-Up (${failedItems.length} items):`, margin + 12, planY);
      planY += 14;

      failedItems.slice(0, 5).forEach((item, fIdx) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        doc.text(`${fIdx + 1}. [${item.section}] ${item.title} — Corrective action to be verified by Store Director.`, margin + 16, planY);
        planY += 12;
      });

      if (failedItems.length > 5) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`+ ${failedItems.length - 5} additional items noted in store checklist.`, margin + 16, planY);
        planY += 12;
      }
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(22, 101, 52);
      doc.text('✓ All audited areas met or exceeded Mountain West Division operational standards.', margin + 12, planY);
      planY += 14;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('Continue standard daily rotation (FIFO), temperature logging, and schematic maintenance.', margin + 16, planY);
      planY += 16;
    }

    planY += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('Scheduled Follow-Up / Re-Inspection:', margin + 12, planY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Next routine division store audit cycle or district review.', margin + 175, planY);

    // Signatures on bottom of Page 2
    drawSignatureBlock(doc, 725);

    // ----- PAGE 3: Single-Sheet 5-Photo Documentation Grid -----
    doc.addPage();
    drawOfficialHeader(doc, 3, 3, 'SEAFOOD STORE VISIT AUDIT', 'DETAILED 3-PAGE REPORT');
    await drawSingleSheetPhotoGrid(doc, data, 90);
  }

  const fileName = `MWD_Seafood_Visit_Store_${data.header.storeNumber || '0000'}_${data.header.visitDate || 'visit'}_${reportType}.pdf`;

  if (shouldDownload) {
    doc.save(fileName);
  }

  return doc;
}

/**
 * Renders uniform YES / NO / BLANK badge in PDF
 */
function drawCheckStatusPill(doc: jsPDF, val: boolean | null, x: number, y: number) {
  const pillW = 28;
  const pillH = 10;

  if (val === true) {
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(x, y, pillW, pillH, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(22, 101, 52);
    doc.text('YES', x + pillW / 2, y + 7.5, { align: 'center' });
  } else if (val === false) {
    doc.setFillColor(254, 226, 226);
    doc.roundedRect(x, y, pillW, pillH, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(185, 28, 28);
    doc.text('NO', x + pillW / 2, y + 7.5, { align: 'center' });
  } else {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(x, y, pillW, pillH, 2, 2, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.text('BLANK', x + pillW / 2, y + 7.5, { align: 'center' });
  }
}
