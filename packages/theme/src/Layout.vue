<script setup lang="ts">
import { useData } from 'vitepress'

const { site, frontmatter } = useData()
</script>

<template>

  <div v-if="frontmatter.home">
    <h1>{{ site.title }}</h1>
    <p>{{ site.description }}</p>
  </div>
  <div v-else>
    <a href="/">首页</a>
    <Content />
  </div>

  <div class="bg-red-500">hello，恭喜你，成功了安装了 vitepress-theme-huasi 主题</div>

</template>
