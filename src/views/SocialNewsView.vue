<script setup lang="ts">
const socialNews = [
  { 
    title: 'Événements Tech de la Semaine', 
    description: 'Résumé des dernières conférences et annonces technologiques.' 
  },
  { 
    title: 'Communautés de Développeurs', 
    description: 'Découvrez les communautés en ligne les plus actives et innovantes.' 
  },
  { 
    title: 'Tendances Open Source', 
    description: 'Les projets open source qui font bouger le monde du développement.' 
  }
]
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8 text-bikininjas-primary dark:text-bikininjas-secondary">
      Actualités Sociales Tech
    </h1>
    <div class="grid md:grid-cols-3 gap-6">
      <div 
        v-for="(news, index) in socialNews" 
        :key="index" 
        class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
      >
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {{ news.title }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          {{ news.description }}
        </p>
      </div>
    </div>
  </div>
</template>
