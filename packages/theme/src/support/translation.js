import { useData } from 'vitepress';
/**
 * @param themeObject Can be an object with `translations` and `locales` properties
 */
/**
 * 创建一个用于搜索页面的翻译函数。
 * 该函数旨在支持搜索页面的翻译需求，优先使用主题特定的语言翻译，其次是主题范围内的翻译，最后是默认翻译。
 * 
 * @param {Object} defaultTranslations - 默认翻译对象，包含默认的翻译键和值。
 * @returns {Function} - 返回一个 translate 函数，该函数接受一个翻译键并返回相应的翻译文本。
 */
export function createSearchTranslate(defaultTranslations) {
    // 从 useData 中解构出 localeIndex 和 theme，以访问当前语言索引和主题数据
    const { localeIndex, theme } = useData();

    /**
     * 根据提供的键执行翻译。
     * 该函数按以下顺序查找翻译：
     * 1. 当前语言的主题翻译
     * 2. 主题范围内的翻译
     * 3. 默认翻译
     * 
     * @param {string} key - 翻译键，支持点符号来访问嵌套对象。
     * @returns {string} - 返回翻译后的文本或找不到翻译时返回空字符串。
     */
    function translate(key) {
        // 按点号分割键，以便分层访问
        const keyPath = key.split('.');
        // 获取与搜索相关的主题选项，这些选项可能包含翻译配置
        const themeObject = theme.value.search?.options;
        // 判断 themeObject 是否为对象，以决定是否继续后续的查找过程
        const isObject = themeObject && typeof themeObject === 'object';
        // 尝试从主题中获取当前语言的翻译，默认为 null 如果未找到
        const locales = (isObject && themeObject.locales?.[localeIndex.value]?.translations) ||
            null;
        // 尝试从主题中获取主题范围内的翻译，默认为 null 如果未找到
        const translations = (isObject && themeObject.translations) || null;
        // 初始化变量，用于存储语言、翻译和默认翻译的查找结果
        let localeResult = locales;
        let translationResult = translations;
        let defaultResult = defaultTranslations;
        // 提取最后一个键，用于最终的翻译查找
        const lastKey = keyPath.pop();

        // 遍历 keyPath（不包括最后一个键）以在每一层查找翻译
        for (const k of keyPath) {
            let fallbackResult = null;

            // 在默认翻译中查找键
            const foundInFallback = defaultResult?.[k];
            if (foundInFallback) {
                fallbackResult = defaultResult = foundInFallback;
            }

            // 在主题范围内的翻译中查找键
            const foundInTranslation = translationResult?.[k];
            if (foundInTranslation) {
                fallbackResult = translationResult = foundInTranslation;
            }

            // 在当前语言的翻译中查找键
            const foundInLocale = localeResult?.[k];
            if (foundInLocale) {
                fallbackResult = localeResult = foundInLocale;
            }

            // 将回退结果放入未解决的结果中
            if (!foundInFallback) {
                defaultResult = fallbackResult;
            }
            if (!foundInTranslation) {
                translationResult = fallbackResult;
            }
            if (!foundInLocale) {
                localeResult = fallbackResult;
            }
        }

        // 返回最终的翻译结果，优先级依次为：语言、翻译、默认，如果都未找到则返回空字符串
        return (localeResult?.[lastKey] ??
            translationResult?.[lastKey] ??
            defaultResult?.[lastKey] ??
            '');
    }

    // 返回 translate 函数
    return translate;
}
