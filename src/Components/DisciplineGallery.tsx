"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";
import TiltImage from "./TiltImage";
import styles from "../styles/ArtistPage.module.css";

export type GalleryImage = { src: string; alt: string };

type Props = {
  images: GalleryImage[];
  name: string;
  accent: string;
  gradient: string;
  previewLayout?: "2x2" | "4x2";
};

export default function DisciplineGallery({ images, name, accent, gradient, previewLayout = "2x2" }: Props) {
  const [gridOpen, setGridOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape closes the gallery (the lightbox handles its own Escape), Tab stays inside.
  useEffect(() => {
    if (!gridOpen || lightboxIndex !== null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setGridOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>("button");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [gridOpen, lightboxIndex]);

  // Move focus into the dialog on open and back to the trigger on close.
  useEffect(() => {
    if (!gridOpen) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    return () => trigger?.focus();
  }, [gridOpen]);

  if (images.length === 0) {
    return <div className={styles.collageEmpty} style={{ background: gradient }} />;
  }

  const preview = images.slice(0, previewLayout === "4x2" ? 8 : 4);
  const imgSrcs = images.map((i) => i.src);

  return (
    <>
      {/* Collage trigger */}
      <button
        ref={triggerRef}
        className={styles.collageBtn}
        onClick={() => setGridOpen(true)}
        aria-label={`View ${name} gallery`}
      >
        <div className={`${styles.collageGrid}${previewLayout === "4x2" ? ` ${styles.collageGrid4x2}` : ""}`}>
          {preview.map((img, i) => (
            <div key={i} className={styles.collageCell}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className={styles.collageImg}
                sizes="(max-width: 900px) 50vw, 300px"
              />
            </div>
          ))}
        </div>
        <span className={styles.collageBadge} style={{ color: accent }}>
          View Gallery
        </span>
      </button>

      {/* Grid overlay */}
      {gridOpen && (
        <div
          className={styles.gridOverlay}
          onClick={() => setGridOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} gallery`}
        >
          <div ref={panelRef} className={styles.gridPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.gridHeader}>
              <h3 className={styles.gridTitle} style={{ color: accent }}>
                {name}
              </h3>
              <button
                ref={closeRef}
                className={styles.gridClose}
                onClick={() => setGridOpen(false)}
                aria-label="Close gallery"
              >
                ×
              </button>
            </div>
            <div className={styles.imageGrid}>
              {images.map((img, i) => (
                <TiltImage key={i}>
                  <button
                    className={styles.gridThumbBtn}
                    onClick={() => setLightboxIndex(i)}
                    aria-label={img.alt}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className={styles.gridThumb}
                      sizes="(max-width: 600px) 45vw, 220px"
                    />
                  </button>
                </TiltImage>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox renders on top of grid (z-index 1000 > gridOverlay 200) */}
      {lightboxIndex !== null && (
        <Lightbox
          images={imgSrcs}
          index={lightboxIndex}
          projectName={name}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
