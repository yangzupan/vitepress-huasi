<script setup lang="ts">
import type { HSTheme } from '../../types/theme'
import HSImage from '../basic/HSImage.vue'
import HSLink from '../basic/HSLink.vue'

defineProps<{
  icon?: HSTheme.FeatureIcon
  title: string
  details?: string
  link?: string
  linkText?: string
  rel?: string
  target?: string
}>()
</script>

<template>
  <HSLink
    class="HSFeature"
    :href="link"
    :rel="rel"
    :target="target"
    :no-icon="true"
    :tag="link ? 'a' : 'div'"
  >
    <article class="box">
      <div v-if="typeof icon === 'object' && icon.wrap" class="icon">
        <HSImage
          :image="icon"
          :alt="icon.alt"
          :height="icon.height || 48"
          :width="icon.width || 48"
        />
      </div>
      <HSImage
        v-else-if="typeof icon === 'object'"
        :image="icon"
        :alt="icon.alt"
        :height="icon.height || 48"
        :width="icon.width || 48"
      />
      <div v-else-if="icon" class="icon" v-html="icon"></div>
      <h2 class="title" v-html="title"></h2>
      <p v-if="details" class="details" v-html="details"></p>

      <div v-if="linkText" class="link-text">
        <p class="link-text-value">
          {{ linkText }} <span class="hsi-arrow-right link-text-icon" />
        </p>
      </div>
    </article>
  </HSLink>
</template>

<style scoped>
.HSFeature {
  display: block;
  border: 1px solid var(--c-border-2);
  border-radius: var(--border-radius-lg);
  height: 100%;
  background-color: var(--c-bg-1);
}

.HSFeature:hover {
  border-color: var(--c-theme);
}

.box {
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 100%;
}

.box > :deep(.HSImage) {
  margin-bottom: 20px;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 6px;
  background-color: var(--c-bg-3);
  width: 48px;
  height: 48px;
  font-size: 24px;
  transition: background-color 0.25s;
}

.title {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
}

.details {
  flex-grow: 1;
  padding-top: 8px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--c-text-2);
}

.link-text {
  padding-top: 8px;
}

.link-text-value {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.7;
  color: var(--c-theme);
  gap: 6px;
}

</style>
