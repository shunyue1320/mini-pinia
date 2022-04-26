import { getCurrentInstance, inject, toRefs, computed, reactive, isRef } from 'vue'
import { activePinia, SymbolPinia, setActivePinia } from './rootStore'

// 用于： defineStore('data', { msg: 'state数据' })
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

      // 没有该 store 就创建：两种模式 Setup ｜ Options
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

function createSetupStore(id: String, setup: Function, pinia: Object) {
  let scope
  const setupStore = pinia._e.run(() => {
    scope.effectScope()
    return scope.run(() => setup())
  })

  function wrapAction(name, action) {
    return function () {}
  }

  for (const key in setupStore) {
    const prop = setupStore[key]
    if (typeof prop === 'function') {
      setupStore[key] = wrapAction(key, prop)
    }
  }

  // 实现 $patch API (作用：批量改变状态)： https://pinia.vuejs.org/api/interfaces/pinia._StoreWithState.html#patch
  function $patch(partialStateOrMutation: any) {
    if (typeof partialStateOrMutation === 'function') {
      partialStateOrMutation(store)
    } else {
      mergeReactiveObject(store, partialStateOrMutation)
    }
  }

  const partialStore = {
    $patch,
    // 实现 $subscribe API (订阅状态改变) https://pinia.vuejs.org/api/interfaces/pinia._StoreWithState.html#subscribe
    $subscribe(callback: Function, options: Object) {
      scope.run(() =>
        watch(
          pinia.state.value[id],
          state => {
            // 监控状态变化
            callback({ type: 'dirct' }, state)
          },
          options
        )
      )
    }
  }
  // 每一个store都是一个响应式对象
  const store = reactive(partialStore)

  // 最终会将处理好的setupStore 放到store的身上
  Object.assign(store, setupStore) // reactive 中放ref 会被拆包  store.count.value
  pinia._s.set(id, store)
  return store
}

function createOptionsStore(id: String, options: Object, pinia: Object) {
  let { state, getters, actions } = options

  // setup 作用： 让 state, getters, actions 响应式，并且合并到一个对象里返回
  function setup() {
    // ref放入的是对象 会被自动proxy
    pinia.state.value[id] = state ? state() : {}
    const localState = toRefs(pinia.state.value[id])
    return Object.assign(
      localState,
      actions,
      Object.keys(getters || {}).reduce((computedGetters, name) => {
        // 计算属性有缓存的性质
        computedGetters[name] = computed(() => {
          // 我们需要获取当前的store是谁
          return getters[name].call(store, store)
        })
        return computedGetters
      }, {})
    )
  }

  const store = createSetupStore(id, setup, pinia)

  // 实现 $reset API (作用：恢复到初始状态)：https://pinia.vuejs.org/api/interfaces/pinia._StoreWithState.html#reset
  store.$reset = function () {
    const newState = state ? state() : {}
    store.$patch($state => {
      Object.assign($state, newState)
    })
  }
  return store
}

// 递归 $patch
function mergeReactiveObject(target, partialState) {
  for (let key in partialState) {
    // 如果是原型上的不考虑
    if (!partialState.hasOwnProperty(key)) {
      continue
    }

    const oldValue = target[key]
    const newValue = partialState[key]

    // 状态有可能是ref, ref也是一个对象不能递归
    if (isObject(oldValue) && isObject(newValue) && isRef(newValue)) {
      target[key] = mergeReactiveObject(oldValue, newValue)
    } else {
      target[key] = newValue
    }
  }

  return target
}

const isObject = (value: any) => {
  return typeof value === 'object' && value !== null
}
