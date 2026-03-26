"use client";

import Image from "next/image";
import { useEffect, useCallback } from "react";
import styles from "./Lightbox.module.css";

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
  const prev = () => onNavigate((index - 1 + images.length) % images.length);
  const next = () => onNavigate((index + 1) % images.length);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClose, index, images.length]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${projectName} image viewer`}
    >
      <button className={styles.close} onClick={onClose} aria-label="Close image viewer">
        ×
      </button>

      <div className={styles.imageWrap} onClick={(e) => e.stopPropagation()}>
        <Image
          src={images[index]}
          alt={`${projectName} preview ${index + 1} of ${images.length}`}
          fill
          className={styles.image}
          sizes="90vw"
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            className={`${styles.nav} ${styles.navPrev}`}
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className={`${styles.nav} ${styles.navNext}`}
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next image"
          >
            ›
          </button>
          <p className={styles.counter} onClick={(e) => e.stopPropagation()}>
            {index + 1} / {images.length}
          </p>
        </>
      )}
    </div>
  );
}
