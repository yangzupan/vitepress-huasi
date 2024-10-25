import type MarkdownIt from 'markdown-it'
import type { Options as MiniSearchOptions } from 'minisearch'
import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { DocSearchProps } from './docsearch.js'
import type {
    LocalSearchTranslations,
    PageSplitSection
} from './local-search.js'
import type { Awaitable, MarkdownEnv, PageData } from 'vitepress'

export namespace HSTheme {
    export interface Config {
        /**
         * 网站的 logo 文件，默认为 /logo.svg
         *
         * @example '/logo.svg'
         */
        logo?: ThemeableImage

        /**
         * logo 链接
         */
        logoLink?: string | { link?: string; rel?: string; target?: string }

        /**
         * 导航栏的网站标题。如果值未定义，将使用 `config.title`。
         */
        siteTitle?: string | false


        /**
         * 导航栏项目。
         */
        nav?: NavItem[]

        /**
         * 侧边栏项目。
         */
        sidebar?: Sidebar

        /**
         * 目录侧边栏位置
         * 设置为 `false` 禁用目录侧边栏。
         * 设置为 `true` 目录侧边栏在右侧。
         * 设置为 'left' 目录侧边栏在左侧。
         *
         * @默认值 true
         */
        aside?: boolean | 'left'

        /**
         * 目录侧边栏的标题配置
         * 可以是 Outline 对象、Outline['level'] 或 false。
         *
         * @default deep
         */
        outline?: Outline | Outline['level'] | false

        /**
         * 编辑链接 的信息。如果未定义，编辑链接功能将被禁用。
         */
        editLink?: EditLink

        /**
         * 最后更新 时间配置
         */
        lastUpdated?: LastUpdatedOptions

        /** 
         * 设置自定义的上一页/下一页标签。
         */
        docFooter?: DocFooter

        /**
         * 在导航栏末尾显示的社交链接。适合放置指向 GitHub、Twitter、Facebook 等社交服务的链接。
         */
        socialLinks?: SocialLink[]

        /**
         * 页脚配置。
         */
        footer?: Footer

        /**
         * @默认值 '外观'
         */
        darkModeSwitchLabel?: string

        /**
         * @默认值 '切换到浅色主题'
         */
        lightModeSwitchTitle?: string

        /**
         * @默认值 '切换到深色主题'
         */
        darkModeSwitchTitle?: string

        /**
         * @默认值 '菜单'
         */
        sidebarMenuLabel?: string

        /**
         * @默认值 '返回顶部'
         */
        returnToTopLabel?: string

        /**
         * 为语言菜单按钮设置自定义的 `aria-label`。
         *
         * @默认值 '切换语言'
         */
        langMenuLabel?: string

        search?:
        | { provider: 'local'; options?: LocalSearchOptions }
        | { provider: 'algolia'; options: AlgoliaSearchOptions }

        /**
         * Carbon 广告选项。将其设为 undefined 可禁用广告功能。
         */
        carbonAds?: CarbonAdsOptions

        /**
         * 当当前 URL 为 `/foo` 时，切换语言将重定向到 `/locale/foo`。
         *
         * @默认值 true
         */
        i18nRouting?: boolean

        /**
         * 在 Markdown 链接中显示外部链接图标。
         *
         * @默认值 false
         */
        externalLinkIcon?: boolean

        /**
         * 自定义 404 页面的文本。
         */
        notFound?: NotFoundOptions
    }

    // ThemeableImage
    export type ThemeableImage =
        | string
        | { src: string; alt?: string;[prop: string]: any }
        | { light: string; dark: string; alt?: string;[prop: string]: any }

    // FeatureIcon
    export type FeatureIcon =
        | string
        | {
            src: string
            alt?: string
            width?: string
            height?: string
            wrap?: boolean
        }
        | {
            light: string
            dark: string
            alt?: string
            width?: string
            height?: string
            wrap?: boolean
        }

    // nav 
    export type NavItem = NavItemComponent | NavItemWithLink | NavItemWithChildren

    export interface NavItemComponent {
        component: string
        props?: Record<string, any>
    }

    export interface NavItemWithLink {
        text: string
        link: string
        items?: never

        /**
         * `activeMatch` is expected to be a regex string. We can't use actual
         * RegExp object here because it isn't serializable
         */
        activeMatch?: string
        rel?: string
        target?: string
        noIcon?: boolean
    }

    export interface NavItemChildren {
        text?: string
        items: NavItemWithLink[]
    }

    export interface NavItemWithChildren {
        text?: string
        items: (NavItemComponent | NavItemChildren | NavItemWithLink)[]

