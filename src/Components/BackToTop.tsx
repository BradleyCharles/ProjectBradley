"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "../styles/back-to-top.css";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <Link href="#top" className="back-to-top" aria-label="Back to top">
      Back to top
    </Link>
  );
};

export default BackToTop;
