<script setup lang="ts">
</script>
<template>
    <main class="main">
        <div class="main-content mx-auto">
            顺利到家到家
        <Content></Content>

        </div>
    </main>
</template>
<style scoped>
.main{
    width: 100%;
    height: 120vh;
}
.main-content{
    max-width: var(--layout-max-width);
    padding-left: var(--layout-padding);
    padding-right: var(--layout-padding);
}
@media (min-width: 960px) {
    .main{
        padding-top: var(--header-height);

    }

}
</style>