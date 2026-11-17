"use client";

import { useState, useEffect } from "react";

type Props = {
  titles: string[];
  className?: string;
};

export default function RoleTicker({ titles, className }: Props) {
  const [shuffled, setShuffled] = useState(titles);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setShuffled([...titles].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % shuffled.length);
    }, 2500);
    return () => clearInterval(id);
  }, [shuffled.length, paused, reduceMotion]);

  return (
    <span
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {shuffled[index]}
    </span>
  );
}
