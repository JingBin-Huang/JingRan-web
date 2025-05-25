import axios from 'axios'
import qs from 'query-string'

export interface BlogRecord {
  id: string
  title: string
  summary: string
  cover_url: string
  category: string
  author: string
  created_at: string
  is_published: string
}

export interface BlogParams extends Partial<BlogRecord> {
  current: number
  pageSize: number
}

export interface BlogListRes {
  list: BlogRecord[]
  total: number
}

export function queryBlogList(params: BlogParams) {
  return axios.get<BlogListRes>('/api/list/blog', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}
