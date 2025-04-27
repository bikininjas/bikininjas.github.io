"use client";
import * as React from "react";

export default function ParallaxBackground() {
  const [offsetY, setOffsetY] = React.useState(0);
  React.useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen -z-10 overflow-hidden"
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="w-full h-full bg-[url('/bikininjas-logos.png')] bg-cover bg-center opacity-15 blur-sm"
        style={{
          transform: `translateY(${offsetY * 0.4}px) scale(1.08)`,
          backgroundAttachment: "fixed",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-[var(--header-bg)]/90 to-transparent" />
    </div>
  );
}
