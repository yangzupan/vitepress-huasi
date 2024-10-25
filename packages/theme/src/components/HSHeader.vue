<script setup lang="ts">
import { ref, onMounted, onUnmounted, watchPostEffect } from 'vue'
import { useData } from 'vitepress'
import { useSidebar } from '../composables/sidebar';
const isScrolled = ref(false)
const { hasSidebar } = useSidebar()
const { frontmatter } = useData()

const classes = ref<Record<string, boolean>>({})
watchPostEffect(() => {
    classes.value = {
        'has-sidebar': hasSidebar.value,
        // 'has-sidebar': true,
        'home': frontmatter.value.layout === 'home' || frontmatter.value.home === true,
        'page': frontmatter.value.layout === 'page',
        'no-top': isScrolled.value,
    }
})
const handleScroll = () => {
    isScrolled.value = window.scrollY > 20
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>
<template>
    <header class="header" :class="classes">
        <div class="header-content mx-auto flex flex-row justify-between items-center gap-4">
            <div class="header-left flex-none flex felx-row gap-2">
                <div class="header-logo">logo</div>
                <div class="header-title">标题</div>
            </div>
            <div class="header-center flex-1 hidden">
                <div class="header-nav flex flex-row justify-center items-center gap-3">
                    <div class="header-nav-item">
                        <a href="">首页</a>
                    </div>
                    <div class="header-nav-item">
                        <a href="">关于我们</a>
                    </div>
                    <div class="header-nav-item">
                        <a href="">产品中心</a>
                    </div>
                    <div class="header-nav-item">
                        <a href="">新闻中心</a>
                    </div>
                    <div class="header-nav-item">
                        <a href="">联系我们</a>
                    </div>
                </div>
            </div>
            <div class="header-right flex-none">
                <div class="header-right-item flex flex-row gap-2">
                    <div class="header-search">搜索</div>
                    <div class="header-themeswitch">主题切换</div>
                    <div class="header-social-links flex gap-2">
                        <div class="github">github</div>
                        <div class="github">github</div>
                        <div class="github">github</div>
                    </div>
                </div>
            </div>
        </div>

    </header>

</template>
<style scoped>
.header {
    position: relative;
    top: 0;
    width: 100%;
}

.header.has-sidebar {
    border-bottom: 1px solid var(--c-border-2);
}
.header-content {
    height: var(--header-height);
    max-width: var(--layout-max-width);
    padding-left: var(--layout-padding);
    padding-right: var(--layout-padding);
}

.header-center {
    font-size: var(--header-nav-font-size);
}

@media (min-width: 960px) {
    .header {
        position: fixed;
        z-index: 1;
    }

    .header.no-top {
        background-color: var(--c-bg-body);

        border-bottom: 1px solid var(--c-border-2);
    }

}
</style>