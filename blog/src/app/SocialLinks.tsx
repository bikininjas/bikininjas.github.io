import React from "react";
import { FaTwitter, FaDiscord, FaTwitch, FaYoutube, FaSteam } from "react-icons/fa";

export default function SocialLinks() {
  return (
    <div className="flex flex-col items-center gap-6 p-8 min-w-[260px] bg-[var(--card-bg)]/80 rounded-2xl shadow-lg neon-glow glass-card">
      <h3 className="text-lg font-bold text-[var(--neon-blue)] mb-4">Suivez-nous</h3>
      <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--neon-pink)] text-2xl transition-colors w-full justify-start px-2 py-2 rounded-lg hover:bg-[var(--neon-pink)]/10">
        <FaTwitter />
        <span className="text-base font-semibold text-[var(--neon-cyan)]">@yourusername</span>
      </a>
      <a href="https://discord.com/users/yourdiscord" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--neon-pink)] text-2xl transition-colors w-full justify-start px-2 py-2 rounded-lg hover:bg-[var(--neon-pink)]/10">
        <FaDiscord />
        <span className="text-base font-semibold text-[var(--neon-cyan)]">yourdiscord#0000</span>
      </a>
      <a href="https://twitch.tv/yourtwitch" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--neon-pink)] text-2xl transition-colors w-full justify-start px-2 py-2 rounded-lg hover:bg-[var(--neon-pink)]/10">
        <FaTwitch />
        <span className="text-base font-semibold text-[var(--neon-cyan)]">yourtwitch</span>
      </a>
      <a href="https://youtube.com/@youryoutube" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--neon-pink)] text-2xl transition-colors w-full justify-start px-2 py-2 rounded-lg hover:bg-[var(--neon-pink)]/10">
        <FaYoutube />
        <span className="text-base font-semibold text-[var(--neon-cyan)]">YourYouTube</span>
      </a>
      <a href="https://store.steampowered.com/yoursteam" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--neon-pink)] text-2xl transition-colors w-full justify-start px-2 py-2 rounded-lg hover:bg-[var(--neon-pink)]/10">
        <FaSteam />
        <span className="text-base font-semibold text-[var(--neon-cyan)]">yoursteam</span>
      </a>
    </div>
);
}
