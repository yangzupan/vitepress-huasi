import { computed } from 'vue';
import { useData } from 'vitepress';
/**
 * 导出一个用于获取编辑链接的钩子函数
 * 该函数根据主题配置和当前页面数据，计算生成编辑页面的链接地址
 * 主要用于在页面中展示一个编辑链接，让用户可以快速跳转到页面内容的编辑位置
 */
export function useEditLink() {
    // 解构获取主题配置和当前页面数据
    const { theme, page } = useData();

    // 返回一个计算属性
    return computed(() => {
        // 从主题配置中提取编辑链接的文本和模式
        const { text = 'Edit this page', pattern = '' } = theme.value.editLink || {};

        // 初始化URL变量
        let url;

        // 根据模式的类型，计算生成编辑链接的URL
        if (typeof pattern === 'function') {
            // 如果模式是一个函数，调用该函数并传入当前页面数据
            url = pattern(page.value);
        }
        else {
            // 如果模式是一个字符串，使用正则表达式替换路径参数
            url = pattern.replace(/:path/g, page.value.filePath);
        }

        // 返回计算生成的URL和文本
        return { url, text };
    });
}
