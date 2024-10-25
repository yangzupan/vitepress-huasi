<script setup lang="ts">
import { computed } from "vue";
import { normalizeLink } from "../../support/utils";
import { EXTERNAL_URL_RE } from "../../shared";

interface Props {
  type?: "primary" | "secondary" | "outline" | "text";
  shape?: "square" | "round" | "circle";
  size?: "xs" | "sm" | "md" | "lg";
  status?: "none" | "success" | "warning" | "danger";
  disabled?: boolean;
  tag?: string;
  text?: string;
  href?: string;
  target?: string;
  rel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "primary",
  shape: "square",
  size: "md",
  status: "none",
});

const isExternal = computed(() => props.href && EXTERNAL_URL_RE.test(props.href));
const component = computed(() => props.tag || (props.href ? "a" : "button"));
</script>

<template>
  <component
    :is="component"
    class="HSButton"
    :class="[type, shape, size, status, { 'is-disabled': props.disabled }]"
    :href="props.href ? normalizeLink(props.href) : undefined"
    :target="props.target ?? (isExternal ? '_blank' : undefined)"
    :rel="props.rel ?? (isExternal ? 'noreferrer' : undefined)"
    :disabled="component === 'button' && props.disabled"
  >
    <slot>{{ text }}</slot>
  </component>
</template>

<style scoped>
.HSButton {
  display: inline-flex;
  position: relative;
  outline: none;
  font-weight: 500;
  appearance: none;
  user-select: none;
  cursor: pointer;
  box-sizing: border-box;
  line-height: 2;
  align-items: center;
  justify-content: center;
}

/* 大小样式 */
.HSButton.xs {
  padding: 0 9px;
  font-size: 12px;
  height: 24px;
}

.HSButton.sm {
  padding: 0 14px;
  font-size: 14px;
  height: 29px;
}

.HSButton.md {
  padding: 0 16px;
  font-size: 14px;
  height: 34px;
}

.HSButton.lg {
  padding: 0 18px;
  font-size: 16px;
  height: 40px;
}

/* 形状样式 */
.HSButton.square {
  border-radius: var(--border-radius-sm);
}

.HSButton.round {
  border-radius: var(--border-radius-full);
}

.HSButton.circle {
  border-radius: var(--border-radius-circle);
}

/* 类型样式 */
.HSButton.primary {
  color: var(--c-white);
  background-color: var(--c-primary-6);
}

.HSButton.primary:hover {
  background-color: var(--c-primary-5);
}

.HSButton.secondary {
  color: var(--c-text-1);
  background-color: var(--c-gray-3);
  border: 1px solid var(--c-gray-3);
}

.HSButton.secondary:hover {
  background-color: var(--c-gray-4);
}

.HSButton.outline {
  background-color: transparent;
  color: var(--c-primary-6);
  border: 1px solid var(--c-primary-6);
}

.HSButton.outline:hover {
  background-color: var(--c-primary-5);
  color: var(--c-primary-1);
}

.HSButton.text {
  background-color: transparent;
  color: var(--c-primary-6);
}

.HSButton.text:hover {
  background-color: var(--c-gray-3);
}

/* 状态样式 */

.HSButton.success {
  background-color: var(--c-success-6);
}

.HSButton.success:hover {
  background-color: var(--c-success-5);
}

.HSButton.success.secondary {
  color: var(--c-success-6);
  background-color: var(--c-success-2);
}

.HSButton.success.outline {
  border: 1px solid var(--c-success-6);
  color: var(--c-success-6);
  background-color: var(--c-success-1);
}

.HSButton.success.outline:hover {

  background-color: var(--c-success-2);
}

.HSButton.success.text {
  background-color: transparent;
  color: var(--c-success-6);
}

.HSButton.success.text:hover {
  background-color: var(--c-success-1);
}

.HSButton.warning {
  background-color: var(--c-warning-6);
}

.HSButton.warning:hover {
  background-color: var(--c-warning-5);
}

.HSButton.warning.secondary {
  color: var(--c-warning-6);
  background-color: var(--c-warning-2);
}

.HSButton.warning.outline {
  border: 1px solid var(--c-warning-6);
  color: var(--c-warning-6);
  background-color: var(--c-warning-1);
}

.HSButton.warning.outline:hover {

  background-color: var(--c-warning-2);
}

.HSButton.warning.text {
  background-color: transparent;
  color: var(--c-warning-6);
}

.HSButton.warning.text:hover {
  background-color: var(--c-warning-1);
}

.HSButton.danger {
  background-color: var(--c-danger-6);
}

.HSButton.danger:hover {
  background-color: var(--c-danger-5);
}

.HSButton.danger.secondary {
  color: var(--c-danger-6);
  background-color: var(--c-danger-2);
}

.HSButton.danger.outline {
  border: 1px solid var(--c-danger-6);
  color: var(--c-danger-6);
  background-color: var(--c-danger-1);
}

.HSButton.danger.outline:hover {
  background-color: var(--c-danger-2);
}

.HSButton.danger.text {
  background-color: transparent;
  color: var(--c-danger-6);
}

.HSButton.danger.text:hover {
  background-color: var(--c-danger-1);
}

.HSButton.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
a.is-disabled {
  pointer-events: none;
}
</style>
