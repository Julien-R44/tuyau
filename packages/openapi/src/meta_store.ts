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

  getComputed(options: { method: string; path: string }) {
    return this.#computedStore.get(`${options.method.toUpperCase()}:${options.path}`)
  }

  compute() {
    for (const [route, value] of this.#store) {
      const serialized = route.toJSON()
      for (const method of serialized.methods) {
        this.#computedStore.set(`${method}:${serialized.pattern}`, value)
      }
    }
  }
}

const metaStore = new MetaStore()
export { metaStore }
