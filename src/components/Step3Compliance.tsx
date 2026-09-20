import React from 'react';
import { ComplianceChecks } from '../types';
import { Check, X, ShieldCheck, Thermometer, FileText, TrendingUp, CheckSquare, ScanLine, Laptop, BookOpen, AlertTriangle, Sparkles } from 'lucide-react';

interface Step3ComplianceProps {
  data: ComplianceChecks;
  onChange: (updater: (prev: ComplianceChecks) => ComplianceChecks) => void;
}

interface ComplianceItemProps {
  idPrefix: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  value: boolean | null;
  onChange: (val: boolean | null) => void;
}

const ComplianceItem: React.FC<ComplianceItemProps> = ({
  idPrefix,
  title,
  description,
  icon,
  value,
  onChange,
}) => {
  return (
    <div className="py-3 border-b border-slate-100 last:border-b-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
      <div className="flex items-start gap-3 flex-1 pr-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
          value === true
            ? 'bg-emerald-50 text-emerald-600'
            : value === false
            ? 'bg-rose-50 text-rose-600'
            : 'bg-slate-100 text-slate-500'
        }`}>
          {icon}
        </div>
        <div>
          <div className="text-xs font-bold text-slate-900 leading-snug">{title}</div>
          <div className="text-[11px] text-slate-500 mt-0.5 leading-normal">{description}</div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0 pl-11 sm:pl-0">
        <button
          type="button"
          id={`${idPrefix}-yes`}
          onClick={() => onChange(true)}
          className={`min-h-[44px] min-w-[58px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            value === true
              ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400/40'
              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 active:bg-slate-200'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>Yes</span>
        </button>

        <button
          type="button"
          id={`${idPrefix}-no`}
          onClick={() => onChange(false)}
          className={`min-h-[44px] min-w-[58px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            value === false
              ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-400/40'
              : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700 active:bg-slate-200'
          }`}
        >
          <X className="w-3.5 h-3.5" />
          <span>No</span>
        </button>

        <button
          type="button"
          id={`${idPrefix}-blank`}
          onClick={() => onChange(null)}
          className={`min-h-[44px] px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-center transition-all cursor-pointer ${
            value === null
              ? 'bg-slate-200 text-slate-800 font-semibold ring-1 ring-slate-300'
              : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:bg-slate-200'
          }`}
          title="Leave blank / Unanswered"
        >
          <span className="text-[11px]">Leave Blank</span>
        </button>
      </div>
    </div>
  );
};

