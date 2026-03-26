"use client";

import { useRef, MouseEvent } from "react";
import styles from "./TiltImage.module.css";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function TiltImage({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - top) / height - 0.5; // -0.5 to 0.5

    // max rotation for X & Y axis, adjust as needed
    el.style.transform = `perspective(700px) rotateY(${x * 5}deg) rotateX(${
      -y * 5
    }deg) scale(1.03)`;
    el.style.transition = "transform 60ms linear";
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)";
    el.style.transition = "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)";
  };

  return (
    <div
      ref={ref}
      className={`${styles.tilt} ${className ?? ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
