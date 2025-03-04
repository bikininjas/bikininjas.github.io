<script setup lang="ts">
const codingTopics = [
  { 
    title: 'Introduction à Vue.js 3', 
    description: 'Découvrez les bases du framework Vue.js et comment construire des applications modernes.' 
  },
  { 
    title: 'Techniques de Débogage Avancées', 
    description: 'Apprenez des stratégies professionnelles pour résoudre les bugs les plus complexes.' 
  },
  { 
    title: 'Programmation Fonctionnelle en JavaScript', 
    description: 'Explorez les concepts de la programmation fonctionnelle et comment les appliquer en JavaScript.' 
  }
]
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8 text-bikininjas-primary dark:text-bikininjas-secondary">
      Programmation Aléatoire
    </h1>
    <div class="grid md:grid-cols-3 gap-6">
      <div 
        v-for="(topic, index) in codingTopics" 
        :key="index" 
        class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
      >
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {{ topic.title }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          {{ topic.description }}
        </p>
      </div>
    </div>
  </div>
</template>
