import { useMediaQuery } from '@vueuse/core';
import { computed } from 'vue';
import { useSidebar } from './sidebar';
/**
 * 自定义钩子用于确定侧边栏是否启用
 * 该钩子主要考虑了屏幕宽度和侧边栏的存在情况，以决定侧边栏是否应该显示
 * 
 * @returns { Object } 返回一个对象，包含一个布尔值属性isAsideEnabled，用于指示侧边栏是否启用
 */
export function useAside() {
    // 使用useSidebar钩子获取侧边栏的存在状态
    const { hasSidebar } = useSidebar();
    // 使用useMediaQuery钩子检查屏幕最小宽度是否为960px
    const is960 = useMediaQuery('(min-width: 960px)');
    // 使用useMediaQuery钩子检查屏幕最小宽度是否为1280px
    const is1280 = useMediaQuery('(min-width: 1280px)');
    
    // 计算侧边栏是否启用
    // 当屏幕宽度小于1280px且小于960px时，不显示侧边栏
    // 当屏幕宽度大于等于1280px或960px时，根据侧边栏是否存在来决定是否显示侧边栏
    const isAsideEnabled = computed(() => {
        if (!is1280.value && !is960.value) {
            return false;
        }
        return hasSidebar.value ? is1280.value : is960.value;
    });
    
    // 返回计算结果，用于在组件中判断侧边栏是否启用
    return {
        isAsideEnabled
    };
}
