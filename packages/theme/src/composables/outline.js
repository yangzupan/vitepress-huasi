import { getScrollOffset } from 'vitepress';
import { onMounted, onUnmounted, onUpdated } from 'vue';
import { throttleAndDebounce } from '../support/utils';
import { useAside } from './aside';
// cached list of anchor elements from resolveHeaders
const resolvedHeaders = [];
/**
 * 根据主题配置解析并返回标题
 * 
 * 此函数旨在通过检查主题配置中的不同属性来确定适当的标题
 * 它首先检查主题的轮廓配置是否为一个对象且不是数组，并且是否包含标签属性
 * 如果满足条件，则使用该标签作为标题如果不存在这样的标签，它会检查主题配置中是否存在outlineTitle属性
 * 如果该属性存在，则使用其值作为标题如果上述条件都不满足，则使用默认标题'On this page'
 * 
 * @param {Object} theme - 主题配置对象，包含主题的各种样式和结构信息
 * @returns {String} - 解析后的标题，用于在页面上显示
 */
export function resolveTitle(theme) {
    return ((typeof theme.outline === 'object' &&
        !Array.isArray(theme.outline) &&
        theme.outline.label) ||
        theme.outlineTitle ||
        '目录');
}
/**
 * 获取文档中的标题及其对应链接和层级
 * 
 * 此函数通过查询文档中的标题元素（h1-h6），并根据指定范围生成一个包含这些元素信息的数组
 * 每个标题元素的信息包括元素本身、标题文本、标题对应的链接以及标题的层级
 * 
 * @param {Object} range - 一个描述需要获取标题的文档范围的对象
 * @returns {Array} - 一个包含标题信息的对象数组，每个对象包含element（标题元素）、title（标题文本）、
 *                    link（标题对应的链接）和level（标题层级）
 */
export function getHeaders(range) {
    // 获取文档中所有的h1-h6元素，并确保它们有id且包含子节点
    const headers = [
        ...document.querySelectorAll('.VPDoc :where(h1,h2,h3,h4,h5,h6)')
    ]
        .filter((el) => el.id && el.hasChildNodes())
        .map((el) => {
        // 将元素的标签名转换为对应的层级数字
        const level = Number(el.tagName[1]);
        // 构建每个标题的信息对象
        return {
            element: el,
            title: serializeHeader(el),
            link: '#' + el.id,
            level
        };
    });
    // 根据指定的范围解析和返回标题信息数组
    return resolveHeaders(headers, range);
}
/**
 * 将标题元素的内容序列化为字符串
 * 此函数用于提取标题元素（如<h1>, <h2>等）中的文本内容，同时忽略特定类的元素
 * 它通过遍历标题元素的子节点来构建标题的文本表示，确保某些特殊元素不被包含在内
 * 
 * @param {HTMLElement} h - 待序列化的标题元素
 * @returns {string} - 标题元素的文本内容，不包含任何HTML标签或指定类的元素内容
 */
function serializeHeader(h) {
    let ret = '';
    // 遍历标题元素的子节点
    for (const node of h.childNodes) {
        // 如果子节点是元素节点（不包括文本节点等）
        if (node.nodeType === 1) {
            // 忽略具有特定类名的元素，这些类名的元素不符合序列化条件
            if (node.classList.contains('VPBadge') ||
                node.classList.contains('header-anchor') ||
                node.classList.contains('ignore-header')) {
                continue;
            }
            // 将符合条件的元素节点的文本内容添加到结果字符串中
            ret += node.textContent;
        }
        // 如果子节点是文本节点
        else if (node.nodeType === 3) {
            // 直接将文本节点的内容添加到结果字符串中
            ret += node.textContent;
        }
    }
    // 返回结果字符串，去除前后空格
    return ret.trim();
}
/**
 * 解析并构建标题树
 * 
 * 根据给定的标题集合和范围，构建一个标题树结构该函数用于处理Markdown中的标题，
 * 并根据指定的范围生成一个数组，数组中的每个元素代表一个标题节点，节点包含标题的层级和文本
 * 
 * @param {Array} headers - 标题集合，每个标题应包含其层级和文本信息
 * @param {number|object|string} range - 标题的范围可以是数字、对象或字符串"deep"，
 *          用于指定要包含的标题层级范围如果是一个对象，应包含一个`level`属性
 * @returns {Array} 返回构建的标题树数组如果范围为false或无效，则返回空数组
 */
