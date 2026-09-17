import React from 'react';
import { Check, X, Minus } from 'lucide-react';
import { YesNoValue } from '../types';

interface YesNoToggleProps {
  value: YesNoValue;
  onChange: (val: YesNoValue) => void;
  idPrefix?: string;
  compact?: boolean;
  ariaLabel?: string;
}

export const YesNoToggle: React.FC<YesNoToggleProps> = ({
  value,
  onChange,
  idPrefix,
  compact = false,
  ariaLabel = 'Inspection check',
}) => {
  const isYes = value === true;
  const isNo = value === false;
  const isBlank = value === null || value === undefined;

  const handleYes = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(isYes ? null : true);
  };

  const handleNo = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(isNo ? null : false);
  };

  const handleBlank = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 shadow-inner ${
        compact ? 'gap-1' : 'gap-1.5'
      }`}
    >
      {/* YES Button */}
      <button
        type="button"
        id={idPrefix ? `${idPrefix}-yes` : undefined}
        onClick={handleYes}
        aria-pressed={isYes}
        aria-label={`${ariaLabel}: Yes`}
        className={`min-h-[44px] rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer select-none whitespace-nowrap ${
          compact ? 'px-2.5 py-2' : 'px-3 py-2.5 min-w-[56px]'
        } ${
          isYes
            ? 'bg-emerald-600 text-white shadow-xs border border-emerald-700'
            : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/70'
        }`}
      >
        <Check className={`w-4 h-4 stroke-[2.5] ${isYes ? 'text-white' : 'text-emerald-600'}`} />
        <span>YES</span>
      </button>

      {/* NO Button */}
      <button
        type="button"
        id={idPrefix ? `${idPrefix}-no` : undefined}
        onClick={handleNo}
        aria-pressed={isNo}
        aria-label={`${ariaLabel}: No`}
        className={`min-h-[44px] rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer select-none whitespace-nowrap ${
          compact ? 'px-2.5 py-2' : 'px-3 py-2.5 min-w-[56px]'
        } ${
          isNo
            ? 'bg-rose-600 text-white shadow-xs border border-rose-700'
            : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/70'
        }`}
      >
        <X className={`w-4 h-4 stroke-[2.5] ${isNo ? 'text-white' : 'text-rose-600'}`} />
        <span>NO</span>
      </button>

      {/* LEAVE BLANK Button */}
      <button
        type="button"
        id={idPrefix ? `${idPrefix}-blank` : undefined}
        onClick={handleBlank}
        aria-pressed={isBlank}
        aria-label={`${ariaLabel}: Leave Blank`}
        className={`min-h-[44px] rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer select-none whitespace-nowrap ${
          compact ? 'px-2.5 py-2' : 'px-3 py-2.5 min-w-[70px]'
        } ${
          isBlank
            ? 'bg-slate-700 text-white shadow-xs border border-slate-800'
            : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/70'
        }`}
      >
        <Minus className={`w-3.5 h-3.5 stroke-[2.5] ${isBlank ? 'text-white' : 'text-slate-400'}`} />
        <span>Leave Blank</span>
      </button>
    </div>
  );
};
