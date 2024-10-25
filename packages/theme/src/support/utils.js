import { withBase , useData} from 'vitepress';
import { isExternal, treatAsHtml } from '../shared';
/**
 * 函数节流和防抖的组合实现
 * 该函数的目的是限制另一个函数的执行频率，直到一定时间没有调用后才再次执行
 * 主要解决了在高频事件中如何有效控制函数调用次数的问题
 * 
 * @param {Function} fn 要进行节流和防抖处理的函数
 * @param {number} delay 延迟执行的时间间隔，单位为毫秒
 * @returns {Function} 返回一个新的函数，该函数会在首次调用后等待指定的延迟时间再执行
 */
export function throttleAndDebounce(fn, delay) {
    // 用于存储 setTimeout 的句柄
    let timeoutId;
    // 标记函数是否已调用
    let called = false;
    // 返回一个新的函数给用户调用
    return () => {
        // 如果已有定时器，则清除它，防止重复触发
        if (timeoutId)
            clearTimeout(timeoutId);
        // 如果函数没有被调用，则直接调用，并设置标记为已调用
        if (!called) {
            fn();
            // 在指定延迟后重置调用标记
            (called = true) && setTimeout(() => (called = false), delay);
        }
        // 如果函数已被调用，则设置一个定时器，在指定延迟后调用函数
        else
            timeoutId = setTimeout(fn, delay);
    };
}
/**
 * 确保给定的路径以斜杠开头。
 * 
 * 该函数检查输入的路径字符串是否以斜杠（"/"）开头。
 * 如果是，则返回原始路径；如果不是，则在路径前添加斜杠并返回。
 * 
 * @param {string} path - 需要检查和可能修改的路径。
 * @returns {string} - 保证以斜杠开头的路径。
 */
export function ensureStartingSlash(path) {
    return /^\//.test(path) ? path : `/${path}`;
}
/**
 * 标准化链接地址
 * 
 * 此函数旨在根据给定的URL，生成一个标准化的链接地址它首先解析URL的各个组成部分，
 * 然后根据一系列条件判断来决定是否需要对链接进行处理这些条件包括链接是否指向外部网站、
 * 是否为锚点链接、协议是否为http以及路径是否指向HTML资源如果这些条件都不满足，
 * 则根据网站的配置和路径特性，重新构造链接地址最后，使用withBase函数添加基础路径
 * 
 * @param {string} url - 需要标准化的链接地址
 * @returns {string} - 标准化后的链接地址
 */
export function normalizeLink(url) {
    // 解析URL，获取各个组成部分
    const { pathname, search, hash, protocol } = new URL(url, 'http://a.com');

    // 检查链接是否为外部链接、锚点链接、非HTTP协议或不指向HTML资源，如果是则直接返回原始URL
    if (isExternal(url) ||
        url.startsWith('#') ||
        !protocol.startsWith('http') ||
        !treatAsHtml(pathname))
        return url;

    // 获取网站配置数据
    const { site } = useData();

    // 根据路径是否以斜杠结尾或是否为HTML文件，以及网站配置，决定是否需要修改URL
    const normalizedPath = pathname.endsWith('/') || pathname.endsWith('.html')
        ? url
        : url.replace(/(?:(^\.+)\/)?.*$/, `$1${pathname.replace(/(\.md)?$/, site.value.cleanUrls ? '' : '.html')}${search}${hash}`);

    // 添加基础路径并返回标准化后的链接
    return withBase(normalizedPath);
}
