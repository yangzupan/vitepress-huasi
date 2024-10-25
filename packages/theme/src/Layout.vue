<script setup lang="ts">

import { computed, provide, useSlots, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
// import HSBackdrop from './components/HSBackdrop.vue'
import HSHeader from './components/HSHeader.vue'
import HSLocalNav from './components/HSLocalNav.vue'
import HSContent from './components/HSContent.vue'
import HSFooter from './components/HSFooter.vue'

import HSButton from './components/basic/HSButton.vue'
import HSFeatures from './components/function/HSFeatures.vue'
import DarkModeSwitch from './components/function/DarkModeSwitch.vue'
import { useCloseSidebarOnEscape, useSidebar } from './composables/sidebar'



const { site, frontmatter } = useData()
const { frontmatter: fm } = useData()
const {
    isOpen: isSidebarOpen,
    open: openSidebar,
    close: closeSidebar
} = useSidebar()

const route = useRoute()
watch(() => route.path, closeSidebar)

useCloseSidebarOnEscape(isSidebarOpen, closeSidebar)


</script>

<template>
    <div v-if="frontmatter.layout !== false" class="Layout" :class="frontmatter.pageClass">
        <slot name="layout-top" />
        <!-- <HSBackdrop class="backdrop" :show="isSidebarOpen" @click="closeSidebar" /> -->
        <HSHeader>
        </HSHeader>
        <!-- <HSLocalNav :open="isSidebarOpen" @open-menu="openSidebar" /> -->
        <HSContent>
        </HSContent>
        <HSFooter />


        <DarkModeSwitch></DarkModeSwitch>
        <slot name="layout-bottom" />

    </div>
    <Content v-else />

</template>

<style scoped>
.Layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    color: var(--c-text-1);
    background-color: var(--c-bg-body);
}
</style>