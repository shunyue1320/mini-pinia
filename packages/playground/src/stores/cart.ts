import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    rawItems: [] as string[]
  }),
  getters: {
    items: (state: any) => {
      return state.rawItems
    }
  },
  actions: {
    addItem(item: string) {
      this.rawItems.push(item)
    }
  }
})
