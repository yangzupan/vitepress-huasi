<template>
    <button @click="toggleDark" class="dark-mode-switch">
      {{ isDark ? '🌙' : '☀️' }}
    </button>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const isDark = ref(false)
  
  const toggleDark = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('vitepress-theme-appearance', isDark.value ? 'dark' : 'light')
  }
  
  onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  </script>
  
  <style scoped>
  .dark-mode-switch {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1.2em;
  }
  </style>