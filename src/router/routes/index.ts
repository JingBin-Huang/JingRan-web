import type { RouteRecordNormalized } from 'vue-router'

const modules = import.meta.glob('./modules/*.ts', { eager: true })
const externalModules = import.meta.glob('./externalModules/*.ts', {
  eager: true,
})

const useModules: string[] = ['dashboard', 'blog', 'system', 'user']

function formatModules(_modules: any, result: RouteRecordNormalized[]) {
  Object.keys(_modules).forEach((key) => {
    const has = useModules.some((item) => key.includes(item))
    if (!has) return
    const defaultModule = _modules[key].default
    if (!defaultModule) return
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule]
    result.push(...moduleList)
  })
  return result
}

export const appRoutes: RouteRecordNormalized[] = formatModules(modules, [])

export const appExternalRoutes: RouteRecordNormalized[] = formatModules(externalModules, [])
