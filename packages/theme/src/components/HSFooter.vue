<script setup lang="ts">
</script>
<template>
    <footer class="footer ">
        <div class="footer-social">
            <div class="footer-social-content">
                <a href="">图标</a>
                <a href="">图标</a>
                <a href="">图标</a>
                <a href="">图标</a>
                <a href="">图标</a>
                <a href="">图标</a>
                <a href="">图标</a>
            </div>
        </div>
        <div class="footer-sitemap hidden">
            <div class="footer-sitemap-content">
                <div class="footer-sitemap-item">
                    <span class="footer-sitemap-item-title">关于我们</span>
                    <div class="footer-sitemap-item-list">
                        <a href="">链接</a>
                        <a href="">链接</a>
                        <a href="">链接</a>
                        <a href="">链接</a>
                    </div>
                </div>
                <div class="footer-sitemap-item">
                    <span class="footer-sitemap-item-title">关于我们</span>
                    <div class="footer-sitemap-item-list">
                        <a href="">链接</a>
                        <a href="">链接</a>
                        <a href="">链接</a>
                        <a href="">链接</a>
                    </div>
                </div>
                <div class="footer-sitemap-item">
                    <span class="footer-sitemap-item-title">关于我们</span>
                    <div class="footer-sitemap-item-list">
                        <a href="">链接</a>
                        <a href="">链接</a>
                        <a href="">链接</a>
                        <a href="">链接</a>
                    </div>
                </div>
                <div class="footer-sitemap-item">
                    <span class="footer-sitemap-item-title">关于我们</span>
                    <div class="footer-sitemap-item-list">
                        <a href="">链接</a>
                        <a href="">链接</a>
                        <a href="">链接</a>
                        <a href="">链接</a>
                    </div>
                </div>
                <div class="footer-sitemap-item">
                    <span class="footer-sitemap-item-title">关于我们</span>
                    <div class="footer-sitemap-item-list">
                        <a href="">链接</a>
                        <a href="">链接</a>
                        <a href="">链接</a>
                        <a href="">链接</a>
                    </div>
                </div>
                <div class="footer-sitemap-item ">
                    <span class="footer-sitemap-item-title">关于我们</span>
                    <div class="footer-sitemap-item-list">
                        <a href="">链接</a>
                        <a href="">链接</a>
                        <a href="">链接</a>
                        <a href="">链接</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-copyright ">
            <div class="footer-copyright-content">
                <div class="footer-copyright-content-left">
                    <div class="footer-copyright-text text-center">
                        Copyright © 2021 - 2024
                        <a href="http://" target="_blank" rel="noopener noreferrer"></a>
                        All Rights Reserved.
                    </div>
                    <div class="footer-copyright-link ">
                        <a href="">
                            <img src="https://cdn.yangzupan.com/images/public/icp.svg" alt="" srcset="">
                            <span>滇ICP备2021007697号-11</span>
                        </a>
                        <a href="">
                            <img src="https://cdn.yangzupan.com/images/public/police.svg" alt="" srcset="">
                            <span>
                                滇公网安备 53038102530444 号</span>
                        </a>
                    </div>
                </div>
                <div class="footer-copyright-content-right ">
                    <a  href="">
                        <span class="by">Powered by</span>
                        <span class="name">VitePress</span>
                    </a>
                    <a href="">
                        <span class="by">Theme by</span>
                        <span class="name">HuaSiTheme</span>
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>
<style scoped>
.footer-social-content,
.footer-sitemap-content,
.footer-copyright-content {
    max-width: var(--layout-max-width);
    padding-left: var(--layout-padding);
    padding-right: var(--layout-padding);
    margin-left: auto;
    margin-right: auto;
}

.footer-social-content {
    min-height: 4rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}

.footer-sitemap {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
}

.footer-sitemap-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
}

.footer-sitemap-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.footer-sitemap-item-title {
    font-size: 1rem;
    font-weight: 600;
}

.footer-sitemap-item-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

}

.footer-copyright {
    /* display: flex;
  justify-content: center;
  align-items: center; */
    gap: 1rem;
    border-top: 1px solid var(--c-border-2);
    /* background-color: antiquewhite; */
}

.footer-copyright-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
    min-height: var(--footer-height);
    padding-top: 1rem;
    padding-bottom: 1rem;

}

.footer-copyright-content-left {
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.footer-copyright-content-right {
    font-size: 0.875rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}
.footer-copyright-content-right a {
    display: flex;
    gap: 0.5rem;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}
.footer-copyright-content-right a:hover{
    color: var(--c-theme);
    
    background-color: var(--c-primary-1);
}
.footer-copyright-content-right a .by{
    font-weight: 400;
    opacity: .8;
}
.footer-copyright-content-right a .name{
    font-weight: 700;
}
.footer-copyright-text {
    text-align: center;
}

.footer-copyright-link {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
}

.footer-copyright-link a {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.25rem;
}

.footer-copyright-link a img {
    width: 1rem;
    height: 1rem
}

.footer-copyright-link a:hover {
    color: var(--c-theme);
}

@media (min-width: 640px) {

    .footer-copyright-content-left {
        flex-direction: column;
    }

    .footer-copyright-link {
        flex-direction: row;
    }
}

@media (min-width: 1024px) {

    .footer-copyright-content {
        flex-direction: column-reverse;
        gap: 1rem;
    }
    .footer-copyright-content-left {
        flex-direction: row;
        font-size: 1rem;
        line-height: 1.5rem;
    }
    .footer-copyright-content-right {
        font-size: 1rem;
        line-height: 1.5rem;
    }

}
@media (min-width: 1024px) {}
</style>
