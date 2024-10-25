import { ref, watch } from 'vue';
import { useRoute } from 'vitepress';
/**
 * 导出一个导航组件的状态管理函数。
 * 此函数主要用于管理导航界面的显示与隐藏，并监听窗口大小调整事件，
 * 在平板窗口尺寸下自动隐藏导航。
 */
export function useHeader() {
    // 初始化导航屏幕显示状态为关闭。
    const isScreenOpen = ref(false);

    /**
     * 打开导航屏幕的函数。
     * 将导航屏幕状态设置为打开，并添加窗口大小调整事件监听器。
     */
    function openScreen() {
        isScreenOpen.value = true;
        window.addEventListener('resize', closeScreenOnTabletWindow);
    }

    /**
     * 关闭导航屏幕的函数。
     * 将导航屏幕状态设置为关闭，并移除窗口大小调整事件监听器。
     */
    function closeScreen() {
        isScreenOpen.value = false;
        window.removeEventListener('resize', closeScreenOnTabletWindow);
    }

    /**
     * 切换导航屏幕的函数。
     * 根据当前状态决定是打开还是关闭导航屏幕。
     */
    function toggleScreen() {
        isScreenOpen.value ? closeScreen() : openScreen();
    }

    /**
     * 当用户将窗口调整到大于平板尺寸时关闭屏幕。
     */
    function closeScreenOnTabletWindow() {
        window.outerWidth >= 768 && closeScreen();
    }

    // 监听路由路径的变化，以自动关闭导航屏幕。
    const route = useRoute();
    watch(() => route.path, closeScreen);

    // 返回导航屏幕状态管理函数。
    return {
        isScreenOpen,
        openScreen,
        closeScreen,
        toggleScreen
    };
}