export function resolveHeaders(headers, range) {
    // 如果范围明确为false，则直接返回空数组，不进行标题树的构建
    if (range === false) {
        return [];
    }

    // 确定标题的层级范围根据传入的范围类型，计算出具体的高和低层级
    const levelsRange = (typeof range === 'object' && !Array.isArray(range)
        ? range.level
        : range) || 2;
    
    // 根据范围确定高和低层级如果范围是一个数字，则高和低层级相同
    // 如果范围是"deep"，则默认从第2级到第6级
    const [high, low] = typeof levelsRange === 'number'
        ? [levelsRange, levelsRange]
        : levelsRange === 'deep'
            ? [2, 6]
            : levelsRange;

    // 调用buildTree函数构建标题树，传入标题集合和确定的高、低层级
    return buildTree(headers, high, low);
}
/**
 * 自定义 Hook，用于管理容器内的活动锚点状态。
 * 它会根据滚动位置和路由变化自动更新活动锚点。
 * @param {Object} container - 管理活动锚点的容器元素。
 * @param {Object} marker - 指示活动锚点的标记元素。
 */
export function useActiveAnchor(container, marker) {
    // 导入 useAside Hook 以检查侧边栏是否启用。
    const { isAsideEnabled } = useAside();
    
    // 节流和防抖处理 setActiveLink 函数，以优化滚动时的性能。
    const onScroll = throttleAndDebounce(setActiveLink, 100);
    
    // 初始化前一个活动链接变量。
    let prevActiveLink = null;
    
    // 在组件挂载时添加事件监听器。
    onMounted(() => {
        requestAnimationFrame(setActiveLink);
        window.addEventListener('scroll', onScroll);
    });
    
    // 在组件更新时更新活动链接，这可能表示路由变化。
    onUpdated(() => {
        // 侧边栏更新意味着路由变化
        activateLink(location.hash);
    });
    
    // 在组件卸载时移除事件监听器。
    onUnmounted(() => {
        window.removeEventListener('scroll', onScroll);
    });

    /**
     * 根据当前滚动位置设置活动链接。
     * 它检查标题的可见性并相应地更新活动链接。
     */
    function setActiveLink() {
        // 如果侧边栏未启用，则不执行任何操作。
        if (!isAsideEnabled.value) {
            return;
        }
        
        // 计算当前滚动位置和窗口尺寸。
        const scrollY = window.scrollY;
        const innerHeight = window.innerHeight;
        const offsetHeight = document.body.offsetHeight;
        const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1;
        
        // 获取标题并按其顶部位置排序。
        const headers = resolvedHeaders
            .map(({ element, link }) => ({
            link,
            top: getAbsoluteTop(element)
        }))
            .filter(({ top }) => !Number.isNaN(top))
            .sort((a, b) => a.top - b.top);
        
        // 如果没有可用的标题，则取消当前活动链接。
        if (!headers.length) {
            activateLink(null);
            return;
        }
        
        // 处理页面在顶部或底部的情况。
        if (scrollY < 1) {
            activateLink(null);
            return;
        }
        if (isBottom) {
            activateLink(headers[headers.length - 1].link);
            return;
        }
        
        // 查找视口顶部上方的最后一个标题，并更新活动链接。
        let activeLink = null;
        for (const { link, top } of headers) {
            if (top > scrollY + getScrollOffset() + 4) {
                break;
            }
            activeLink = link;
        }
        activateLink(activeLink);
    }

    /**
     * 根据提供的哈希激活或取消激活链接。
     * 它更新活动链接并调整标记的位置。
     * @param {string} hash - 要激活的链接的哈希。如果为 null，则取消激活当前活动链接。
     */
    function activateLink(hash) {
        // 从上一个活动链接中移除活动类。
        if (prevActiveLink) {
            prevActiveLink.classList.remove('active');
        }
        
        // 根据提供的哈希更新上一个活动链接。
        if (hash == null) {
            prevActiveLink = null;
        }
        else {
            prevActiveLink = container.value.querySelector(`a[href="${decodeURIComponent(hash)}"]`);
        }
        
        // 更新活动链接并调整标记位置。
        const activeLink = prevActiveLink;
        if (activeLink) {
            activeLink.classList.add('active');
            marker.value.style.top = activeLink.offsetTop + 39 + 'px';
            marker.value.style.opacity = '1';
        }
        else {
            marker.value.style.top = '33px';
            marker.value.style.opacity = '0';
        }
    }
}
/**
 * 计算元素相对于文档的绝对顶部坐标。
 * 
 * @param {HTMLElement} element - 需要计算绝对顶部坐标的元素。
 * @returns {number} - 元素的绝对顶部坐标。如果元素未附加到DOM或满足其他指定条件，则返回NaN。
 */
