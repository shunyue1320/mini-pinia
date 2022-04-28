// 实现 mapState 方法 （作用：只读数据）： https://pinia.vuejs.org/api/modules/pinia.html#mapstate
export function mapState(useStore: Function, keysOrMapper: any) {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        reduced[key] = function () {
          return useStore()[key]
        }
        return reduced
      }, {})
    : Object.keys(keysOrMapper).reduce((reduced: Record<string, Object>, key) => {
        reduced[key] = function () {
          const store = useStore()
          const storeKey = keysOrMapper[key]
          return store[storeKey]
        }
        return reduced
      }, {})
}

// 实现 mapWritableState 方法 （作用：读写数据）： https://pinia.vuejs.org/api/modules/pinia.html#mapwritablestate
export function mapWritableState(useStore: Function, keysOrMapper: any) {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        reduced[key] = {
          get() {
            return useStore()[key]
          },
          set(value: any) {
            useStore()[key] = value
          }
        }
        return reduced
      }, {})
    : Object.keys(keysOrMapper).reduce((reduced: Record<string, Object>, key) => {
        reduced[key] = {
          get() {
            const store = useStore()
            const storeKey = keysOrMapper[key]
            return store[storeKey]
          },
          set(value: any) {
            const store = useStore()
            const storeKey = keysOrMapper[key]
            store[storeKey] = value
          }
        }
        return reduced
      }, {})
}

// 实现 mapActions 方法： https://pinia.vuejs.org/api/modules/pinia.html#mapactions
export function mapActions(useStore: Function, keysOrMapper: any) {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        reduced[key] = function (...args: Array<any>) {
          return useStore()[key](...args)
        }
        return reduced
      })
    : Object.keys(keysOrMapper).reduce((reduced: Record<string, Object>, key) => {
        reduced[key] = function (...args: Array<any>) {
          const store = useStore()
          const storeKey = keysOrMapper[key]
          return store[storeKey](...args)
        }
        return reduced
      }, {})
}
