import React, { useState } from 'react';
import { ChecklistData } from '../types';
import { calculateAuditStats } from '../utils/historyStorage';
import { generateStoreVisitPDF } from '../utils/pdfGenerator';
import { shareStoreVisitPDF } from '../utils/pdfShare';
import { MountainWestLogo } from './MountainWestLogo';
import {
  X,
  Printer,
  FileDown,
  Share2,
  CheckCircle2,
  XCircle,
  FileText,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ChecklistData;
  initialReportType?: 'simple' | 'detailed';
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
  initialReportType = 'simple',
}) => {
  const [reportType, setReportType] = useState<'simple' | 'detailed'>(initialReportType);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const stats = calculateAuditStats(data);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateStoreVisitPDF(data, reportType, true);
    } catch (e) {
      console.error('Failed to download PDF:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const checksList = [
    { section: 'Dept Operations', title: 'Clerk Scheduled & In Seafood', val: data.caseDepartment.clerkScheduledAndInSeafood },
    { section: 'Dept Operations', title: 'Seafood Case Pulled Night Before', val: data.caseDepartment.seafoodCasePulledNightBefore },
    { section: 'Dept Operations', title: 'Seafood Case Clean & Odor Free', val: data.caseDepartment.seafoodCaseCleanOdorFree },
    { section: 'Dept Operations', title: 'Scale Tares Done Daily', val: data.caseDepartment.taresDoneDaily },
    { section: 'Dept Operations', title: 'Deliveries Checked Against Invoice', val: data.caseDepartment.deliveriesCheckedInvoice },
    { section: 'Dept Operations', title: 'Regulatory Decals & Allergens in Place', val: data.caseDepartment.regulatoryDecalsAllergens },
    { section: 'Dept Operations', title: 'Perishable Link Tool Used', val: data.caseDepartment.perishableLinkUsed },

    { section: 'Full-Service Case', title: 'Set to Division Schematic', val: data.caseDepartment.fullServiceCase.setToSchematic },
    { section: 'Full-Service Case', title: 'Proper Dividers / Cross-Contact Prevention', val: data.caseDepartment.fullServiceCase.properDividers },
    { section: 'Full-Service Case', title: 'Correct SLU & COOL Tags', val: data.caseDepartment.fullServiceCase.correctSluCool },
    { section: 'Full-Service Case', title: 'Cooked Shrimp Dated & Separated', val: data.caseDepartment.fullServiceCase.cookedShrimpDated },
    { section: 'Full-Service Case', title: 'Shellfish Harvest Tags Kept 90 Days', val: data.caseDepartment.fullServiceCase.shellfishHarvestTags90Days },

    { section: 'Self-Serve Case', title: 'Faced to Front 100%', val: data.caseDepartment.selfServeCase.faced },
    { section: 'Self-Serve Case', title: 'Price Tagged 100%', val: data.caseDepartment.selfServeCase.tagged },
    { section: 'Self-Serve Case', title: 'Set to Division Schematic', val: data.caseDepartment.selfServeCase.setToSchematic },
    { section: 'Self-Serve Case', title: 'Culled & Rotated (FIFO)', val: data.caseDepartment.selfServeCase.culledRotated },
    { section: 'Self-Serve Case', title: 'Markdown Procedures Followed', val: data.caseDepartment.selfServeCase.properlyMarkedDown },

    { section: 'Frozen & Dry', title: 'Frozen Doors/Bunkers: Set to Schematic', val: data.caseDepartment.frozenDoorsBunkers.setToSchematic },
    { section: 'Frozen & Dry', title: 'Frozen Doors/Bunkers: Faced & Tagged', val: data.caseDepartment.frozenDoorsBunkers.facedAndTagged },
    { section: 'Frozen & Dry', title: 'Wet/Dry Racks: Faced & Tagged', val: data.caseDepartment.wetDryRacks.faced },

    { section: 'Compliance', title: '1. Ad Support & Price Integrity', val: data.compliance.adSupport },
    { section: 'Compliance', title: '2. Walk-In Coolers & Freezers Organized', val: data.compliance.coolersFreezersOrganizedDated },
    { section: 'Compliance', title: '3. Temperature Checks & Logs (<38°F)', val: data.compliance.temperatureChecks },
    { section: 'Compliance', title: '4. Sales & Purchases Tracking Reviewed', val: data.compliance.salesPurchasesTrackingReviewed },
    { section: 'Compliance', title: '5. Form 120 Submitted (Shrink / Credits)', val: data.compliance.form120Submitted },
    { section: 'Compliance', title: '6. Vision Pro Scanned Production List', val: data.compliance.visionProScannedProductionList },
    { section: 'Compliance', title: '7. Schematic Integrity Online (ePOG)', val: data.compliance.schematicIntegrityOnline },
    { section: 'Compliance', title: '8. New Program Bulletin Meat & Seafood', val: data.compliance.newProgramBulletinMeatSeafood },
    { section: 'Compliance', title: '9. Food Safety Handling & Sanitizer Levels', val: data.compliance.foodSafetyHandlingDatingPolicy },
    { section: 'Compliance', title: '10. Markdown Procedures & Freshness Protocol', val: data.compliance.markDownProcedures },
  ];

  const photoSlots = [
    { label: '1. Full-Service Case', desc: 'Merchandising, ice bed, dividers & SLU tags', url: data.photos.fullServe },
    { label: '2. Self-Serve Case', desc: '100% faced, 100% tagged, rotation & markdowns', url: data.photos.selfServe },
    { label: '3. Frozen Doors & Bunkers', desc: 'Frozen seafood variety, schematics & condition', url: data.photos.frozenDoorsBunkers },
    { label: '4. Walk-In Cooler & Freezers', desc: 'Storage organization, dating & FIFO rotation', url: data.photos.coolerFreezer },
    { label: '5. Spice Racks & Dry Displays', desc: 'Coatings, marinades, cedar planks & sauces', url: data.photos.spiceRacks },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 rounded-2xl max-w-2xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden my-auto">
        {/* Top Modal Navigation */}
        <div className="bg-[#091b34] text-white px-4 py-3 flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-2">
            <MountainWestLogo variant="compact" />
          </div>

          <div className="flex items-center gap-1.5">
            {/* Report Type Selector */}
            <div className="flex bg-blue-950 p-0.5 rounded-lg border border-blue-800 text-xs font-semibold mr-1">
              <button
                type="button"
                onClick={() => setReportType('simple')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  reportType === 'simple'
                    ? 'bg-[#104f9b] text-white shadow-xs'
                    : 'text-blue-300 hover:text-white'
                }`}
              >
                Simple (2-Pg)
              </button>
              <button
                type="button"
                onClick={() => setReportType('detailed')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  reportType === 'detailed'
                    ? 'bg-[#104f9b] text-white shadow-xs'
                    : 'text-blue-300 hover:text-white'
                }`}
              >
                Detailed (3-Pg)
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-200 hover:text-white transition-colors cursor-pointer"
              title="Print document"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating}
              className="p-2 rounded-lg bg-[#104f9b] hover:bg-[#0c4080] text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="Download PDF"
            >
              <FileDown className="w-4 h-4" />
              <span className="hidden xs:inline">PDF</span>
            </button>
            <button
              type="button"
              onClick={() => shareStoreVisitPDF(data, reportType)}
              className="p-2 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-200 hover:text-white transition-colors cursor-pointer"
              title="Share report"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Simulation */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-slate-200/80 space-y-6">
          {/* PAGE 1 SIMULATION */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-300 max-w-xl mx-auto text-slate-900 font-sans">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 text-right">
              {reportType === 'simple' ? 'PAGE 1 OF 2 • OFFICIAL AUDIT CHECKLIST' : 'PAGE 1 OF 3 • EXECUTIVE AUDIT'}
            </div>

            {reportType === 'simple' ? (
              /* Simple Report Authentic Paper Form Header & Metadata Box */
              <div className="space-y-3 mb-4 font-sans">
                {/* Top Header: Logo on left, 2-Row Metadata Box on right */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-300 pb-3">
                  <div className="p-0.5">
                    <MountainWestLogo variant="full" size="md" />
                  </div>
                  <div className="border border-slate-900 rounded-sm bg-white text-[11px] p-2 sm:min-w-[320px] divide-y divide-slate-300">
                    <div className="flex items-center justify-between gap-3 pb-1.5 text-[10px]">
                      <div>
                        <span className="font-bold text-slate-900">DISTRICT# </span>
                        <span className="font-semibold underline decoration-slate-400">{data.header.districtNumber || '______'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">STORE # </span>
                        <span className="font-semibold underline decoration-slate-400">{data.header.storeNumber || '______'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">DATE </span>
                        <span className="font-semibold underline decoration-slate-400">{data.header.visitDate || '________'}</span>
                      </div>
                    </div>
                    <div className="pt-1.5 text-[10px]">
                      <span className="font-bold text-slate-900">LUSAMERICA MERCHANDISER </span>
                      <span className="font-semibold underline decoration-slate-400">{data.header.merchandiserName || '________________________'}</span>
                    </div>
                  </div>
                </div>

                {/* Single-Column Checklist matching physical form */}
                <div className="space-y-1.5 text-xs text-slate-900">
                  {/* Item 1 */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                      {data.caseDepartment.clerkScheduledAndInSeafood === true ? 'Y' : data.caseDepartment.clerkScheduledAndInSeafood === false ? <span className="text-rose-600">N</span> : null}
                    </div>
                    <span>Clerk Scheduled And In Seafood Department</span>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                      {data.caseDepartment.seafoodCasePulledNightBefore === true ? 'Y' : data.caseDepartment.seafoodCasePulledNightBefore === false ? <span className="text-rose-600">N</span> : null}
                    </div>
                    <span>Seafood Case Pulled Night Before</span>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                      {data.caseDepartment.seafoodCaseCleanOdorFree === true ? 'Y' : data.caseDepartment.seafoodCaseCleanOdorFree === false ? <span className="text-rose-600">N</span> : null}
                    </div>
                    <span>Seafood Case Clean, Clear Of Build-Up And Odor Free</span>
                  </div>

                  {/* Item 4 */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                      {data.caseDepartment.taresDoneDaily === true ? 'Y' : data.caseDepartment.taresDoneDaily === false ? <span className="text-rose-600">N</span> : null}
                    </div>
                    <span>Tares Done Daily</span>
                  </div>

                  {/* Item 5 */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                      {data.caseDepartment.deliveriesCheckedInvoice === true ? 'Y' : data.caseDepartment.deliveriesCheckedInvoice === false ? <span className="text-rose-600">N</span> : null}
                    </div>
                    <span>Deliveries Checked Against Invoice (Shorts And Quality)</span>
                  </div>

                  {/* Item 6: Regulatory Decals */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                      {data.caseDepartment.regulatoryDecalsAllergens === true ? 'Y' : data.caseDepartment.regulatoryDecalsAllergens === false ? <span className="text-rose-600">N</span> : null}
                    </div>
                    <span>Regulatory Decals (Check Missing Decals)</span>
                  </div>

                  {/* Sub-items for Regulatory Decals */}
                  <div className="flex items-center gap-6 pl-8 text-[11px] text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 border border-slate-700 rounded-xs flex items-center justify-center font-bold text-[9px] shrink-0 bg-white">
                        {data.caseDepartment.decalsAllergens === true ? 'Y' : data.caseDepartment.decalsAllergens === false ? <span className="text-rose-600">N</span> : null}
                      </div>
                      <span>Allergens</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 border border-slate-700 rounded-xs flex items-center justify-center font-bold text-[9px] shrink-0 bg-white">
                        {data.caseDepartment.decalsColorAdded === true ? 'Y' : data.caseDepartment.decalsColorAdded === false ? <span className="text-rose-600">N</span> : null}
                      </div>
                      <span>Color Added</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 border border-slate-700 rounded-xs flex items-center justify-center font-bold text-[9px] shrink-0 bg-white">
                        {data.caseDepartment.decalsConsumerAdvisory === true ? 'Y' : data.caseDepartment.decalsConsumerAdvisory === false ? <span className="text-rose-600">N</span> : null}
                      </div>
                      <span>Consumer Advisory</span>
                    </div>
                  </div>

                  {/* Section: Self-Serve Case */}
                  <div className="pt-2 font-bold text-[13px] text-slate-900">Self-Serve Case</div>

                  {/* Faced, Tagged And Set To Schematic + Number Of OOS */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                        {data.caseDepartment.selfServeCase.setToSchematic === true ? 'Y' : data.caseDepartment.selfServeCase.setToSchematic === false ? <span className="text-rose-600">N</span> : null}
                      </div>
                      <span>Faced, Tagged And Set To Schematic</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 text-[11px]">
                      <span>Number Of OOS</span>
                      <span className="font-bold underline decoration-slate-800 px-2 min-w-[36px] text-center">
                        {data.caseDepartment.selfServeCase.numberOfOOS > 0 ? data.caseDepartment.selfServeCase.numberOfOOS : '______'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                      {data.caseDepartment.selfServeCase.culledRotated === true ? 'Y' : data.caseDepartment.selfServeCase.culledRotated === false ? <span className="text-rose-600">N</span> : null}
                    </div>
                    <span>Culled And Rotated</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                      {data.caseDepartment.selfServeCase.properlyMarkedDown === true ? 'Y' : data.caseDepartment.selfServeCase.properlyMarkedDown === false ? <span className="text-rose-600">N</span> : null}
                    </div>
                    <span>Properly Marked Down</span>
                  </div>

                  {/* Section: Frozen Doors/Bunkers */}
                  <div className="pt-2 font-bold text-[13px] text-slate-900">Frozen Doors/Bunkers</div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                        {data.caseDepartment.frozenDoorsBunkers.setToSchematic === true ? 'Y' : data.caseDepartment.frozenDoorsBunkers.setToSchematic === false ? <span className="text-rose-600">N</span> : null}
                      </div>
                      <span>Set To Schematic</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span>Number Of OOS</span>
                      <span>Doors</span>
                      <span className="font-bold underline decoration-slate-800 px-1 min-w-[28px] text-center">
                        {data.caseDepartment.frozenDoorsBunkers.oosDoors ?? (data.caseDepartment.frozenDoorsBunkers.numberOfOOS > 0 ? data.caseDepartment.frozenDoorsBunkers.numberOfOOS : '______')}
                      </span>
                      <span>Bunkers</span>
                      <span className="font-bold underline decoration-slate-800 px-1 min-w-[28px] text-center">
                        {data.caseDepartment.frozenDoorsBunkers.oosBunkers ?? '______'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                      {data.caseDepartment.frozenDoorsBunkers.facedAndTagged === true ? 'Y' : data.caseDepartment.frozenDoorsBunkers.facedAndTagged === false ? <span className="text-rose-600">N</span> : null}
                    </div>
                    <span>Faced And Tagged</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                        {data.caseDepartment.wetDryRacks.setToSchematic === true ? 'Y' : data.caseDepartment.wetDryRacks.setToSchematic === false ? <span className="text-rose-600">N</span> : null}
                      </div>
                      <span>Wet & Dry Racks Faced, Tagged, And Set To Schematic</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 text-[11px]">
                      <span>Number Of OOS</span>
                      <span className="font-bold underline decoration-slate-800 px-2 min-w-[36px] text-center">
                        {data.caseDepartment.wetDryRacks.numberOfOOS > 0 ? data.caseDepartment.wetDryRacks.numberOfOOS : '______'}
                      </span>
                    </div>
                  </div>

                  {/* Section: Full-Service Case */}
                  <div className="pt-2 font-bold text-[13px] text-slate-900">Full-Service Case</div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                        {data.caseDepartment.fullServiceCase.setToSchematic === true ? 'Y' : data.caseDepartment.fullServiceCase.setToSchematic === false ? <span className="text-rose-600">N</span> : null}
                      </div>
                      <span>Set To Schematic</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 text-[11px]">
                      <span>Number Of OOS</span>
                      <span className="font-bold underline decoration-slate-800 px-2 min-w-[36px] text-center">
                        {data.caseDepartment.fullServiceCase.numberOfOOS > 0 ? data.caseDepartment.fullServiceCase.numberOfOOS : '______'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                      {data.caseDepartment.fullServiceCase.properDividers === true ? 'Y' : data.caseDepartment.fullServiceCase.properDividers === false ? <span className="text-rose-600">N</span> : null}
                    </div>
                    <span>Proper Dividers For Food Safety</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                      {data.caseDepartment.fullServiceCase.correctSluCool === true ? 'Y' : data.caseDepartment.fullServiceCase.correctSluCool === false ? <span className="text-rose-600">N</span> : null}
                    </div>
                    <span>Correct SLU Used And COOL Information Properly Displayed</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                      {data.caseDepartment.fullServiceCase.cookedShrimpDated === true ? 'Y' : data.caseDepartment.fullServiceCase.cookedShrimpDated === false ? <span className="text-rose-600">N</span> : null}
                    </div>
                    <span>Cooked Shrimp Properly Dated (Back Of 4-Up Tag)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                      {data.caseDepartment.fullServiceCase.shellfishHarvestTags90Days === true ? 'Y' : data.caseDepartment.fullServiceCase.shellfishHarvestTags90Days === false ? <span className="text-rose-600">N</span> : null}
                    </div>
                    <span>Shellfish Harvest Tags With Product And Filed According To Sold-By-Date, Kept For 90 Days</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                      {data.caseDepartment.perishableLinkUsed === true ? 'Y' : data.caseDepartment.perishableLinkUsed === false ? <span className="text-rose-600">N</span> : null}
                    </div>
                    <span>Perishable Link Used For Overstock Items</span>
                  </div>

                  {/* Section: Focused Training */}
                  <div className="pt-2 font-bold text-[13px] text-slate-900">Focused Training</div>

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
                    { label: 'Mark Down Procedures (Self-Serve, Full-Serve, Frozen Cases)', val: data.compliance.markDownProcedures },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-slate-800 rounded-xs flex items-center justify-center font-bold text-[10px] shrink-0 bg-white">
                        {item.val === true ? 'Y' : item.val === false ? <span className="text-rose-600">N</span> : null}
                      </div>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Instruction Line */}
                <div className="pt-6 pb-2 text-center text-xs text-slate-800">
                  Take Pictures Of Cooler/Freezer, Self-Serve, Full-Serve, Frozen Doors/Bunkers, And Spice Racks
                </div>
              </div>
            ) : (
              /* Detailed Report Page 1 Overview */
              <>
                <div className="bg-[#091b34] text-white p-3.5 rounded-lg mb-4 flex items-start justify-between">
                  <div>
                    <div className="text-sm font-black tracking-wider uppercase text-white font-sans">
                      MOUNTAIN WEST DIVISION
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-bold">
                      <span className="text-sky-300">Albertsons</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-rose-300">Safeway</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-amber-300">Lucky</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-300 font-normal">Detailed Comprehensive Audit</span>
                    </div>
                  </div>
                </div>

                {/* Store Info Card */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs mb-3">
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px] uppercase">Store:</span>
                    <span className="font-bold text-slate-800">Store #{data.header.storeNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px] uppercase">District:</span>
                    <span className="font-bold text-slate-800">District {data.header.districtNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px] uppercase">Visit Date:</span>
                    <span className="font-medium text-slate-800">{data.header.visitDate || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px] uppercase">Merchandiser:</span>
                    <span className="font-medium text-slate-800">{data.header.merchandiserName || 'Not specified'}</span>
                  </div>
                </div>

                {/* OOS Numbers Summary */}
                <div className="mb-3">
                  <div className="bg-[#104f9b] text-white text-[11px] font-bold px-2.5 py-1 rounded-t-md flex items-center justify-between">
                    <span>Out of Stock (OOS) Summary</span>
                    <span>Total: {stats.totalOOS}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-50 border border-t-0 border-slate-200 rounded-b-md text-xs">
                    <div>• Self-Serve: <strong>{data.caseDepartment.selfServeCase.numberOfOOS} OOS</strong></div>
                    <div>• Frozen Doors: <strong>{data.caseDepartment.frozenDoorsBunkers.numberOfOOS} OOS</strong></div>
                    <div>• Wet/Dry Racks: <strong>{data.caseDepartment.wetDryRacks.numberOfOOS} OOS</strong></div>
                    <div>• Full-Service: <strong>{data.caseDepartment.fullServiceCase.numberOfOOS} OOS</strong></div>
                  </div>
                </div>

                {/* Checklist Table */}
                <div className="mb-4">
                  <div className="bg-[#104f9b] text-white text-[11px] font-bold px-2.5 py-1 rounded-t-md flex items-center justify-between">
                    <span>Checklist Findings (Uniform Yes / No / Blank)</span>
                    <span>Result</span>
                  </div>
                  <div className="border border-t-0 border-slate-200 rounded-b-md divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    {checksList.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-1.5 text-xs">
                        <span className="text-slate-700 text-[11px] truncate pr-2">{item.title}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          item.val === true
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.val === false
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {item.val === true ? 'YES' : item.val === false ? 'NO' : 'BLANK'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Bottom Signatures */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-[10px] text-slate-500">
              <div>
                <div className="border-b border-slate-400 pb-4"></div>
                <div className="mt-1 font-bold text-slate-700">LUSAMERICA MERCHANDISER SIGNATURE</div>
              </div>
              <div>
                <div className="border-b border-slate-400 pb-4"></div>
                <div className="mt-1 font-bold text-slate-700">STORE DIRECTOR / DEPT MGR SIGNATURE</div>
              </div>
            </div>
            {reportType === 'simple' && (
              <div className="text-[10px] text-slate-400 italic text-center mt-3">
                * Note: Simple report is strictly 2 pages (Checklist + 5-Photo Grid) and does NOT contain field notes.
              </div>
            )}
          </div>

          {/* DETAILED REPORT PAGE 2 SIMULATION (Dedicated Field Notes) */}
          {reportType === 'detailed' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-300 max-w-xl mx-auto text-slate-900 font-sans">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 text-right">
                PAGE 2 OF 3 • FIELD OBSERVATIONS & ACTION PLAN
              </div>

              <div className="bg-[#091b34] text-white p-3.5 rounded-lg mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-black tracking-wider uppercase text-white font-sans">
                    MOUNTAIN WEST DIVISION
                  </div>
                  <div className="text-[11px] font-bold text-amber-300">
                    Albertsons • Lucky — Field Observations & Action Plan
                  </div>
                </div>
                <span className="text-xs text-sky-200 font-medium">Store #{data.header.storeNumber || '---'}</span>
              </div>

              {/* Dedicated Field Notes */}
              <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#104f9b]" />
                  <span>Merchandiser Field Observations & Discussion</span>
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 min-h-[140px] whitespace-pre-wrap leading-relaxed">
                  {data.generalNotes.trim()
                    ? data.generalNotes
                    : 'Comprehensive store visit conducted reviewing division merchandising schematics, perishable link utilization, case condition, and rotation procedures. Reviewed top ad items, shrink minimization, and display standards with the department manager.'}
                </div>
              </div>

              {/* Action Plan */}
              <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Action Items & Department Priorities
                </h3>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div>• Ensure daily rotation (FIFO) and fresh ice replenishment in Full-Service Case.</div>
                  <div>• Maintain 100% price tag compliance and facing across self-serve bunkers.</div>
                  <div>• Record daily digital temperature checks per food safety protocol (&lt;38°F).</div>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-[10px] text-slate-500">
                <div>
                  <div className="border-b border-slate-400 pb-4"></div>
                  <div className="mt-1 font-bold">MERCHANDISER SIGNATURE</div>
                </div>
                <div>
                  <div className="border-b border-slate-400 pb-4"></div>
                  <div className="mt-1 font-bold">DEPT MGR ACKNOWLEDGEMENT</div>
                </div>
              </div>
            </div>
          )}

          {/* SINGLE-SHEET 5-PHOTO DOCUMENTATION GRID SIMULATION */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-300 max-w-xl mx-auto text-slate-900 font-sans">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 text-right">
              {reportType === 'simple' ? 'PAGE 2 OF 2 • PHOTO GRID' : 'PAGE 3 OF 3 • PHOTO GRID'}
            </div>

            <div className="bg-[#091b34] text-white p-3.5 rounded-lg mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-black tracking-wider uppercase text-white font-sans">
                  MOUNTAIN WEST DIVISION
                </div>
                <div className="text-[11px] font-bold text-sky-300">
                  Albertsons • Lucky — Single-Sheet 5-Photo Grid
                </div>
              </div>
              <span className="text-xs text-sky-200 font-medium">Store #{data.header.storeNumber || '---'}</span>
            </div>

            {/* Balanced 2-Column Photo Grid with Uniform Frames & Proportional Fitting */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {photoSlots.slice(0, 4).map((slot, idx) => (
                <div key={idx} className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs flex flex-col">
                  {/* Image Display Area with clean neutral background and proportional fit */}
                  <div className="h-36 bg-slate-50 flex items-center justify-center p-1.5 border-b border-slate-100">
                    {slot.url ? (
                      <img
                        src={slot.url}
                        alt={slot.label}
                        className="max-h-full max-w-full object-contain rounded-xs border border-slate-200 shadow-2xs"
                      />
                    ) : (
                      <div className="text-center px-2">
                        <span className="text-[10px] text-slate-400 italic block">No Photo Attached</span>
                        <span className="text-[8px] text-slate-400 font-mono mt-0.5 block">Capture via Mobile Wizard</span>
                      </div>
                    )}
                  </div>
                  {/* Caption Bar Below Image */}
                  <div className="p-2 bg-white flex flex-col justify-between grow">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[11px] font-bold text-slate-900 truncate">{slot.label}</span>
                      {slot.url ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          Attached
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-200 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Pending
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 line-clamp-1">{slot.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 3: Photo 5 Centered Horizontally */}
            <div className="max-w-xs mx-auto mb-3">
              {photoSlots.slice(4, 5).map((slot, idx) => (
                <div key={idx} className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs flex flex-col">
                  <div className="h-36 bg-slate-50 flex items-center justify-center p-1.5 border-b border-slate-100">
                    {slot.url ? (
                      <img
                        src={slot.url}
                        alt={slot.label}
                        className="max-h-full max-w-full object-contain rounded-xs border border-slate-200 shadow-2xs"
                      />
                    ) : (
                      <div className="text-center px-2">
                        <span className="text-[10px] text-slate-400 italic block">No Photo Attached</span>
                        <span className="text-[8px] text-slate-400 font-mono mt-0.5 block">Capture via Mobile Wizard</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-white flex flex-col justify-between grow">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[11px] font-bold text-slate-900 truncate">{slot.label}</span>
                      {slot.url ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          Attached
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-200 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Pending
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 line-clamp-1">{slot.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-2 bg-slate-50 rounded border border-slate-200 text-[10px] text-slate-500 text-center">
              Visual Audit Record • Mountain West Division (Albertsons & Lucky)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