function getAbsoluteTop(element) {
    // 初始化累计顶部偏移量为0
    let offsetTop = 0;
    
    // 通过元素的offsetParent向上遍历，直到到达文档体
    while (element !== document.body) {
        // 检查当前元素是否为null，如果是，返回NaN
        if (element === null) {
            // 子元素可能是：
            // - 未附加到DOM（display: none）
            // - 设置为固定位置（不可滚动）
            // - body或html元素（offsetParent为null）
            return NaN;
        }
        
        // 将当前元素的offsetTop累加到累计顶部偏移量
        offsetTop += element.offsetTop;
        
        // 更新当前元素为其offsetParent，继续向上遍历
        element = element.offsetParent;
    }
    
    // 返回累计顶部偏移量作为元素的绝对顶部坐标
    return offsetTop;
}
/**
 * 根据给定的数据构建一个树形结构
 * @param {Array} data - 包含节点信息的数组，每个节点包含level和element属性
 * @param {number} min - 树中节点的最小层级
 * @param {number} max - 树中节点的最大层级
 * @returns {Array} - 返回一个树形结构的数组，满足给定的层级范围
 */
function buildTree(data, min, max) {
    // 重置resolvedHeaders数组，确保它为空
    resolvedHeaders.length = 0;
    // 初始化结果数组，用于存储构建的树形结构
    const result = [];
    // 初始化栈，用于临时存储节点以构建树形结构
    const stack = [];
    // 遍历数据数组，为每个元素创建节点并根据层级关系构建树形结构
    data.forEach((item) => {
        // 复制当前项并初始化children数组
        const node = { ...item, children: [] };
        // 获取当前栈中的父节点
        let parent = stack[stack.length - 1];
        // 当父节点存在且其层级大于等于当前节点的层级时，出栈，直到找到合适的父节点
        while (parent && parent.level >= node.level) {
            stack.pop();
            parent = stack[stack.length - 1];
        }
        // 如果当前节点应被忽略（根据类名或父节点的属性判断），则将其设置为应忽略，并入栈
        if (node.element.classList.contains('ignore-header') ||
            (parent && 'shouldIgnore' in parent)) {
            stack.push({ level: node.level, shouldIgnore: true });
            return;
        }
        // 如果当前节点的层级不在给定的范围内，则忽略此节点
        if (node.level > max || node.level < min)
            return;
        // 将当前节点添加到已解析的头部数组中
        resolvedHeaders.push({ element: node.element, link: node.link });
        // 如果存在父节点，则将当前节点添加到父节点的子节点数组中；否则，将当前节点添加到结果数组中
        if (parent)
            parent.children.push(node);
        else
            result.push(node);
        // 将当前节点入栈，作为后续节点的可能父节点
        stack.push(node);
    });
    // 返回构建的树形结构数组
    return result;
}
