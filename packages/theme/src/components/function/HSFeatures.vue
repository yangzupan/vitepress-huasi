<script setup lang="ts">
import type { HSTheme } from '../../types/theme'
import { computed } from 'vue'
import HSFeature from './HSFeature.vue'

export interface Feature {
  icon?: HSTheme.FeatureIcon
  title: string
  details: string
  link?: string
  linkText?: string
  rel?: string
  target?: string
}

const props = defineProps<{
  features: Feature[]
}>()

const grid = computed(() => {
  const length = props.features.length

  if (!length) {
    return
  } else if (length === 2) {
    return 'grid-2'
  } else if (length === 3) {
    return 'grid-3'
  } else if (length % 3 === 0) {
    return 'grid-6'
  } else if (length > 3) {
    return 'grid-4'
  }
})
</script>

<template>
  <div v-if="features" class="HSFeatures">
    <div class="container">
      <div class="items">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="item"
          :class="[grid]"
        >
          <HSFeature
            :icon="feature.icon"
            :title="feature.title"
            :details="feature.details"
            :link="feature.link"
            :link-text="feature.linkText"
            :rel="feature.rel"
            :target="feature.target"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.HSFeatures {
  position: relative;
  padding: 0 20px;
}

@media (min-width: 640px) {
  .HSFeatures {
    padding: 0 40px;
  }
}

@media (min-width: 960px) {
  .HSFeatures {
    padding: 0 60px;
  }
}

.container {
  margin: 0 auto;
  max-width: 1152px;
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.item {
  padding: 8px;
  width: 100%;
}

@media (min-width: 640px) {
  .item.grid-2,
  .item.grid-4,
  .item.grid-6 {
    width: calc(100% / 2);
  }
}

@media (min-width: 768px) {
  .item.grid-2,
  .item.grid-4 {
    width: calc(100% / 2);
  }

  .item.grid-3,
  .item.grid-6 {
    width: calc(100% / 3);
  }
}

@media (min-width: 960px) {
  .item.grid-4 {
    width: calc(100% / 4);
  }
}
</style>
