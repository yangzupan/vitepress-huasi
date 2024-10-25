import { ensureStartingSlash } from './utils.js';
import { isActive } from '../shared';

/**
 * 根据给定的路径获取侧边栏配置。
 * 
 * 该函数根据提供的侧边栏配置和当前路径，确定要显示的侧边栏内容。
 * 首先检查侧边栏配置是否为数组，如果是，则直接处理并返回。
 * 如果侧边栏配置为 null 或 undefined，则返回一个空数组，表示没有侧边栏内容。
 * 否则，尝试根据路径匹配合适的侧边栏配置。
 * 
 * @param {Object|Array} _sidebar 侧边栏配置对象或数组。
 * @param {string} path 当前路径，用于获取侧边栏配置。
 * @returns {Array} 处理后的侧边栏配置数组。
 */
export function getSidebar(_sidebar, path) {
    // 检查侧边栏配置是否为数组，如果是，则直接处理并返回。
    if (Array.isArray(_sidebar))
        return addBase(_sidebar);
    // 如果侧边栏配置为 null 或 undefined，返回一个空数组。
    if (_sidebar == null)
        return [];
    // 确保路径以斜杠开头，保持一致性。
    path = ensureStartingSlash(path);
    // 按目录深度降序排序，优先匹配更深的目录。
    const dir = Object.keys(_sidebar)
        .sort((a, b) => {
        return b.split('/').length - a.split('/').length;
    })
        .find((dir) => {
        // 确保多级侧边栏键也以斜杠开头
        return path.startsWith(ensureStartingSlash(dir));
    });
    // 获取匹配目录的侧边栏配置，如果没有找到匹配项，则默认为空数组。
    const sidebar = dir ? _sidebar[dir] : [];
    // 根据侧边栏配置的类型进行处理并返回。
    return Array.isArray(sidebar)
        ? addBase(sidebar)
        : addBase(sidebar.items, sidebar.base);
}
/**
 * Get or generate sidebar group from the given sidebar items.
 */
/**
 * 根据侧边栏配置获取侧边栏组
 * 该函数旨在处理侧边栏导航数据，将其组织成具有嵌套项的组
 * 主要用于解决侧边栏导航的分组显示问题
 * 
 * @param {Array} sidebar - 侧边栏配置数组，包含多个侧边栏项
 * @returns {Array} - 组织后的侧边栏组数组，每个元素包含一个或多个侧边栏项
 */
export function getSidebarGroups(sidebar) {
    // 初始化侧边栏组数组
    const groups = [];
    // 初始化最后一个组的索引
    let lastGroupIndex = 0;
    // 遍历侧边栏配置数组
    for (const index in sidebar) {
        // 获取当前遍历的侧边栏项
        const item = sidebar[index];
        // 如果当前项包含子项，则作为一个新组添加到组数组中，并更新最后一个组的索引
        if (item.items) {
            lastGroupIndex = groups.push(item);
            continue;
        }
        // 如果当前组为空，则创建一个新的组并添加到组数组中
        if (!groups[lastGroupIndex]) {
            groups.push({ items: [] });
        }
        // 将当前项添加到最后一个组的子项数组中
        groups[lastGroupIndex].items.push(item);
    }
    // 返回组织后的侧边栏组数组
    return groups;
}
/**
 * 导出一个函数，用于递归地提取侧边栏中的链接，并返回一个扁平化的链接数组
 * @param {Array} sidebar - 侧边栏的配置数组，每个元素代表一个侧边栏项，可能包含子项
 * @returns {Array} 返回一个扁平化的链接数组，每个元素包含文本、链接和可选的文档页脚文本
 */
export function getFlatSideBarLinks(sidebar) {
    // 初始化一个空数组，用于存储提取出的链接信息
    const links = [];

    /**
     * 内部递归函数，用于遍历侧边栏项并提取链接
     * @param {Array} items - 当前层级的侧边栏项数组
     */
    function recursivelyExtractLinks(items) {
        // 遍历每个侧边栏项
        for (const item of items) {
            // 如果当前项包含文本和链接，则将其信息添加到链接数组中
            if (item.text && item.link) {
                links.push({
                    text: item.text,
                    link: item.link,
                    docFooterText: item.docFooterText
                });
            }
            // 如果当前项包含子项，则递归调用自身处理子项
            if (item.items) {
                recursivelyExtractLinks(item.items);
            }
        }
    }
    // 调用递归函数处理整个侧边栏配置
    recursivelyExtractLinks(sidebar);
    // 返回提取出的扁平化链接数组
    return links;
}
/**
 * 检查给定路径中是否包含活动链接
 * 
 * 此函数的目的是通过递归检查项目及其子项目来确定当前路径是否包含活动链接
 * 它首先检查传入的项目是否为数组，如果是，则迭代每个项目并递归调用自身
 * 如果不是数组，则检查当前项目的链接是否与给定路径匹配，或者继续递归检查当前项目的子项目
 * 
 * @param {string} path - 当前路径，用于比较链接是否活动
 * @param {Object|Object[]} items - 一个对象或对象数组，包含链接和/或子项目
 * @returns {boolean} - 如果找到活动链接则返回true，否则返回false
 */
export function hasActiveLink(path, items) {
    // 检查items是否为数组，如果是，则使用some方法迭代检查每个项目
    if (Array.isArray(items)) {
        return items.some((item) => hasActiveLink(path, item));
    }
    // 如果当前项目的链接与给定路径匹配，则返回true
    return isActive(path, items.link)
        ? true
        // 如果当前项目包含子项目，则递归调用自身检查子项目
        : items.items
            ? hasActiveLink(path, items.items)
            // 如果没有匹配的链接和子项目，则返回false
            : false;
}
/**
 * 为项目列表中的每个项目添加基础路径
 * 
 * 此函数通过复制给定的项目列表，并根据每个项目中定义的 base 属性或传递的 _base 参数，
 * 为每个项目及其可能包含的子项目列表中的每个项目添加基础路径
 * 如果项目中包含 link 属性，则将 base 路径与 link 属性值合并
 * 
 * @param {Array} items - 项目列表，每个项目可能包含自己的 base 属性和 link 属性
 * @param {string} _base - 默认的基础路径，用于没有定义自己 base 属性的项目
 * @returns {Array} - 复制后的项目列表，其中每个项目的 link 属性（如果存在）都已添加了基础路径
 */
function addBase(items, _base) {
    return [...items].map((_item) => {
        // 复制当前项目以避免修改原始对象
        const item = { ..._item };
        // 使用项目自身的 base 属性或使用传递的 _base 参数
        const base = item.base || _base;
        // 如果当前项目有 base 属性和 link 属性，将它们合并
        if (base && item.link)
            item.link = base + item.link;
        // 如果当前项目包含子项目列表，递归地为每个子项目添加基础路径
        if (item.items)
            item.items = addBase(item.items, base);
        // 返回处理后的项目
        return item;
    });
}
