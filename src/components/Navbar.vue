<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isDarkMode = ref(true)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 shadow-md">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <RouterLink 
        to="/" 
        class="text-2xl font-bold text-bikininjas-primary dark:text-bikininjas-secondary"
      >
        Bikininjas Blog
      </RouterLink>
      
      <div class="flex space-x-4">
        <RouterLink 
          to="/programmation" 
          class="text-gray-700 dark:text-gray-300 hover:text-bikininjas-primary dark:hover:text-bikininjas-secondary"
        >
          Programmation
        </RouterLink>
        <RouterLink 
          to="/bac-a-sable" 
          class="text-gray-700 dark:text-gray-300 hover:text-bikininjas-primary dark:hover:text-bikininjas-secondary"
        >
          Bac à Sable
        </RouterLink>
        <RouterLink 
          to="/modding" 
          class="text-gray-700 dark:text-gray-300 hover:text-bikininjas-primary dark:hover:text-bikininjas-secondary"
        >
          Modding
        </RouterLink>
        <RouterLink 
          to="/actualites" 
          class="text-gray-700 dark:text-gray-300 hover:text-bikininjas-primary dark:hover:text-bikininjas-secondary"
        >
          Actualités
        </RouterLink>
        
        <button 
          @click="toggleDarkMode" 
          class="ml-4 text-gray-700 dark:text-gray-300 hover:text-bikininjas-primary dark:hover:text-bikininjas-secondary"
        >
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>
  </nav>
</template>
