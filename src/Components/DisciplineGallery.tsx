"use client";

import { useState } from "react";
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
};

export default function DisciplineGallery({ images, name, accent, gradient }: Props) {
  const [gridOpen, setGridOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return <div className={styles.collageEmpty} style={{ background: gradient }} />;
  }

  const preview = images.slice(0, 4);
  const imgSrcs = images.map((i) => i.src);

  return (
    <>
      {/* Collage trigger */}
      <button
        className={styles.collageBtn}
        onClick={() => setGridOpen(true)}
        aria-label={`View ${name} gallery`}
      >
        <div className={styles.collageGrid}>
          {preview.map((img, i) => (
            <div key={i} className={styles.collageCell}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className={styles.collageImg}
                sizes="300px"
                unoptimized
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
          <div className={styles.gridPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.gridHeader}>
              <h3 className={styles.gridTitle} style={{ color: accent }}>
                {name}
              </h3>
              <button
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
                      unoptimized
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
