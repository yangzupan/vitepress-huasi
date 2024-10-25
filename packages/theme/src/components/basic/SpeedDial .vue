
<script setup lang="ts">
const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});

const isOpen = ref(false);

function toggleMenu() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
    <div class="speed-dial">
      <button @click="toggleMenu" class="speed-dial-button">
        <slot name="button-icon">+</slot>
      </button>
      <ul v-if="isOpen" class="speed-dial-menu">
        <li v-for="(item, index) in items" :key="index" @click="item.action">
          <slot name="item" :item="item">{{ item.label }}</slot>
        </li>
      </ul>
    </div>
  </template>

<style scoped>
.speed-dial {
  position: relative;
}

.speed-dial-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 24px;
  cursor: pointer;
}

.speed-dial-menu {
  position: absolute;
  bottom: 70px;
  right: 0;
  list-style: none;
  padding: 0;
  margin: 0;
}

.speed-dial-menu li {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  border-radius: 4px;
}
</style>