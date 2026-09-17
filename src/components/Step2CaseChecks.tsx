import React from 'react';
import { CaseDepartmentChecks, YesNoValue } from '../types';
import { Minus, Plus, Fish, Layers, Snowflake, Sparkles, ClipboardList } from 'lucide-react';
import { YesNoToggle } from './YesNoToggle';

interface Step2CaseChecksProps {
  data: CaseDepartmentChecks;
  onChange: (updater: (prev: CaseDepartmentChecks) => CaseDepartmentChecks) => void;
}

export const Step2CaseChecks: React.FC<Step2CaseChecksProps> = ({ data, onChange }) => {
  const setTopLevelField = (
    field: keyof Omit<CaseDepartmentChecks, 'selfServeCase' | 'frozenDoorsBunkers' | 'wetDryRacks' | 'fullServiceCase'>,
    value: YesNoValue
  ) => {
    onChange((prev) => ({
      ...prev,
      [field]: value,
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

  const allCheckValues: YesNoValue[] = [
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
  ];

  const totalYes = allCheckValues.filter((v) => v === true).length;
  const totalNo = allCheckValues.filter((v) => v === false).length;
  const totalEvaluated = allCheckValues.filter((v) => v !== null && v !== undefined).length;
  const totalCriteria = allCheckValues.length;

  const handleClearAll = () => {
    onChange((prev) => ({
      ...prev,
      clerkScheduledAndInSeafood: null,
      seafoodCasePulledNightBefore: null,
      seafoodCaseCleanOdorFree: null,
      taresDoneDaily: null,
      deliveriesCheckedInvoice: null,
      regulatoryDecalsAllergens: null,
      perishableLinkUsed: null,
      selfServeCase: {
        ...prev.selfServeCase,
        faced: null,
        tagged: null,
        setToSchematic: null,
        culledRotated: null,
        properlyMarkedDown: null,
      },
      frozenDoorsBunkers: {
        ...prev.frozenDoorsBunkers,
        setToSchematic: null,
        facedAndTagged: null,
      },
      wetDryRacks: {
        ...prev.wetDryRacks,
        faced: null,
        tagged: null,
        setToSchematic: null,
      },
      fullServiceCase: {
        ...prev.fullServiceCase,
        setToSchematic: null,
        properDividers: null,
        correctSluCool: null,
        cookedShrimpDated: null,
        shellfishHarvestTags90Days: null,
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
              {totalEvaluated}/{totalCriteria} Checked
            </span>
          </div>
        </div>

        {/* Individual Verification Notice & Clear Option */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
          <span className="text-slate-500 italic">
            Select YES, NO, or Leave Blank for each standard during store walk
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

      {/* General Department & Case Operations */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <Fish className="w-4 h-4 text-[#104f9b]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Department Operations & Readiness
          </h4>
        </div>

        {/* 1. Clerk Scheduled */}
        <div
          className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            data.clerkScheduledAndInSeafood === true
              ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
              : data.clerkScheduledAndInSeafood === false
              ? 'bg-rose-50/40 border-rose-300/80 shadow-xs'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex-1 min-w-0 pr-1">
            <div className="text-sm font-semibold text-slate-900">
              Clerk Scheduled And In Seafood Department
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Coverage verified for department operational hours
            </div>
          </div>
          <div className="shrink-0 self-end sm:self-center">
            <YesNoToggle
              value={data.clerkScheduledAndInSeafood}
              onChange={(val) => setTopLevelField('clerkScheduledAndInSeafood', val)}
              idPrefix="check-clerk-scheduled"
              ariaLabel="Clerk Scheduled And In Seafood Department"
            />
          </div>
        </div>

        {/* 2. Seafood Case Pulled Night Before */}
        <div
          className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            data.seafoodCasePulledNightBefore === true
              ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
              : data.seafoodCasePulledNightBefore === false
              ? 'bg-rose-50/40 border-rose-300/80 shadow-xs'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex-1 min-w-0 pr-1">
            <div className="text-sm font-semibold text-slate-900">
              Seafood Case Pulled Night Before
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Case pulled, iced down, or covered per division closing policy
            </div>
          </div>
          <div className="shrink-0 self-end sm:self-center">
            <YesNoToggle
              value={data.seafoodCasePulledNightBefore}
              onChange={(val) => setTopLevelField('seafoodCasePulledNightBefore', val)}
              idPrefix="check-seafood-pulled"
              ariaLabel="Seafood Case Pulled Night Before"
            />
          </div>
        </div>

        {/* 3. Seafood Case Clean & Odor Free */}
        <div
          className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            data.seafoodCaseCleanOdorFree === true
              ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
              : data.seafoodCaseCleanOdorFree === false
              ? 'bg-rose-50/40 border-rose-300/80 shadow-xs'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex-1 min-w-0 pr-1">
            <div className="text-sm font-semibold text-slate-900">
              Seafood Case Clean, Clear Of Build-Up And Odor Free
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Trays, ice beds, glass shields, and drain troughs sanitized
            </div>
          </div>
          <div className="shrink-0 self-end sm:self-center">
            <YesNoToggle
              value={data.seafoodCaseCleanOdorFree}
              onChange={(val) => setTopLevelField('seafoodCaseCleanOdorFree', val)}
              idPrefix="check-seafood-clean"
              ariaLabel="Seafood Case Clean, Clear Of Build-Up And Odor Free"
            />
          </div>
        </div>

        {/* 4. Tares Done Daily */}
        <div
          className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            data.taresDoneDaily === true
              ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
              : data.taresDoneDaily === false
              ? 'bg-rose-50/40 border-rose-300/80 shadow-xs'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex-1 min-w-0 pr-1">
            <div className="text-sm font-semibold text-slate-900">
              Tares Done Daily
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Service and self-serve scale tare logs verified and accurate
            </div>
          </div>
          <div className="shrink-0 self-end sm:self-center">
            <YesNoToggle
              value={data.taresDoneDaily}
              onChange={(val) => setTopLevelField('taresDoneDaily', val)}
              idPrefix="check-tares-daily"
              ariaLabel="Tares Done Daily"
            />
          </div>
        </div>

        {/* 5. Deliveries Checked Against Invoice */}
        <div
          className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            data.deliveriesCheckedInvoice === true
              ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
              : data.deliveriesCheckedInvoice === false
              ? 'bg-rose-50/40 border-rose-300/80 shadow-xs'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex-1 min-w-0 pr-1">
            <div className="text-sm font-semibold text-slate-900">
              Deliveries Checked Against Invoice (Shorts And Quality)
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Product counted, temp recorded, and credits submitted promptly
            </div>
          </div>
          <div className="shrink-0 self-end sm:self-center">
            <YesNoToggle
              value={data.deliveriesCheckedInvoice}
              onChange={(val) => setTopLevelField('deliveriesCheckedInvoice', val)}
              idPrefix="check-deliveries-invoice"
              ariaLabel="Deliveries Checked Against Invoice"
            />
          </div>
        </div>

        {/* 6. Regulatory Decals & Allergens */}
        <div
          className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            data.regulatoryDecalsAllergens === true
              ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
              : data.regulatoryDecalsAllergens === false
              ? 'bg-rose-50/40 border-rose-300/80 shadow-xs'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex-1 min-w-0 pr-1">
            <div className="text-sm font-semibold text-slate-900">
              Regulatory Decals & Allergens Color Added Consumer Advisory
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Health advisories, salmon color added, and allergen notices posted
            </div>
          </div>
          <div className="shrink-0 self-end sm:self-center">
            <YesNoToggle
              value={data.regulatoryDecalsAllergens}
              onChange={(val) => setTopLevelField('regulatoryDecalsAllergens', val)}
              idPrefix="check-regulatory-decals"
              ariaLabel="Regulatory Decals & Allergens Color Added Consumer Advisory"
            />
          </div>
        </div>
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

        {/* Yes/No Items */}
        <div className="space-y-2.5">
          {[
            { key: 'faced' as const, label: 'Faced', desc: 'Product pulled forward and neat' },
            { key: 'tagged' as const, label: 'Tagged', desc: 'Clear price and item tag on every shelf position' },
            { key: 'setToSchematic' as const, label: 'Set to Schematic', desc: 'Planogram layout matching active store schematic' },
            { key: 'culledRotated' as const, label: 'Culled / Rotated', desc: 'Older dates rotated forward, poor quality culled' },
            { key: 'properlyMarkedDown' as const, label: 'Properly Marked Down', desc: 'Yellow/orange clearance tags applied accurately' },
          ].map((item) => {
            const val = data.selfServeCase[item.key];
            return (
              <div
                key={item.key}
                className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                  val === true
                    ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
                    : val === false
                    ? 'bg-rose-50/40 border-rose-300/80 shadow-xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex-1 min-w-0 pr-1">
                  <div className="text-xs font-semibold text-slate-900">{item.label}</div>
                  <div className="text-[11px] text-slate-500">{item.desc}</div>
                </div>
                <div className="shrink-0 self-end sm:self-center">
                  <YesNoToggle
                    value={val}
                    onChange={(newVal) => updateSelfServe(item.key, newVal)}
                    idPrefix={`self-serve-${item.key}`}
                    compact
                    ariaLabel={`Self-serve ${item.label}`}
                  />
                </div>
              </div>
            );
          })}
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

        <div className="space-y-2.5">
          {[
            { key: 'setToSchematic' as const, label: 'Set to Schematic', desc: 'Door and bunker layouts follow planogram' },
            { key: 'facedAndTagged' as const, label: 'Faced & Tagged', desc: 'Freezer shelves fully fronted with matching tags' },
          ].map((item) => {
            const val = data.frozenDoorsBunkers[item.key];
            return (
              <div
                key={item.key}
                className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                  val === true
                    ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
                    : val === false
                    ? 'bg-rose-50/40 border-rose-300/80 shadow-xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex-1 min-w-0 pr-1">
                  <div className="text-xs font-semibold text-slate-900">{item.label}</div>
                  <div className="text-[11px] text-slate-500">{item.desc}</div>
                </div>
                <div className="shrink-0 self-end sm:self-center">
                  <YesNoToggle
                    value={val}
                    onChange={(newVal) => updateFrozenDoors(item.key, newVal)}
                    idPrefix={`frozen-doors-${item.key}`}
                    compact
                    ariaLabel={`Frozen doors ${item.label}`}
                  />
                </div>
              </div>
            );
          })}
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

        <div className="space-y-2.5">
          {[
            { key: 'faced' as const, label: 'Faced', desc: 'Spices, sauces, and dry rubs fronted neatly' },
            { key: 'tagged' as const, label: 'Tagged', desc: 'Every spice rack position has current retail shelf tag' },
            { key: 'setToSchematic' as const, label: 'Set to Schematic', desc: 'Rack schematic alignment verified' },
          ].map((item) => {
            const val = data.wetDryRacks[item.key];
            return (
              <div
                key={item.key}
                className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                  val === true
                    ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
                    : val === false
                    ? 'bg-rose-50/40 border-rose-300/80 shadow-xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex-1 min-w-0 pr-1">
                  <div className="text-xs font-semibold text-slate-900">{item.label}</div>
                  <div className="text-[11px] text-slate-500">{item.desc}</div>
                </div>
                <div className="shrink-0 self-end sm:self-center">
                  <YesNoToggle
                    value={val}
                    onChange={(newVal) => updateWetDryRacks(item.key, newVal)}
                    idPrefix={`wet-dry-${item.key}`}
                    compact
                    ariaLabel={`Wet & dry racks ${item.label}`}
                  />
                </div>
              </div>
            );
          })}
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

        <div className="space-y-2.5">
          {[
            { key: 'setToSchematic' as const, label: 'Set to Schematic', desc: 'Case display rows, species placement, and variety matching schematic' },
            { key: 'properDividers' as const, label: 'Proper Dividers', desc: 'Sanitary clear dividers separating cooked, raw, and ready-to-eat species' },
            { key: 'correctSluCool' as const, label: 'Correct SLU / COOL', desc: 'Country of Origin Labeling and Scale Look-Up tags correct on display' },
            { key: 'cookedShrimpDated' as const, label: 'Cooked Shrimp Dated', desc: 'Slack dating and sell-by timers accurately tracked' },
            { key: 'shellfishHarvestTags90Days' as const, label: 'Shellfish Harvest Tags Kept for 90 Days', desc: 'Oyster, clam, and mussel shellstock tags retained on file in chronological order' },
          ].map((item) => {
            const val = data.fullServiceCase[item.key];
            return (
              <div
                key={item.key}
                className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  val === true
                    ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
                    : val === false
                    ? 'bg-rose-50/40 border-rose-300/80 shadow-xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex-1 min-w-0 pr-1">
                  <div className="text-xs font-semibold text-slate-900">{item.label}</div>
                  <div className="text-[11px] text-slate-500">{item.desc}</div>
                </div>
                <div className="shrink-0 self-end sm:self-center">
                  <YesNoToggle
                    value={val}
                    onChange={(newVal) => updateFullService(item.key, newVal)}
                    idPrefix={`full-service-${item.key}`}
                    compact
                    ariaLabel={`Full-service ${item.label}`}
                  />
                </div>
              </div>
            );
          })}
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
        <div
          className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            data.perishableLinkUsed === true
              ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
              : data.perishableLinkUsed === false
              ? 'bg-rose-50/40 border-rose-300/80 shadow-xs'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex-1 min-w-0 pr-1">
            <div className="text-sm font-semibold text-slate-900">
              Perishable Link Used For Overstock Items
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Inventory link maintained for excess product tracking & shrink minimization
            </div>
          </div>
          <div className="shrink-0 self-end sm:self-center">
            <YesNoToggle
              value={data.perishableLinkUsed}
              onChange={(val) => setTopLevelField('perishableLinkUsed', val)}
              idPrefix="check-perishable-link"
              ariaLabel="Perishable Link Used For Overstock Items"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
