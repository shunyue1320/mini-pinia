import { effectScope, markRaw, reactive, ref } from 'vue'

export function createPinia() {
  const scope = effectScope(true)
  console.log(scope)
}