        /**
         * `activeMatch` is expected to be a regex string. We can't use actual
         * RegExp object here because it isn't serializable
         */
        activeMatch?: string
    }

    // sidebar
    export type Sidebar = SidebarItem[] | SidebarMulti

    export interface SidebarMulti {
        [path: string]: SidebarItem[] | { items: SidebarItem[]; base: string }
    }

    export type SidebarItem = {
        /**
         * 项目的文本标签。
         */
        text?: string

        /**
         * 项目的链接。
         */
        link?: string

        /**
         * 项目的子项目。
         */
        items?: SidebarItem[]

        /**
         * 如果未指定，则该组不可折叠。
         *
         * 如果为 `true`，该组可折叠且默认折叠。
         *
         * 如果为 `false`，该组可折叠但默认展开。
         */
        collapsed?: boolean

        /**
         * 子项目的基础路径。
         */
        base?: string

        /**
         * 自定义显示在上一页/下一页页脚的文本。
         */
        docFooterText?: string

        /**
         * 链接的 rel 属性。
         */
        rel?: string

        /**
         * 链接的 target 属性。
         */
        target?: string
    }


    export interface DocSidebar {
        // 侧边栏是否打开
        isOpen: Ref<boolean>
        // 侧边栏项目列表
        sidebar: ComputedRef<SidebarItem[]>
        // 侧边栏分组列表
        sidebarGroups: ComputedRef<SidebarItem[]>
        // 是否有侧边栏
        hasSidebar: ComputedRef<boolean>
        // 是否有旁白栏
        hasAside: ComputedRef<boolean>
        // 旁白栏是否在左侧
        leftAside: ComputedRef<boolean>
        // 侧边栏是否启用
        isSidebarEnabled: ComputedRef<boolean>
        // 打开侧边栏的方法
        open: () => void
        // 关闭侧边栏的方法
        close: () => void
        // 切换侧边栏开关状态的方法
        toggle: () => void
    }

    // outline
    export interface Outline {
        /**
         * 定义大纲的级别
         * - 可以是单个数字，表示从 1 到该数字的所有级别
         * - 可以是一个包含两个数字的数组，表示一个范围
         * - 可以是字符串 'deep'，表示包含所有级别
         */
        level?: number | [number, number] | 'deep'

        /**
         * 大纲的标签文本
         */
        label?: string
    }
    // edit link 
    export interface EditLink {
        /**
         * 编辑链接的模式。
         *
         * @example 'https://github.com/vuejs/vitepress/edit/main/docs/:path'
         * @example ({ filePath }) => { ... }
         */
        pattern: string | ((payload: PageData) => string)

        /**
         * 编辑链接的自定义文本。
         *
         * @default '编辑此页'
         */
        text?: string
    }

    // 上一页/下一页  
    export interface DocFooter {
        /**
         * 上一页按钮的自定义标签。可以设置为 `false` 来禁用。
         *
         * @default '上一页'
         */
        prev?: string | boolean

        /**
         * 下一页按钮的自定义标签。可以设置为 `false` 来禁用。
         *
         * @default '下一页'
         */
        next?: string | boolean
    }

    // 最后更新
    export interface LastUpdatedOptions {
        /**
         * 设置 最后更新 文本。
         *
         * @default '最后更新'
         */
        text?: string

        /**
         * 设置 最后更新 时间的格式化选项。
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
         *
         * @default
         * { dateStyle: 'short', timeStyle: 'short' }
         */
        formatOptions?: Intl.DateTimeFormatOptions & { forceLocale?: boolean }
    }
    // 社交链接 
    export interface SocialLink {
        /**
         * 社交媒体链接的图标
         * 可以是预定义的图标名称或自定义的 SVG
         */
        icon: SocialLinkIcon

        /**
         * 社交媒体链接的 URL
         */
        link: string

        /**
         * 链接的 aria-label 属性，用于提高可访问性
         * 如果未提供，将使用图标名称作为默认值
         */
        ariaLabel?: string
    }

    export type SocialLinkIcon =
        | 'discord'    // Discord 图标
        | 'facebook'   // Facebook 图标
        | 'github'     // GitHub 图标
        | 'instagram'  // Instagram 图标
        | 'linkedin'   // LinkedIn 图标
        | 'mastodon'   // Mastodon 图标
        | 'npm'        // NPM 图标
        | 'slack'      // Slack 图标
        | 'twitter'    // Twitter 图标
        | 'x'          // X（原 Twitter）图标
        | 'youtube'    // YouTube 图标
        | { svg: string } // 自定义 SVG 图标

