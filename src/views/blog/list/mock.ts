import { GetParams } from '@/types/global'
import setupMock, { successResponseWrap } from '@/utils/setup-mock'
import Mock from 'mockjs'
import qs from 'query-string'

const data = Mock.mock({
  'list|55': [
    {
      title: '@ctitle(5, 15)', // 中文标题 5-15 字
      summary: '@csentence(10, 20)', // 中文句子 10-20 字
      category: '@pick(["前端", "后端", "数据库", "测试", "数据可视化"])',
      cover_url: '@image("100x60", "#f5f5f5", "#000", "封面")',
      author: '@cname',
      created_at: '@datetime("yyyy-MM-dd HH:mm:ss")',
      is_published: '@boolean',
    },
  ],
})

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/list/blog'), (params: GetParams) => {
      const { current = 1, pageSize = 10 } = qs.parseUrl(params.url).query
      const p = current as number
      const ps = pageSize as number
      return successResponseWrap({
        list: data.list.slice((p - 1) * ps, p * ps),
        total: 55,
      })
    })
  },
})
