export const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i;
export const APPEARANCE_KEY = 'vitepress-theme-appearance';
const HASH_RE = /#.*$/;
const HASH_OR_QUERY_RE = /[?#].*$/;
const INDEX_OR_EXT_RE = /(?:(^|\/)index)?\.(?:md|html)$/;
export const inBrowser = typeof document !== 'undefined';
export const notFoundPageData = {
    relativePath: '404.md',
    filePath: '',
    title: '404',
    description: 'Not Found',
    headers: [],
    frontmatter: { sidebar: false, layout: 'page' },
    lastUpdated: 0,
    isNotFound: true
};
/**
 * 检查给定路径是否与当前路径匹配
 * 
 * @param {string} currentPath 当前页面的路径
 * @param {string} matchPath 需要匹配的路径或正则表达式
 * @param {boolean} asRegex 是否将matchPath作为正则表达式来匹配，默认为false
 * @returns {boolean} 如果路径匹配则返回true，否则返回false
 */
export function isActive(currentPath, matchPath, asRegex = false) {
    // 如果matchPath未定义，则无法进行匹配，直接返回false
    if (matchPath === undefined) {
        return false;
    }
    
    // 规范化当前路径，并确保它以斜杠开头
    currentPath = normalize(`/${currentPath}`);
    
    // 如果asRegex为true，则将matchPath视为正则表达式进行匹配
    if (asRegex) {
        return new RegExp(matchPath).test(currentPath);
    }
    
    // 如果路径经过规范化处理后仍不匹配，则返回false
    if (normalize(matchPath) !== currentPath) {
        return false;
    }
    
    // 检查路径中是否包含哈希部分
    const hashMatch = matchPath.match(HASH_RE);
    if (hashMatch) {
        // 在浏览器环境中，比较当前页面的哈希值与匹配路径的哈希值
        return (inBrowser ? location.hash : '') === hashMatch[0];
    }
    
    // 如果所有匹配条件都满足，则返回true
    return true;
}
/**
 * 标准化给定的路径
 * 此函数的主要作用是将给定的路径解码，并移除路径中的哈希、查询字符串、索引文件名和文件扩展名
 * 它通过正则表达式替换来实现这一点，使路径适合于统一处理和比较
 * 
 * @param {string} path 需要标准化的路径字符串
 * @returns {string} 返回标准化后的路径字符串
 */
function normalize(path) {
    // 解码路径并移除哈希或查询字符串
    // 然后移除索引文件名或文件扩展名
    return decodeURI(path)
        .replace(HASH_OR_QUERY_RE, '')
        .replace(INDEX_OR_EXT_RE, '$1');
}
/**
 * 判断给定路径是否为外部URL
 * 
 * @param {string} path - 待检测的路径字符串
 * @returns {boolean} - 如果路径是外部URL则返回true，否则返回false
 */
/**
 * 判断给定路径是否为外部URL
 * 
 * @param {string} path - 待检测的路径字符串
 * @returns {boolean} - 如果路径是外部URL则返回true，否则返回false
 */
export function isExternal(path) {
    return EXTERNAL_URL_RE.test(path);
}
/**
 * 根据相对路径获取对应的语言环境
 * 
 * 此函数旨在为给定的相对路径找到最适合的语言环境键
 * 它通过检查每个语言环境键是否不为'root'、是否不指向外部资源、以及是否与给定路径活跃匹配来确定
 * 如果没有找到匹配的语言环境，则默认返回'root'
 * 
 * @param {Object} siteData - 站点数据对象，包含语言环境信息
 * @param {string} relativePath - 请求的相对路径
 * @returns {string} - 对应的语言环境键，如果没有找到则返回'root'
 */
export function getLocaleForPath(siteData, relativePath) {
    // 查找第一个满足条件的语言环境键：
    // 1. 键不等于 'root'
    // 2. 键不指向外部资源（通过 isExternal 函数判断）
    // 3. 给定的相对路径与语言环境键对应的路径活跃匹配（通过 isActive 函数判断）
    // 如果没有找到满足条件的语言环境键，则返回 'root'
    return (Object.keys(siteData?.locales || {}).find((key) => key !== 'root' &&
        !isExternal(key) &&
        isActive(relativePath, `/${key}/`, true)) || 'root');
}
/**
 * this merges the locales data to the main data by the route
 */
/**
 * 根据路由解析站点数据
 * 此函数用于根据给定的站点数据和相对路径，解析出适用于特定路由的站点数据
 * 它主要处理的是多语言相关数据，确保正确的语言设置被应用
 * 
 * @param {Object} siteData - 站点的基础数据对象，包含了站点的各种配置和信息
 * @param {string} relativePath - 用户当前访问的相对路径，用于确定用户正在访问的页面
 * @returns {Object} 返回解析后的站点数据对象，包括多语言设置和其他相关数据
 */
export function resolveSiteDataByRoute(siteData, relativePath) {
    // 获取当前路径对应的语言环境索引
    const localeIndex = getLocaleForPath(siteData, relativePath);
    
    // 合并站点基础数据和当前语言环境的数据
    return Object.assign({}, siteData, {
        localeIndex,
        // 选择当前语言环境的lang设置，如果不存在，则使用默认的lang设置
        lang: siteData.locales[localeIndex]?.lang ?? siteData.lang,
        // 同上，处理文本方向设置
        dir: siteData.locales[localeIndex]?.dir ?? siteData.dir,
        // 处理站点标题
        title: siteData.locales[localeIndex]?.title ?? siteData.title,
        // 处理标题模板
        titleTemplate: siteData.locales[localeIndex]?.titleTemplate ?? siteData.titleTemplate,
        // 处理站点描述
        description: siteData.locales[localeIndex]?.description ?? siteData.description,
        // 合并站点头部信息设置
        head: mergeHead(siteData.head, siteData.locales[localeIndex]?.head ?? []),
        // 合并主题配置，允许语言环境覆盖全局设置
        themeConfig: {
            ...siteData.themeConfig,
            ...siteData.locales[localeIndex]?.themeConfig
        }
    });
}
/**
 * Create the page title string based on config.
 */
/**
 * 创建页面标题
 * 
 * 该函数根据站点数据和页面数据生成最终的页面标题逻辑如下：
 * 1. 首先确定使用页面数据还是站点数据的标题，优先使用页面数据的标题
 * 2. 然后检查标题模板，优先使用页面数据的模板，若未定义，则使用站点数据的模板
 * 3. 如果模板是字符串且包含':title'占位符，则将占位符替换为实际标题
 * 4. 如果模板是函数，则调用该函数生成标题模板
 * 5. 最终决定返回的标题，如果生成的标题与模板字符串的特定部分匹配，则仅返回标题
 * 6. 否则，将实际标题与模板字符串拼接后返回
 * 
 * @param {Object} siteData - 站点配置数据，包含默认的标题和标题模板
 * @param {Object} pageData - 页面配置数据，可能包含特定的标题和标题模板
 * @returns {string} - 最终生成的页面标题
 */
export function createTitle(siteData, pageData) {
    // 确定使用页面数据还是站点数据的标题，优先使用页面数据的标题
    const title = pageData.title || siteData.title;
    // 检查标题模板，优先使用页面数据的模板，若未定义，则使用站点数据的模板
    const template = pageData.titleTemplate ?? siteData.titleTemplate;
    
    // 如果模板是字符串且包含':title'占位符，则将占位符替换为实际标题
    if (typeof template === 'string' && template.includes(':title')) {
        return template.replace(/:title/g, title);
    }
    
    // 调用模板字符串生成函数，生成标题模板
    const templateString = createTitleTemplate(siteData.title, template);
    
    // 如果生成的标题与模板字符串的特定部分匹配，则仅返回标题
    if (title === templateString.slice(3)) {
        return title;
    }
    
    // 否则，将实际标题与模板字符串拼接后返回
    return `${title}${templateString}`;
}
/**
 * 创建标题模板
 * 根据网站标题和模板参数生成页面标题的模板
 * @param {string} siteTitle - 网站的标题
 * @param {boolean|string} template - 模板类型或自定义模板字符串
 * @returns {string} 返回根据模板生成的标题字符串
 */
function createTitleTemplate(siteTitle, template) {
    // 如果模板参数为false，不生成任何标题
    if (template === false) {
        return '';
    }
    // 如果模板参数为true或未定义，使用默认模板格式
    if (template === true || template === undefined) {
        return ` | ${siteTitle}`;
    }
    // 如果网站标题与模板内容相同，不生成任何标题
    if (siteTitle === template) {
        return '';
    }
    // 使用自定义模板格式
    return ` | ${template}`;
}
/**
 * 检查 head 数组中是否包含特定的标签。
 * 
 * @param {Array} head - 包含一系列标签信息的数组。
 * @param {Array} tag - 表示要检查的标签的数组，包括标签类型和属性。
 * @returns {boolean} 如果 head 数组中包含指定的标签，则返回 true；否则返回 false。
 */
function hasTag(head, tag) {
    // 解构标签数组以获取标签类型和属性
    const [tagType, tagAttrs] = tag;
    
    // 如果标签类型不是 'meta'，直接返回 false
    if (tagType !== 'meta')
        return false;
    
    // 获取标签属性中的第一个键值对
    const keyAttr = Object.entries(tagAttrs)[0]; // 第一个键
    
    // 如果标签属性为空，返回 false
    if (keyAttr == null)
        return false;
    
    // 检查 head 数组中是否存在与类型和属性匹配的标签
    return head.some(([type, attrs]) => type === tagType && attrs[keyAttr[0]] === keyAttr[1]);
}

/**
 * 合并两个数组，去除重复的标签属性
 * 
 * 此函数的目的是将当前数组（curr）中的元素合并到前一个数组（prev）中，同时确保不重复的标签属性
 * 它首先通过过滤掉在当前数组中已存在的标签属性来准备前一个数组，然后将当前数组的元素直接扩展到结果数组中
 * 这种方法确保了结果数组中不会有任何重复的标签属性，同时保持了原有数组中元素的顺序
 * 
 * @param {Array} prev - 前一个数组，包含标签属性
 * @param {Array} curr - 当前数组，包含可能需要合并的标签属性
 * @returns {Array} - 返回合并后的数组，去除了重复的标签属性
 */
export function mergeHead(prev, curr) {
    return [...prev.filter((tagAttrs) => !hasTag(curr, tagAttrs)), ...curr];
}
// https://github.com/rollup/rollup/blob/fec513270c6ac350072425cc045db367656c623b/src/utils/sanitizeFileName.ts
const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;
/**
 * 净化文件名，确保文件名中不包含非法字符，并处理Windows系统中的驱动器字母
 * @param {string} name - 原始文件名
 * @returns {string} - 净化后的文件名
 */
export function sanitizeFileName(name) {
    // 检查并提取Windows系统中的驱动器字母
    const match = DRIVE_LETTER_REGEX.exec(name);
    const driveLetter = match ? match[0] : '';

    // 返回净化后的文件名：保留驱动器字母，移除或替换非法字符，规范化文件名开头的下划线
    return (driveLetter +
        name
            .slice(driveLetter.length)
            .replace(INVALID_CHAR_REGEX, '_')
            .replace(/(^|\/)_+(?=[^/]*$)/, '$1'));
}
/**
 * 将路径中的反斜杠替换为斜杠
 * 
 * 在处理文件路径或URL时，不同操作系统或环境可能使用不同的路径分隔符
 * 例如，Windows系统中常用反斜杠（\），而Unix/Linux系统中使用斜杠（/）
 * 为了确保路径在不同环境下的兼容性，此函数将所有反斜杠替换为斜杠
 * 
 * @param {string} p - 需要处理的路径字符串，可能包含反斜杠
 * @returns {string} - 替换后的路径字符串，所有反斜杠被替换为斜杠
 */
export function slash(p) {
    return p.replace(/\\/g, '/');
}
const KNOWN_EXTENSIONS = new Set();
/**
 * 将给定的文件名视为HTML文件名进行处理
 * 此函数通过检查文件扩展名来确定文件是否应被视为HTML文件
 * 非HTML文件将被视为静态资源
 * 
 * @param {string} filename - 待检查的文件名
 * @returns {boolean} - 如果文件应被视为HTML文件，则返回true；否则返回false
 */
export function treatAsHtml(filename) {
    // 初始化已知扩展名集合，如果集合为空，则进行初始化
    if (KNOWN_EXTENSIONS.size === 0) {
        // 尝试从环境变量中获取额外的扩展名
        const extraExts = (typeof process === 'object' && process.env?.VITE_EXTRA_EXTENSIONS) ||
            import.meta.env?.VITE_EXTRA_EXTENSIONS ||
            '';

        // 将已知的和额外的扩展名组合成一个字符串，然后按逗号分割成数组，并添加到已知扩展名集合中
        ('3g2,3gp,aac,ai,apng,au,avif,bin,bmp,cer,class,conf,crl,css,csv,dll,' +
            'doc,eps,epub,exe,gif,gz,ics,ief,jar,jpe,jpeg,jpg,js,json,jsonld,m4a,' +
            'man,mid,midi,mjs,mov,mp2,mp3,mp4,mpe,mpeg,mpg,mpp,oga,ogg,ogv,ogx,' +
            'opus,otf,p10,p7c,p7m,p7s,pdf,png,ps,qt,roff,rtf,rtx,ser,svg,t,tif,' +
            'tiff,tr,ts,tsv,ttf,txt,vtt,wav,weba,webm,webp,woff,woff2,xhtml,xml,' +
            'yaml,yml,zip' +
            (extraExts && typeof extraExts === 'string' ? ',' + extraExts : ''))
            .split(',')
            .forEach((ext) => KNOWN_EXTENSIONS.add(ext));
    }

    // 获取文件名的最后一个扩展名
    const ext = filename.split('.').pop();

    // 如果扩展名为空或不在已知扩展名集合中，则认为文件应被视为HTML文件
    return ext == null || !KNOWN_EXTENSIONS.has(ext.toLowerCase());
}
// https://github.com/sindresorhus/escape-string-regexp/blob/ba9a4473850cb367936417e97f1f2191b7cc67dd/index.js
/**
 * 转义正则表达式中的特殊字符
 * 此函数确保字符串中的特殊字符不会被解释为正则表达式的一部分
 * 而是作为字面值处理这对于动态生成正则表达式非常有用
 * 
 * @param {string} str - 需要进行转义处理的字符串
 * @returns {string} - 转义处理后的字符串
 */
export function escapeRegExp(str) {
    // 替换所有正则表达式特殊字符为其转义形式
    // 特殊字符包括: | \ { } ( ) [ ] ^ $ + * ? 和 -
    // 其中 - 需要单独处理因为它在字符集中有特殊意义
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}
/**
 * @internal
 */
/**
 * 将HTML字符转换为对应的HTML实体
 * 这个函数主要用于防止XSS攻击，通过将特殊字符转换为HTML实体，确保文本安全地呈现在网页上
 * @param {string} str - 需要转换的字符串
 * @returns {string} - 转换后的字符串
 */
export function escapeHtml(str) {
    // 将所有小于号替换为HTML实体，下同
    return str
        .replace(/</g, '&lt;')
        // 将所有大于号替换为HTML实体，下同
        .replace(/>/g, '&gt;')
        // 将所有双引号替换为HTML实体，下同
        .replace(/"/g, '&quot;')
        // 将所有与号（不在HTML实体开头）替换为HTML实体
        .replace(/&(?![\w#]+;)/g, '&amp;');
}
