<script setup lang="ts">
import type { HSTheme } from '../../types/theme'

import { withBase } from 'vitepress'

defineProps<{
  image: HSTheme.ThemeableImage
  alt?: string
}>()

</script>

<template>
  <template v-if="image">
    <img
      v-if="typeof image === 'string' || 'src' in image"
      class="HSImage"
      v-bind="typeof image === 'string' ? $attrs : { ...image, ...$attrs }"
      :src="withBase(typeof image === 'string' ? image : image.src)"
      :alt="alt ?? (typeof image === 'string' ? '' : image.alt || '')"
    />
    <template v-else>
      <HSImage
        class="dark"
        :image="image.dark"
        :alt="image.alt"
        v-bind="$attrs"
      />
      <HSImage
        class="light"
        :image="image.light"
        :alt="image.alt"
        v-bind="$attrs"
      />
    </template>

  </template>
</template>

<style scoped>
html:not(.dark) .HSImage.dark {
  display: none;
}
.dark .HSImage.light {
  display: none;
}
</style>
