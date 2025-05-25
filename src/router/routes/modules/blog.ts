import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const BLOG: AppRouteRecordRaw = {
  path: '/blog',
  name: 'blog',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.blog',
    icon: 'icon-face-smile-fill',
    requiresAuth: true,
    order: 6,
  },
  children: [
    {
      path: 'list',
      name: 'list',
      component: () => import('@/views/blog/list/index.vue'),
      meta: {
        locale: 'menu.blog.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
}

export default BLOG
