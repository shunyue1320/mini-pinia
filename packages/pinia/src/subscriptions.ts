import { _Method } from './types'

export function addSubscription<T extends _Method>(subscriptions: T[], callback: T) {
  subscriptions.push(callback)
  return function reomveSubscription() {
    const idx = subscriptions.indexOf(callback)
    if (idx !== -1) {
      subscriptions.splice(idx, 1)
    }
  }
}

export function triggerSubscriptions<T extends _Method>(subscriptions: T[], ...args: Parameters<T>) {
  subscriptions.forEach(callback => callback(...args))
}
