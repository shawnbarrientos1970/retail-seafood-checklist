import React from 'react';
import { CaseDepartmentChecks } from '../types';
import { Check, X, Ban, Plus, Minus, Layers, Fish, Sparkles, Snowflake, Package, ShieldAlert } from 'lucide-react';

interface Step2CaseChecksProps {
  data: CaseDepartmentChecks;
  onChange: (updater: (prev: CaseDepartmentChecks) => CaseDepartmentChecks) => void;
}

interface TriToggleProps {
  idPrefix: string;
  label: string;
  subtitle?: string;
  value: boolean | null;
  onChange: (val: boolean | null) => void;
  allowNA?: boolean;
}

const TriToggle: React.FC<TriToggleProps> = ({
  idPrefix,
  label,
  subtitle,
  value,
  onChange,
}) => {
  return (
    <div className="py-2.5 border-b border-slate-100 last:border-b-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div className="flex-1 pr-2">
        <div className="text-xs font-semibold text-slate-800 leading-snug">{label}</div>
        {subtitle && <div className="text-[11px] text-slate-500 mt-0.5">{subtitle}</div>}
      </div>
      <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0">
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

interface OosCounterProps {
  idPrefix: string;
  count: number;
  notes: string;
  onCountChange: (cnt: number) => void;
  onNotesChange: (notes: string) => void;
  label?: string;
}

const OosCounter: React.FC<OosCounterProps> = ({
  idPrefix,
  count,
  notes,
  onCountChange,
  onNotesChange,
  label = 'Out of Stocks (OOS)',
}) => {
  return (
    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800">{label}:</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id={`${idPrefix}-dec`}
            onClick={() => onCountChange(Math.max(0, count - 1))}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-white border border-slate-300 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-transform cursor-pointer shadow-2xs"
            aria-label="Decrease out of stock count"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            id={`${idPrefix}-input`}
            value={count}
            onChange={(e) => onCountChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="w-14 h-11 text-center text-sm font-bold bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-[#104f9b] focus:ring-1 focus:ring-blue-200"
          />
          <button
            type="button"
            id={`${idPrefix}-inc`}
            onClick={() => onCountChange(count + 1)}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-white border border-slate-300 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-transform cursor-pointer shadow-2xs"
            aria-label="Increase out of stock count"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      {count > 0 && (
        <div className="space-y-1">
          <label htmlFor={`${idPrefix}-notes`} className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
            <span>Specific Missing Items:</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id={`${idPrefix}-notes`}
            placeholder="e.g. Sockeye fillets, cooked tail-on 26/30, cocktail sauce..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="w-full min-h-[44px] px-3 rounded-xl border border-amber-300 bg-amber-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#104f9b] focus:ring-1 focus:ring-blue-200"
          />
        </div>
      )}
    </div>
  );
};

export const Step2CaseChecks: React.FC<Step2CaseChecksProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Department Operations Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#104f9b] flex items-center justify-center">
            <Fish className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Seafood Operations & Clerks</h2>
            <p className="text-[11px] text-slate-500">Daily standards, tares, deliveries & sanitation</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <TriToggle
            idPrefix="dept-clerk"
            label="Clerk Scheduled & Working in Seafood"
            subtitle="Coverage verified and team member active at the counter"
            value={data.clerkScheduledAndInSeafood}
            onChange={(val) =>
              onChange((prev) => ({ ...prev, clerkScheduledAndInSeafood: val }))
            }
          />
          <TriToggle
            idPrefix="dept-pulled"
            label="Seafood Case Pulled Night Before"
            subtitle="Full case pull procedure executed prior evening"
            value={data.seafoodCasePulledNightBefore}
            onChange={(val) =>
              onChange((prev) => ({ ...prev, seafoodCasePulledNightBefore: val }))
            }
          />
          <TriToggle
            idPrefix="dept-clean"
            label="Seafood Case Clean & Odor Free"
            subtitle="Glass, trays, ice bed, drains and floor behind counter clean"
            value={data.seafoodCaseCleanOdorFree}
            onChange={(val) =>
              onChange((prev) => ({ ...prev, seafoodCaseCleanOdorFree: val }))
            }
          />
          <TriToggle
            idPrefix="dept-tares"
            label="Scale Tares Completed Daily"
            subtitle="Verified tare weight recorded for packaging and bags"
            value={data.taresDoneDaily}
            onChange={(val) =>
              onChange((prev) => ({ ...prev, taresDoneDaily: val }))
            }
          />
          <TriToggle
            idPrefix="dept-deliveries"
            label="Deliveries Checked Against Invoice"
            subtitle="Counts, weights, catch dates, and temperatures verified"
            value={data.deliveriesCheckedInvoice}
            onChange={(val) =>
              onChange((prev) => ({ ...prev, deliveriesCheckedInvoice: val }))
            }
          />
          <TriToggle
            idPrefix="dept-allergens"
            label="Regulatory Decals (Check Missing Decals)"
            subtitle="COOL country of origin labels, shellfish warnings & decals"
            value={data.regulatoryDecalsAllergens}
            onChange={(val) =>
              onChange((prev) => ({ ...prev, regulatoryDecalsAllergens: val }))
            }
          />
          {/* Missing Decals Detail Checklist */}
          <div className="py-2.5 px-3 bg-slate-50/80 rounded-xl border border-slate-200/60 my-1">
            <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Specific Decal Status:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { key: 'decalsAllergens', label: 'Allergens', val: data.decalsAllergens },
                { key: 'decalsColorAdded', label: 'Color Added', val: data.decalsColorAdded },
                { key: 'decalsConsumerAdvisory', label: 'Consumer Advisory', val: data.decalsConsumerAdvisory },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-800 font-medium">{item.label}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        onChange((prev) => ({ ...prev, [item.key]: prev[item.key as keyof typeof prev] === true ? null : true }))
                      }
                      className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                        item.val === true ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Y
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onChange((prev) => ({ ...prev, [item.key]: prev[item.key as keyof typeof prev] === false ? null : false }))
                      }
                      className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                        item.val === false ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      N
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <TriToggle
            idPrefix="dept-perishable"
            label="Perishable Link Tool Used"
            subtitle="Inventory tracking & daily log updated"
            value={data.perishableLinkUsed}
            onChange={(val) =>
              onChange((prev) => ({ ...prev, perishableLinkUsed: val }))
            }
          />
        </div>
      </div>

      {/* Full Service Case */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Full Service Seafood Case</h2>
            <p className="text-[11px] text-slate-500">Service counter presentation & food safety</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <TriToggle
            idPrefix="fs-schematic"
            label="Set to Division Schematic"
            subtitle="Merchandised according to seasonal fish schematic plan"
            value={data.fullServiceCase.setToSchematic}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                fullServiceCase: { ...prev.fullServiceCase, setToSchematic: val },
              }))
            }
          />
          <TriToggle
            idPrefix="fs-dividers"
            label="Proper Dividers Between Species"
            subtitle="Greens/dividers preventing cross-contact between raw & cooked"
            value={data.fullServiceCase.properDividers}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                fullServiceCase: { ...prev.fullServiceCase, properDividers: val },
              }))
            }
          />
          <TriToggle
            idPrefix="fs-slucool"
            label="Correct SLU & COOL Tags Displayed"
            subtitle="Prices, species, wild vs farm-raised, country of origin"
            value={data.fullServiceCase.correctSluCool}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                fullServiceCase: { ...prev.fullServiceCase, correctSluCool: val },
              }))
            }
          />
          <TriToggle
            idPrefix="fs-cookedshrimp"
            label="Cooked Shrimp Rotated & Dated"
            subtitle="Separated from raw seafood with proper expiration tags"
            value={data.fullServiceCase.cookedShrimpDated}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                fullServiceCase: { ...prev.fullServiceCase, cookedShrimpDated: val },
              }))
            }
          />
          <TriToggle
            idPrefix="fs-shellfishtags"
            label="Shellfish Harvest Tags Kept 90 Days"
            subtitle="Oysters, mussels, clams tags logged in chronologic binder"
            value={data.fullServiceCase.shellfishHarvestTags90Days}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                fullServiceCase: {
                  ...prev.fullServiceCase,
                  shellfishHarvestTags90Days: val,
                },
              }))
            }
          />
        </div>

        <OosCounter
          idPrefix="fs-oos"
          count={data.fullServiceCase.numberOfOOS}
          notes={data.fullServiceCase.oosNotes}
          onCountChange={(cnt) =>
            onChange((prev) => ({
              ...prev,
              fullServiceCase: { ...prev.fullServiceCase, numberOfOOS: cnt },
            }))
          }
          onNotesChange={(notes) =>
            onChange((prev) => ({
              ...prev,
              fullServiceCase: { ...prev.fullServiceCase, oosNotes: notes },
            }))
          }
        />
      </div>

      {/* Self-Serve Case */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Self-Serve Case</h2>
            <p className="text-[11px] text-slate-500">Packaged seafood, grab & go, smoked fish</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <TriToggle
            idPrefix="ss-faced"
            label="Faced to Front Edge"
            value={data.selfServeCase.faced}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                selfServeCase: { ...prev.selfServeCase, faced: val },
              }))
            }
          />
          <TriToggle
            idPrefix="ss-tagged"
            label="100% Tagged with Current Prices"
            value={data.selfServeCase.tagged}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                selfServeCase: { ...prev.selfServeCase, tagged: val },
              }))
            }
          />
          <TriToggle
            idPrefix="ss-schematic"
            label="Set to Division Schematic"
            value={data.selfServeCase.setToSchematic}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                selfServeCase: { ...prev.selfServeCase, setToSchematic: val },
              }))
            }
          />
          <TriToggle
            idPrefix="ss-culled"
            label="Culled & Rotated (FIFO)"
            subtitle="Nearest expiration to front, blown seals removed"
            value={data.selfServeCase.culledRotated}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                selfServeCase: { ...prev.selfServeCase, culledRotated: val },
              }))
            }
          />
          <TriToggle
            idPrefix="ss-markdown"
            label="Properly Marked Down / Distressed Items"
            subtitle="Quick-sale tags applied according to division policy"
            value={data.selfServeCase.properlyMarkedDown}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                selfServeCase: { ...prev.selfServeCase, properlyMarkedDown: val },
              }))
            }
          />
        </div>

        <OosCounter
          idPrefix="ss-oos"
          count={data.selfServeCase.numberOfOOS}
          notes={data.selfServeCase.oosNotes}
          onCountChange={(cnt) =>
            onChange((prev) => ({
              ...prev,
              selfServeCase: { ...prev.selfServeCase, numberOfOOS: cnt },
            }))
          }
          onNotesChange={(notes) =>
            onChange((prev) => ({
              ...prev,
              selfServeCase: { ...prev.selfServeCase, oosNotes: notes },
            }))
          }
        />
      </div>

      {/* Frozen Doors & Bunkers */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <Snowflake className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Frozen Doors & Bunkers</h2>
            <p className="text-[11px] text-slate-500">Frozen fillets, shrimp, value-add seafood</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <TriToggle
            idPrefix="fz-schematic"
            label="Set to Division Schematic"
            value={data.frozenDoorsBunkers.setToSchematic}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                frozenDoorsBunkers: { ...prev.frozenDoorsBunkers, setToSchematic: val },
              }))
            }
          />
          <TriToggle
            idPrefix="fz-faced"
            label="Faced & Tagged"
            subtitle="No frost buildup, readable shelf tags"
            value={data.frozenDoorsBunkers.facedAndTagged}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                frozenDoorsBunkers: { ...prev.frozenDoorsBunkers, facedAndTagged: val },
              }))
            }
          />
        </div>

        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Total Frozen OOS:</span>
            <span className="text-sm font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
              {data.frozenDoorsBunkers.numberOfOOS}
            </span>
          </div>

          {/* Sub-breakdown for Doors and Bunkers matching physical checklist */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
              <span className="text-xs font-medium text-slate-700">Doors:</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={data.frozenDoorsBunkers.oosDoors ?? ''}
                placeholder="0"
                onChange={(e) => {
                  const val = e.target.value === '' ? undefined : Math.max(0, parseInt(e.target.value, 10) || 0);
                  onChange((prev) => {
                    const oosDoors = val;
                    const oosBunkers = prev.frozenDoorsBunkers.oosBunkers ?? 0;
                    const sum = (oosDoors ?? 0) + oosBunkers;
                    return {
                      ...prev,
                      frozenDoorsBunkers: {
                        ...prev.frozenDoorsBunkers,
                        oosDoors,
                        numberOfOOS: sum,
                      },
                    };
                  });
                }}
                className="w-14 h-9 text-center text-xs font-bold bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#104f9b]"
              />
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
              <span className="text-xs font-medium text-slate-700">Bunkers:</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={data.frozenDoorsBunkers.oosBunkers ?? ''}
                placeholder="0"
                onChange={(e) => {
                  const val = e.target.value === '' ? undefined : Math.max(0, parseInt(e.target.value, 10) || 0);
                  onChange((prev) => {
                    const oosBunkers = val;
                    const oosDoors = prev.frozenDoorsBunkers.oosDoors ?? 0;
                    const sum = (oosBunkers ?? 0) + oosDoors;
                    return {
                      ...prev,
                      frozenDoorsBunkers: {
                        ...prev.frozenDoorsBunkers,
                        oosBunkers,
                        numberOfOOS: sum,
                      },
                    };
                  });
                }}
                className="w-14 h-9 text-center text-xs font-bold bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#104f9b]"
              />
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <label htmlFor="fz-oos-notes" className="text-[11px] font-bold text-slate-700">
              Missing Frozen Items (Notes):
            </label>
            <input
              type="text"
              id="fz-oos-notes"
              placeholder="e.g. Frozen raw shrimp 16/20, breaded cod fillets..."
              value={data.frozenDoorsBunkers.oosNotes}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  frozenDoorsBunkers: { ...prev.frozenDoorsBunkers, oosNotes: e.target.value },
                }))
              }
              className="w-full min-h-[38px] px-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#104f9b]"
            />
          </div>
        </div>
      </div>

      {/* Wet / Dry Racks & Spices */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Wet / Dry Racks & Condiments</h2>
            <p className="text-[11px] text-slate-500">Coatings, marinades, cocktail sauce, cedar planks</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <TriToggle
            idPrefix="wd-faced"
            label="Faced"
            value={data.wetDryRacks.faced}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                wetDryRacks: { ...prev.wetDryRacks, faced: val },
              }))
            }
          />
          <TriToggle
            idPrefix="wd-tagged"
            label="Tagged with Correct Prices"
            value={data.wetDryRacks.tagged}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                wetDryRacks: { ...prev.wetDryRacks, tagged: val },
              }))
            }
          />
          <TriToggle
            idPrefix="wd-schematic"
            label="Set to Division Schematic"
            value={data.wetDryRacks.setToSchematic}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                wetDryRacks: { ...prev.wetDryRacks, setToSchematic: val },
              }))
            }
          />
        </div>

        <OosCounter
          idPrefix="wd-oos"
          count={data.wetDryRacks.numberOfOOS}
          notes={data.wetDryRacks.oosNotes}
          onCountChange={(cnt) =>
            onChange((prev) => ({
              ...prev,
              wetDryRacks: { ...prev.wetDryRacks, numberOfOOS: cnt },
            }))
          }
          onNotesChange={(notes) =>
            onChange((prev) => ({
              ...prev,
              wetDryRacks: { ...prev.wetDryRacks, oosNotes: notes },
            }))
          }
        />
      </div>
    </div>
  );
};
