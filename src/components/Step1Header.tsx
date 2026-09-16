import React from 'react';
import { HeaderInfo } from '../types';
import { Hash, Calendar, User, Store, AlertCircle } from 'lucide-react';
import { MountainWestLogo } from './MountainWestLogo';

interface Step1HeaderProps {
  data: HeaderInfo;
  onChange: (data: Partial<HeaderInfo>) => void;
  errors?: {
    districtNumber?: string;
    storeNumber?: string;
    merchandiserName?: string;
  };
}

export const Step1Header: React.FC<Step1HeaderProps> = ({ data, onChange, errors }) => {
  const errs = errors || {};
  return (
    <div id="step-1-container" className="space-y-4">
      {/* Official Mountain West Division Brand Header Card at Top of First Page */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm text-center flex flex-col items-center relative overflow-hidden">
        {/* Mountain West Blue brand accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#091b34] via-[#104f9b] to-[#1e73cf]" />

        {/* Mountain West Logo */}
        <div className="pt-2 pb-1 flex flex-col items-center">
          <MountainWestLogo size="xl" className="my-1 transition-transform hover:scale-105 duration-200" />
        </div>

        {/* Division Standards Sub-bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs text-slate-600">
          <div className="text-left">
            <span className="font-bold text-[#104f9b] block">Store Visit Audit</span>
            <span className="text-[10px] text-slate-400">Official Department Checklist</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#104f9b] block">
              Albertsons • Lucky
            </span>
            <span className="text-[10px] text-slate-400">Merchandising Standards</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#104f9b] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            1
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Store Visit Information</h3>
            <p className="text-xs text-slate-500">
              Mountain West Division Merchandising Audit
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        {/* District # */}
        <div>
          <label htmlFor="district-number-input" className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-[#104f9b]" />
              District #
            </span>
            <span className="text-xs text-rose-500 font-normal">*Required</span>
          </label>
          <div className="relative">
            <input
              id="district-number-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={data.districtNumber}
              onChange={(e) => onChange({ districtNumber: e.target.value })}
              placeholder="e.g. 14"
              className={`w-full min-h-[48px] px-4 py-3 text-base rounded-xl border bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 transition-all ${
                errs.districtNumber
                  ? 'border-rose-400 focus:ring-rose-400/30'
                  : 'border-slate-200 focus:border-[#104f9b] focus:ring-[#104f9b]/20'
              }`}
            />
          </div>
          {errs.districtNumber && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errs.districtNumber}
            </p>
          )}
        </div>

        {/* Store # */}
        <div>
          <label htmlFor="store-number-input" className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Store className="w-4 h-4 text-[#104f9b]" />
              Store #
            </span>
            <span className="text-xs text-rose-500 font-normal">*Required</span>
          </label>
          <div className="relative">
            <input
              id="store-number-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={data.storeNumber}
              onChange={(e) => onChange({ storeNumber: e.target.value })}
              placeholder="e.g. 1824"
              className={`w-full min-h-[48px] px-4 py-3 text-base rounded-xl border bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 transition-all ${
                errs.storeNumber
                  ? 'border-rose-400 focus:ring-rose-400/30'
                  : 'border-slate-200 focus:border-[#104f9b] focus:ring-[#104f9b]/20'
              }`}
            />
          </div>
          {errs.storeNumber && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errs.storeNumber}
            </p>
          )}
        </div>

        {/* Visit Date */}
        <div>
          <label htmlFor="visit-date-input" className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#104f9b]" />
              Visit Date
            </span>
            <span className="text-xs text-slate-400 font-normal">Defaults to today</span>
          </label>
          <input
            id="visit-date-input"
            type="date"
            value={data.visitDate}
            onChange={(e) => onChange({ visitDate: e.target.value })}
            className="w-full min-h-[48px] px-4 py-3 text-base rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#104f9b] focus:ring-2 focus:ring-[#104f9b]/20 focus:outline-hidden transition-all"
          />
        </div>

        {/* Merchandiser Name */}
        <div>
          <label htmlFor="merchandiser-name-input" className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#104f9b]" />
              LusaMerica Merchandiser Name
            </span>
            <span className="text-xs text-rose-500 font-normal">*Required</span>
          </label>
          <input
            id="merchandiser-name-input"
            type="text"
            value={data.merchandiserName}
            onChange={(e) => onChange({ merchandiserName: e.target.value })}
            placeholder="e.g. John Miller"
            className={`w-full min-h-[48px] px-4 py-3 text-base rounded-xl border bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 transition-all ${
              errs.merchandiserName
                ? 'border-rose-400 focus:ring-rose-400/30'
                : 'border-slate-200 focus:border-[#104f9b] focus:ring-[#104f9b]/20'
            }`}
          />
          {errs.merchandiserName && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errs.merchandiserName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
