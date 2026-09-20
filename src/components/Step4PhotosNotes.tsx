import React, { useRef, useState } from 'react';
import { PhotoData, PhotoSlot } from '../types';
import { Camera, Upload, Trash2, Maximize2, X, Image as ImageIcon, FileText, CheckCircle2, Plus } from 'lucide-react';

interface Step4PhotosNotesProps {
  photos: PhotoData;
  generalNotes: string;
  onUpdatePhoto: (slot: PhotoSlot, dataUrl: string | null) => void;
  onUpdateNotes: (notes: string) => void;
}

interface PhotoCardProps {
  slot: PhotoSlot;
  label: string;
  description: string;
  photoUrl: string | null;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
  onView: (dataUrl: string) => void;
}

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 960;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG
        const compressed = canvas.toDataURL('image/jpeg', 0.72);
        resolve(compressed);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const PhotoCard: React.FC<PhotoCardProps> = ({
  slot,
  label,
  description,
  photoUrl,
  onUpload,
  onRemove,
  onView,
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const libraryInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const compressed = await compressImage(file);
      onUpload(compressed);
    } catch (err) {
      console.error('Failed to process image:', err);
    } finally {
      setIsProcessing(false);
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (libraryInputRef.current) libraryInputRef.current.value = '';
    }
  };

  return (
    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex-1 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900">{label}</span>
          {photoUrl && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Attached
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
      </div>

      <div className="flex items-center gap-2 self-stretch sm:self-center shrink-0 justify-end">
        {/* iOS Direct Camera input */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          onChange={handleFileChange}
          className="hidden"
          id={`photo-camera-${slot}`}
        />
        {/* Photo Library input */}
        <input
          type="file"
          accept="image/*"
          ref={libraryInputRef}
          onChange={handleFileChange}
          className="hidden"
          id={`photo-library-${slot}`}
        />

        {photoUrl ? (
          <div className="flex items-center gap-2.5">
            <div
              onClick={() => onView(photoUrl)}
              className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-[#104f9b] bg-slate-200 cursor-pointer group shadow-2xs"
              title="Click to view full photo"
            >
              <img
                src={photoUrl}
                alt={label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="min-h-[36px] px-2.5 py-1 text-[11px] font-bold bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200 cursor-pointer flex items-center justify-center gap-1"
              >
                <Camera className="w-3 h-3 text-[#104f9b]" />
                <span>Retake</span>
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="min-h-[32px] px-2.5 py-1 text-[11px] font-semibold bg-rose-50 border border-rose-200 rounded-lg text-rose-600 hover:bg-rose-100 active:bg-rose-200 cursor-pointer flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 sm:flex-initial min-h-[44px] px-3 py-2 rounded-xl bg-[#104f9b] hover:bg-[#0c4080] active:bg-[#093264] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Snap live photo with iPhone camera"
            >
              <Camera className="w-4 h-4" />
              <span>{isProcessing ? 'Saving...' : 'Camera'}</span>
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => libraryInputRef.current?.click()}
              className="flex-1 sm:flex-initial min-h-[44px] px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Choose from photo library"
            >
              <ImageIcon className="w-4 h-4 text-slate-500" />
              <span>Library</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const NOTE_TEMPLATES = [
  'Case faced and tagged 100%. Excellent presentation.',
  'Discussed shellfish tag log requirement with Department Manager.',
  'Form 120 shrink credits verified for this period.',
  'Action required: Order replacement COOL tags for salmon items.',
  'Walk-in cooler organized and dated according to FIFO standards.',
];

export const Step4PhotosNotes: React.FC<Step4PhotosNotesProps> = ({
  photos,
  generalNotes,
  onUpdatePhoto,
  onUpdateNotes,
}) => {
  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);

  const handleAppendTemplate = (template: string) => {
    if (!generalNotes.trim()) {
      onUpdateNotes(`• ${template}`);
    } else {
      onUpdateNotes(`${generalNotes}\n• ${template}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Photo Section Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2.5 mb-2 pb-2.5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#104f9b] flex items-center justify-center">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Merchandising Photos</h2>
            <p className="text-[11px] text-slate-500">Capture visual audit proof for store visit report</p>
          </div>
        </div>

        <div className="space-y-2.5 mt-3">
          <PhotoCard
            slot="fullServe"
            label="1. Full-Service Seafood Case"
            description="Overall case display, ice presentation & dividers"
            photoUrl={photos.fullServe}
            onUpload={(dataUrl) => onUpdatePhoto('fullServe', dataUrl)}
            onRemove={() => onUpdatePhoto('fullServe', null)}
            onView={(url) => setActivePhotoModal(url)}
          />

          <PhotoCard
            slot="selfServe"
            label="2. Self-Serve Case"
            description="Packaged fish, grab & go items & freshness stickers"
            photoUrl={photos.selfServe}
            onUpload={(dataUrl) => onUpdatePhoto('selfServe', dataUrl)}
            onRemove={() => onUpdatePhoto('selfServe', null)}
            onView={(url) => setActivePhotoModal(url)}
          />

          <PhotoCard
            slot="frozenDoorsBunkers"
            label="3. Frozen Doors & Bunkers"
            description="Frozen seafood variety, schematics & condition"
            photoUrl={photos.frozenDoorsBunkers}
            onUpload={(dataUrl) => onUpdatePhoto('frozenDoorsBunkers', dataUrl)}
            onRemove={() => onUpdatePhoto('frozenDoorsBunkers', null)}
            onView={(url) => setActivePhotoModal(url)}
          />

          <PhotoCard
            slot="coolerFreezer"
            label="4. Walk-In Cooler & Freezers"
            description="Backroom storage organization, FIFO rotation & dating"
            photoUrl={photos.coolerFreezer}
            onUpload={(dataUrl) => onUpdatePhoto('coolerFreezer', dataUrl)}
            onRemove={() => onUpdatePhoto('coolerFreezer', null)}
            onView={(url) => setActivePhotoModal(url)}
          />

          <PhotoCard
            slot="spiceRacks"
            label="5. Spice Racks & Dry Displays"
            description="Seafood coatings, marinades, wood planks & sauces"
            photoUrl={photos.spiceRacks}
            onUpload={(dataUrl) => onUpdatePhoto('spiceRacks', dataUrl)}
            onRemove={() => onUpdatePhoto('spiceRacks', null)}
            onView={(url) => setActivePhotoModal(url)}
          />
        </div>
      </div>

      {/* General Notes & Action Items */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Visit Notes & Action Plan</h2>
            <p className="text-[11px] text-slate-500">Document discussions with Department Manager and follow-up items</p>
          </div>
        </div>

        <div>
          <textarea
            id="general-notes-textarea"
            rows={5}
            value={generalNotes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            placeholder="Type observations, feedback provided to the team, training items, or necessary follow-ups..."
            className="w-full p-3 rounded-xl border border-slate-300 text-xs font-normal text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#104f9b] focus:ring-2 focus:ring-blue-100 transition-colors"
          />
        </div>

        {/* Quick bullet points */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-600 block">Quick notes suggestion:</span>
          <div className="flex flex-wrap gap-1.5">
            {NOTE_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAppendTemplate(tmpl)}
                className="text-[10px] px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-2.5 h-2.5 text-slate-500" />
                <span className="truncate max-w-[200px]">{tmpl}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Viewer Modal */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="relative max-w-lg w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-2">
            <button
              type="button"
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activePhotoModal}
              alt="Expanded preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