export const Step3Compliance: React.FC<Step3ComplianceProps> = ({ data, onChange }) => {
  const allPassed = Object.values(data).every((v) => v === true);

  const handleMarkAllPassed = () => {
    onChange(() => ({
      adSupport: true,
      coolersFreezersOrganizedDated: true,
      temperatureChecks: true,
      salesPurchasesTrackingReviewed: true,
      form120Submitted: true,
      visionProScannedProductionList: true,
      schematicIntegrityOnline: true,
      newProgramBulletinMeatSeafood: true,
      foodSafetyHandlingDatingPolicy: true,
      markDownProcedures: true,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Header with Quick Action */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#104f9b] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Compliance & Operations Audit</h2>
            <p className="text-[11px] text-slate-500">Policies, logs, and food safety standards</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleMarkAllPassed}
          className="min-h-[36px] px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-200/70 transition-colors cursor-pointer shrink-0"
          title="Set all compliance items to Pass"
        >
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Pass All</span>
        </button>
      </div>

      {/* Compliance Items List */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs divide-y divide-slate-100">
        <ComplianceItem
          idPrefix="comp-ad"
          title="Ad Support & Promotion Integrity"
          description="Featured circular items in stock, ad sign placards posted, proper promotional prices active"
          icon={<FileText className="w-4 h-4" />}
          value={data.adSupport}
          onChange={(val) => onChange((prev) => ({ ...prev, adSupport: val }))}
        />

        <ComplianceItem
          idPrefix="comp-coolers"
          title="Coolers & Freezers Organized & Dated"
          description="Walk-in cooler and freezers 6 inches off floor, slotted, rotated FIFO, dated containers"
          icon={<ShieldCheck className="w-4 h-4" />}
          value={data.coolersFreezersOrganizedDated}
          onChange={(val) =>
            onChange((prev) => ({ ...prev, coolersFreezersOrganizedDated: val }))
          }
        />

        <ComplianceItem
          idPrefix="comp-temps"
          title="Temperature Checks Logged"
          description="Case & cooler logs verified (Seafood under 38°F, Freezers under 0°F, calibrated thermometer)"
          icon={<Thermometer className="w-4 h-4" />}
          value={data.temperatureChecks}
          onChange={(val) =>
            onChange((prev) => ({ ...prev, temperatureChecks: val }))
          }
        />

        <ComplianceItem
          idPrefix="comp-sales"
          title="Sales & Purchases Tracking Reviewed"
          description="Sales tracking sheet, gross margin, purchases reviewed with department manager"
          icon={<TrendingUp className="w-4 h-4" />}
          value={data.salesPurchasesTrackingReviewed}
          onChange={(val) =>
            onChange((prev) => ({ ...prev, salesPurchasesTrackingReviewed: val }))
          }
        />

        <ComplianceItem
          idPrefix="comp-form120"
          title="Form 120 Submitted (Shrink / Credits)"
          description="Credit requests, supplier adjustments, and shrink transfers accurately submitted"
          icon={<CheckSquare className="w-4 h-4" />}
          value={data.form120Submitted}
          onChange={(val) =>
            onChange((prev) => ({ ...prev, form120Submitted: val }))
          }
        />

        <ComplianceItem
          idPrefix="comp-vision"
          title="Vision Pro Scanned Production List"
          description="Daily production list scanned, printed, and strictly utilized by counter clerks"
          icon={<ScanLine className="w-4 h-4" />}
          value={data.visionProScannedProductionList}
          onChange={(val) =>
            onChange((prev) => ({ ...prev, visionProScannedProductionList: val }))
          }
        />

        <ComplianceItem
          idPrefix="comp-pog"
          title="Schematic Integrity Online (ePOG)"
          description="Online schematic matches physical layout; unauthorized cuts or skips not present"
          icon={<Laptop className="w-4 h-4" />}
          value={data.schematicIntegrityOnline}
          onChange={(val) =>
            onChange((prev) => ({ ...prev, schematicIntegrityOnline: val }))
          }
        />

        <ComplianceItem
          idPrefix="comp-bulletin"
          title="New Program Bulletin Meat & Seafood"
          description="Division merchandising bulletins posted in binder; seasonal programs executed"
          icon={<BookOpen className="w-4 h-4" />}
          value={data.newProgramBulletinMeatSeafood}
          onChange={(val) =>
            onChange((prev) => ({ ...prev, newProgramBulletinMeatSeafood: val }))
          }
        />

        <ComplianceItem
          idPrefix="comp-safety"
          title="Food Safety Handling & Dating Policy"
          description="Cross-contamination protocols, sanitizer bucket at strength (200-400ppm), glove usage"
          icon={<AlertTriangle className="w-4 h-4" />}
          value={data.foodSafetyHandlingDatingPolicy}
          onChange={(val) =>
            onChange((prev) => ({ ...prev, foodSafetyHandlingDatingPolicy: val }))
          }
        />

        <ComplianceItem
          idPrefix="comp-markdown"
          title="Markdown Procedures & Freshness Protocol"
          description="Daily markdown timeline followed (AM/PM checks), correct orange/red markdown stickers"
          icon={<Sparkles className="w-4 h-4" />}
          value={data.markDownProcedures}
          onChange={(val) =>
            onChange((prev) => ({ ...prev, markDownProcedures: val }))
          }
        />
      </div>
    </div>
  );
};
