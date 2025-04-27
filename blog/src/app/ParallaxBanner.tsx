"use client";
import * as React from "react";
import Image from "next/image";

export default function ParallaxBanner() {
  return (
    <div className="relative h-72 md:h-96 flex items-center justify-center">
      <div className="relative z-10 text-center px-6 py-8 rounded-2xl bg-[var(--card-bg)]/80 backdrop-blur-lg border border-[var(--neon-blue)] shadow-2xl glass-hero-content animate-fade-in">
        <div className="flex justify-center items-center mb-3">
  <Image
    src="/bikininjas-logos.png"
    alt="BikiNinjas Logo"
    width={440}
    height={440}
    className="transition-transform duration-700 hover:rotate-[360deg]"
    priority
  />
</div>
        <p className="mt-2 text-2xl font-medium text-[var(--neon-blue)] drop-shadow">
          Jeux Vidéo, Développement & Bien-être Numérique
        </p>
      </div>
    </div>
  );
}
