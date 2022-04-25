import { effectScope, markRaw, reactive, ref } from 'vue'
import { SymbolPinia, setActivePinia } from './rootStore'

export function createPinia() {
  const scope = effectScope(true)

  // run 方法的返回值就是这个fn的返回结果
  const state = scope.run(() => ref({}))

  const _p = []

  // markRaw 标记一个对象，使其永远不会转换为代理。返回对象本身。
  const pinia = markRaw({
    install(app: any) {
      // pinia 希望能被共享出去
      setActivePinia(pinia)
      pinia._a = app
      // 将pinia实例暴露到app上，所有的组件都可以通过inject注入进来
      app.provide(SymbolPinia, pinia)
      app.config.globalProperties.$pinia = pinia
    },
    use(plugin: any) {
      _p.push(plugin)
      return this
    },
    _p,
    _a: null,
    state,
    _e: scope,
    _s: new Map()
  })

  return pinia
}
