import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Trash2,
  Camera,
  Download,
  CheckCircle2,
} from 'lucide-react';

export interface LightboxPhotoItem {
  key: string;
  url: string;
  label: string;
  subLabel?: string;
  sectionNum?: number;
}

export interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Single photo fallback (for backwards compatibility)
  imageUrl?: string | null;
  title?: string;
  // Multi-photo lightbox mode (Step 4 & Step 5)
  photos?: LightboxPhotoItem[];
  activeKey?: string | null;
  onSelectPhoto?: (key: string) => void;
  onRetake?: (key: string) => void;
  onDelete?: (key: string) => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title = 'Photo Review',
  photos,
  activeKey,
  onSelectPhoto,
  onRetake,
  onDelete,
}) => {
  // Normalize photo items
  const items: LightboxPhotoItem[] = React.useMemo(() => {
    if (photos && photos.length > 0) {
      return photos;
    }
    if (imageUrl) {
      return [{ key: 'single', url: imageUrl, label: title }];
    }
    return [];
  }, [photos, imageUrl, title]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Sync current index when activeKey or items change
  useEffect(() => {
    if (!isOpen) return;
    if (activeKey && items.length > 0) {
      const idx = items.findIndex((it) => it.key === activeKey);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    } else {
      setCurrentIndex(0);
    }
    // Reset zoom & pan on open
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setConfirmDelete(false);
  }, [isOpen, activeKey, items]);

  // Reset zoom & pan when index changes
  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handlePrev = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex((prev) => {
      const nextIdx = prev > 0 ? prev - 1 : items.length - 1;
      if (onSelectPhoto && items[nextIdx]) {
        onSelectPhoto(items[nextIdx].key);
      }
      return nextIdx;
    });
    resetZoom();
    setConfirmDelete(false);
  }, [items, onSelectPhoto, resetZoom]);

  const handleNext = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex((prev) => {
      const nextIdx = prev < items.length - 1 ? prev + 1 : 0;
      if (onSelectPhoto && items[nextIdx]) {
        onSelectPhoto(items[nextIdx].key);
      }
      return nextIdx;
    });
    resetZoom();
    setConfirmDelete(false);
  }, [items, onSelectPhoto, resetZoom]);

  // Keyboard navigation & zoom
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        setZoom((z) => Math.min(z + 0.5, 3));
      } else if (e.key === '-' || e.key === '_') {
        setZoom((z) => {
          const next = Math.max(z - 0.5, 1);
          if (next === 1) setPan({ x: 0, y: 0 });
          return next;
        });
      } else if (e.key === '0') {
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext, resetZoom]);

  // Handle Fullscreen API change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch {
      // ignore
    }
  };

  const handleZoomIn = () => {
    setZoom((z) => Math.min(z + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(z - 0.5, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleDoubleTap = () => {
    if (zoom > 1) {
      resetZoom();
    } else {
      setZoom(2);
    }
  };

  // Dragging / panning when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch gestures (swipe to next/prev when 1x, pan when zoomed)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      if (zoom > 1) {
        setIsDragging(true);
        setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (zoom > 1 && isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    if (zoom === 1 && touchStartRef.current && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Detect horizontal swipe (at least 50px travel in under 500ms, mostly horizontal)
      if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 60 && deltaTime < 500) {
        if (deltaX < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    touchStartRef.current = null;
  };

  // Download active photo
  const handleDownload = () => {
    const activeItem = items[currentIndex];
    if (!activeItem?.url) return;

    const link = document.createElement('a');
    link.href = activeItem.url;
    link.download = `MountainWest_${activeItem.label.replace(/[^a-zA-Z0-9]/g, '_')}_Photo.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];
  const hasMultiple = items.length > 1;

  return (
    <div
      ref={containerRef}
      id="photo-lightbox-modal"
      className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col justify-between overflow-hidden select-none backdrop-blur-md"
      onMouseUp={handleMouseUp}
    >
      {/* Lightbox Top Header Bar (Safe area padded for iPhone notch) */}
      <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 pt-[max(0.625rem,calc(0.625rem+env(safe-area-inset-top,0px)))] flex items-center justify-between gap-3 z-20 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          {currentItem.sectionNum && (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#104f9b] text-white text-xs font-bold shrink-0 shadow-xs">
              {currentItem.sectionNum}
            </span>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                {currentItem.label}
              </h3>
              {hasMultiple && (
                <span className="text-[11px] font-medium bg-slate-800 text-sky-300 px-2 py-0.5 rounded-full shrink-0 border border-slate-700/60">
                  {currentIndex + 1} of {items.length}
                </span>
              )}
            </div>
            {currentItem.subLabel && (
              <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                {currentItem.subLabel}
              </p>
            )}
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 active:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-slate-300 px-1.5 min-w-[38px] text-center font-bold">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 active:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {zoom > 1 && (
              <button
                type="button"
                onClick={resetZoom}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-400 hover:bg-slate-800 cursor-pointer"
                title="Reset zoom"
                aria-label="Reset zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Fullscreen API toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 active:bg-slate-700 hidden md:flex items-center justify-center transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
            aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Download image */}
          <button
            type="button"
            onClick={handleDownload}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 active:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Download photo"
            aria-label="Download photo"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Close Lightbox Button (44px target) */}
          <button
            type="button"
            id="lightbox-close-btn"
            onClick={onClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-slate-800 hover:bg-rose-600 active:bg-rose-700 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs ml-1"
            title="Close full screen review (Esc)"
            aria-label="Close full screen review"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Full-Screen Photo Stage */}
      <div
        className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden touch-none p-2 sm:p-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleTap}
      >
        {/* Previous Photo Button */}
        {hasMultiple && (
          <button
            type="button"
            id="lightbox-prev-btn"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 z-30 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-950/70 hover:bg-slate-900 text-white border border-slate-700/60 shadow-lg flex items-center justify-center transition-all active:scale-95 cursor-pointer backdrop-blur-xs"
            title="Previous photo (Arrow Left)"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Interactive Image */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-100 ease-out"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          }}
        >
          <img
            src={currentItem.url}
            alt={currentItem.label}
            className="max-h-[calc(100vh-13rem)] sm:max-h-[calc(100vh-12rem)] w-auto max-w-full object-contain rounded-xl shadow-2xl pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Next Photo Button */}
        {hasMultiple && (
          <button
            type="button"
            id="lightbox-next-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 z-30 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-950/70 hover:bg-slate-900 text-white border border-slate-700/60 shadow-lg flex items-center justify-center transition-all active:scale-95 cursor-pointer backdrop-blur-xs"
            title="Next photo (Arrow Right)"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Zoom Hint Chip (auto hides or appears on mobile) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-950/60 backdrop-blur-xs border border-slate-800 text-slate-300 text-[10px] px-2.5 py-1 rounded-full pointer-events-none sm:hidden">
          {zoom > 1 ? `${Math.round(zoom * 100)}% (drag to pan)` : 'Double-tap to zoom • Swipe to browse'}
        </div>
      </div>

      {/* Lightbox Bottom Toolbar & Navigation Strip */}
      <footer className="w-full bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-3 sm:px-4 py-2.5 pb-[max(0.75rem,calc(0.75rem+env(safe-area-inset-bottom,0px)))] z-20 shrink-0 space-y-2">
        {/* Mobile controls & action buttons */}
        <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
          {/* Zoom controls on mobile */}
          <div className="flex sm:hidden items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center text-slate-300 active:text-white disabled:opacity-30 cursor-pointer"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-slate-300 px-1 font-bold min-w-[34px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center text-slate-300 active:text-white disabled:opacity-30 cursor-pointer"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Section info description */}
          <div className="flex-1 text-center sm:text-left min-w-0 px-2">
            <p className="text-xs font-semibold text-white truncate">
              {currentItem.label}
            </p>
            {currentItem.subLabel && (
              <p className="text-[11px] text-slate-400 truncate">
                {currentItem.subLabel}
              </p>
            )}
          </div>

          {/* Management actions (Retake & Delete) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onRetake && (
              <button
                type="button"
                onClick={() => onRetake(currentItem.key)}
                className="min-h-[44px] px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-sky-300 border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Retake or replace this photo"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Retake</span>
              </button>
            )}

            {onDelete && (
              confirmDelete ? (
                <div className="flex items-center gap-1 bg-rose-950/80 border border-rose-800 p-1 rounded-xl">
                  <span className="text-[10px] font-bold text-rose-200 px-1">Delete?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(currentItem.key);
                      setConfirmDelete(false);
                      // If this was the only photo, close
                      if (items.length <= 1) {
                        onClose();
                      } else {
                        handlePrev();
                      }
                    }}
                    className="min-h-[44px] px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="min-h-[44px] px-3 rounded-lg text-slate-300 hover:text-white text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="min-h-[44px] px-3.5 rounded-xl bg-slate-900 hover:bg-rose-900/60 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Remove this photo from report"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Thumbnail Carousel Strip (when 2 or more photos exist) */}
        {hasMultiple && (
          <div className="flex items-center justify-center gap-2 pt-1.5 overflow-x-auto max-w-2xl mx-auto py-1 px-2 no-scrollbar">
            {items.map((item, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    if (onSelectPhoto) onSelectPhoto(item.key);
                    resetZoom();
                    setConfirmDelete(false);
                  }}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer border-2 ${
                    isSelected
                      ? 'border-sky-400 ring-2 ring-sky-400/40 scale-105 shadow-md'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                  title={item.label}
                  aria-label={`Switch to ${item.label}`}
                >
                  <img
                    src={item.url}
                    alt={item.label}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#104f9b] text-white flex items-center justify-center">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] font-bold text-center text-white py-0.2 truncate px-0.5">
                    #{item.sectionNum || idx + 1}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </footer>
    </div>
  );
};
