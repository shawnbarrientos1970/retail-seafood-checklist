import React, { useRef, useState } from 'react';
import { PhotoCaptureData } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { PhotoModal, LightboxPhotoItem } from './PhotoModal';
import { Camera, Trash2, Eye, RefreshCw, CheckCircle2, Image as ImageIcon, Maximize2 } from 'lucide-react';

interface Step4PhotosNotesProps {
  photos: PhotoCaptureData;
  generalNotes: string;
  onUpdatePhoto: (slot: keyof PhotoCaptureData, dataUrl: string | null) => void;
  onUpdateNotes: (notes: string) => void;
}

interface PhotoSlotConfig {
  key: keyof PhotoCaptureData;
  label: string;
  subLabel: string;
  sectionNum: number;
}

const photoSlots: PhotoSlotConfig[] = [
  { sectionNum: 1, key: 'coolerFreezer', label: 'Cooler / Freezer', subLabel: 'Storage order, dating, and walk-in cleanliness' },
  { sectionNum: 2, key: 'selfServe', label: 'Self-Serve Case', subLabel: 'Facing, schematic compliance, markdown tags' },
  { sectionNum: 3, key: 'fullServe', label: 'Full-Serve Case', subLabel: 'Dividers, shrimp dating, ice/case cleanliness' },
  { sectionNum: 4, key: 'frozenDoorsBunkers', label: 'Frozen Doors / Bunkers', subLabel: 'Door schematics, tags, and facing' },
  { sectionNum: 5, key: 'spiceRacks', label: 'Spice Racks', subLabel: 'Wet & dry racks full, faced, and tagged' },
];

