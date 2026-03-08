"use client";

import { useState, useEffect, useMemo } from "react";

type Props = {
  titles: string[];
  className?: string;
};

export default function RoleTicker({ titles, className }: Props) {
  const shuffled = useMemo(() => [...titles].sort(() => Math.random() - 0.5), []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % shuffled.length);
    }, 2500);
    return () => clearInterval(id);
  }, [shuffled.length]);

  return <span className={className}>{shuffled[index]}</span>;
}
