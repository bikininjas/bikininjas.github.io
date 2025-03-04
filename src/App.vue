<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <Navbar />
    <RouterView />
    <footer class="bg-gray-200 dark:bg-gray-800 text-center p-4 mt-8">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        &copy; 2024 Bikininjas Blog - Tous droits réservés
      </p>
    </footer>
  </div>
</template>

<style>
body {
  @apply transition-colors duration-300;
}
</style>