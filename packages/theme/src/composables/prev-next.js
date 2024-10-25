import { computed } from 'vue';
import { useData } from 'vitepress';
import { isActive } from '../shared';
import { getSidebar, getFlatSideBarLinks } from '../support/sidebar';
/**
 * 用于导航到上一页和下一页的 Hook。
 * 此 Hook 根据当前页面、主题设置和前置事项（frontmatter）计算上一页和下一页的导航信息。
 * 
 * @returns {Object} 返回一个包含上一页和下一页导航信息的对象。
 *                  每个对象都有 'text' 和 'link' 属性，分别表示导航的显示文本和链接。
 *                  如果根据设置应隐藏导航，则相应的属性（prev 或 next）将为 undefined。
 */
export function usePrevNext() {
    // 从当前数据中提取页面信息、主题设置和前置事项。
    const { page, theme, frontmatter } = useData();
    
    // 返回一个计算属性，当依赖项发生变化时自动更新。
    return computed(() => {
        // 根据当前页面的相对路径和主题设置获取侧边栏配置。
        const sidebar = getSidebar(theme.value.sidebar, page.value.relativePath);
        // 将侧边栏链接展平为一维数组，以便于处理。
        const links = getFlatSideBarLinks(sidebar);
        // 去除重复链接，忽略查询参数和锚点。
        const candidates = uniqBy(links, (link) => link.link.replace(/[?#].*$/, ''));
        // 查找当前活动页面链接的索引。
        const index = candidates.findIndex((link) => {
            return isActive(page.value.relativePath, link.link);
        });
        // 根据主题设置和前置事项确定是否隐藏上一页导航。
        const hidePrev = (theme.value.docFooter?.prev === false && !frontmatter.value.prev) ||
            frontmatter.value.prev === false;
        // 根据主题设置和前置事项确定是否隐藏下一页导航。
        const hideNext = (theme.value.docFooter?.next === false && !frontmatter.value.next) ||
            frontmatter.value.next === false;
        
        // 构建并返回上一页和下一页的导航信息。
        return {
            prev: hidePrev
                ? undefined
                : {
                    // 上一页导航的文本，优先使用前置事项中的自定义文本。
                    text: (typeof frontmatter.value.prev === 'string'
                        ? frontmatter.value.prev
                        : typeof frontmatter.value.prev === 'object'
                            ? frontmatter.value.prev.text
                            : undefined) ??
                        candidates[index - 1]?.docFooterText ??
                        candidates[index - 1]?.text,
                    // 上一页导航的链接，优先使用前置事项中的自定义链接。
                    link: (typeof frontmatter.value.prev === 'object'
                        ? frontmatter.value.prev.link
                        : undefined) ?? candidates[index - 1]?.link
                },
            next: hideNext
                ? undefined
                : {
                    // 下一页导航的文本，优先使用前置事项中的自定义文本。
                    text: (typeof frontmatter.value.next === 'string'
                        ? frontmatter.value.next
                        : typeof frontmatter.value.next === 'object'
                            ? frontmatter.value.next.text
                            : undefined) ??
                        candidates[index + 1]?.docFooterText ??
                        candidates[index + 1]?.text,
                    // 下一页导航的链接，优先使用前置事项中的自定义链接。
                    link: (typeof frontmatter.value.next === 'object'
                        ? frontmatter.value.next.link
                        : undefined) ?? candidates[index + 1]?.link
                }
        };
    });
}
/**
 * 去除数组中根据指定函数计算后具有重复键值的元素
 * @param {Array} array - 需要去重的数组
 * @param {Function} keyFn - 用于计算每个元素的键值的函数
 * @returns {Array} - 返回去重后的数组
 */
function uniqBy(array, keyFn) {
    // 创建一个Set来存储计算后的键值，以便快速检查重复
    const seen = new Set();
    // 使用filter方法迭代数组，决定哪些元素保留在结果数组中
    return array.filter((item) => {
        // 使用keyFn函数计算当前元素的键值
        const k = keyFn(item);
        // 如果Set中已经存在该键值，返回false，元素被过滤掉
        // 如果Set中不存在该键值，添加到Set中并返回true，元素保留在结果数组中
        return seen.has(k) ? false : seen.add(k);
    });
}
