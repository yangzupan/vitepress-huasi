import { useMediaQuery } from '@vueuse/core';
import { computed, onMounted, onUnmounted, ref, watch, watchEffect, watchPostEffect } from 'vue';
import { isActive } from '../shared';
import { hasActiveLink as containsActiveLink, getSidebar, getSidebarGroups } from '../support/sidebar';
import { useData } from 'vitepress';
/**
 * 自定义钩子用于管理侧边栏的状态和配置
 * 此钩子计算侧边栏的配置、控制侧边栏的显示状态、并根据屏幕宽度和页面配置决定是否显示侧边栏
 */
export function useSidebar() {
    // 从全局数据中解构出所需的数据：frontmatter（页面元数据）、page（页面信息）、theme（主题配置）
    const { frontmatter, page, theme } = useData();
    // 使用媒体查询钩子判断当前屏幕宽度是否大于960px，用于响应式设计
    const is960 = useMediaQuery('(min-width: 960px)');
    // 使用ref创建一个响应式的变量来控制侧边栏的打开和关闭状态
    const isOpen = ref(false);
    // 计算侧边栏的配置，根据当前页面路径和主题配置动态生成侧边栏内容
    const _sidebar = computed(() => {
        const sidebarConfig = theme.value.sidebar;
        const relativePath = page.value.relativePath;
        return sidebarConfig ? getSidebar(sidebarConfig, relativePath) : [];
    });
    // 初始化侧边栏内容
    const sidebar = ref(_sidebar.value);
    // 监听侧边栏配置的变化，如果变化则更新侧边栏内容
    watch(_sidebar, (next, prev) => {
        if (JSON.stringify(next) !== JSON.stringify(prev))
            sidebar.value = _sidebar.value;
    });
    // 计算是否有侧边栏，根据侧边栏配置、页面元数据和页面布局决定
    const hasSidebar = computed(() => {
        return (frontmatter.value.sidebar !== false &&
            sidebar.value.length > 0 &&
            frontmatter.value.layout !== 'home');
    });
    // 计算左侧边栏的显示状态，根据主题配置和页面元数据决定
    const leftAside = computed(() => {
        if (hasAside)
            return frontmatter.value.aside == null
                ? theme.value.aside === 'left'
                : frontmatter.value.aside === 'left';
        return false;
    });
    // 计算是否有侧边栏，根据页面布局、页面元数据和主题配置决定
    const hasAside = computed(() => {
        if (frontmatter.value.layout === 'home')
            return false;
        if (frontmatter.value.aside != null)
            return !!frontmatter.value.aside;
        return theme.value.aside !== false;
    });
    // 计算侧边栏是否启用，根据是否有侧边栏和屏幕宽度决定
    const isSidebarEnabled = computed(() => hasSidebar.value && is960.value);
    // 计算侧边栏分组，如果有侧边栏则生成侧边栏分组
    const sidebarGroups = computed(() => {
        return hasSidebar.value ? getSidebarGroups(sidebar.value) : [];
    });
    // 打开侧边栏的方法
    function open() {
        isOpen.value = true;
    }
    // 关闭侧边栏的方法
    function close() {
        isOpen.value = false;
    }
    // 切换侧边栏显示状态的方法
    function toggle() {
        isOpen.value ? close() : open();
    }
    // 返回侧边栏相关数据和方法，供组件使用
    return {
        isOpen,
        sidebar,
        sidebarGroups,
        hasSidebar,
        hasAside,
        leftAside,
        isSidebarEnabled,
        open,
        close,
        toggle
    };
}

/**
 * 使用此自定义钩子可以在按下Escape键时关闭侧边栏
 * @param {Ref<boolean>} isOpen - 一个响应式对象，表示侧边栏的打开状态
 * @param {Function} close - 一个用于关闭侧边栏的函数
 */
export function useCloseSidebarOnEscape(isOpen, close) {
    // 定义一个变量来存储触发侧边栏关闭的元素
    let triggerElement;

    // 当isOpen的值变化时，更新triggerElement
    watchEffect(() => {
        triggerElement = isOpen.value
            ? document.activeElement
            : undefined;
    });

    // 在组件挂载时，添加键盘事件监听器
    onMounted(() => {
        window.addEventListener('keyup', onEscape);
    });

    // 在组件卸载时，移除键盘事件监听器
    onUnmounted(() => {
        window.removeEventListener('keyup', onEscape);
    });

    /**
     * 监听键盘事件，当按下Escape键且侧边栏是打开状态时，关闭侧边栏并聚焦触发元素
     * @param {KeyboardEvent} e - 键盘事件对象
     */
    function onEscape(e) {
        if (e.key === 'Escape' && isOpen.value) {
            close();
            triggerElement?.focus();
        }
    }
}
/**
 * 自定义钩子用于控制侧边栏的折叠和选中状态
 * @param {Object} item - 当前侧边栏项的数据
 * @returns {Object} - 返回包含侧边栏状态和行为的对象
 */
export function useSidebarControl(item) {
    // 获取页面数据和哈希值
    const { page, hash } = useData();
    // 初始化折叠状态
    const collapsed = ref(false);
    // 计算是否可以折叠
    const collapsible = computed(() => {
        return item.value.collapsed != null;
    });
    // 计算是否为链接项
    const isLink = computed(() => {
        return !!item.value.link;
    });
    // 初始化当前链接的选中状态
    const isActiveLink = ref(false);
    // 更新当前链接的选中状态的方法
    const updateIsActiveLink = () => {
        isActiveLink.value = isActive(page.value.relativePath, item.value.link);
    };
    // 监视页面数据、项数据和哈希值变化时更新选中状态
    watch([page, item, hash], updateIsActiveLink);
    // 在组件挂载时更新选中状态
    onMounted(updateIsActiveLink);
    // 计算是否包含选中的链接
    const hasActiveLink = computed(() => {
        if (isActiveLink.value) {
            return true;
        }
        return item.value.items
            ? containsActiveLink(page.value.relativePath, item.value.items)
            : false;
    });
    // 计算是否有子项
    const hasChildren = computed(() => {
        return !!(item.value.items && item.value.items.length);
    });
    // 在可折叠状态变化时更新折叠状态
    watchEffect(() => {
        collapsed.value = !!(collapsible.value && item.value.collapsed);
    });
    // 在选中状态或包含选中链接状态变化后更新折叠状态
    watchPostEffect(() => {
        ;
        (isActiveLink.value || hasActiveLink.value) && (collapsed.value = false);
    });
    // 切换折叠状态的方法
    function toggle() {
        if (collapsible.value) {
            collapsed.value = !collapsed.value;
        }
    }
    // 返回侧边栏状态和行为相关的属性和方法
    return {
        collapsed,
        collapsible,
        isLink,
        isActiveLink,
        hasActiveLink,
        hasChildren,
        toggle
    };
}
