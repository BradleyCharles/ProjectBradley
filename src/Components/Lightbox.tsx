"use client";

import Image from "next/image";
import { useEffect, useCallback, useState, useRef } from "react";
import styles from "../styles/Lightbox.module.css";

type Props = {
  images: string[];
  index: number;
  projectName: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export default function Lightbox({
  images,
  index,
  projectName,
  onClose,
  onNavigate,
}: Props) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const backdropRef = useRef<HTMLDivElement>(null);

  const resetZoom = useCallback(() => {
    setScale(1);
    scaleRef.current = 1;
    setOffset({ x: 0, y: 0 });
  }, []);

  const prev = useCallback(() => {
    resetZoom();
    onNavigate((index - 1 + images.length) % images.length);
  }, [resetZoom, onNavigate, index, images.length]);

  const next = useCallback(() => {
    resetZoom();
    onNavigate((index + 1) % images.length);
  }, [resetZoom, onNavigate, index, images.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    },
    [onClose, next, prev]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // Non-passive wheel listener so we can preventDefault
  useEffect(() => {
    const el = backdropRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScale((prev) => {
        const next = Math.min(4, Math.max(1, prev - e.deltaY * 0.001));
        scaleRef.current = next;
        if (next === 1) setOffset({ x: 0, y: 0 });
        return next;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scaleRef.current <= 1) return;
    e.preventDefault();
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };
    setOffset((prev) => {
      const s = scaleRef.current;
      const maxX = (s - 1) * window.innerWidth * 0.45;
      const maxY = (s - 1) * window.innerHeight * 0.45;
      return {
        x: Math.min(maxX, Math.max(-maxX, prev.x + dx)),
        y: Math.min(maxY, Math.max(-maxY, prev.y + dy)),
      };
    });
  }, []);

  const stopDrag = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  const isZoomed = scale > 1;

  return (
    <div
      ref={backdropRef}
      className={styles.backdrop}
      onClick={isZoomed ? undefined : onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      role="dialog"
      aria-modal="true"
      aria-label={`${projectName} image viewer`}
      style={{ cursor: isZoomed ? (isDragging ? "grabbing" : "grab") : "zoom-out" }}
    >
      <button
        className={styles.close}
        onClick={onClose}
        aria-label="Close image viewer"
      >
        ×
      </button>

      <div
        className={styles.imageWrap}
        onMouseDown={handleMouseDown}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "center center",
          cursor: isZoomed ? (isDragging ? "grabbing" : "grab") : "default",
        }}
      >
        <Image
          src={images[index]}
          alt={`${projectName} preview ${index + 1} of ${images.length}`}
          fill
          className={styles.image}
          sizes="90vw"
          draggable={false}
        />
      </div>

      {images.length > 1 && !isZoomed && (
        <>
          <button
            className={`${styles.nav} ${styles.navPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className={`${styles.nav} ${styles.navNext}`}
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
          >
            ›
          </button>
          <p
            className={styles.counter}
            onClick={(e) => e.stopPropagation()}
          >
            {index + 1} / {images.length}
          </p>
        </>
      )}
    </div>
  );
}
