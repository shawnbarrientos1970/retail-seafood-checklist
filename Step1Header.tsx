import React from 'react';
import { StoreHeader } from '../types';
import { Building2, Hash, Calendar, UserCheck, AlertCircle, Sparkles } from 'lucide-react';
import { MountainWestLogo } from './MountainWestLogo';

interface Step1HeaderProps {
  data: StoreHeader;
  onChange: (updated: Partial<StoreHeader>) => void;
  errors: Record<string, string>;
}

export const Step1Header: React.FC<Step1HeaderProps> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-4">
      {/* Intro card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs text-center sm:text-left">
        <div className="flex justify-center mb-3">
          <MountainWestLogo variant="full" size="md" />
        </div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#104f9b] flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-bold text-slate-900 leading-snug">
              Store Visit Information
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              MOUNTAIN WEST DIVISION • Albertsons • Safeway • Lucky
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-left">
          Enter the store details below to begin the store inspection. All entries save locally to your device.
        </p>
      </div>

      {/* Form Fields Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        {/* District Number */}
        <div>
          <label htmlFor="district-number-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#104f9b]" />
            <span>District Number *</span>
          </label>
          <div className="relative">
            <input
              id="district-number-input"
              type="text"
              placeholder="e.g. 3 or District 3"
              value={data.districtNumber}
              onChange={(e) => onChange({ districtNumber: e.target.value })}
              className={`w-full h-11 px-3.5 rounded-xl border text-sm font-medium transition-colors bg-white focus:outline-hidden focus:ring-2 ${
                errors.districtNumber
                  ? 'border-rose-300 ring-rose-400 bg-rose-50/20 text-rose-900'
                  : 'border-slate-300 focus:border-[#104f9b] focus:ring-blue-100 text-slate-900'
              }`}
            />
          </div>
          {errors.districtNumber && (
            <p className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.districtNumber}</span>
            </p>
          )}
        </div>

        {/* Store Number */}
        <div>
          <label htmlFor="store-number-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-[#104f9b]" />
            <span>Store Number *</span>
          </label>
          <div className="relative">
            <input
              id="store-number-input"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 1542"
              value={data.storeNumber}
              onChange={(e) => onChange({ storeNumber: e.target.value })}
              className={`w-full h-11 px-3.5 rounded-xl border text-sm font-semibold tracking-wide font-mono transition-colors bg-white focus:outline-hidden focus:ring-2 ${
                errors.storeNumber
                  ? 'border-rose-300 ring-rose-400 bg-rose-50/20 text-rose-900'
                  : 'border-slate-300 focus:border-[#104f9b] focus:ring-blue-100 text-slate-900'
              }`}
            />
          </div>
          {errors.storeNumber && (
            <p className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.storeNumber}</span>
            </p>
          )}
        </div>

        {/* Visit Date */}
        <div>
          <label htmlFor="visit-date-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#104f9b]" />
            <span>Visit Date *</span>
          </label>
          <input
            id="visit-date-input"
            type="date"
            value={data.visitDate}
            onChange={(e) => onChange({ visitDate: e.target.value })}
            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 bg-white focus:outline-hidden focus:border-[#104f9b] focus:ring-2 focus:ring-blue-100 transition-colors"
          />
        </div>

        {/* Merchandiser Name */}
        <div>
          <label htmlFor="merchandiser-name-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#104f9b]" />
            <span>Merchandiser Name *</span>
          </label>
          <input
            id="merchandiser-name-input"
            type="text"
            placeholder="e.g. Shawn Barrientos"
            value={data.merchandiserName}
            onChange={(e) => onChange({ merchandiserName: e.target.value })}
            className={`w-full h-11 px-3.5 rounded-xl border text-sm font-medium transition-colors bg-white focus:outline-hidden focus:ring-2 ${
              errors.merchandiserName
                ? 'border-rose-300 ring-rose-400 bg-rose-50/20 text-rose-900'
                : 'border-slate-300 focus:border-[#104f9b] focus:ring-blue-100 text-slate-900'
            }`}
          />
          {errors.merchandiserName && (
            <p className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.merchandiserName}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
