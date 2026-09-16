import React from 'react';
import { ComplianceTrainingChecks } from '../types';
import { Check, ShieldCheck, FileCheck, Thermometer, TrendingUp, Scan, Globe, BookOpen, AlertOctagon, Tag } from 'lucide-react';

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
  const toggleItem = (key: keyof ComplianceTrainingChecks) => {
    onChange((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const totalPassed = Object.values(data).filter(Boolean).length;
  const totalCount = complianceItems.length;

  const handleClearAll = () => {
    onChange((prev) => {
      const next = { ...prev };
      complianceItems.forEach((item) => {
        next[item.key] = false;
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
                Mountain West Division auditing & focused training items
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
              totalPassed === totalCount
                ? 'bg-blue-100 text-[#104f9b]'
                : totalPassed >= 7
                ? 'bg-sky-100 text-sky-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {totalPassed} / {totalCount} Passed
            </span>
          </div>
        </div>

        {/* Individual Verification Notice & Clear Option */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
          <span className="text-slate-500 italic">
            Check each standard individually during store walk
          </span>
          {totalPassed > 0 && (
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
          const isChecked = Boolean(data[item.key]);
          const Icon = item.icon;

          return (
            <label
              key={item.key}
              htmlFor={`compliance-${item.key}`}
              className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
                isChecked
                  ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50/70'
              }`}
            >
              <input
                id={`compliance-${item.key}`}
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleItem(item.key)}
                className="sr-only"
              />
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
                  isChecked
                    ? 'bg-[#104f9b] border-[#104f9b] text-white'
                    : 'border-slate-300 bg-white text-transparent'
                }`}
              >
                {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-4 h-4 ${isChecked ? 'text-[#104f9b]' : 'text-slate-400'}`} />
                  <span className={`text-sm font-semibold leading-tight ${isChecked ? 'text-blue-950' : 'text-slate-800'}`}>
                    {item.title}
                  </span>
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${isChecked ? 'text-blue-900/80' : 'text-slate-500'}`}>
                  {item.desc}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};
