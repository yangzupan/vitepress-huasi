import { ref, watch, readonly, onUnmounted } from 'vue';
import { inBrowser } from 'vitepress';
export const focusedElement = ref();
let active = false;
let listeners = 0;
/**
 * 自定义钩子用于管理弹出窗口的焦点状态
 * 在浏览器环境中，激活焦点跟踪并监视指定元素的焦点变化
 * 当元素获得或失去焦点时，调用相应的回调函数
 * 
 * @param {Object} options - 包含弹出窗口相关选项的对象
 * @param {Ref} options.el - 要监视焦点状态的DOM元素的Ref
 * @param {Function} [options.onFocus] - 当元素获得焦点时调用的回调函数
 * @param {Function} [options.onBlur] - 当元素失去焦点时调用的回调函数
 * @returns {Ref} - 返回一个只读的Ref，表示焦点状态
 */
export function useFlyout(options) {
    // 创建一个响应式的焦点状态变量
    const focus = ref(false);

    // 确保在浏览器环境中执行后续操作
    if (inBrowser) {
        // 如果当前没有激活焦点跟踪，则激活焦点跟踪
        !active && activateFocusTracking();
        // 增加监听器计数，表示有新的弹出窗口关注焦点变化
        listeners++;

        // 监视焦点元素的变化，当焦点元素变化时更新焦点状态
        const unwatch = watch(focusedElement, (el) => {
            // 如果当前焦点元素是弹出窗口的一部分，则设置焦点状态为true
            if (el === options.el.value || options.el.value?.contains(el)) {
                focus.value = true;
                // 调用获得焦点的回调函数，如果有的话
                options.onFocus?.();
            } else {
                // 否则设置焦点状态为false
                focus.value = false;
                // 调用失去焦点的回调函数，如果有的话
                options.onBlur?.();
            }
        });

        // 在组件卸载时清理监视器并减少监听器计数
        onUnmounted(() => {
            unwatch();
            listeners--;
            // 如果没有剩余的监听器，则停用焦点跟踪
            if (!listeners) {
                deactivateFocusTracking();
            }
        });
    }

    // 返回只读的焦点状态Ref
    return readonly(focus);
}
/**
 * 启用焦点跟踪功能
 * 当文档中的元素获得焦点时，通过添加事件监听器来跟踪当前焦点所在的元素
 * 这个函数会将焦点跟踪功能激活，并在首次调用时记录当前获得焦点的元素
 */
function activateFocusTracking() {
    document.addEventListener('focusin', handleFocusIn);
    active = true;
    focusedElement.value = document.activeElement;
}

/**
 * 禁用焦点跟踪功能
 * 通过移除事件监听器来停止跟踪文档中元素的焦点变化
 * 这个函数用于在不需要继续跟踪焦点时，解除对focusin事件的监听
 */
function deactivateFocusTracking() {
    document.removeEventListener('focusin', handleFocusIn);
}

/**
 * 处理焦点进入事件
 * 当焦点移动到文档中的新元素时，更新记录当前焦点所在的元素
 * 这个函数在每次焦点变化时被调用，确保跟踪的焦点元素是最新的
 */
function handleFocusIn() {
    focusedElement.value = document.activeElement;
}