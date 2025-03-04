<script setup lang="ts">
const moddingTopics = [
  { 
    title: 'Modding de Jeux Vidéo', 
    description: 'Découvrez comment personnaliser et étendre vos jeux préférés.' 
  },
  { 
    title: 'Création de Mods pour Minecraft', 
    description: 'Guide complet pour développer des mods innovants pour Minecraft.' 
  },
  { 
    title: 'Modding dans les Frameworks Open Source', 
    description: 'Techniques pour contribuer et modifier des projets open source.' 
  }
]
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8 text-bikininjas-primary dark:text-bikininjas-secondary">
      Univers du Modding
    </h1>
    <div class="grid md:grid-cols-3 gap-6">
      <div 
        v-for="(topic, index) in moddingTopics" 
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