export const Step4PhotosNotes: React.FC<Step4PhotosNotesProps> = ({
  photos,
  generalNotes,
  onUpdatePhoto,
  onUpdateNotes,
}) => {
  const [loadingSlot, setLoadingSlot] = useState<keyof PhotoCaptureData | null>(null);
  const [activeLightboxKey, setActiveLightboxKey] = useState<keyof PhotoCaptureData | null>(null);

  // Hidden inputs for iPhone camera & photo library
  const cameraInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const libraryInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = async (slot: keyof PhotoCaptureData, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoadingSlot(slot);
      const compressed = await compressImage(file, 1280, 1280, 0.82);
      onUpdatePhoto(slot, compressed);
    } catch (err) {
      console.error('Failed to compress image:', err);
    } finally {
      setLoadingSlot(null);
      // Reset input value so same photo can be re-selected if needed
      e.target.value = '';
    }
  };

  const attachedCount = Object.values(photos).filter(Boolean).length;

  // Build items array for full-screen lightbox
  const lightboxItems: LightboxPhotoItem[] = photoSlots
    .filter((slot) => Boolean(photos[slot.key]))
    .map((slot) => ({
      key: slot.key,
      url: photos[slot.key]!,
      label: slot.label,
      subLabel: slot.subLabel,
      sectionNum: slot.sectionNum,
    }));

  const handleOpenLightbox = (slotKey: keyof PhotoCaptureData) => {
    setActiveLightboxKey(slotKey);
  };

  return (
    <div id="step-4-container" className="space-y-4">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#104f9b] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              4
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Photo Capture & Notes</h3>
              <p className="text-xs text-slate-500">
                Required audit documentation & visit observations
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
              attachedCount === 5
                ? 'bg-blue-100 text-[#104f9b]'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {attachedCount === 5 && <CheckCircle2 className="w-3.5 h-3.5 text-[#104f9b]" />}
              {attachedCount} / 5 Photos
            </span>
          </div>
        </div>

        {/* Quick Fullscreen Review Trigger Button */}
        {attachedCount > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Tap any photo or launch full-screen review:
            </span>
            <button
              type="button"
              id="lightbox-open-all-btn"
              onClick={() => {
                const firstCaptured = photoSlots.find((s) => Boolean(photos[s.key]));
                if (firstCaptured) handleOpenLightbox(firstCaptured.key);
              }}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#104f9b]/10 hover:bg-[#104f9b]/20 active:bg-[#104f9b]/30 text-[#104f9b] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Review Full Screen</span>
            </button>
          </div>
        )}
      </div>

      {/* Photo Capture Slots - Each Section With Live Thumbnail Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Required Photos by Section
          </h4>
          <span className="text-[11px] text-slate-400">
            Take live camera photo or choose from library
          </span>
        </div>

        {photoSlots.map((slot) => {
          const photoUrl = photos[slot.key];
          const isLoading = loadingSlot === slot.key;

          return (
            <div
              key={slot.key}
              id={`photo-section-${slot.key}`}
              className={`bg-white rounded-2xl p-4 border transition-all ${
                photoUrl ? 'border-blue-200 shadow-xs' : 'border-slate-200 shadow-xs'
              }`}
            >
              {/* Standard HTML file input with capture="environment" for iPhone live camera */}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={(el) => {
                  cameraInputRefs.current[slot.key] = el;
                }}
                onChange={(e) => handleFileChange(slot.key, e)}
                className="hidden"
                id={`camera-input-${slot.key}`}
              />

              {/* Standard HTML file input for iPhone photo library selection */}
              <input
                type="file"
                accept="image/*"
                ref={(el) => {
                  libraryInputRefs.current[slot.key] = el;
                }}
                onChange={(e) => handleFileChange(slot.key, e)}
                className="hidden"
                id={`library-input-${slot.key}`}
              />

              <div className="flex items-start gap-3.5">
                {/* Live Thumbnail Preview / Interactive Area */}
                {photoUrl ? (
                  <div
                    onClick={() => handleOpenLightbox(slot.key)}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer group border-2 border-blue-300 shadow-xs active:scale-95 transition-all"
                    title="Tap to review in full-screen lightbox"
                  >
                    <img
                      src={photoUrl}
                      alt={slot.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
                      <Eye className="w-5 h-5 text-white drop-shadow" />
                      <span className="text-[10px] font-bold text-white mt-1 drop-shadow">Full Screen</span>
                    </div>
                    <div className="absolute top-1 right-1 bg-[#104f9b] text-white p-1 rounded-full shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => cameraInputRefs.current[slot.key]?.click()}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center shrink-0 text-slate-400 hover:border-slate-400 hover:bg-slate-100 active:bg-slate-200 transition-all active:scale-95 group"
                    title="Tap to capture live photo"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-[#104f9b] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-full bg-slate-200 group-hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors">
                          <Camera className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold mt-1.5 text-slate-600">Add Photo</span>
                        <span className="text-[9px] text-slate-400">Live / Library</span>
                      </>
                    )}
                  </button>
                )}

                {/* Section Details & Mobile Upload Action Buttons */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold shrink-0">
                        {slot.sectionNum}
                      </span>
                      <span className="font-bold text-sm text-slate-900 truncate">
                        {slot.label}
                      </span>
                    </div>
                    {photoUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#104f9b] bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {slot.subLabel}
                  </p>

                  {/* Actions Bar */}
                  {photoUrl ? (
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleOpenLightbox(slot.key)}
                        className="min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 active:bg-slate-300 transition-colors cursor-pointer"
                        title="Review full screen"
                      >
                        <Eye className="w-4 h-4" /> Full Screen
                      </button>
                      <button
                        type="button"
                        onClick={() => cameraInputRefs.current[slot.key]?.click()}
                        className="min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 active:bg-slate-300 transition-colors cursor-pointer"
                        title="Retake using camera"
                      >
                        <RefreshCw className="w-4 h-4" /> Retake
                      </button>
                      <button
                        type="button"
                        onClick={() => libraryInputRefs.current[slot.key]?.click()}
                        className="min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 active:bg-slate-300 transition-colors cursor-pointer"
                        title="Choose another photo from library"
                      >
                        <ImageIcon className="w-4 h-4" /> Library
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdatePhoto(slot.key, null)}
                        className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-rose-500 hover:bg-rose-50 active:bg-rose-100 ml-auto flex items-center justify-center transition-colors cursor-pointer"
                        title="Delete photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100">
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => cameraInputRefs.current[slot.key]?.click()}
                        className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-[#104f9b] hover:bg-[#0c4080] active:bg-[#093264] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Live Camera</span>
                      </button>
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => libraryInputRefs.current[slot.key]?.click()}
                        className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Photo Library</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* General Visit Notes */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
        <label htmlFor="general-visit-notes" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          General Visit Notes & Observations
        </label>
        <p className="text-xs text-slate-500">
          Document clerk feedback, shrink actions, ad execution, or management discussions.
        </p>
        <textarea
          id="general-visit-notes"
          rows={4}
          value={generalNotes}
          onChange={(e) => onUpdateNotes(e.target.value)}
          placeholder="e.g. Reviewed schematic alignment with seafood lead. Case pulled cleanly at 9pm. Form 120 completed for 1 case cod shorts. Discussed markdown timing before 2pm..."
          className="w-full px-4 py-3 text-base rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#104f9b] focus:ring-2 focus:ring-[#104f9b]/20 focus:outline-hidden transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      <PhotoModal
        isOpen={Boolean(activeLightboxKey && photos[activeLightboxKey])}
        onClose={() => setActiveLightboxKey(null)}
        photos={lightboxItems}
        activeKey={activeLightboxKey}
        onSelectPhoto={(key) => setActiveLightboxKey(key as keyof PhotoCaptureData)}
        onRetake={(key) => {
          setActiveLightboxKey(null);
          setTimeout(() => {
            cameraInputRefs.current[key]?.click();
          }, 150);
        }}
        onDelete={(key) => {
          onUpdatePhoto(key as keyof PhotoCaptureData, null);
        }}
      />
    </div>
  );
};
