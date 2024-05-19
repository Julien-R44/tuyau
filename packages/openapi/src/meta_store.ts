import type { Route } from '@adonisjs/core/http'

export class MetaStore {
  #store = new Map<Route, any>()
  #computedStore = new Map<string, any>()

  set(key: Route, value: any) {
    this.#store.set(key, value)
  }

  get(key: Route) {
    return this.#store.get(key)
  }

  getComputed(key: string) {
    return this.#computedStore.get(key)
  }

  compute() {
    for (const [route, value] of this.#store) {
      this.#computedStore.set(route.toJSON().pattern, value)
    }
  }
}

const metaStore = new MetaStore()
export { metaStore }
