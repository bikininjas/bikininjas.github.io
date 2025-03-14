export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-4">Bienvenue chez les Bikininjas ! 🏄‍♂️💻</h1>
      <p className="text-lg mb-8">
        Le blog où on parle de modding, de code, d'IA, et parfois de nos problèmes existentiels. Parce que pourquoi pas ?
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Derniers articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <article className="border p-4 rounded-lg">
            <div className="bg-gray-200 h-48 mb-4 rounded-lg"></div>
            <h3 className="text-xl font-semibold mb-2">Couocou</h3>
            <p className="mb-4">Un article qui dit couocou. Profond, non ?</p>
            <a href="/blog/couocou" className="text-blue-500 hover:underline">Lire l'article</a>
          </article>
          <article className="border p-4 rounded-lg">
            <div className="bg-gray-200 h-48 mb-4 rounded-lg"></div>
            <h3 className="text-xl font-semibold mb-2">Placeholder</h3>
            <p className="mb-4">Un article qui n'existe pas encore. Comme nos espoirs et rêves.</p>
            <a href="/blog/couocou" className="text-blue-500 hover:underline">Lire l'article</a>
          </article>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">À propos</h2>
        <p className="text-lg">
          Ici, on modifie des jeux, on code des trucs, et on essaie de comprendre pourquoi on est là. Parfois, on réussit. Souvent, on échoue. Mais au moins, on a du fun en chemin.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Nos thèmes</h2>
        <ul className="list-disc list-inside">
          <li>Modding de jeux vidéo : Parce que parfois, il faut prendre les choses en main (ou en code).</li>
          <li>Jeux vidéo : Pour ceux qui préfèrent sauver le monde virtuel plutôt que le réel.</li>
          <li>Technologies : Les gadgets cool et les trucs qui font *bip* et *boup*.</li>
          <li>Développement (code) : Parce que le code, c'est comme le chocolat, c'est meilleur quand on le partage.</li>
          <li>Hors-sujet (santé mentale et société) : Parce que c'est important de parler de ces sujets, même si on le fait avec un peu d'humour noir.</li>
        </ul>
      </section>
    </main>
  );
}