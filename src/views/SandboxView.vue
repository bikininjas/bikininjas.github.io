<script setup lang="ts">
const sandboxProjects = [
  { 
    title: 'Éditeur de Code en Ligne', 
    description: 'Un environnement de développement interactif pour tester et partager du code rapidement.' 
  },
  { 
    title: 'Générateur de Composants Vue', 
    description: 'Créez des composants Vue personnalisés avec une interface intuitive.' 
  },
  { 
    title: 'Bac à Sable Algorithmes', 
    description: 'Testez et visualisez différents algorithmes de manière interactive.' 
  }
]
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8 text-bikininjas-primary dark:text-bikininjas-secondary">
      Bac à Sable de Code
    </h1>
    <div class="grid md:grid-cols-3 gap-6">
      <div 
        v-for="(project, index) in sandboxProjects" 
        :key="index" 
        class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
      >
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {{ project.title }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          {{ project.description }}
        </p>
      </div>
    </div>
  </div>
</template>
