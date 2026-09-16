import React from 'react';
import { CaseDepartmentChecks } from '../types';
import { Check, Minus, Plus, Fish, Layers, Snowflake, Sparkles, ClipboardList } from 'lucide-react';

interface Step2CaseChecksProps {
  data: CaseDepartmentChecks;
  onChange: (updater: (prev: CaseDepartmentChecks) => CaseDepartmentChecks) => void;
}

export const Step2CaseChecks: React.FC<Step2CaseChecksProps> = ({ data, onChange }) => {
  const toggleBoolean = (field: keyof Omit<CaseDepartmentChecks, 'selfServeCase' | 'frozenDoorsBunkers' | 'wetDryRacks' | 'fullServiceCase'>) => {
    onChange((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const updateSelfServe = (field: keyof CaseDepartmentChecks['selfServeCase'], value: any) => {
    onChange((prev) => ({
      ...prev,
      selfServeCase: {
        ...prev.selfServeCase,
        [field]: value,
      },
    }));
  };

  const updateFrozenDoors = (field: keyof CaseDepartmentChecks['frozenDoorsBunkers'], value: any) => {
    onChange((prev) => ({
      ...prev,
      frozenDoorsBunkers: {
        ...prev.frozenDoorsBunkers,
        [field]: value,
      },
    }));
  };

  const updateWetDryRacks = (field: keyof CaseDepartmentChecks['wetDryRacks'], value: any) => {
    onChange((prev) => ({
      ...prev,
      wetDryRacks: {
        ...prev.wetDryRacks,
        [field]: value,
      },
    }));
  };

  const updateFullService = (field: keyof CaseDepartmentChecks['fullServiceCase'], value: any) => {
    onChange((prev) => ({
      ...prev,
      fullServiceCase: {
        ...prev.fullServiceCase,
        [field]: value,
      },
    }));
  };

  const handleOOSStepper = (
    currentVal: number | '',
    setter: (val: number | '') => void,
    delta: number
  ) => {
    const current = currentVal === '' ? 0 : Number(currentVal);
    const updated = Math.max(0, current + delta);
    setter(updated);
  };

  const isOOSActive = (val: number | '' | undefined): boolean => {
    if (typeof val === 'number') return !isNaN(val) && val >= 1;
    if (!val) return false;
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 1;
  };

  const totalChecked = [
    data.clerkScheduledAndInSeafood,
    data.seafoodCasePulledNightBefore,
    data.seafoodCaseCleanOdorFree,
    data.taresDoneDaily,
    data.deliveriesCheckedInvoice,
    data.regulatoryDecalsAllergens,
    data.perishableLinkUsed,
    data.selfServeCase.faced,
    data.selfServeCase.tagged,
    data.selfServeCase.setToSchematic,
    data.selfServeCase.culledRotated,
    data.selfServeCase.properlyMarkedDown,
    data.frozenDoorsBunkers.setToSchematic,
    data.frozenDoorsBunkers.facedAndTagged,
    data.wetDryRacks.faced,
    data.wetDryRacks.tagged,
    data.wetDryRacks.setToSchematic,
    data.fullServiceCase.setToSchematic,
    data.fullServiceCase.properDividers,
    data.fullServiceCase.correctSluCool,
    data.fullServiceCase.cookedShrimpDated,
    data.fullServiceCase.shellfishHarvestTags90Days,
  ].filter(Boolean).length;

  const totalCriteria = 22;

  const handleClearAll = () => {
    onChange((prev) => ({
      ...prev,
      clerkScheduledAndInSeafood: false,
      seafoodCasePulledNightBefore: false,
      seafoodCaseCleanOdorFree: false,
      taresDoneDaily: false,
      deliveriesCheckedInvoice: false,
      regulatoryDecalsAllergens: false,
      perishableLinkUsed: false,
      selfServeCase: {
        ...prev.selfServeCase,
        faced: false,
        tagged: false,
        setToSchematic: false,
        culledRotated: false,
        properlyMarkedDown: false,
      },
      frozenDoorsBunkers: {
        ...prev.frozenDoorsBunkers,
        setToSchematic: false,
        facedAndTagged: false,
      },
      wetDryRacks: {
        ...prev.wetDryRacks,
        faced: false,
        tagged: false,
        setToSchematic: false,
      },
      fullServiceCase: {
        ...prev.fullServiceCase,
        setToSchematic: false,
        properDividers: false,
        correctSluCool: false,
        cookedShrimpDated: false,
        shellfishHarvestTags90Days: false,
      },
    }));
  };

  return (
    <div id="step-2-container" className="space-y-4">
      {/* Section Introduction */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#104f9b] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              2
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Case & Department Checks</h3>
              <p className="text-xs text-slate-500">
                Mountain West Division seafood and merchandised case standards
              </p>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                totalChecked === totalCriteria
                  ? 'bg-blue-100 text-[#104f9b]'
                  : totalChecked > 0
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {totalChecked} / {totalCriteria} Checked
            </span>
          </div>
        </div>

        {/* Individual Verification Notice & Clear Option */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
          <span className="text-slate-500 italic">
            Check each standard individually during store walk
          </span>
          {totalChecked > 0 && (
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

      {/* General Department & Case Operations */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <Fish className="w-4 h-4 text-[#104f9b]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Department Operations & Readiness
          </h4>
        </div>

        {/* 1. Clerk Scheduled */}
        <label
          htmlFor="check-clerk-scheduled"
          className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
            data.clerkScheduledAndInSeafood
              ? 'bg-blue-50/70 border-blue-300 text-blue-950'
              : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100/60'
          }`}
        >
          <input
            id="check-clerk-scheduled"
            type="checkbox"
            checked={data.clerkScheduledAndInSeafood}
            onChange={() => toggleBoolean('clerkScheduledAndInSeafood')}
            className="sr-only"
          />
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
              data.clerkScheduledAndInSeafood
                ? 'bg-[#104f9b] border-[#104f9b] text-white'
                : 'border-slate-300 bg-white'
            }`}
          >
            {data.clerkScheduledAndInSeafood && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
          <div className="flex-1 text-sm font-medium">
            Clerk Scheduled And In Seafood Department
          </div>
        </label>

        {/* 2. Seafood Case Pulled Night Before */}
        <label
          htmlFor="check-seafood-pulled"
          className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
            data.seafoodCasePulledNightBefore
              ? 'bg-blue-50/70 border-blue-300 text-blue-950'
              : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100/60'
          }`}
        >
          <input
            id="check-seafood-pulled"
            type="checkbox"
            checked={data.seafoodCasePulledNightBefore}
            onChange={() => toggleBoolean('seafoodCasePulledNightBefore')}
            className="sr-only"
          />
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
              data.seafoodCasePulledNightBefore
                ? 'bg-[#104f9b] border-[#104f9b] text-white'
                : 'border-slate-300 bg-white'
            }`}
          >
            {data.seafoodCasePulledNightBefore && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
          <div className="flex-1 text-sm font-medium">
            Seafood Case Pulled Night Before
          </div>
        </label>

        {/* 3. Seafood Case Clean & Odor Free */}
        <label
          htmlFor="check-seafood-clean"
          className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
            data.seafoodCaseCleanOdorFree
              ? 'bg-blue-50/70 border-blue-300 text-blue-950'
              : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100/60'
          }`}
        >
          <input
            id="check-seafood-clean"
            type="checkbox"
            checked={data.seafoodCaseCleanOdorFree}
            onChange={() => toggleBoolean('seafoodCaseCleanOdorFree')}
            className="sr-only"
          />
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
              data.seafoodCaseCleanOdorFree
                ? 'bg-[#104f9b] border-[#104f9b] text-white'
                : 'border-slate-300 bg-white'
            }`}
          >
            {data.seafoodCaseCleanOdorFree && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
          <div className="flex-1 text-sm font-medium">
            Seafood Case Clean, Clear Of Build-Up And Odor Free
          </div>
        </label>

        {/* 4. Tares Done Daily */}
        <label
          htmlFor="check-tares-daily"
          className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
            data.taresDoneDaily
              ? 'bg-blue-50/70 border-blue-300 text-blue-950'
              : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100/60'
          }`}
        >
          <input
            id="check-tares-daily"
            type="checkbox"
            checked={data.taresDoneDaily}
            onChange={() => toggleBoolean('taresDoneDaily')}
            className="sr-only"
          />
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
              data.taresDoneDaily
                ? 'bg-[#104f9b] border-[#104f9b] text-white'
                : 'border-slate-300 bg-white'
            }`}
          >
            {data.taresDoneDaily && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
          <div className="flex-1 text-sm font-medium">
            Tares Done Daily
          </div>
        </label>

        {/* 5. Deliveries Checked Against Invoice */}
        <label
          htmlFor="check-deliveries-invoice"
          className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
            data.deliveriesCheckedInvoice
              ? 'bg-blue-50/70 border-blue-300 text-blue-950'
              : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100/60'
          }`}
        >
          <input
            id="check-deliveries-invoice"
            type="checkbox"
            checked={data.deliveriesCheckedInvoice}
            onChange={() => toggleBoolean('deliveriesCheckedInvoice')}
            className="sr-only"
          />
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
              data.deliveriesCheckedInvoice
                ? 'bg-[#104f9b] border-[#104f9b] text-white'
                : 'border-slate-300 bg-white'
            }`}
          >
            {data.deliveriesCheckedInvoice && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
          <div className="flex-1 text-sm font-medium">
            Deliveries Checked Against Invoice (Shorts And Quality)
          </div>
        </label>

        {/* 6. Regulatory Decals & Allergens */}
        <label
          htmlFor="check-regulatory-decals"
          className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
            data.regulatoryDecalsAllergens
              ? 'bg-blue-50/70 border-blue-300 text-blue-950'
              : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100/60'
          }`}
        >
          <input
            id="check-regulatory-decals"
            type="checkbox"
            checked={data.regulatoryDecalsAllergens}
            onChange={() => toggleBoolean('regulatoryDecalsAllergens')}
            className="sr-only"
          />
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
              data.regulatoryDecalsAllergens
                ? 'bg-[#104f9b] border-[#104f9b] text-white'
                : 'border-slate-300 bg-white'
            }`}
          >
            {data.regulatoryDecalsAllergens && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
          <div className="flex-1 text-sm font-medium">
            Regulatory Decals & Allergens Color Added Consumer Advisory
          </div>
        </label>
      </div>

      {/* Self-Serve Case */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Self-Serve Case
            </h4>
          </div>
        </div>

        {/* Checkbox grid */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => updateSelfServe('faced', !data.selfServeCase.faced)}
            className={`min-h-[44px] flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-left transition-all ${
              data.selfServeCase.faced
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${data.selfServeCase.faced ? 'bg-[#104f9b] border-[#104f9b] text-white' : 'border-slate-300 bg-white'}`}>
              {data.selfServeCase.faced && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Faced</span>
          </button>

          <button
            type="button"
            onClick={() => updateSelfServe('tagged', !data.selfServeCase.tagged)}
            className={`min-h-[44px] flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-left transition-all ${
              data.selfServeCase.tagged
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${data.selfServeCase.tagged ? 'bg-[#104f9b] border-[#104f9b] text-white' : 'border-slate-300 bg-white'}`}>
              {data.selfServeCase.tagged && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Tagged</span>
          </button>

          <button
            type="button"
            onClick={() => updateSelfServe('setToSchematic', !data.selfServeCase.setToSchematic)}
            className={`min-h-[44px] flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-left transition-all col-span-2 ${
              data.selfServeCase.setToSchematic
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${data.selfServeCase.setToSchematic ? 'bg-[#104f9b] border-[#104f9b] text-white' : 'border-slate-300 bg-white'}`}>
              {data.selfServeCase.setToSchematic && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Set to Schematic</span>
          </button>

          <button
            type="button"
            onClick={() => updateSelfServe('culledRotated', !data.selfServeCase.culledRotated)}
            className={`min-h-[44px] flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-left transition-all ${
              data.selfServeCase.culledRotated
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${data.selfServeCase.culledRotated ? 'bg-[#104f9b] border-[#104f9b] text-white' : 'border-slate-300 bg-white'}`}>
              {data.selfServeCase.culledRotated && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Culled/Rotated</span>
          </button>

          <button
            type="button"
            onClick={() => updateSelfServe('properlyMarkedDown', !data.selfServeCase.properlyMarkedDown)}
            className={`min-h-[44px] flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-left transition-all ${
              data.selfServeCase.properlyMarkedDown
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${data.selfServeCase.properlyMarkedDown ? 'bg-[#104f9b] border-[#104f9b] text-white' : 'border-slate-300 bg-white'}`}>
              {data.selfServeCase.properlyMarkedDown && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Properly Marked Down</span>
          </button>
        </div>

        {/* Number of OOS Stepper & Missing Items Note */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-800">Number of OOS (Out of Stock)</div>
              <div className="text-[11px] text-slate-500">Count of missing schematic items</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOOSStepper(data.selfServeCase.numberOfOOS, (v) => updateSelfServe('numberOfOOS', v), -1)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 active:bg-slate-100 shadow-xs cursor-pointer"
                aria-label="Decrease self-serve out of stock count"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="0"
                value={data.selfServeCase.numberOfOOS}
                onChange={(e) => {
                  const val = e.target.value;
                  updateSelfServe('numberOfOOS', val === '' ? '' : Math.max(0, parseInt(val, 10) || 0));
                }}
                onBlur={() => {
                  if (data.selfServeCase.numberOfOOS === '') {
                    updateSelfServe('numberOfOOS', 0);
                  }
                }}
                placeholder="0"
                className="w-14 h-11 min-h-[44px] text-center font-bold text-base bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#104f9b] shadow-xs"
              />
              <button
                type="button"
                onClick={() => handleOOSStepper(data.selfServeCase.numberOfOOS, (v) => updateSelfServe('numberOfOOS', v), 1)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 active:bg-slate-100 shadow-xs cursor-pointer"
                aria-label="Increase self-serve out of stock count"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Missing items note - only appears if 1 or more missing items */}
          {isOOSActive(data.selfServeCase.numberOfOOS) && (
            <div className="pt-2 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="self-serve-oos-notes"
                  className="text-xs font-semibold text-rose-700 flex items-center gap-1.5"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-rose-600" />
                  <span>Specific Missing Item(s)</span>
                  <span className="text-[10px] font-normal text-slate-500">
                    ({data.selfServeCase.numberOfOOS} missing)
                  </span>
                </label>
                {Boolean(data.selfServeCase.oosNotes?.trim()) && (
                  <button
                    type="button"
                    onClick={() => updateSelfServe('oosNotes', '')}
                    className="min-h-[44px] px-2.5 inline-flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 active:text-slate-800 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                id="self-serve-oos-notes"
                rows={2}
                value={data.selfServeCase.oosNotes || ''}
                onChange={(e) => updateSelfServe('oosNotes', e.target.value)}
                placeholder="List specific missing item(s) (e.g. 16/20 EZ Peel Shrimp, Cedar Plank Salmon 10oz, Tuna Poke Bowls)..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-rose-200 bg-white placeholder-slate-400 text-slate-800 focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all resize-none shadow-xs"
              />
            </div>
          )}
        </div>
      </div>

      {/* Frozen Doors / Bunkers */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Snowflake className="w-4 h-4 text-cyan-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Frozen Doors / Bunkers
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => updateFrozenDoors('setToSchematic', !data.frozenDoorsBunkers.setToSchematic)}
            className={`min-h-[44px] flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-left transition-all ${
              data.frozenDoorsBunkers.setToSchematic
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${data.frozenDoorsBunkers.setToSchematic ? 'bg-[#104f9b] border-[#104f9b] text-white' : 'border-slate-300 bg-white'}`}>
              {data.frozenDoorsBunkers.setToSchematic && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Set to Schematic</span>
          </button>

          <button
            type="button"
            onClick={() => updateFrozenDoors('facedAndTagged', !data.frozenDoorsBunkers.facedAndTagged)}
            className={`min-h-[44px] flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-left transition-all ${
              data.frozenDoorsBunkers.facedAndTagged
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${data.frozenDoorsBunkers.facedAndTagged ? 'bg-[#104f9b] border-[#104f9b] text-white' : 'border-slate-300 bg-white'}`}>
              {data.frozenDoorsBunkers.facedAndTagged && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Faced & Tagged</span>
          </button>
        </div>

        {/* Number of OOS Doors/Bunkers & Missing Items Note */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-800">Number of OOS (Doors & Bunkers)</div>
              <div className="text-[11px] text-slate-500">Out of stock frozen items</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOOSStepper(data.frozenDoorsBunkers.numberOfOOS, (v) => updateFrozenDoors('numberOfOOS', v), -1)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 active:bg-slate-100 shadow-xs cursor-pointer"
                aria-label="Decrease frozen doors out of stock count"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="0"
                value={data.frozenDoorsBunkers.numberOfOOS}
                onChange={(e) => {
                  const val = e.target.value;
                  updateFrozenDoors('numberOfOOS', val === '' ? '' : Math.max(0, parseInt(val, 10) || 0));
                }}
                onBlur={() => {
                  if (data.frozenDoorsBunkers.numberOfOOS === '') {
                    updateFrozenDoors('numberOfOOS', 0);
                  }
                }}
                placeholder="0"
                className="w-14 h-11 min-h-[44px] text-center font-bold text-base bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#104f9b] shadow-xs"
              />
              <button
                type="button"
                onClick={() => handleOOSStepper(data.frozenDoorsBunkers.numberOfOOS, (v) => updateFrozenDoors('numberOfOOS', v), 1)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 active:bg-slate-100 shadow-xs cursor-pointer"
                aria-label="Increase frozen doors out of stock count"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Missing items note - only appears if 1 or more missing items */}
          {isOOSActive(data.frozenDoorsBunkers.numberOfOOS) && (
            <div className="pt-2 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="frozen-doors-oos-notes"
                  className="text-xs font-semibold text-cyan-800 flex items-center gap-1.5"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Specific Missing Item(s)</span>
                  <span className="text-[10px] font-normal text-slate-500">
                    ({data.frozenDoorsBunkers.numberOfOOS} missing)
                  </span>
                </label>
                {Boolean(data.frozenDoorsBunkers.oosNotes?.trim()) && (
                  <button
                    type="button"
                    onClick={() => updateFrozenDoors('oosNotes', '')}
                    className="min-h-[44px] px-2.5 inline-flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 active:text-slate-800 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                id="frozen-doors-oos-notes"
                rows={2}
                value={data.frozenDoorsBunkers.oosNotes || ''}
                onChange={(e) => updateFrozenDoors('oosNotes', e.target.value)}
                placeholder="List specific missing item(s) (e.g. 2lb Breaded Shrimp, Lobster Tails 2pk, IQF Cod Fillets)..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-cyan-200 bg-white placeholder-slate-400 text-slate-800 focus:outline-hidden focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition-all resize-none shadow-xs"
              />
            </div>
          )}
        </div>
      </div>

      {/* Wet & Dry Racks */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Wet & Dry Racks
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => updateWetDryRacks('faced', !data.wetDryRacks.faced)}
            className={`min-h-[44px] flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-left transition-all ${
              data.wetDryRacks.faced
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${data.wetDryRacks.faced ? 'bg-[#104f9b] border-[#104f9b] text-white' : 'border-slate-300 bg-white'}`}>
              {data.wetDryRacks.faced && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Faced</span>
          </button>

          <button
            type="button"
            onClick={() => updateWetDryRacks('tagged', !data.wetDryRacks.tagged)}
            className={`min-h-[44px] flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-left transition-all ${
              data.wetDryRacks.tagged
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${data.wetDryRacks.tagged ? 'bg-[#104f9b] border-[#104f9b] text-white' : 'border-slate-300 bg-white'}`}>
              {data.wetDryRacks.tagged && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Tagged</span>
          </button>

          <button
            type="button"
            onClick={() => updateWetDryRacks('setToSchematic', !data.wetDryRacks.setToSchematic)}
            className={`min-h-[44px] flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-left transition-all col-span-2 ${
              data.wetDryRacks.setToSchematic
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${data.wetDryRacks.setToSchematic ? 'bg-[#104f9b] border-[#104f9b] text-white' : 'border-slate-300 bg-white'}`}>
              {data.wetDryRacks.setToSchematic && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Set to Schematic</span>
          </button>
        </div>

        {/* Number of OOS Wet & Dry & Missing Items Note */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-800">Number of OOS (Wet & Dry Racks)</div>
              <div className="text-[11px] text-slate-500">Out of stock spice/marinade/rack items</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOOSStepper(data.wetDryRacks.numberOfOOS, (v) => updateWetDryRacks('numberOfOOS', v), -1)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 active:bg-slate-100 shadow-xs cursor-pointer"
                aria-label="Decrease wet and dry racks out of stock count"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="0"
                value={data.wetDryRacks.numberOfOOS}
                onChange={(e) => {
                  const val = e.target.value;
                  updateWetDryRacks('numberOfOOS', val === '' ? '' : Math.max(0, parseInt(val, 10) || 0));
                }}
                onBlur={() => {
                  if (data.wetDryRacks.numberOfOOS === '') {
                    updateWetDryRacks('numberOfOOS', 0);
                  }
                }}
                placeholder="0"
                className="w-14 h-11 min-h-[44px] text-center font-bold text-base bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#104f9b] shadow-xs"
              />
              <button
                type="button"
                onClick={() => handleOOSStepper(data.wetDryRacks.numberOfOOS, (v) => updateWetDryRacks('numberOfOOS', v), 1)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 active:bg-slate-100 shadow-xs cursor-pointer"
                aria-label="Increase wet and dry racks out of stock count"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Missing items note - only appears if 1 or more missing items */}
          {isOOSActive(data.wetDryRacks.numberOfOOS) && (
            <div className="pt-2 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="wet-dry-oos-notes"
                  className="text-xs font-semibold text-amber-800 flex items-center gap-1.5"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-amber-600" />
                  <span>Specific Missing Item(s)</span>
                  <span className="text-[10px] font-normal text-slate-500">
                    ({data.wetDryRacks.numberOfOOS} missing)
                  </span>
                </label>
                {Boolean(data.wetDryRacks.oosNotes?.trim()) && (
                  <button
                    type="button"
                    onClick={() => updateWetDryRacks('oosNotes', '')}
                    className="min-h-[44px] px-2.5 inline-flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 active:text-slate-800 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                id="wet-dry-oos-notes"
                rows={2}
                value={data.wetDryRacks.oosNotes || ''}
                onChange={(e) => updateWetDryRacks('oosNotes', e.target.value)}
                placeholder="List specific missing item(s) (e.g. Old Bay Seasoning, Blackened Fish Fry, Lemon Pepper Marinade)..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-amber-200 bg-white placeholder-slate-400 text-slate-800 focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all resize-none shadow-xs"
              />
            </div>
          )}
        </div>
      </div>

      {/* Full-Service Case */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Fish className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Full-Service Case
            </h4>
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => updateFullService('setToSchematic', !data.fullServiceCase.setToSchematic)}
            className={`w-full min-h-[44px] flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium text-left transition-all ${
              data.fullServiceCase.setToSchematic
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${data.fullServiceCase.setToSchematic ? 'bg-[#104f9b] border-[#104f9b] text-white' : 'border-slate-300 bg-white'}`}>
              {data.fullServiceCase.setToSchematic && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Set to Schematic</span>
          </button>

          <button
            type="button"
            onClick={() => updateFullService('properDividers', !data.fullServiceCase.properDividers)}
            className={`w-full min-h-[44px] flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium text-left transition-all ${
              data.fullServiceCase.properDividers
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${data.fullServiceCase.properDividers ? 'bg-[#104f9b] border-[#104f9b] text-white' : 'border-slate-300 bg-white'}`}>
              {data.fullServiceCase.properDividers && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Proper Dividers</span>
          </button>

          <button
            type="button"
            onClick={() => updateFullService('correctSluCool', !data.fullServiceCase.correctSluCool)}
            className={`w-full min-h-[44px] flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium text-left transition-all ${
              data.fullServiceCase.correctSluCool
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${data.fullServiceCase.correctSluCool ? 'bg-[#104f9b] border-[#104f9b] text-white' : 'border-slate-300 bg-white'}`}>
              {data.fullServiceCase.correctSluCool && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Correct SLU / COOL (Country of Origin Labeling)</span>
          </button>

          <button
            type="button"
            onClick={() => updateFullService('cookedShrimpDated', !data.fullServiceCase.cookedShrimpDated)}
            className={`w-full min-h-[44px] flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium text-left transition-all ${
              data.fullServiceCase.cookedShrimpDated
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${data.fullServiceCase.cookedShrimpDated ? 'bg-[#104f9b] border-[#104f9b] text-white' : 'border-slate-300 bg-white'}`}>
              {data.fullServiceCase.cookedShrimpDated && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Cooked Shrimp Dated</span>
          </button>

          <button
            type="button"
            onClick={() => updateFullService('shellfishHarvestTags90Days', !data.fullServiceCase.shellfishHarvestTags90Days)}
            className={`w-full min-h-[44px] flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium text-left transition-all ${
              data.fullServiceCase.shellfishHarvestTags90Days
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${data.fullServiceCase.shellfishHarvestTags90Days ? 'bg-[#104f9b] border-[#104f9b] text-white' : 'border-slate-300 bg-white'}`}>
              {data.fullServiceCase.shellfishHarvestTags90Days && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Shellfish Harvest Tags Kept for 90 Days</span>
          </button>
        </div>

        {/* Number of OOS Full-Service & Missing Items Note */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-800">Number of OOS (Full-Service Case)</div>
              <div className="text-[11px] text-slate-500">Missing full-service varieties</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOOSStepper(data.fullServiceCase.numberOfOOS, (v) => updateFullService('numberOfOOS', v), -1)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 active:bg-slate-100 shadow-xs cursor-pointer"
                aria-label="Decrease full-service out of stock count"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="0"
                value={data.fullServiceCase.numberOfOOS}
                onChange={(e) => {
                  const val = e.target.value;
                  updateFullService('numberOfOOS', val === '' ? '' : Math.max(0, parseInt(val, 10) || 0));
                }}
                onBlur={() => {
                  if (data.fullServiceCase.numberOfOOS === '') {
                    updateFullService('numberOfOOS', 0);
                  }
                }}
                placeholder="0"
                className="w-14 h-11 min-h-[44px] text-center font-bold text-base bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#104f9b] shadow-xs"
              />
              <button
                type="button"
                onClick={() => handleOOSStepper(data.fullServiceCase.numberOfOOS, (v) => updateFullService('numberOfOOS', v), 1)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 active:bg-slate-100 shadow-xs cursor-pointer"
                aria-label="Increase full-service out of stock count"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Missing items note - only appears if 1 or more missing items */}
          {isOOSActive(data.fullServiceCase.numberOfOOS) && (
            <div className="pt-2 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="full-service-oos-notes"
                  className="text-xs font-semibold text-indigo-800 flex items-center gap-1.5"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Specific Missing Item(s)</span>
                  <span className="text-[10px] font-normal text-slate-500">
                    ({data.fullServiceCase.numberOfOOS} missing)
                  </span>
                </label>
                {Boolean(data.fullServiceCase.oosNotes?.trim()) && (
                  <button
                    type="button"
                    onClick={() => updateFullService('oosNotes', '')}
                    className="min-h-[44px] px-2.5 inline-flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 active:text-slate-800 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                id="full-service-oos-notes"
                rows={2}
                value={data.fullServiceCase.oosNotes || ''}
                onChange={(e) => updateFullService('oosNotes', e.target.value)}
                placeholder="List specific missing item(s) (e.g. Fresh Halibut Fillets, Jumbo Sea Scallops, Wild Sockeye Salmon)..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-indigo-200 bg-white placeholder-slate-400 text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all resize-none shadow-xs"
              />
            </div>
          )}
        </div>
      </div>

      {/* Perishable Link Item */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <label
          htmlFor="check-perishable-link"
          className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
            data.perishableLinkUsed
              ? 'bg-blue-50/70 border-blue-300 text-blue-950'
              : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100/60'
          }`}
        >
          <input
            id="check-perishable-link"
            type="checkbox"
            checked={data.perishableLinkUsed}
            onChange={() => toggleBoolean('perishableLinkUsed')}
            className="sr-only"
          />
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
              data.perishableLinkUsed
                ? 'bg-[#104f9b] border-[#104f9b] text-white'
                : 'border-slate-300 bg-white'
            }`}
          >
            {data.perishableLinkUsed && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Perishable Link Used For Overstock Items</div>
            <div className="text-xs text-slate-500 mt-0.5">Inventory link maintained for excess product tracking</div>
          </div>
        </label>
      </div>
    </div>
  );
};
