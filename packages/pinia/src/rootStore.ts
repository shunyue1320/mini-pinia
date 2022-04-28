import { App, EffectScope, Ref } from 'vue'
import { StateTree } from './types'

export const SymbolPinia = Symbol()

export let activePinia: Pinia | undefined
export const setActivePinia = (pinia: Pinia | undefined) => (activePinia = pinia)

export interface Pinia {
  install: (app: App) => void
  state: Ref<Record<string, StateTree>>
  use(plugin: PiniaPlugin): Pinia
  _p: PiniaPlugin[]
  _a: App | null
  _e: EffectScope
  _s: Map<string, any>
}

export interface PiniaPlugin {
  (context: PiniaPluginContext): any
}

export interface PiniaPluginContext {
  pinia: Pinia
  app: App
  store: any
  id: any
}