    // footer 
    export interface Footer {
        /**
         * 页脚显示的消息文本
         * 可以用于展示网站的简短描述、口号或其他信息
         */
        message?: string

        /**
         * 页脚显示的版权信息
         * 通常包含版权声明、年份和公司/组织名称
         */
        copyright?: string
    }

    // 团队
    export interface TeamMember {
        /**
         * 团队成员的头像图片 URL
         */
        avatar: string

        /**
         * 团队成员的姓名
         */
        name: string

        /**
         * 团队成员的职位或头衔（可选）
         */
        title?: string

        /**
         * 团队成员所属的组织（可选）
         */
        org?: string

        /**
         * 组织的链接（可选）
         */
        orgLink?: string

        /**
         * 团队成员的描述（可选）
         */
        desc?: string

        /**
         * 团队成员的社交媒体链接（可选）
         */
        links?: SocialLink[]

        /**
         * 赞助商信息（可选）
         */
        sponsor?: string

        /**
         * 操作按钮文本（可选）
         */
        actionText?: string
    }

    // local nav -----------------------------------------------------------------

    export interface DocLocalNav {
        /**
         * 当前页面的大纲标题。
         */
        headers: ShallowRef<any>

        /**
         * 当前页面是否有本地导航。当页面中存在"大纲"时会显示本地导航。
         * 但请注意，实际的本地导航可见性还取决于屏幕宽度。
         */
        hasLocalNav: ComputedRef<boolean>
    }



    // local search --------------------------------------------------------------

    export interface LocalSearchOptions {
        /**
         * @default false
         * @deprecated Use `detailedView: false` instead.
         */
        disableDetailedView?: boolean

        /**
         * If `true`, the detailed view will be enabled by default.
         * If `false`, the detailed view will be disabled.
         * If `'auto'`, the detailed view will be disabled by default, but can be enabled by the user.
         *
         * @default 'auto'
         */
        detailedView?: boolean | 'auto'

        /**
         * @default false
         */
        disableQueryPersistence?: boolean

        translations?: LocalSearchTranslations
        locales?: Record<string, Partial<Omit<LocalSearchOptions, 'locales'>>>

        miniSearch?: {
            /**
             * @see https://lucaong.github.io/minisearch/types/MiniSearch.Options.html
             */
            options?: Pick<
                MiniSearchOptions,
                'extractField' | 'tokenize' | 'processTerm'
            >
            /**
             * @see https://lucaong.github.io/minisearch/types/MiniSearch.SearchOptions.html
             */
            searchOptions?: MiniSearchOptions['searchOptions']

            /**
             * Overrides the default regex based page splitter.
             * Supports async generator, making it possible to run in true parallel
             * (when used along with `node:child_process` or `worker_threads`)
             * ---
             * This should be especially useful for scalability reasons.
             * ---
             * @param {string} path - absolute path to the markdown source file
             * @param {string} html - document page rendered as html
             */
            _splitIntoSections?: (
                path: string,
                html: string
            ) =>
                | AsyncGenerator<PageSplitSection>
                | Generator<PageSplitSection>
                | Awaitable<PageSplitSection[]>
        }
        /**
         * Allows transformation of content before indexing (node only)
         * Return empty string to skip indexing
         */
        _render?: (
            src: string,
            env: MarkdownEnv,
            md: MarkdownIt
        ) => Awaitable<string>
    }

    // algolia -------------------------------------------------------------------

    /**
     * Algolia search options. Partially copied from
     * `@docsearch/react/dist/esm/DocSearch.d.ts`
     */
    export interface AlgoliaSearchOptions extends DocSearchProps {
        locales?: Record<string, Partial<DocSearchProps>>
    }

    // carbon ads ----------------------------------------------------------------

    // Todo: 广告
    export interface CarbonAdsOptions {
        code: string
        placement: string
    }



    // not found 
    export interface NotFoundOptions {
        /**
         * 404 页面代码，默认为 '404'
         *
         * @default '404'
         */
        code?: string

        /**
         * 404 页面标题，默认为 '页面未找到'
         *
         * @default '页面未找到'
         */
        title?: string

        /**
         * 404 页面描述，默认为 "很抱歉，您访问的页面不存在，请仔细检查您访问的网址是否正确。"
         *
         * @default "很抱歉，您访问的页面不存在，请仔细检查您访问的网址是否正确。"
         */
        tips?: string

        /**
         * 设置主页链接的 aria 标签。
         *
         * @default '返回首页'
         */
        linkLabel?: string

        /**
         * 设置主页链接的文本。
         *
         * @default '返回首页'
         */
        linkText?: string

    }
}
