import { getCurrentInstance, inject } from 'vue'
import { activePinia, SymbolPinia, setActivePinia } from './rootStore'

export function defineStore(idOrOptions: String, setup: any) {
  let id: String
  let options: Object

  if (typeof idOrOptions === 'string') {
    id = idOrOptions
    options = setup
  } else {
    options = idOrOptions
    id = idOrOptions.id

    // 如果是函数 说明是一个setup语法
    const isSetupStore = typeof setup === 'function'

    function useStore() {
      const currentInstance = getCurrentInstance()
      // 拿到 main.js 内  app.use( createPinia() ) 时 setActivePinia 的 pinia
      let pinia = currentInstance && inject(SymbolPinia)
      if (pinia) {
        setActivePinia(pinia)
      }
      pinia = activePinia

      if (!pinia._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, pinia)
        } else {
          createOptionsStore(id, options, pinia)
        }
      }

      const store = pinia._s.get(id)
      return store
    }

    return useStore
  }
}

function createSetupStore(id: String, setup: Function, pinia: Object) {}

function createOptionsStore(id: String, options: Object, pinia: Object) {}
