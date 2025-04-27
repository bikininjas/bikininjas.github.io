import React from "react";

export default function WidgetsPanel() {
  return (
    <aside className="flex flex-col gap-6 p-8 min-w-[260px] bg-[var(--card-bg)]/80 rounded-2xl shadow-lg neon-glow glass-card md:sticky md:top-8">
      <h3 className="text-xl font-bold text-[var(--neon-blue)] mb-4">Widgets</h3>
      {/* Steam Charts Widget (example embed) */}
      <div className="mb-4">
        <h4 className="text-md font-semibold text-[var(--neon-cyan)] mb-1">Steam Charts</h4>
        <iframe
          src="https://steamcharts.com/embed/game/730"
          width="100%"
          height="180"
          className="rounded-xl border border-[var(--neon-blue)]"
          title="Steam Charts"
          loading="lazy"
        ></iframe>
      </div>
      {/* Game Pass News Widget (placeholder) */}
      <div>
        <h4 className="text-md font-semibold text-[var(--neon-cyan)] mb-1">Game Pass News</h4>
        <div className="bg-[var(--background-color)]/60 rounded p-2 text-sm text-[var(--neon-blue)]">
          <p>Dernières nouveautés Game Pass :</p>
          <ul className="list-disc ml-4 mt-1">
            <li>Persona 3 Reload ajouté</li>
            <li>Forza Horizon 5 mise à jour</li>
            <li>Sea of Thieves : nouvelle saison</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
