import { onContentUpdated } from 'vitepress';
import { computed, shallowRef } from 'vue';
import { getHeaders } from '../composables/outline';
import { useData } from './data';
/**
 * 自定义导航钩子函数
 * 该函数用于处理和返回页面内的导航信息，包括导航项和是否显示导航
 */
export function useLocalNav() {
    // 获取页面数据，包括主题配置和前置元数据
    const { theme, frontmatter } = useData();
    // 初始化headers数组，用于存储导航项
    const headers = shallowRef([]);
    // 计算是否有本地导航
    const hasLocalNav = computed(() => {
        return headers.value.length > 0;
    });
    // 当内容更新时，更新导航项
    onContentUpdated(() => {
        headers.value = getHeaders(frontmatter.value.outline ?? theme.value.outline);
    });
    // 返回导航项和是否有导航的信息
    return {
        headers,
        hasLocalNav
    };
}
