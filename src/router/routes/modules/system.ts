import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const SYSTEM: AppRouteRecordRaw = {
  path: '/system',
  name: 'system',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.system',
    icon: 'iconSettings',
    requiresAuth: true,
    order: 6,
  },
  children: [
    {
      path: '/dictionary',
      name: 'dictionary',
      component: () => import('@/views/system/dictionary/index.vue'),
      meta: {
        locale: 'menu.system.dictionary',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
}

export default SYSTEM
