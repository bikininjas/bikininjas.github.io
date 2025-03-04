<script setup lang="ts">
import { ref } from 'vue'
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-6 text-bikininjas-primary dark:text-bikininjas-secondary">
      Bienvenue sur Bikininjas Blog
    </h1>
    <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        Bikininjas Blog est votre destination ultime pour explorer le monde fascinant du développement logiciel, 
        du modding et des dernières tendances technologiques. Plongez dans nos articles passionnants, 
        découvrez des tutoriels de code et restez à jour avec les dernières innovations.
      </p>
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>