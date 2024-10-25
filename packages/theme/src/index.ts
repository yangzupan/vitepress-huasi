
import Layout from './Layout.vue'

import './styles/tailwind.css'
import './styles/var.css'
import './styles/icons.css'
import './styles/style.css'

export type { HSTheme } from './types/theme.js'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // ...

  }
}