import React from 'react';
import Navbar from '../../Navbar';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="w-[90vw] max-w-xl mx-auto mt-24 text-center">
        <h1 className="text-3xl font-bold mb-4">404 — Article non trouvé</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Le billet de blog demandé n'existe pas ou a été supprimé.</p>
        <a href="/" className="inline-block px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Retour à l'accueil</a>
      </div>
    </>
  );
}
