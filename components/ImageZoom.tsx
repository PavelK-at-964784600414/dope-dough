'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import Image from 'next/image';

interface ImageZoomProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ImageZoom component - Full-screen image viewer with pinch-to-zoom support
 */
export function ImageZoom({ src, alt, isOpen, onClose }: ImageZoomProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastTapRef = useRef(0);
  const lastDistanceRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(1, scale + delta), 5);
    setScale(newScale);
    
    // Reset position when zooming out to 1
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Handle double tap to zoom
  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (scale === 1) {
        setScale(2.5);
      } else {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    }
    lastTapRef.current = now;
  };

  // Handle pinch to zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      lastDistanceRef.current = distance;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      if (lastDistanceRef.current > 0) {
        const delta = distance - lastDistanceRef.current;
        const newScale = Math.min(Math.max(1, scale + delta * 0.01), 5);
        setScale(newScale);
        
        if (newScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
      }

      lastDistanceRef.current = distance;
    }
  };

  const handleTouchEnd = () => {
    lastDistanceRef.current = 0;
  };

  const handleClose = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={handleClose}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Zoom indicator */}
          {scale > 1 && (
            <div className="absolute top-4 left-4 z-10 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
              {Math.round(scale * 100)}%
            </div>
          )}

          {/* Image container */}
          <motion.div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center overflow-hidden touch-none"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              drag={scale > 1}
              dragConstraints={{
                top: scale > 1 ? -500 : 0,
                left: scale > 1 ? -500 : 0,
                right: scale > 1 ? 500 : 0,
                bottom: scale > 1 ? 500 : 0,
              }}
              dragElastic={0.1}
              onTap={handleTap}
              style={{
                scale,
                x: position.x,
                y: position.y,
              }}
              className="relative w-[90vw] h-[90vh]"
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain select-none pointer-events-none"
                sizes="100vw"
                priority
                draggable={false}
              />
            </motion.div>
          </motion.div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white text-sm text-center">
            <p className="hidden md:block">
              Scroll to zoom • Drag to pan • Click outside to close
            </p>
            <p className="md:hidden">
              Double tap or pinch to zoom • Drag to pan • Tap outside to close
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * ZoomableImage component - Image with click-to-zoom functionality
 */
export function ZoomableImage({ src, alt, className = '' }: ZoomableImageProps) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  return (
    <>
      <div
        className={`relative cursor-zoom-in group ${className}`}
        onClick={() => setIsZoomOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Zoom overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
            <ZoomIn className="h-6 w-6 text-gray-800" />
          </div>
        </div>
      </div>

      <ImageZoom
        src={src}
        alt={alt}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />
    </>
  );
}
