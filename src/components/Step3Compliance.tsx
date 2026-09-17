import React from 'react';
import { ComplianceTrainingChecks, YesNoValue } from '../types';
import { ShieldCheck, FileCheck, Thermometer, TrendingUp, Scan, Globe, BookOpen, AlertOctagon, Tag } from 'lucide-react';
import { YesNoToggle } from './YesNoToggle';

interface Step3ComplianceProps {
  data: ComplianceTrainingChecks;
  onChange: (updater: (prev: ComplianceTrainingChecks) => ComplianceTrainingChecks) => void;
}

const complianceItems: Array<{
  key: keyof ComplianceTrainingChecks;
  title: string;
  desc: string;
  icon: React.ElementType;
}> = [
  {
    key: 'adSupport',
    title: 'Ad Support',
    desc: 'Promotional features, ad items stocked, and display signage accurate',
    icon: Tag,
  },
  {
    key: 'coolersFreezersOrganizedDated',
    title: 'Coolers/Freezers Organized And Dated',
    desc: 'Walk-ins rotated, shelving clean, all product labeled with date',
    icon: ShieldCheck,
  },
  {
    key: 'temperatureChecks',
    title: 'Temperature Checks',
    desc: 'Cases and storage holding verified safe temps (<40°F / 0°F freezer)',
    icon: Thermometer,
  },
  {
    key: 'salesPurchasesTrackingReviewed',
    title: 'Sales And Purchases Tracking Reviewed',
    desc: 'Department movement, shrink trends, and order tracking audited',
    icon: TrendingUp,
  },
  {
    key: 'form120Submitted',
    title: 'Form 120 Submitted For Short/Poor Quality Product',
    desc: 'Vendor shorts and warehouse quality credit submissions completed',
    icon: FileCheck,
  },
  {
    key: 'visionProScannedProductionList',
    title: 'Vision Pro Scanned And Production List Followed',
    desc: 'Handheld scanner utilized and daily production prep list followed',
    icon: Scan,
  },
  {
    key: 'schematicIntegrityOnline',
    title: 'Schematic Integrity-Accessing Schematics Online',
    desc: 'Store team able to access and follow active online POG schematics',
    icon: Globe,
  },
  {
    key: 'newProgramBulletinMeatSeafood',
    title: 'New Program/New Bulletin-Accessing On Meat & Seafood Page',
    desc: 'Division updates, bulletin boards, and current programs reviewed',
    icon: BookOpen,
  },
  {
    key: 'foodSafetyHandlingDatingPolicy',
    title: 'Food Safety/Seafood Handling/Dating Policy',
    desc: 'Cross-contamination prevention, glove rules, sanitizing & sell-by codes',
    icon: AlertOctagon,
  },
  {
    key: 'markDownProcedures',
    title: 'Mark Down Procedures',
    desc: 'Timely cull markdown schedule followed, accurate orange/yellow tag pricing',
    icon: Tag,
  },
];

export const Step3Compliance: React.FC<Step3ComplianceProps> = ({ data, onChange }) => {
  const setComplianceValue = (key: keyof ComplianceTrainingChecks, val: YesNoValue) => {
    onChange((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const values = complianceItems.map((item) => data[item.key]);
  const totalYes = values.filter((v) => v === true).length;
  const totalNo = values.filter((v) => v === false).length;
  const totalEvaluated = values.filter((v) => v !== null && v !== undefined).length;
  const totalCount = complianceItems.length;

  const handleClearAll = () => {
    onChange((prev) => {
      const next = { ...prev };
      complianceItems.forEach((item) => {
        next[item.key] = null;
      });
      return next;
    });
  };

  return (
    <div id="step-3-container" className="space-y-4">
      {/* Header card with compliance score */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#104f9b] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              3
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Compliance & Training</h3>
              <p className="text-xs text-slate-500">
                Division seafood policy, food safety, and retail operations
              </p>
            </div>
          </div>

          <div className="text-right flex items-center gap-1.5 flex-wrap justify-end">
            {totalYes > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {totalYes} YES
              </span>
            )}
            {totalNo > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                {totalNo} NO
              </span>
            )}
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {totalEvaluated}/{totalCount} Evaluated
            </span>
          </div>
        </div>

        {/* Individual Verification Notice & Clear Option */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
          <span className="text-slate-500 italic">
            Select YES, NO, or Leave Blank for each compliance standard during store walk
          </span>
          {totalEvaluated > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="min-h-[44px] py-2 px-3 text-xs font-semibold rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors flex items-center justify-center cursor-pointer"
            >
              Clear Section
            </button>
          )}
        </div>
      </div>

      {/* Compliance List */}
      <div className="space-y-2.5">
        {complianceItems.map((item) => {
          const val = data[item.key];
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                val === true
                  ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
                  : val === false
                  ? 'bg-rose-50/40 border-rose-300/80 shadow-xs'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                    val === true
                      ? 'bg-emerald-100 border-emerald-200 text-emerald-700'
                      : val === false
                      ? 'bg-rose-100 border-rose-200 text-rose-700'
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 leading-tight">
                    {item.title}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-center">
                <YesNoToggle
                  value={val}
                  onChange={(newVal) => setComplianceValue(item.key, newVal)}
                  idPrefix={`compliance-${item.key}`}
                  ariaLabel={item.title}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
